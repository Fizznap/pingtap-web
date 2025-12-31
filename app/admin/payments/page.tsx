import { createClient } from '@supabase/supabase-js';
import { CheckCircle, Clock, XCircle, AlertCircle, IndianRupee } from 'lucide-react';

// Force dynamic rendering to ensure fresh data
export const dynamic = 'force-dynamic';

export default async function AdminPaymentsPage() {
    // 1. Initialize Supabase with Service Role Key to bypass RLS
    // Standard client would only see "own" payments due to current RLS policies
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    // Fallback URL if env is missing (for local dev safety, though should be set)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;

    if (!serviceKey) {
        return (
            <div className="p-8 text-center bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-200 dark:border-red-800">
                <h2 className="text-xl font-bold text-red-600 dark:text-red-400">Configuration Error</h2>
                <p className="text-slate-600 dark:text-slate-400 mt-2">
                    Admin access requires <code>SUPABASE_SERVICE_ROLE_KEY</code> in environment variables.
                </p>
            </div>
        );
    }

    const supabase = createClient(supabaseUrl, serviceKey);

    // 2. Fetch Payments joining with Profiles (if possible) or Users
    // NOTE: 'auth.users' is not directly joinable via standard client unless using RPC or View.
    // However, we have a 'profiles' table that maps 1:1 to users.
    const { data: payments, error } = await supabase
        .from('payments')
        .select(`
            *,
            profiles:user_id ( full_name, email )
        `)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Admin Payments Fetch Error:', error);
        return (
            <div className="p-8 text-center text-red-500">
                Failed to load payments. Check server logs.
            </div>
        );
    }

    // Helper for Status Badge
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'captured':
                return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"><CheckCircle className="h-3 w-3" /> Paid</span>;
            case 'failed':
                return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"><XCircle className="h-3 w-3" /> Failed</span>;
            case 'created':
                return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"><Clock className="h-3 w-3" /> Pending</span>;
            case 'refunded':
                return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400"><RefreshCw className="h-3 w-3" /> Refunded</span>;
            default:
                return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700">{status}</span>;
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Payments</h1>
                <div className="text-sm text-slate-500">
                    Total: <span className="font-bold text-slate-900 dark:text-white">{payments?.length || 0}</span>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 border-b border-slate-200 dark:border-slate-800 uppercase text-xs font-bold tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Order ID</th>
                                <th className="px-6 py-4">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {payments?.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                        No payments found.
                                    </td>
                                </tr>
                            ) : (
                                payments!.map((payment) => (
                                    <tr key={payment.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-4">
                                            {getStatusBadge(payment.status)}
                                        </td>
                                        <td className="px-6 py-4 font-mono font-medium text-slate-900 dark:text-white">
                                            ₹{payment.amount} <span className="text-xs text-slate-400">{payment.currency}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                {/* @ts-ignore - profiles is joined array or object depending on relationship */}
                                                <p className="font-medium text-slate-900 dark:text-white">{payment.profiles?.full_name || 'Unknown User'}</p>
                                                {/* @ts-ignore */}
                                                <p className="text-xs text-slate-500">{payment.profiles?.email || 'No Email'}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-mono text-xs text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                                                {payment.provider_order_id || 'N/A'}
                                            </span>
                                            {payment.provider_payment_id && (
                                                <div className="text-[10px] text-slate-400 mt-1">
                                                    ID: {payment.provider_payment_id}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                                            {new Date(payment.created_at).toLocaleDateString('en-IN', {
                                                day: 'numeric', month: 'short', year: 'numeric',
                                                hour: '2-digit', minute: '2-digit'
                                            })}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

import { RefreshCw } from 'lucide-react';
