import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Activity, StickyNote, MessageSquare, User, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createBrowserClient } from '@supabase/ssr';
import { useEffect, useState } from 'react';

const sidebarItems = [
    { icon: LayoutDashboard, label: 'Home', href: '/dashboard' },
    { icon: Activity, label: 'Usage', href: '/dashboard/usage' },
    { icon: StickyNote, label: 'Billing', href: '/dashboard/billing' },
    { icon: MessageSquare, label: 'Support', href: '/dashboard/support' },
    { icon: User, label: 'Profile', href: '/dashboard/profile' },
];

export function DashboardSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [user, setUser] = useState<{ name: string; email: string }>({ name: 'User', email: 'Loading...' });

    useEffect(() => {
        const fetchUser = async () => {
            const supabase = createBrowserClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            );
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUser({
                    name: user.user_metadata?.full_name || 'Guest User',
                    email: user.email || 'No Email'
                });
            }
        };
        fetchUser();
    }, []);

    const handleSignOut = async () => {
        const supabase = createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
        await supabase.auth.signOut();
        router.push('/login');
    };

    return (
        <aside className="hidden lg:flex flex-col w-64 h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 sticky top-0">
            {/* Brand */}
            <div className="h-16 flex items-center px-6 border-b border-slate-100 dark:border-slate-800/50">
                <Link href="/" className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">P</div>
                    <span className="text-lg font-bold text-slate-900 dark:text-white">PINGTAP</span>
                </Link>
            </div>

            {/* User Profile Snippet */}
            <div className="p-4">
                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                    <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                        <User className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                        <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-2 space-y-1">
                {sidebarItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                                isActive
                                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                            )}
                        >
                            <item.icon className={cn("h-5 w-5", isActive ? "text-blue-600" : "text-slate-400")} />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800">
                <button
                    onClick={handleSignOut}
                    className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                >
                    <LogOut className="h-5 w-5" />
                    Sign Out
                </button>
            </div>
        </aside>
    );
}
