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

const defaultPlans = [
    {
        name: 'Basic Plan',
        speed_mbps: 50,
        price_monthly: 499,
        price_quarterly: 1499,
        price_yearly: 5699,
        features: ['50 Mbps Speed', 'Unlimited Data', 'No OTT'],
        is_active: true
    },
    {
        name: 'Standard Plan',
        speed_mbps: 100,
        price_monthly: 799,
        price_quarterly: 2399,
        price_yearly: 9199,
        features: ['100 Mbps Speed', 'Unlimited Data', 'Amazon Prime', 'Dual Band Router'],
        is_active: true
    },
    {
        name: 'Ultra Plan',
        speed_mbps: 300,
        price_monthly: 1299,
        price_quarterly: 3899,
        price_yearly: 14999,
        features: ['300 Mbps Speed', 'Unlimited Data', 'Netflix & Prime', 'Mesh Router'],
        is_active: true
    }
];

async function seed() {
    console.log('Seeding Plans...');

    // Check existing
    const { count } = await supabase.from('plans').select('*', { count: 'exact', head: true });

    if (count > 0) {
        console.log(`Plans already exist (${count}). Skipping seed.`);
        return;
    }

    const { data, error } = await supabase.from('plans').insert(defaultPlans).select();

    if (error) {
        console.error('Error insert plans:', error.message);
    } else {
        console.log(`Success! Inserted ${data.length} plans.`);
    }
}

seed();
