'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Ticket, Map, Settings, LogOut, ShieldAlert, Banknote, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';

const sidebarItems = [
    { icon: LayoutDashboard, label: 'Overview', href: '/admin' },
    { icon: Ticket, label: 'Tickets Queue', href: '/admin/tickets' },
    { icon: Users, label: 'Subscriptions', href: '/admin/subscriptions' }, // Task 1
    { icon: Calendar, label: 'Installations', href: '/admin/installations' },
    { icon: Users, label: 'Technicians', href: '/admin/technicians' },
    { icon: Banknote, label: 'Payments', href: '/admin/payments' },
    { icon: Map, label: 'Live Map', href: '/admin/map' },
    { icon: Settings, label: 'Settings', href: '/admin/settings' },
];

export function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const handleSignOut = async () => {
        const supabase = createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
        await supabase.auth.signOut();
        router.push('/login');
    };

    return (
        <aside className="hidden lg:flex flex-col w-64 h-screen bg-slate-900 text-white border-r border-slate-800 sticky top-0 font-sans">
            {/* Brand */}
            <div className="h-16 flex items-center px-6 border-b border-slate-800 bg-slate-950/50">
                <Link href="/admin" className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
                        <ShieldAlert className="h-5 w-5" />
                    </div>
                    <span className="text-lg font-bold">PINGTAP <span className="text-[10px] bg-indigo-900 text-indigo-300 px-1.5 py-0.5 rounded ml-1 align-top">ADMIN</span></span>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-1">
                {sidebarItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all",
                                isActive
                                    ? "bg-indigo-600/10 text-indigo-400 border border-indigo-600/20"
                                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                            )}
                        >
                            <item.icon className={cn("h-5 w-5", isActive ? "text-indigo-400" : "text-slate-500")} />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/30">
                <button
                    onClick={handleSignOut}
                    className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-red-900/20 transition-colors"
                >
                    <LogOut className="h-5 w-5" />
                    Sign Out
                </button>
            </div>
        </aside>
    );
}
