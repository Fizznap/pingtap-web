import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import BillingContent from './BillingContent';

export default async function BillingPage() {
    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                    // No-op
                },
            },
        }
    );

    const { data: { user } } = await supabase.auth.getUser();

    // Default Empty Props
    let profile = { full_name: 'Customer', address: 'N/A', email: '' }; // Fallback safe
    let payments: any[] = [];
    let subscription = null;

    if (user) {
        // 1. Fetch Profile
        const { data: profileData } = await supabase
            .from('profiles')
            .select('full_name, address')
            .eq('id', user.id)
            .single();

        if (profileData) {
            profile = { ...profileData, email: user.email || '' };
        } else if (user.user_metadata) {
            profile = {
                full_name: user.user_metadata.full_name || 'Customer',
                address: 'N/A',
                email: user.email || ''
            };
        }

        // 2. Fetch Payments
        const { data: paymentsData } = await supabase
            .from('payments')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (paymentsData) {
            payments = paymentsData;
        }

        // 3. Fetch Active Subscription
        const { data: sub } = await supabase
            .from('subscriptions')
            .select(`
                id,
                end_date,
                status,
                plans (
                    name,
                    price_monthly
                )
            `)
            .eq('customer_id', user.id)
            .eq('customer_id', user.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        if (sub) {
            // Transform for prop shape
            subscription = {
                id: sub.id,
                end_date: sub.end_date,
                status: sub.status,
                // @ts-ignore
                plan: sub.plans ? {
                    // @ts-ignore
                    name: sub.plans.name,
                    // @ts-ignore
                    price_monthly: sub.plans.price_monthly
                } : null
            };
        }
    }

    // 4. Fetch Available Plans (for everyone)
    const { data: plans } = await supabase
        .from('plans')
        .select('*')
        .eq('is_active', true)
        .order('price_monthly', { ascending: true });

    console.log('[BillingDebug] Plans Fetch:', {
        plansCount: plans?.length,
        user: user?.id,
        error: plans ? 'None' : 'Plans Data is Null'
    });

    const paymentsEnabled = process.env.PAYMENTS_ENABLED === 'true';

    return (
        <BillingContent
            profile={profile}
            payments={payments}
            subscription={subscription}
            availablePlans={plans || []}
            paymentsEnabled={paymentsEnabled}
        />
    );
}
