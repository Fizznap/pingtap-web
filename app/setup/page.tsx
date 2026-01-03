'use client';

import { useState, useEffect } from 'react';
import { completeSetup, getAvailablePlans, checkUserAdminStatus } from '@/app/actions/temp-setup';
import { useRouter } from 'next/navigation';
import { Loader2, Zap, CheckCircle, AlertCircle } from 'lucide-react';

export default function SetupPage() {
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<any>(null);
    const [error, setError] = useState('');
    const [plans, setPlans] = useState<any[]>([]);
    const [loadingPlans, setLoadingPlans] = useState(true);
    const [userStatus, setUserStatus] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        loadPlans();
        checkStatus();
    }, []);

    const loadPlans = async () => {
        setLoadingPlans(true);
        const result = await getAvailablePlans();
        if (result.plans) {
            setPlans(result.plans);
        }
        setLoadingPlans(false);
    };

    const checkStatus = async () => {
        const status = await checkUserAdminStatus();
        setUserStatus(status);
    };

    const handleCompleteSetup = async (planName: string) => {
        setLoading(true);
        setResults(null);
        setError('');

        try {
            const result = await completeSetup(planName);
            if (result.error) {
                setError(result.error);
                if (result.results) {
                    setResults(result.results);
                }
            } else {
                setResults(result.results);
                // Auto redirect after 3 seconds
                setTimeout(() => {
                    router.push('/login');
                }, 3000);
            }
        } catch (e: any) {
            setError('Unexpected error: ' + e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
            <div className="max-w-3xl w-full bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-8">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
                        ⚡ One-Click Setup
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">
                        Complete database setup in one click
                    </p>
                    {userStatus && (
                        <div className="mt-4 inline-block">
                            <div className="bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-lg">
                                <p className="text-xs text-slate-600 dark:text-slate-400">
                                    👤 <span className="font-bold">{userStatus.email}</span>
                                </p>
                                <p className="text-xs text-slate-500 mt-1">
                                    Profile: {userStatus.profileExists ?
                                        <span className="text-green-600 font-bold">✅ Exists</span> :
                                        <span className="text-amber-600 font-bold">❌ Missing (will create)</span>
                                    }
                                    {' • '}
                                    Role: <span className={`font-bold ${userStatus.isAdmin ? 'text-green-600' : 'text-slate-600'}`}>
                                        {userStatus.role}
                                    </span>
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Results Display */}
                {results && (
                    <div className="mb-6 p-6 bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-lg">
                        <h3 className="font-bold text-green-900 dark:text-green-100 text-lg mb-3">
                            ✅ Setup Complete!
                        </h3>
                        <div className="space-y-1.5">
                            {results.details.map((detail: string, i: number) => (
                                <p key={i} className="text-sm text-green-800 dark:text-green-200 font-medium">
                                    {detail}
                                </p>
                            ))}
                        </div>
                        <p className="text-sm text-green-700 dark:text-green-300 mt-4 font-bold">
                            🔄 Redirecting you to login in 3 seconds...
                        </p>
                    </div>
                )}

                {/* Error Display */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-lg">
                        <p className="text-red-800 dark:text-red-200 text-sm font-bold mb-2">❌ Error:</p>
                        <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
                        {results && results.details.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-red-200 dark:border-red-700">
                                <p className="text-xs text-red-600 dark:text-red-400 font-bold mb-1">Partial Progress:</p>
                                {results.details.map((detail: string, i: number) => (
                                    <p key={i} className="text-xs text-red-600 dark:text-red-400">
                                        {detail}
                                    </p>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Main Setup Section */}
                <div className="border-2 border-blue-200 dark:border-blue-800 rounded-xl p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                            Choose Your Plan
                        </h2>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            This will create your profile, grant admin access, and activate your subscription
                        </p>
                    </div>

                    {loadingPlans ? (
                        <div className="text-center py-12">
                            <Loader2 className="h-10 w-10 animate-spin mx-auto text-blue-600 mb-3" />
                            <p className="text-sm text-slate-500">Loading plans...</p>
                        </div>
                    ) : plans.length === 0 ? (
                        <div className="text-center py-12 px-6 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-lg">
                            <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-3" />
                            <p className="text-sm text-red-700 dark:text-red-300 font-bold mb-2">
                                No plans found in database
                            </p>
                            <p className="text-xs text-red-600 dark:text-red-400">
                                Run <code className="bg-red-100 dark:bg-red-900 px-1 py-0.5 rounded">supabase/seed_plans.sql</code> first
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {plans.map((plan) => (
                                <button
                                    key={plan.id}
                                    onClick={() => handleCompleteSetup(plan.name)}
                                    disabled={loading}
                                    className="group relative bg-white dark:bg-slate-800 hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/40 dark:hover:to-purple-900/40 p-6 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed border-2 border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 hover:scale-105 hover:shadow-xl"
                                >
                                    {loading ? (
                                        <div className="flex flex-col items-center">
                                            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                                            <p className="text-xs text-slate-500 mt-2">Setting up...</p>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="text-center">
                                                <Zap className="h-8 w-8 text-blue-600 mx-auto mb-2 group-hover:text-purple-600 transition-colors" />
                                                <div className="font-bold text-xl text-slate-900 dark:text-white mb-2">
                                                    {plan.name}
                                                </div>
                                                <div className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-1">
                                                    {plan.speed_mbps} Mbps
                                                </div>
                                                <div className="text-sm text-slate-600 dark:text-slate-400">
                                                    ₹{plan.price_monthly}/month
                                                </div>
                                                <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700">
                                                    <p className="text-xs font-bold text-purple-600 dark:text-purple-400">
                                                        Click to Complete Setup
                                                    </p>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Info Box */}
                <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-blue-800 dark:text-blue-200">
                            <p className="font-bold mb-1">What happens when you click:</p>
                            <ul className="space-y-1 text-xs">
                                <li>1️⃣ Creates your profile (if missing)</li>
                                <li>2️⃣ Grants you admin access</li>
                                <li>3️⃣ Activates your chosen plan (30 days)</li>
                                <li>4️⃣ Logs you out automatically</li>
                                <li>5️⃣ Login again to access everything!</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Warning */}
                <div className="mt-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-300 dark:border-amber-700 rounded-lg p-3">
                    <p className="text-xs text-amber-900 dark:text-amber-200">
                        ⚠️ Delete <code className="bg-amber-100 dark:bg-amber-900 px-1 rounded">/app/setup</code> folder after use!
                    </p>
                </div>
            </div>
        </div>
    );
}
