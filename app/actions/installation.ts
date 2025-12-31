'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

// Mock Available Slots Generator
export async function getAvailableSlots(date: string) {
    // In a real app, this would query the DB for existing bookings and subtract from capacity.
    // For now, we return static slots.

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const slots = [
        '09:00 AM - 11:00 AM',
        '11:00 AM - 01:00 PM',
        '02:00 PM - 04:00 PM',
        '04:00 PM - 06:00 PM'
    ];

    return { success: true, slots };
}

export async function scheduleInstallation(date: Date, slot: string) {
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

    // 1. Check for Active Subscription (that needs installation)
    // We assume the most recent active subscription is the one.
    const { data: subscription } = await supabase
        .from('subscriptions')
        .select('id')
        .eq('customer_id', user.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

    if (!subscription) {
        return { error: 'No active subscription found. Please purchase a plan first.' };
    }

    // 2. Check if already scheduled (Active: pending, confirmed, completed)
    const { data: existing } = await supabase
        .from('installations')
        .select('id, status')
        .eq('subscription_id', subscription.id)
        .neq('status', 'cancelled') // Allow rescheduling if previous was cancelled
        .single();

    if (existing) {
        return { error: 'An active installation is already scheduled for this subscription.' };
    }

    // 3. Create Installation Record
    const { error } = await supabase
        .from('installations')
        .insert({
            user_id: user.id,
            subscription_id: subscription.id,
            scheduled_at: date.toISOString(),
            slot_time: slot,
            status: 'pending'
        });

    if (error) {
        console.error('Schedule Error:', error);
        return { error: 'Failed to schedule installation.' };
    }

    revalidatePath('/dashboard');
    return { success: true };
}
