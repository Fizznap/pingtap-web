import Razorpay from 'razorpay';
import { logPaymentEvent } from '@/lib/paymentLogger';

// Type definition for the error
export class PaymentConfigError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'PAYMENT_PROVIDER_NOT_CONFIGURED';
    }
}

// Singleton instance (lazy initialization)
let razorpayInstance: Razorpay | null = null;

const getRazorpayInstance = () => {
    if (razorpayInstance) return razorpayInstance;

    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_id || !key_secret) {
        logPaymentEvent('PROVIDER_NOT_CONFIGURED', { message: 'Razorpay keys missing from environment variables.' });
        throw new PaymentConfigError('Razorpay keys are missing from environment variables.');
    }

    razorpayInstance = new Razorpay({
        key_id,
        key_secret,
    });

    return razorpayInstance;
};

export interface RazorpayOrder {
    id: string;
    entity: string;
    amount: number;
    amount_paid: number;
    amount_due: number;
    currency: string;
    receipt: string;
    status: string;
    attempts: number;
    notes: any;
    created_at: number;
}

/**
 * Creates a Razorpay Order server-side.
 * @param amount Amount in standard unit (e.g. 500 for ₹500) - Will be converted to paise
 * @param currency Default: INR
 * @param options Additional options like receipt, notes
 */
export async function createOrder(
    amount: number,
    currency: string = 'INR',
    options?: { receipt?: string; notes?: Record<string, string> }
): Promise<RazorpayOrder> {
    const instance = getRazorpayInstance();

    try {
        const orderOptions = {
            amount: Math.round(amount * 100), // Convert to subunits (paise)
            currency,
            receipt: options?.receipt,
            notes: options?.notes,
        };

        logPaymentEvent('CREATE_ORDER_ATTEMPT', { message: 'Calling Razorpay API', orderOptions: { ...orderOptions, notes: 'REDACTED (contains PII)' } });

        const order = await instance.orders.create(orderOptions);
        return order as RazorpayOrder;
    } catch (error: any) {
        // console.error is handled by logger now
        logPaymentEvent('ERROR', { message: 'Razorpay API Call Failed', error: error.message });
        throw error;
    }
}

