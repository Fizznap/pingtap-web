import { Activity, Calendar, Zap } from 'lucide-react';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import Link from 'next/link';

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
                    // No-op
                },
            },
        }
    );

    const { data: { user } } = await supabase.auth.getUser();

    // 1. Fetch User Profile for Name
    let userName = 'User';
    if (user) {
        if (user.user_metadata?.full_name) {
            userName = user.user_metadata.full_name.split(' ')[0];
        }
    }

    // 2. Fetch Active Subscription
    let subscription = null;
    let daysLeft = 0;

    if (user) {
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

        // @ts-ignore
        subscription = sub;

        if (subscription) {
            const end = new Date(subscription.end_date);
            const now = new Date();
            const diffTime = Math.abs(end.getTime() - now.getTime());
            daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        }
    }

    return (
        <div className="p-4 lg:p-8 max-w-5xl mx-auto space-y-6">

            {/* Header / Greeting */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    Good Morning, {userName} <span className="text-2xl">👋</span>
                </h1>
                <p className="text-slate-500 text-sm mt-1">Here's what's happening with your broadband connection today.</p>
            </div>

            {subscription ? (
                <>
                    {/* Quick Stats Row */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {/* Data Left Card - Placeholder until usage API exists */}
                        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between h-40">
                            <div className="h-10 w-10 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-blue-600 mb-2">
                                <Activity className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-slate-500 text-sm font-medium">Data Policy</p>
                                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">Unlimited</p>
                            </div>
                        </div>

                        {/* Validity Card */}
                        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between h-40">
                            <div className="h-10 w-10 bg-purple-50 dark:bg-purple-900/20 rounded-xl flex items-center justify-center text-purple-600 mb-2">
                                <Calendar className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-slate-500 text-sm font-medium">Validity</p>
                                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                                    {daysLeft} Days
                                </p>
                            </div>
                        </div>

                        {/* Speed Card */}
                        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between h-40 col-span-2 md:col-span-1">
                            <div className="h-10 w-10 bg-green-50 dark:bg-green-900/20 rounded-xl flex items-center justify-center text-green-600 mb-2">
                                <Zap className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-slate-500 text-sm font-medium">Speed</p>
                                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                                    {/* @ts-ignore */}
                                    {subscription.plans.speed_mbps} Mbps
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Current Plan Card */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-md">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <p className="text-slate-500 text-sm font-medium mb-1">Current Plan</p>
                                {/* @ts-ignore */}
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">{subscription.plans.name}</h2>
                            </div>
                            <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                                Active
                            </span>
                        </div>

                        <p className="text-slate-400 text-xs mb-6">Exp: {new Date(subscription.end_date).toLocaleDateString()}</p>

                        <Link href="/dashboard/billing">
                            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-600/20 transition-all active:scale-[0.98]">
                                Renew Now
                            </button>
                        </Link>
                    </div>

                    {/* Installation Prompt (Only if Active Sub exists) */}
                    <div className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-900/10 p-5 rounded-2xl border border-orange-200 dark:border-orange-800/50 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 bg-orange-100 dark:bg-orange-800/30 text-orange-600 rounded-full flex items-center justify-center">
                                <Zap className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 dark:text-white">Installation Status</h3>
                                <p className="text-sm text-slate-500 max-w-sm">Schedule or track your technician visit.</p>
                            </div>
                        </div>
                        <Link href="/dashboard/installation">
                            <button className="bg-white dark:bg-slate-800 text-orange-600 font-bold px-5 py-2.5 rounded-xl shadow-sm border border-orange-100 dark:border-orange-900 hover:bg-orange-50 transition-colors text-sm">
                                View Details
                            </button>
                        </Link>
                    </div>
                </>
            ) : (
                /* No Active Plan State */
                <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
                    <div className="h-16 w-16 bg-orange-50 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-4 text-orange-500">
                        <Zap className="h-8 w-8" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Active Connection</h2>
                    <p className="text-slate-500 mb-6 max-w-sm mx-auto">You don't have an active broadband plan. Subscribe now to get started.</p>
                    <Link href="/dashboard/billing">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-blue-600/20">
                            Browse Plans
                        </button>
                    </Link>
                </div>
            )}

            {/* Promo / Banner - Clean Static Placeholder */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-6 text-white relative overflow-hidden flex flex-col justify-between">
                <div className="relative z-10">
                    <span className="bg-white/20 text-xs font-bold px-2 py-1 rounded-lg backdrop-blur-sm">Offer</span>
                    <h3 className="text-xl font-bold mt-3 leading-tight">Need more speed?</h3>
                    <p className="text-indigo-200 text-xs mt-2 max-w-[80%]">Upgrade your plan instantly.</p>
                </div>
                <Link href="/dashboard/billing">
                    <button className="bg-white text-indigo-700 px-5 py-3 rounded-xl text-sm font-bold shadow-lg mt-6 w-fit hover:bg-slate-50 relative z-10">
                        View Plans
                    </button>
                </Link>
                {/* Abstract Shapes */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-500 rounded-full blur-3xl opacity-50"></div>
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-500 rounded-full blur-3xl opacity-50"></div>
            </div>

        </div>
    );
}
