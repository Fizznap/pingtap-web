'use client';

import { LogOut } from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';

export function SignOutButton() {
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
        <button
            onClick={handleSignOut}
            className="p-2 text-slate-400 hover:text-white transition-colors"
        >
            <LogOut className="h-5 w-5" />
        </button>
    );
}
