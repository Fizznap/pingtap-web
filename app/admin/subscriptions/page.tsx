import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import AdminSubscriptionClient from './AdminSubscriptionClient';

export const dynamic = 'force-dynamic';

export default async function AdminSubscriptionsPage() {
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

    // Fetch All Subscriptions (limit to 50 recent for MVP safety)
    const { data: subscriptions } = await supabase
        .from('subscriptions')
        .select(`
            *,
            plans (name),
            profiles:customer_id (full_name, email, phone)
        `)
        .order('end_date', { ascending: true }) // Expiring soonest first
        .limit(50);

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Subscription Management</h1>
                    <p className="text-slate-500 text-sm">Extend validity and manage customer plans.</p>
                </div>
            </div>

            <AdminSubscriptionClient initialSubscriptions={subscriptions || []} />
        </div>
    );
}
