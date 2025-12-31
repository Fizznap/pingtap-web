const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment from .env file manually
try {
    const envPath = path.resolve(__dirname, '../.env');
    if (fs.existsSync(envPath)) {
        const envFile = fs.readFileSync(envPath, 'utf8');
        const lines = envFile.split('\n');
        lines.forEach(line => {
            const parts = line.split('=');
            if (parts.length >= 2) {
                const key = parts[0].trim();
                const val = parts.slice(1).join('=').trim().replace(/^["']|["']$/g, '');
                if (key && val) {
                    process.env[key] = val;
                }
            }
        });
    }
} catch (e) {
    console.warn('Could not read .env file, relying on process.env', e);
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('ERROR: Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function reset() {
    console.log('Starting Business Data Reset...');

    const tables = [
        'invoices',
        'payments',
        'installations',
        'ticket_messages',
        'support_tickets',
        'subscriptions'
    ];

    for (const table of tables) {
        process.stdout.write(`Clearing ${table}... `);
        // Using a filter that matches all UUIDs
        const { error, count } = await supabase
            .from(table)
            .delete({ count: 'exact' })
            .neq('id', '00000000-0000-0000-0000-000000000000');

        if (error) {
            console.error(`FAILED: ${error.message}`);
        } else {
            console.log(`Done. (Deleted rows: ${count})`);
        }
    }

    console.log('Normalizing Profiles (role -> customer)...');
    const { error: profileError, count: profileCount } = await supabase
        .from('profiles')
        .update({ role: 'customer' }, { count: 'exact' })
        .neq('role', 'customer');

    if (profileError) {
        console.error('Error normalizing profiles:', profileError.message);
    } else {
        console.log(`Profiles Normalized. (Updated rows: ${profileCount})`);
    }

    // Verify Plans
    console.log('Verifying Plans...');
    const { data: plans, error: plansError } = await supabase
        .from('plans')
        .select('id, name, is_active')
        .eq('is_active', true);

    if (plansError) {
        console.error('Error checking plans:', plansError.message);
    } else {
        console.log(`Active Plans Found: ${plans.length}`);
        if (plans.length === 0) {
            console.warn('WARNING: No active plans found! You may need to seed plans.');
        } else {
            console.log('Plans OK.');
        }
    }

    console.log('Reset Complete.');
}

reset();
