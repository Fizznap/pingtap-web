'use client';

import { useState } from 'react';
import { Calendar, CheckCircle, Clock, Search, AlertCircle, Loader2, RefreshCw } from 'lucide-react';
import { extendSubscription } from '@/app/actions/admin-subscription';

type Subscription = {
    id: string;
    status: string;
    end_date: string;
    plans: {
        name: string;
    };
    profiles: {
        full_name: string;
        email: string;
        phone: string;
    };
};

export default function AdminSubscriptionClient({ initialSubscriptions }: { initialSubscriptions: any[] }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [processingId, setProcessingId] = useState<string | null>(null);

    const filtered = initialSubscriptions.filter(sub => {
        const search = searchTerm.toLowerCase();
        return (
            sub.profiles?.full_name?.toLowerCase().includes(search) ||
            sub.profiles?.email?.toLowerCase().includes(search) ||
            sub.profiles?.phone?.includes(search) ||
            sub.id.includes(search)
        );
    });

    const handleExtend = async (subId: string, days: number) => {
        if (!confirm(`Are you sure you want to extend this subscription by ${days} days?`)) return;

        setProcessingId(subId);
        try {
            const result = await extendSubscription(subId, days);
            if (result.error) {
                alert('Error: ' + result.error);
            } else {
                alert('Subscription extended successfully!');
                window.location.reload(); // Simple refresh to show new date
            }
        } catch (e: any) {
            alert('Unexpected error: ' + e.message);
        } finally {
            setProcessingId(null);
        }
    };

    return (
        <div className="space-y-6">
            {/* Search Bar */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search by name, email, or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* List */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 font-medium border-b border-slate-200 dark:border-slate-800">
                            <tr>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Plan</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Validity Ends</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                                        No subscriptions found matching your search.
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((sub) => {
                                    const isExpired = new Date(sub.end_date) < new Date();
                                    const isProcessing = processingId === sub.id;

                                    return (
                                        <tr key={sub.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-slate-900 dark:text-white">
                                                    {sub.profiles?.full_name || 'Unknown'}
                                                </div>
                                                <div className="text-xs text-slate-500">{sub.profiles?.email}</div>
                                                <div className="text-xs text-slate-500">{sub.profiles?.phone}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="font-medium text-slate-700 dark:text-slate-300">
                                                    {sub.plans?.name || 'Unknown Plan'}
                                                </span>
                                                <div className="text-[10px] text-slate-400 font-mono">ID: {sub.id.slice(0, 8)}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold capitalize
                                                    ${sub.status === 'active' && !isExpired ? 'bg-green-100 text-green-700' : ''}
                                                    ${sub.status === 'active' && isExpired ? 'bg-red-100 text-red-700' : ''}
                                                    ${sub.status === 'cancelled' ? 'bg-slate-100 text-slate-600' : ''}
                                                `}>
                                                    {isExpired && sub.status === 'active' ? (
                                                        <>
                                                            <AlertCircle className="h-3 w-3" /> Expired
                                                        </>
                                                    ) : (
                                                        <>
                                                            <CheckCircle className="h-3 w-3" /> {sub.status}
                                                        </>
                                                    )}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-mono text-slate-600 dark:text-slate-400">
                                                {new Date(sub.end_date).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => handleExtend(sub.id, 30)}
                                                        disabled={isProcessing}
                                                        className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors disabled:opacity-50"
                                                    >
                                                        {isProcessing ? <Loader2 className="h-3 w-3 animate-spin" /> : '+30 Days'}
                                                    </button>
                                                    <button
                                                        onClick={() => handleExtend(sub.id, 90)}
                                                        disabled={isProcessing}
                                                        className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors disabled:opacity-50"
                                                    >
                                                        {isProcessing ? <Loader2 className="h-3 w-3 animate-spin" /> : '+3M'}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
