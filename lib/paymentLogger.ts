
// Minimal, server-only logging utility for payment flows

export type PaymentEventType =
    | 'CREATE_ORDER_ATTEMPT'
    | 'PAYMENT_DISABLED'
    | 'PROVIDER_NOT_CONFIGURED'
    | 'ORDER_CREATED'
    | 'ERROR';

interface LogPayload {
    message: string;
    userId?: string;
    paymentId?: string;
    [key: string]: any;
}

/**
 * Logs structured payment events to the console.
 * Sanities sensitive information before logging.
 */
export function logPaymentEvent(type: PaymentEventType, payload: LogPayload) {
    const timestamp = new Date().toISOString();

    // Basic sanitization to prevent logging secrets
    const safePayload = sanitizePayload(payload);

    const logEntry = {
        timestamp,
        type,
        ...safePayload
    };

    if (type === 'ERROR') {
        console.error(JSON.stringify(logEntry));
    } else {
        console.info(JSON.stringify(logEntry));
    }
}

function sanitizePayload(payload: LogPayload): LogPayload {
    const SENSITIVE_KEYS = ['key', 'secret', 'password', 'token', 'auth', 'cvv', 'card'];
    const safe: any = {};

    for (const [key, value] of Object.entries(payload)) {
        const lowerKey = key.toLowerCase();
        const isSensitive = SENSITIVE_KEYS.some(s => lowerKey.includes(s));

        if (isSensitive) {
            safe[key] = '[REDACTED]';
        } else if (typeof value === 'object' && value !== null) {
            // Shallow recursion for one level of objects (e.g. razorpay options)
            safe[key] = JSON.stringify(value);
        } else {
            safe[key] = value;
        }
    }

    return safe as LogPayload;
}
