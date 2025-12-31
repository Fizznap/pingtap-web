'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { User, Lock, MessageSquare, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export function LoginForm() {
    const [authMethod, setAuthMethod] = useState<'password' | 'otp'>('password');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [magicLinkSent, setMagicLinkSent] = useState(false);

    // Form State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const router = useRouter();
    const supabase = createClient();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            if (authMethod === 'password') {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                router.push('/dashboard');
            } else {
                // OTP / Magic Link Flow
                // Since we don't have SMS configured, we use Email OTP/Magic Link
                const { error } = await supabase.auth.signInWithOtp({
                    email,
                    options: {
                        // set this to false if you want 'Magic Link' only. 
                        // If you want a 6-digit code, you need Supabase 'Email OTP' enabled.
                        // Defaulting to Magic Link for simplicity as it works out of the box usually.
                        shouldCreateUser: false,
                    }
                });
                if (error) throw error;
                setMagicLinkSent(true);
            }
        } catch (err: any) {
            setError(err.message || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    if (magicLinkSent) {
        return (
            <div className="text-center py-8 animate-in zoom-in duration-300">
                <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 p-6 rounded-2xl mb-6">
                    <MessageSquare className="h-10 w-10 mx-auto mb-3" />
                    <h3 className="font-bold text-lg">Check your Inbox</h3>
                    <p className="text-sm mt-2">We sent a magic login link to <br /><span className="font-semibold">{email}</span></p>
                </div>
                <button
                    onClick={() => setMagicLinkSent(false)}
                    className="text-sm text-slate-500 hover:text-slate-900 font-medium"
                >
                    Back to Login
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Toggle */}
            <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-lg grid grid-cols-2 gap-1 mb-8">
                <button
                    type="button"
                    onClick={() => { setAuthMethod('password'); setError(null); }}
                    className={cn(
                        "flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-md transition-all",
                        authMethod === 'password'
                            ? "bg-white dark:bg-slate-700 text-blue-600 shadow-sm"
                            : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                    )}
                >
                    <Lock className="h-4 w-4" />
                    Password
                </button>
                <button
                    type="button"
                    onClick={() => { setAuthMethod('otp'); setError(null); }}
                    className={cn(
                        "flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-md transition-all",
                        authMethod === 'otp'
                            ? "bg-white dark:bg-slate-700 text-blue-600 shadow-sm"
                            : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                    )}
                >
                    <MessageSquare className="h-4 w-4" />
                    OTP / Link
                </button>
            </div>

            <form className="space-y-4" onSubmit={handleLogin}>
                {error && (
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg border border-red-200 dark:border-red-800/50">
                        {error}
                    </div>
                )}

                <div className="relative group">
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-blue-600">
                        <User className="h-5 w-5" />
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 transition-colors focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                        <label htmlFor="email" className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-0.5">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="block w-full bg-transparent border-none p-0 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-0 sm:text-lg font-medium outline-none"
                            placeholder="user@example.com"
                        />
                    </div>
                </div>

                {authMethod === 'password' && (
                    <div className="relative group">
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer z-10"
                        >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                        <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-4 transition-colors focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 flex items-center">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="block w-full bg-transparent border-none p-0 text-slate-900 dark:text-white placeholder:text-slate-500 focus:ring-0 text-base outline-none"
                                placeholder="Password"
                            />
                        </div>
                    </div>
                )}

                <div className="flex justify-end pt-1">
                    <Link href="/forgot-password" className="text-sm font-medium text-blue-600 hover:text-blue-700">
                        Forgot Password?
                    </Link>
                </div>

                <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 text-base bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-600/20 mt-2"
                >
                    {loading ? <Loader2 className="animate-spin h-5 w-5" /> : (
                        <>
                            {authMethod === 'otp' ? 'Send Login Link' : 'Login Securely'}
                            {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
                        </>
                    )}
                </Button>
            </form>
        </div>
    );
}
