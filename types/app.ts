export interface Profile {
    id?: string;
    full_name: string;
    email: string;
    phone?: string;
    address?: any; // JSONB
    role?: 'customer' | 'admin' | 'technician';
}

export interface Payment {
    id: string;
    amount: number;
    currency: string;
    status: string;
    created_at: string;
    provider_order_id?: string;
    provider_payment_id?: string;
    method?: string;
    user_id: string;
    profiles?: Profile; // Joined data
}

export interface Plan {
    id: string;
    name: string;
    price_monthly: number;
    speed_mbps: number;
    features?: string[];
    is_active: boolean;
}

export interface Subscription {
    id: string;
    customer_id: string;
    plan_id: string;
    status: 'active' | 'expired' | 'cancelled';
    start_date: string;
    end_date: string;
    plans?: Plan; // Joined data
}

export interface Installation {
    id: string;
    user_id: string;
    status: 'pending' | 'scheduled' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
    scheduled_date?: string;
    technician_id?: string;
}
