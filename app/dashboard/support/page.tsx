
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import SupportClient from './SupportClient';

export default async function SupportPage() {
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

    let tickets: any[] = [];

    if (user) {
        const { data } = await supabase
            .from('support_tickets')
            .select('*')
            .eq('customer_id', user.id)
            .order('created_at', { ascending: false });

        if (data) {
            tickets = data;
        }
    }

    return <SupportClient initialTickets={tickets} />;
}
