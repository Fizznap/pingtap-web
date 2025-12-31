'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export async function extendSubscription(subscriptionId: string, days: number) {
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

    // 1. Check Admin Role
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Unauthorized' };

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (!profile || profile.role !== 'admin') {
        return { error: 'Forbidden: Admin access required' };
    }

    // 2. Fetch Subscription to get current end_date
    const { data: sub, error: subError } = await supabase
        .from('subscriptions')
        .select('end_date, status')
        .eq('id', subscriptionId)
        .single();

    if (subError || !sub) return { error: 'Subscription not found' };

    // 3. Calculate New Date
    const currentEndDate = new Date(sub.end_date);
    const now = new Date();

    // If expired, start from NOW. If active, valid from current end date.
    const baseDate = currentEndDate > now ? currentEndDate : now;

    const newEndDate = new Date(baseDate);
    newEndDate.setDate(baseDate.getDate() + days);

    // 4. Update
    const { error: updateError } = await supabase
        .from('subscriptions')
        .update({
            end_date: newEndDate.toISOString(),
            status: 'active', // Force active if it was expired
            updated_at: new Date().toISOString()
        })
        .eq('id', subscriptionId);

    if (updateError) return { error: updateError.message };

    // 5. Log Action (Optional - useful for audit)
    // console.log(`Admin ${user.email} extended subscription ${subscriptionId} by ${days} days.`);

    revalidatePath('/admin');
    revalidatePath('/admin/subscriptions');
    revalidatePath('/dashboard'); // Update user view

    return { success: true, newDate: newEndDate.toISOString() };
}
