'use client';

import Link from 'next/link';
import { Home, StickyNote, Activity, MessageSquare, User } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function BottomNav() {
    const pathname = usePathname();

    const navItems = [
        { label: 'Home', icon: Home, href: '/dashboard' },
        { label: 'Usage', icon: Activity, href: '/dashboard/usage' },
        { label: 'Billing', icon: StickyNote, href: '/dashboard/billing' },
        { label: 'Support', icon: MessageSquare, href: '/dashboard/support' },
        { label: 'Profile', icon: User, href: '/dashboard/profile' },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pb-safe z-50 lg:hidden">
            <div className="flex justify-around items-center h-16">
                {navItems.map((item) => (
                    <Link
                        key={item.label}
                        href={item.href}
                        className="flex flex-col items-center justify-center w-full h-full text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 p-1"
                    >
                        <item.icon className="h-5 w-5 mb-1" />
                        <span className="text-[10px] font-medium">{item.label}</span>
                    </Link>
                ))}
            </div>
        </nav>
    );
}
