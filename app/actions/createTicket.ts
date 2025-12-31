'use server';

import { createClient } from '@/lib/supabase/server';
import { sendWhatsAppMessage } from '@/lib/whatsapp';

export async function createTicketAction(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, message: 'Unauthorized' };
    }

    const category = formData.get('category') as string;
    const subject = formData.get('subject') as string;
    const description = formData.get('description') as string;

    // 1. Create Ticket in DB (Mocking DB insert if table doesn't exist yet, or assuming it does)
    // ideally: await supabase.from('tickets').insert({ ... })
    // For now, we simulate success to proceed to WhatsApp part
    const ticketId = `TKT-${Math.floor(1000 + Math.random() * 9000)}`;

    // 2. Send WhatsApp Notification
    // We assume the user has a phone number in metadata or profile
    // const userPhone = user.user_metadata?.phone || '91XXXXXXXXXX'; 
    // In a real app, fetch valid phone. For demo, we might log or use a dummy if env var not set.

    // Construct simplified message 
    const messageText = `Hello ${user.user_metadata?.full_name || 'User'}, your ticket *${ticketId}* for *${category}* has been created.\n\nSubject: ${subject}\n\nOur team will contact you shortly.`;

    // Attempt to send (will log warning if env vars missing)
    // We use the user's phone if available, or fall back to a safe debug number if you have one.
    // Here we'll just try to send to the registered phone.
    if (user.user_metadata?.phone) {
        await sendWhatsAppMessage({
            to: user.user_metadata.phone,
            text: messageText
        });
    }

    return {
        success: true,
        message: 'Ticket created successfully',
        ticket: {
            id: ticketId,
            category,
            subject,
            status: 'Open',
            date: new Date().toLocaleDateString()
        }
    };
}
