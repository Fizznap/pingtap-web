'use server';

import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

const getServiceClient = () => {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        }
    );
};

/**
 * COMPLETE SETUP - Creates profile, grants admin, and creates subscription
 */
export async function completeSetup(planName: string) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() { return cookieStore.getAll(); },
                setAll(cookiesToSet) { },
            },
        }
    );

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { error: 'Not authenticated' };
    }

    const serviceClient = getServiceClient();
    const results = {
        profile: false,
        admin: false,
        subscription: false,
        details: [] as string[]
    };

    try {
        // Step 1: Ensure profile exists
        const { data: existingProfile } = await serviceClient
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (!existingProfile) {
            // Create profile
            const { error: profileError } = await serviceClient
                .from('profiles')
                .insert({
                    id: user.id,
                    email: user.email,
                    full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
                    phone: user.user_metadata?.phone || '',
                    role: 'admin' // Set admin right away
                });

            if (profileError) {
                return { error: 'Failed to create profile: ' + profileError.message, results };
            }
            results.profile = true;
            results.admin = true;
            results.details.push('✅ Created profile');
            results.details.push('✅ Granted admin role');
        } else {
            results.profile = true;
            results.details.push('✅ Profile exists');

            // Update to admin if not already
            if (existingProfile.role !== 'admin') {
                const { error: updateError } = await serviceClient
                    .from('profiles')
                    .update({ role: 'admin' })
                    .eq('id', user.id);

                if (updateError) {
                    return { error: 'Failed to update role: ' + updateError.message, results };
                }
                results.admin = true;
                results.details.push('✅ Granted admin role');
            } else {
                results.admin = true;
                results.details.push('✅ Already admin');
            }
        }

        // Step 2: Create subscription if plan provided
        if (planName) {
            // Get the plan
            const { data: plan, error: planError } = await serviceClient
                .from('plans')
                .select('*')
                .eq('name', planName)
                .eq('is_active', true)
                .single();

            if (planError || !plan) {
                results.details.push('❌ Plan not found: ' + planName);
                return { error: 'Plan not found', results };
            }

            // Check existing subscription
            const { data: existing } = await serviceClient
                .from('subscriptions')
                .select('id')
                .eq('customer_id', user.id)
                .eq('status', 'active')
                .single();

            if (existing) {
                results.subscription = true;
                results.details.push('✅ Subscription already exists');
            } else {
                // Create subscription
                const startDate = new Date();
                const endDate = new Date();
                endDate.setMonth(endDate.getMonth() + 1);

                const { error: subError } = await serviceClient
                    .from('subscriptions')
                    .insert({
                        customer_id: user.id,
                        plan_id: plan.id,
                        status: 'active',
                        billing_cycle: 'monthly',
                        start_date: startDate.toISOString(),
                        end_date: endDate.toISOString()
                    });

                if (subError) {
                    results.details.push('❌ Failed to create subscription: ' + subError.message);
                    return { error: 'Failed to create subscription: ' + subError.message, results };
                }

                results.subscription = true;
                results.details.push(`✅ Created subscription: ${plan.name} (${plan.speed_mbps} Mbps)`);
                results.details.push(`✅ Valid until: ${endDate.toLocaleDateString()}`);
            }
        }

        // Force sign out to refresh session
        await supabase.auth.signOut();

        revalidatePath('/dashboard');
        revalidatePath('/dashboard/usage');
        revalidatePath('/admin');

        return {
            success: true,
            results,
            message: 'Setup complete! Please login again.',
            shouldRedirect: true
        };

    } catch (error: any) {
        return { error: 'Unexpected error: ' + error.message, results };
    }
}

export async function makeCurrentUserAdmin() {
    return completeSetup('');
}

export async function createTestSubscriptionForCurrentUser(planName: string) {
    return completeSetup(planName);
}

export async function getAvailablePlans() {
    const serviceClient = getServiceClient();

    const { data: plans, error } = await serviceClient
        .from('plans')
        .select('*')
        .eq('is_active', true)
        .order('price_monthly', { ascending: true });

    if (error) {
        return { error: 'Failed to fetch plans: ' + error.message, plans: [] };
    }

    return { plans: plans || [] };
}

export async function checkUserAdminStatus() {
    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() { return cookieStore.getAll(); },
                setAll(cookiesToSet) { },
            },
        }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { isAdmin: false, email: null };
    }

    const serviceClient = getServiceClient();
    const { data: profile } = await serviceClient
        .from('profiles')
        .select('role, email, full_name')
        .eq('id', user.id)
        .single();

    return {
        isAdmin: profile?.role === 'admin',
        email: profile?.email || user.email,
        role: profile?.role || 'customer',
        profileExists: !!profile
    };
}
