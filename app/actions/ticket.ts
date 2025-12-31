'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';


export async function createTicket(subject: string, description: string, category: string, priority: 'low' | 'medium' | 'high' = 'medium') {
    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() { return cookieStore.getAll(); },
                setAll(cookiesToSet) { },
            },
        }
    );

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'Unauthorized' };
    }

    const finalSubject = category ? `[${category}] ${subject}` : subject;

    // 1. Insert into DB
    const { data: ticket, error } = await supabase
        .from('support_tickets')
        .insert({
            customer_id: user.id,
            subject: finalSubject,
            description: description,
            status: 'open',
            priority: priority
        })
        .select()
        .single();

    if (error) {
        console.error('Create Ticket Error:', error.message, error.details || '', error.hint || '');
        return { error: `Failed to create ticket: ${error.message}` };
    }

    // 2. Try WhatsApp Notification (Fail Safe)
    try {
        // Find User Phone (if available in profile or metadata)
        // For now, using a placeholder check or skipping if phone not strictly verified
        // const phone = user.phone || user.user_metadata?.phone;

        // TODO: Call WhatsApp API here. 
        // If it fails, we catch/log but DO NOT revert the ticket.
    } catch (waError) {
        console.warn('WhatsApp Notification Failed:', waError);
    }

    revalidatePath('/dashboard/support');
    return { success: true, ticketId: ticket.id };
}

export async function sendMessage(ticketId: string, message: string) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() { return cookieStore.getAll(); },
                setAll(cookiesToSet) { },
            },
        }
    );

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'Unauthorized' };
    }

    // RLS Policy handles the permission check (User must own ticket)

    const { error } = await supabase
        .from('ticket_messages')
        .insert({
            ticket_id: ticketId,
            sender_id: user.id,
            sender_role: 'user',
            message: message
        });

    if (error) {
        console.error('Send Message Error:', error);
        return { error: 'Failed to send message.' };
    }

    revalidatePath(`/dashboard/support/${ticketId}`);
    return { success: true };
}

export async function updateTicketStatus(ticketId: string, status: 'open' | 'in_progress' | 'resolved' | 'closed') {
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
                    // No-op for server actions usually, unless setting auth cookies which we aren't here
                },
            },
        }
    );

    // 1. Check Auth
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { error: 'Unauthorized' };
    }


    // 2. Perform Update
    // RLS Policy "Admins can update tickets" ensures only admins can perform this.
    // We use the standard client (user context) to respect RLS.


    const updateData: any = { status };
    if (status === 'resolved') {
        updateData.resolved_at = new Date().toISOString();
    }

    const { error } = await supabase
        .from('support_tickets')
        .update(updateData)
        .eq('id', ticketId);

    if (error) {
        console.error('Update Ticket Error:', error);
        return { error: 'Failed to update ticket' };
    }

    revalidatePath('/admin/tickets');
    return { success: true };
}
