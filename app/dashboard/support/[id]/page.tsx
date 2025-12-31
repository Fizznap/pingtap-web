
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import SupportDetailClient from './SupportDetailClient';

export default async function TicketDetailPage({ params }: { params: { id: string } }) {
    const { id } = await params;
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

    // 1. Fetch Ticket & Verify Ownership
    const { data: ticket } = await supabase
        .from('support_tickets')
        .select('*')
        .eq('id', id)
        .eq('customer_id', user.id)
        .single();

    if (!ticket) {
        // Either doesn't exist or doesn't belong to user
        notFound();
    }

    // 2. Fetch Messages
    let messages: any[] = [];
    const { data: msgs } = await supabase
        .from('ticket_messages')
        .select('*')
        .eq('ticket_id', id)
        .order('created_at', { ascending: true }); // Oldest first for chat

    if (msgs) {
        messages = msgs;
    }

    return (
        <SupportDetailClient
            ticket={ticket}
            initialMessages={messages}
            currentUserId={user.id}
        />
    );
}
