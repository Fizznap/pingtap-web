'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export async function assignTechnician(installationId: string, technicianId: string) {
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
    if (!user) return { error: 'Unauthorized' };

    // Role Check (Optimization: RLS handles this, but explicit check is good for Server Action feedback)
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (profile?.role !== 'admin') {
        return { error: 'Only admins can assign technicians.' };
    }

    const { error } = await supabase
        .from('installations')
        .update({
            technician_id: technicianId,
            status: 'confirmed' // Auto-confirm when assigned? Or keep pending? Let's say confirmed for now as it's scheduled.
        })
        .eq('id', installationId);

    if (error) {
        console.error('Assign Tech Error:', error);
        return { error: 'Failed to assign technician.' };
    }

    revalidatePath('/admin/installations');
    return { success: true };
}

export async function updateJobStatus(installationId: string, status: 'confirmed' | 'in_progress' | 'completed' | 'cancelled') {
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
    if (!user) return { error: 'Unauthorized' };

    // Check ownership (Technician assigned) OR Admin role
    // We can rely on RLS if "Users can update own assigned installations" policy exists.
    // But currently we only have "Admins can update installations". 
    // We need to ADD a policy for Technicians to update their own jobs OR handle it here.
    // Let's add the policy in the next step. For now, we'll verify here conceptually.

    // For now, we will assume RLS will eventually enforce it, but we can also check role here.
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();

    // If not admin, check if assigned
    if (profile?.role !== 'admin') {
        const { data: install } = await supabase
            .from('installations')
            .select('technician_id')
            .eq('id', installationId)
            .single();

        if (install?.technician_id !== user.id) {
            return { error: 'You are not assigned to this job.' };
        }
    }

    const { error } = await supabase
        .from('installations')
        .update({ status })
        .eq('id', installationId);

    if (error) {
        console.error('Update Job Error:', error);
        return { error: 'Failed to update job status.' };
    }

    revalidatePath('/technician');
    revalidatePath('/admin/installations');
    return { success: true };
}
