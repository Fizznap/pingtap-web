'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export async function createSubscription(planId: string) {
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

    // 1. Auth Check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { error: 'Unauthorized. Please login.' };
    }

    // 2. Validate Plan
    const { data: plan, error: planError } = await supabase
        .from('plans')
        .select('*')
        .eq('id', planId)
        .eq('is_active', true)
        .single();

    if (planError || !plan) {
        return { error: 'Invalid or inactive plan selected.' };
    }

    // 3. Check Existing Subscription
    const { data: existing, error: existError } = await supabase
        .from('subscriptions')
        .select('id, status')
        .eq('customer_id', user.id)
        .in('status', ['active', 'pending'])
        .single();

    if (existing) {
        return { error: `You already have an ${existing.status} subscription.` };
    }

    // 4. Calculate Dates
    // Defaulting to monthly for now as per prompt "today + plan.duration"
    // Assuming monthly since duration isn't in plan table shown in schema (schema has price_monthly etc)
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1); // Default 1 month

    // 5. Insert Subscription
    const { data: sub, error: insertError } = await supabase
        .from('subscriptions')
        .insert({
            customer_id: user.id,
            plan_id: plan.id,
            status: 'pending',
            billing_cycle: 'monthly',
            start_date: startDate.toISOString(),
            end_date: endDate.toISOString()
        })
        .select()
        .single();

    if (insertError) {
        console.error("Subscription Create Error:", insertError);
        return { error: 'Failed to create subscription record.' };
    }

    revalidatePath('/dashboard/billing');
    return { success: true, subscriptionId: sub.id };
}
