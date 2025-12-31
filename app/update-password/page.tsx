'use client';

import { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { Lock, Eye, EyeOff, Loader2, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function UpdatePasswordPage() {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isUpdated, setIsUpdated] = useState(false);
    const [error, setError] = useState('');

    const router = useRouter();

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            setIsLoading(false);
            return;
        }

        try {
            const supabase = createBrowserClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            );

            const { error } = await supabase.auth.updateUser({
                password: password
            });

            if (error) throw error;
            setIsUpdated(true);
            setTimeout(() => {
                router.push('/dashboard');
            }, 3000);
        } catch (err: any) {
            setError(err.message || 'Failed to update password.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 p-8">

                <div className="text-center mb-8">
                    <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Lock className="h-6 w-6" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Set New Password</h1>
                    <p className="text-slate-500 text-sm mt-2">Create a strong password for your account.</p>
                </div>

                {isUpdated ? (
                    <div className="text-center animate-in zoom-in duration-300">
                        <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 p-4 rounded-2xl mb-6">
                            <CheckCircle className="h-8 w-8 mx-auto mb-2" />
                            <p className="font-bold">Password Updated!</p>
                            <p className="text-sm mt-1">Redirecting you to dashboard...</p>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleUpdate} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">New Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter new password"
                                    className="w-full pl-10 pr-10 h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        {error && <p className="text-xs text-red-500 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">{error}</p>}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center disabled:opacity-50 disabled:active:scale-100"
                        >
                            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Update Password'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
