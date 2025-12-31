import { Activity, Calendar, Zap } from 'lucide-react';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function DashboardOverview() {
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
                    try {
                        cookiesToSet.forEach(({ name, value, options }) => {
                            cookieStore.set(name, value, options);
                        });
                    } catch (error) {
                        // The `setAll` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing user sessions.
                    }
                },
            },
        }
    );

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    // 1. Fetch User Profile for Name
    let userName = 'User';
    if (user.user_metadata?.full_name) {
        userName = user.user_metadata.full_name.split(' ')[0];
    }

    // 2. Fetch Active Subscription & Plan
    const { data: sub } = await supabase
        .from('subscriptions')
        .select(`
            id,
            end_date,
            status,
            plans (
                name,
                speed_mbps,
                price_monthly
            )
        `)
        .eq('customer_id', user.id)
        .eq('status', 'active')
        .single();

    // @ts-ignore - Supabase types might infer plans as Single or Array depending on setup, we handle safely below
    const subscription = sub;
    const plan = subscription?.plans ? (Array.isArray(subscription.plans) ? subscription.plans[0] : subscription.plans) : null;

    let daysLeft = 0;
    if (subscription) {
        const end = new Date(subscription.end_date);
        const now = new Date();
        const diffTime = Math.abs(end.getTime() - now.getTime());
        daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    // 3. Fetch Installation Status
    const { data: installation } = await supabase
        .from('installations')
        .select('status, scheduled_date')
        .eq('user_id', user.id)
        .in('status', ['pending', 'scheduled', 'assigned', 'in_progress'])
        .maybeSingle();

    const isInstallationPending = !!installation;

    return (
        <div className="p-4 lg:p-8 max-w-5xl mx-auto space-y-6">

            {/* Header / Greeting */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    Good Morning, {userName} <span className="text-2xl">👋</span>
                </h1>
                <p className="text-slate-500 text-sm mt-1">Here's what's happening with your broadband connection today.</p>
            </div>

            {/* Status Based UI */}
            {!subscription ? (
                /* CASE 1: No Active Plan */
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 text-center">
                    <div className="h-16 w-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-500">
                        <Activity className="h-8 w-8" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Active Plan</h2>
                    <p className="text-slate-500 mb-6 max-w-sm mx-auto">
                        There is no active broadband plan linked to this account.
                        <br />
                        Please contact support or visit our office to subscribe.
                    </p>
                    <div className="inline-flex items-center text-sm font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-lg">
                        Support: 816-925-700
                    </div>
                </div>
            ) : isInstallationPending ? (
                /* CASE 2: Plan Exists, Installation Pending */
                <div className="bg-blue-50 dark:bg-blue-900/10 rounded-3xl p-8 border border-blue-200 dark:border-blue-800 text-center">
                    <div className="h-16 w-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                        <Zap className="h-8 w-8" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Installation Pending</h2>
                    <p className="text-slate-600 dark:text-slate-300 mb-6 max-w-sm mx-auto">
                        Your plan ({plan?.name}) is active, but installation is pending.
                        <br />
                        A technician will contact you shortly.
                    </p>
                    {installation?.scheduled_date && (
                        <div className="inline-flex items-center gap-2 text-sm font-bold text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/50 px-4 py-2 rounded-lg">
                            <Calendar className="h-4 w-4" />
                            Scheduled: {new Date(installation.scheduled_date).toLocaleDateString()}
                        </div>
                    )}
                </div>
            ) : (
                /* CASE 3: Active & Installed */
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <p className="text-slate-500 text-sm font-medium mb-1">Active Plan</p>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                                {plan?.name}
                            </h2>
                            <div className="flex items-center gap-2 mt-2 text-slate-600 dark:text-slate-400">
                                <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded">
                                    Speed: {plan?.speed_mbps} Mbps
                                </span>
                                <span>•</span>
                                <span>Unlimited Data</span>
                            </div>
                        </div>
                        <div className="text-left md:text-right bg-slate-50 dark:bg-slate-800 p-4 rounded-xl">
                            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Validity</p>
                            <p className="text-lg font-bold text-slate-900 dark:text-white">
                                {daysLeft} Days Left
                            </p>
                            <p className="text-xs text-slate-400 mt-1">
                                Ends: {new Date(subscription.end_date).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Task 5: Support Load Clarity (Static Note) */}
            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 text-center border border-slate-100 dark:border-slate-800">
                <p className="text-xs text-slate-500">
                    For renewals, installation scheduling, or plan upgrades, please contact support directly or visit our office.
                    <br />
                    <span className="font-bold text-slate-600 dark:text-slate-400">Support: 816-925-700</span>
                </p>
            </div>
        </div>
    );
}
