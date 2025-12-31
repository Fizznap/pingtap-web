import { createServerClient } from '@supabase/ssr';
import { CheckCircle, Search, Filter, ArrowUpRight, Clock, AlertCircle } from 'lucide-react';
export const dynamic = 'force-dynamic';
import { cookies } from 'next/headers';
import AdminTicketsClient from './AdminTicketsClient';

export default async function AdminTicketsPage() {
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

    // Fetch Tickets server-side (Admin View: All Tickets)
    // Note: RLS "Admins can view all tickets" policy handles security.
    const { data: tickets } = await supabase
        .from('support_tickets')
        .select(`
            *,
            profiles (
                full_name,
                address
            )
        `)
        .order('created_at', { ascending: false });

    // Validate and cast data if necessary to match Client props
    const safeTickets = (tickets || []).map((t: any) => ({
        ...t,
        profiles: t.profiles || { full_name: 'Unknown', address: null }
    }));

    return <AdminTicketsClient initialTickets={safeTickets} />;
}
