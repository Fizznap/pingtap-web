
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import TechnicianDashboardClient from './TechnicianDashboardClient';

export default async function TechnicianPage() {
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

    // Fetch Assigned Jobs
    // Note: RLS will auto-filter if we set up 'Users can view own assigned installations'.
    // If not, we explicitly filter by technician_id.
    // Let's rely on explicit query for now to be safe and clear.
    const { data: jobs } = await supabase
        .from('installations')
        .select(`
            *,
            profiles:user_id (
                full_name,
                address,
                phone
            ),
            subscriptions (
                plans (
                    name
                )
            )
        `)
        .eq('technician_id', user!.id)
        .order('scheduled_at', { ascending: true });

    return <TechnicianDashboardClient jobs={jobs || []} />;
}
