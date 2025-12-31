'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function RegisterForm() {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="space-y-6">
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>

                {/* Name Input */}
                <div className="relative group">
                    <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 transition-colors focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                        <label htmlFor="name" className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-0.5">
                            Full Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            className="block w-full bg-transparent border-none p-0 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-0 sm:text-base font-medium"
                            placeholder="John Doe"
                        />
                    </div>
                </div>

                {/* Email Input */}
                <div className="relative group">
                    <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 transition-colors focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                        <label htmlFor="email" className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-0.5">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="block w-full bg-transparent border-none p-0 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-0 sm:text-base font-medium"
                            placeholder="john@example.com"
                        />
                    </div>
                </div>

                {/* Mobile Input */}
                <div className="relative group">
                    <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 transition-colors focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                        <label htmlFor="mobile" className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-0.5">
                            Mobile Number
                        </label>
                        <input
                            type="tel"
                            id="mobile"
                            className="block w-full bg-transparent border-none p-0 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-0 sm:text-base font-medium"
                            placeholder="+91 98765 43210"
                        />
                    </div>
                </div>

                {/* Password Input */}
                <div className="relative group">
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer z-10"
                    >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                    <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 transition-colors focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                        <label htmlFor="password" className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-0.5">
                            Set Password
                        </label>
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            className="block w-full bg-transparent border-none p-0 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-0 sm:text-base font-medium"
                            placeholder="Create a strong password"
                        />
                    </div>
                </div>

                <Button
                    className="w-full h-12 text-base bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-600/20 mt-4"
                >
                    Create Account
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </form>

            <div className="pt-4 text-center border-t border-slate-100 dark:border-slate-800">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                    Already have an account? <Link href="/login" className="font-bold text-blue-600 hover:underline">Login here</Link>
                </p>
            </div>
        </div>
    );
}
