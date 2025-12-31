import { createServerClient } from '@supabase/ssr';
import { CheckCircle, Search, Filter, MapPin, Calendar, Clock, MoreVertical } from 'lucide-react';
export const dynamic = 'force-dynamic';
import { cookies } from 'next/headers';
import AdminInstallationsClient from './AdminInstallationsClient';

export default async function AdminInstallationsPage() {
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

    // Fetch Installations
    const { data: installations } = await supabase
        .from('installations')
        .select(`
            *,
            profiles:user_id (
                full_name,
                address
            ),
            subscriptions (
                plans (
                    name
                )
            )
        `)
        .order('scheduled_at', { ascending: true });

    // Fetch Technicians
    const { data: technicians } = await supabase
        .from('profiles')
        .select('id, full_name')
        .eq('role', 'technician');

    return (
        <AdminInstallationsClient
            installations={installations || []}
            technicians={technicians || []}
        />
    );
}
