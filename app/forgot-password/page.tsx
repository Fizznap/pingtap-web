'use client';

import { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { Mail, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const [error, setError] = useState('');

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const supabase = createBrowserClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            );

            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/update-password`,
            });

            if (error) throw error;
            setIsSent(true);
        } catch (err: any) {
            setError(err.message || 'Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 p-8">

                {/* Header */}
                <div className="text-center mb-8">
                    <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Mail className="h-6 w-6" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Forgot Password?</h1>
                    <p className="text-slate-500 text-sm mt-2">No worries, we'll send you reset instructions.</p>
                </div>

                {isSent ? (
                    <div className="text-center animate-in zoom-in duration-300">
                        <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 p-4 rounded-2xl mb-6">
                            <CheckCircle className="h-8 w-8 mx-auto mb-2" />
                            <p className="font-bold">Check your email</p>
                            <p className="text-sm mt-1">We sent a reset link to <span className="font-semibold">{email}</span></p>
                        </div>
                        <Link href="/login" className="text-blue-600 font-bold text-sm hover:underline">
                            Back to Login
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleReset} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your registered email"
                                    className="w-full pl-10 h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                />
                            </div>
                        </div>

                        {error && <p className="text-xs text-red-500 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">{error}</p>}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center disabled:opacity-50 disabled:active:scale-100"
                        >
                            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Reset Password'}
                        </button>

                        <div className="text-center">
                            <Link href="/login" className="text-slate-500 hover:text-slate-900 dark:hover:text-white text-sm font-medium flex items-center justify-center gap-2 transition-colors">
                                <ArrowLeft className="h-4 w-4" /> Back to Login
                            </Link>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
