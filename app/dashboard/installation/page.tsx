
import { createServerClient } from '@supabase/ssr';
export const dynamic = 'force-dynamic';
import { cookies } from 'next/headers';
import InstallationScheduler from './InstallationScheduler';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default async function InstallationPage() {
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

    let subscription = null;
    let existingInstallation = null;

    if (user) {
        // 1. Fetch Subscription
        const { data: sub } = await supabase
            .from('subscriptions')
            .select('id, status')
            .eq('customer_id', user.id)
            .eq('status', 'active')
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        // @ts-ignore
        subscription = sub;

        // 2. Fetch Existing Installation
        if (subscription) {
            const { data: install } = await supabase
                .from('installations')
                .select('*')
                .eq('subscription_id', subscription.id)
                .single();

            existingInstallation = install;
        }
    }

    return (
        <div className="p-4 lg:p-8 max-w-2xl mx-auto space-y-6">
            <Link href="/dashboard" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
            </Link>

            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Installation</h1>
                <p className="text-slate-500 text-sm mt-1">Manage your installation appointment.</p>
            </div>

            <InstallationScheduler
                subscriptionId={subscription?.id || null}
                existingInstallation={existingInstallation}
            />
        </div>
    );
}
