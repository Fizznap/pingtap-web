
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Menu } from 'lucide-react';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                    // No-op
                },
            },
        }
    );

    // 1. Auth Check
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    // 2. Role Check
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (!profile || profile.role !== 'admin') {
        redirect('/dashboard');
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex dark">
            {/* Desktop Sidebar */}
            <AdminSidebar />

            <div className="flex-1 flex flex-col min-h-screen">
                {/* Mobile Header */}
                <header className="lg:hidden h-16 bg-slate-900 text-white flex items-center justify-between px-4 border-b border-slate-800 sticky top-0 z-40">
                    <span className="font-bold">PINGTAP ADMIN</span>
                    <button className="p-2">
                        <Menu className="h-6 w-6" />
                    </button>
                </header>

                <main className="flex-1 overflow-auto bg-slate-100/50 dark:bg-black/20">
                    {children}
                </main>
            </div>
        </div>
    );
}

