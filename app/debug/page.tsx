'use client';

import { useState, useEffect } from 'react';
import { checkMyData } from '@/app/actions/debug';
import { Loader2, Database, RefreshCw } from 'lucide-react';

export default function DebugPage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        const result = await checkMyData();
        setData(result);
        setLoading(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                            <Database className="h-8 w-8" />
                            Database Debug View
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                            Check your database state
                        </p>
                    </div>
                    <button
                        onClick={loadData}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Refresh
                    </button>
                </div>

                {data?.error ? (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
                        <p className="text-red-800 dark:text-red-200 font-bold">Error: {data.error}</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* User Info */}
                        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">👤 Your Account</h2>
                            <div className="space-y-2 font-mono text-sm">
                                <p><span className="text-slate-500">User ID:</span> <span className="text-slate-900 dark:text-white">{data?.userId}</span></p>
                                <p><span className="text-slate-500">Email:</span> <span className="text-slate-900 dark:text-white">{data?.userEmail}</span></p>
                            </div>
                        </div>

                        {/* Profile */}
                        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">📋 Profile Data</h2>
                            {data?.profile ? (
                                <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 overflow-x-auto">
                                    <pre className="text-xs text-slate-900 dark:text-white">
                                        {JSON.stringify(data.profile, null, 2)}
                                    </pre>
                                </div>
                            ) : (
                                <p className="text-amber-600">No profile found</p>
                            )}
                        </div>

                        {/* My Subscriptions */}
                        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">📦 Your Subscriptions</h2>
                            {data?.mySubscriptions?.length > 0 ? (
                                <div className="space-y-3">
                                    {data.mySubscriptions.map((sub: any, i: number) => (
                                        <div key={i} className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="font-bold text-green-900 dark:text-green-100">
                                                    ✅ Active Subscription
                                                </span>
                                                <span className={`px-2 py-1 rounded text-xs font-bold ${sub.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'
                                                    }`}>
                                                    {sub.status}
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                                <p><span className="text-slate-500">Plan:</span> {sub.plan?.name || 'Unknown'}</p>
                                                <p><span className="text-slate-500">Speed:</span> {sub.plan?.speed_mbps || 0} Mbps</p>
                                                <p><span className="text-slate-500">Start:</span> {new Date(sub.start_date).toLocaleDateString()}</p>
                                                <p><span className="text-slate-500">End:</span> {new Date(sub.end_date).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                                    <p className="text-amber-800 dark:text-amber-200">❌ No subscriptions found for your account</p>
                                    <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
                                        Go to <a href="/setup" className="underline font-bold">/setup</a> to create one
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* All Subscriptions (Admin View) */}
                        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">🔧 All Subscriptions (Admin View)</h2>
                            {data?.allSubscriptions?.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                            <tr>
                                                <th className="p-2 text-left">Customer</th>
                                                <th className="p-2 text-left">Plan</th>
                                                <th className="p-2 text-left">Status</th>
                                                <th className="p-2 text-left">End Date</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                                            {data.allSubscriptions.map((sub: any, i: number) => (
                                                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                                    <td className="p-2">
                                                        <div className="font-medium text-slate-900 dark:text-white">
                                                            {sub.customer?.full_name || 'Unknown'}
                                                        </div>
                                                        <div className="text-xs text-slate-500">
                                                            {sub.customer?.email}
                                                        </div>
                                                    </td>
                                                    <td className="p-2 text-slate-900 dark:text-white">
                                                        {sub.plan?.name || 'Unknown'}
                                                    </td>
                                                    <td className="p-2">
                                                        <span className={`px-2 py-1 rounded text-xs font-bold ${sub.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'
                                                            }`}>
                                                            {sub.status}
                                                        </span>
                                                    </td>
                                                    <td className="p-2 text-slate-900 dark:text-white">
                                                        {new Date(sub.end_date).toLocaleDateString()}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="text-slate-500">No subscriptions in database</p>
                            )}
                        </div>

                        {/* Quick Links */}
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                            <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3">Quick Links:</p>
                            <div className="flex flex-wrap gap-2">
                                <a href="/setup" className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                                    Setup Tool
                                </a>
                                <a href="/admin/subscriptions" className="px-3 py-1.5 bg-slate-600 text-white rounded-lg text-sm hover:bg-slate-700">
                                    Admin Subscriptions
                                </a>
                                <a href="/dashboard/usage" className="px-3 py-1.5 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700">
                                    Usage Page
                                </a>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
