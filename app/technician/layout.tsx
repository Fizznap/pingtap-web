
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { LogOut, HardHat } from 'lucide-react';
import Link from 'next/link';
import { SignOutButton } from '@/components/auth/SignOutButton';

export default async function TechnicianLayout({ children }: { children: React.ReactNode }) {
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

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('role, full_name')
        .eq('id', user.id)
        .single();

    if (!profile || (profile.role !== 'technician' && profile.role !== 'admin')) { // Allow admins to preview too
        redirect('/dashboard');
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
            {/* Mobile-first Header */}
            <header className="h-16 bg-slate-900 text-white flex items-center justify-between px-4 sticky top-0 z-50 shadow-md">
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold">
                        <HardHat className="h-5 w-5" />
                    </div>
                    <div>
                        <span className="font-bold block leading-none">TECH PORTAL</span>
                        <span className="text-[10px] text-slate-400 font-medium">Hello, {profile.full_name?.split(' ')[0]}</span>
                    </div>
                </div>
                <SignOutButton />
            </header>

            <main className="flex-1 p-4 max-w-lg mx-auto w-full">
                {children}
            </main>
        </div>
    );
}
