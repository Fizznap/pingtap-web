'use client';

import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { BottomNav } from '@/components/layout/BottomNav'; // Reusing mobile bottom nav

export function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex">
            <DashboardSidebar />

            <main className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-0 relative">
                {/* Mobile Header (Simple) */}
                <header className="lg:hidden h-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sticky top-0 z-30">
                    <span className="font-bold text-slate-900 dark:text-white">Dashboard</span>
                    <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs font-bold">
                        RS
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto">
                    {children}
                </div>
            </main>

            {/* Mobile Bottom Nav */}
            <div className="lg:hidden">
                <BottomNav />
            </div>
        </div>
    );
}
