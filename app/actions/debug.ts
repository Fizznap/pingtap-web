'use server';

import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const getServiceClient = () => {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        }
    );
};

export async function checkMyData() {
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
        return { error: 'Not authenticated' };
    }

    const serviceClient = getServiceClient();

    // Get profile
    const { data: profile } = await serviceClient
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    // Get subscriptions
    const { data: subscriptions } = await serviceClient
        .from('subscriptions')
        .select(`
            *,
            plan:plans(*)
        `)
        .eq('customer_id', user.id);

    // Get all subscriptions (for admin view)
    const { data: allSubscriptions } = await serviceClient
        .from('subscriptions')
        .select(`
            *,
            plan:plans(*),
            customer:profiles(email, full_name)
        `)
        .limit(10);

    return {
        userId: user.id,
        userEmail: user.email,
        profile,
        mySubscriptions: subscriptions || [],
        allSubscriptions: allSubscriptions || []
    };
}
