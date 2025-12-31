'use client';

import Link from 'next/link';
import { Lock } from 'lucide-react';

interface AuthLayoutProps {
    children: React.ReactNode;
    heading: string;
    subheading: string;
}

export function AuthLayout({ children, heading, subheading }: AuthLayoutProps) {
    return (
        <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute inset-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100 via-slate-50 to-slate-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-950 -z-10"></div>

            {/* Brand Header */}
            <div className="mb-8 flex flex-col items-center">
                <div className="flex items-center gap-2 mb-2">
                    <div className="h-10 w-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" /></svg>
                    </div>
                    <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">PINGTAP <span className="text-blue-600">Broadband</span></span>
                </div>
            </div>

            {/* Main Card */}
            <div className="w-full max-w-[420px] bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{heading}</h1>
                    <p className="text-slate-500 text-sm">{subheading}</p>
                </div>

                {children}
            </div>

            {/* Footer */}
            <div className="mt-8 flex flex-col items-center gap-4 text-center">
                <div className="flex items-center gap-2 text-slate-400 text-xs font-medium uppercase tracking-wider">
                    <Lock className="h-3 w-3" />
                    Secure Connection
                </div>
                <div className="text-slate-400 text-xs">
                    © {new Date().getFullYear()} PINGTAP Broadband Services. Thane, India.
                </div>
                <div className="flex gap-4 text-xs text-slate-500">
                    <Link href="#" className="hover:text-blue-600 transition-colors">Support: +91 816925700</Link>
                    <Link href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</Link>
                </div>
            </div>
        </div>
    );
}
