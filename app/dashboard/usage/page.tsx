'use client';

import { useEffect, useState } from 'react';
import { Activity, ArrowDown, ArrowUp, Calendar, Info } from 'lucide-react';
import { getUserUsageData } from '@/app/actions/usage';

export const dynamic = 'force-dynamic';

interface UsageData {
    subscription?: {
        id: string;
        planName: string;
        speed: number;
        status: string;
        billingCycle: string;
        startDate: string;
        endDate: string;
    };
    currentCycle?: {
        start: string;
        end: string;
    };
    usage?: {
        totalGB: number;
        downloadGB: number;
        uploadGB: number;
    };
    hasSubscription: boolean;
    error?: string;
}

export default function UsagePage() {
    const [data, setData] = useState<UsageData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            const result = await getUserUsageData();
            setData(result as UsageData);
            setLoading(false);
        }
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="p-4 lg:p-8 max-w-5xl mx-auto flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-slate-500">Loading usage data...</p>
                </div>
            </div>
        );
    }

    if (!data?.hasSubscription) {
        return (
            <div className="p-4 lg:p-8 max-w-5xl mx-auto">
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-8 text-center">
                    <Info className="h-12 w-12 text-amber-600 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-amber-900 dark:text-amber-100 mb-2">No Active Subscription</h2>
                    <p className="text-amber-700 dark:text-amber-300">
                        You need an active subscription to view usage data. Please subscribe to a plan first.
                    </p>
                </div>
            </div>
        );
    }

    const cycleStart = data.currentCycle ? new Date(data.currentCycle.start) : new Date();
    const cycleEnd = data.currentCycle ? new Date(data.currentCycle.end) : new Date();

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const formatMonth = (date: Date) => {
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    };

    return (
        <div className="p-4 lg:p-8 max-w-5xl mx-auto space-y-8 pb-24">

            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Data Usage</h1>
                <p className="text-slate-500">Track your consumption and session history.</p>
            </div>

            {/* Info Notice */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-6 flex items-start gap-4">
                <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                    <h3 className="font-bold text-blue-900 dark:text-blue-100 mb-1">Usage Tracking Coming Soon</h3>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                        Real-time data usage tracking will be enabled once your installation is complete and your service is active.
                        Your plan: <span className="font-semibold">{data.subscription?.planName}</span> ({data.subscription?.speed} Mbps)
                    </p>
                </div>
            </div>

            {/* Total Usage Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Total Consumption */}
                <div className="md:col-span-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                        <div>
                            <p className="text-blue-100 font-medium mb-1 flex items-center gap-2"><Activity className="h-4 w-4" /> Current Billing Cycle</p>
                            <h2 className="text-5xl font-bold">0 <span className="text-2xl opacity-80">GB</span></h2>
                            <p className="text-sm text-blue-100 mt-2 opacity-80">
                                Cycle: {formatDate(cycleStart)} - {formatDate(cycleEnd)}
                            </p>
                        </div>

                        {/* Split Stats */}
                        <div className="flex gap-8">
                            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 min-w-[140px]">
                                <p className="text-xs text-blue-100 mb-1 flex items-center gap-1"><ArrowDown className="h-3 w-3" /> Download</p>
                                <p className="text-2xl font-bold">0 GB</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 min-w-[140px]">
                                <p className="text-xs text-blue-100 mb-1 flex items-center gap-1"><ArrowUp className="h-3 w-3" /> Upload</p>
                                <p className="text-2xl font-bold">0 GB</p>
                            </div>
                        </div>
                    </div>
                    {/* Background Decor */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-900 opacity-20 rounded-full translate-y-1/2 -translate-x-1/2"></div>
                </div>
            </div>

            {/* Monthly Chart */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-slate-900 dark:text-white">Daily Consumption ({formatMonth(cycleStart)})</h3>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Used</span>
                    </div>
                </div>

                <div className="h-48 flex items-center justify-center text-slate-400 dark:text-slate-500">
                    <div className="text-center">
                        <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p className="text-sm">Usage tracking will appear here once your service is active</p>
                    </div>
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 mt-2 border-t border-slate-100 dark:border-slate-800 pt-2">
                    <span>{formatDate(cycleStart)}</span>
                    <span>{formatDate(cycleEnd)}</span>
                </div>
            </div>

            {/* Subscription Details */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="font-bold text-slate-900 dark:text-white mb-6">Subscription Details</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl">
                        <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Plan</p>
                        <p className="font-bold text-slate-900 dark:text-white">{data.subscription?.planName}</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl">
                        <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Speed</p>
                        <p className="font-bold text-slate-900 dark:text-white">{data.subscription?.speed} Mbps</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl">
                        <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Billing Cycle</p>
                        <p className="font-bold text-slate-900 dark:text-white capitalize">{data.subscription?.billingCycle}</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl">
                        <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Status</p>
                        <p className="font-bold text-green-600 dark:text-green-400 capitalize">{data.subscription?.status}</p>
                    </div>
                </div>
            </div>

        </div>
    );
}
