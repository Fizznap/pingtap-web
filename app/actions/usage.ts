'use server';

import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

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

export async function getUserUsageData() {
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

    // Get authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { error: 'Unauthorized. Please login.' };
    }

    // Use service role to bypass RLS
    const serviceClient = getServiceClient();

    // Get the user's active subscription using service role
    const { data: subscriptions } = await serviceClient
        .from('subscriptions')
        .select(`
            *,
            plan:plans(*)
        `)
        .eq('customer_id', user.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

    const subscription = subscriptions && subscriptions.length > 0 ? subscriptions[0] : null;

    if (!subscription) {
        return {
            error: 'No active subscription found.',
            hasSubscription: false
        };
    }

    // Calculate current billing cycle dates
    const now = new Date();
    const startDate = new Date(subscription.start_date);
    const endDate = new Date(subscription.end_date);

    // For monthly billing, get the current month's cycle
    const cycleStart = new Date(startDate);
    while (cycleStart < now) {
        const nextCycle = new Date(cycleStart);
        nextCycle.setMonth(nextCycle.getMonth() + 1);
        if (nextCycle > now) break;
        cycleStart.setMonth(cycleStart.getMonth() + 1);
    }

    const cycleEnd = new Date(cycleStart);
    cycleEnd.setMonth(cycleEnd.getMonth() + 1);

    return {
        subscription: {
            id: subscription.id,
            planName: subscription.plan?.name || 'Unknown Plan',
            speed: subscription.plan?.speed_mbps || 0,
            status: subscription.status,
            billingCycle: subscription.billing_cycle,
            startDate: subscription.start_date,
            endDate: subscription.end_date,
        },
        currentCycle: {
            start: cycleStart.toISOString(),
            end: cycleEnd.toISOString(),
        },
        usage: {
            totalGB: 0,
            downloadGB: 0,
            uploadGB: 0,
        },
        hasSubscription: true,
    };
}
