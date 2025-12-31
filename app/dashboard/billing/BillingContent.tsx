'use client';

import { useState } from 'react';
import { CreditCard, Download, Clock, AlertCircle, ChevronRight, Lock, Loader2, Calendar, Smartphone, Building2, Wallet, Info } from 'lucide-react';
import Script from 'next/script';
import { createOrderAction, createSubscriptionAndOrder, verifyPaymentSignature } from '@/app/actions/razorpay';
import { Payment, Subscription as AppSubscription } from '@/types/app';
import { createSubscription } from '@/app/actions/subscription'; // New Action
import { Button } from '@/components/ui/Button';
import { generateInvoicePDF } from '@/lib/invoice';

type PaymentMethod = 'card' | 'upi' | 'netbanking' | 'wallet';

type UserProfile = {
    full_name: string;
    address: any;
    email: string;
};

// Use the imported Subscription type or keep local if they differ significantly.
// Looking at local Subscription:
// type Subscription = { id: string; end_date: string; status: string; plan: { name: string; price_monthly: number; } | null; };
// AppSubscription: { ... plans?: Plan } -> Plan has name, price_monthly.
// The local Subscription type is slightly different in structure (nested plan object vs plans join).
// I will keep Subscription local but rename it or map it if needed. 
// Actually current code maps it: subscription = { ..., plan: { name... } }
// So the local Subscription type is accurate for the PROP. 
// I will just replace PaymentRecord with Payment.

type BillingContentProps = {
    profile: UserProfile;
    payments: Payment[];
    subscription: {
        id: string;
        end_date: string;
        status: string;
        plan: {
            name: string;
            price_monthly: number;
        } | null;
    } | null;
    availablePlans: any[];
    paymentsEnabled: boolean;
};

export default function BillingContent({ profile, payments, subscription, availablePlans, paymentsEnabled }: BillingContentProps) {
    const [isPaymentLoading, setIsPaymentLoading] = useState(false);

    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [selectedPlanForPurchase, setSelectedPlanForPurchase] = useState<any>(null);

    const handleDownloadInvoice = (record: Payment) => {
        if (!profile) return;

        let addressStr = 'N/A';
        const rawAddr = profile.address;

        if (typeof rawAddr === 'string') {
            addressStr = rawAddr;
        } else if (rawAddr && typeof rawAddr === 'object') {
            const parts = [rawAddr.line1, rawAddr.line2, rawAddr.city, rawAddr.state, rawAddr.zip].filter(Boolean);
            addressStr = parts.join(', ') || 'N/A';
        }

        const doc = generateInvoicePDF({
            invoiceNumber: `INV-${record.id.slice(0, 8).toUpperCase()}`,
            date: new Date(record.created_at).toLocaleDateString(),
            customerName: profile.full_name,
            customerAddress: addressStr,
            status: record.status,
            items: [
                {
                    description: 'Broadband Subscription Refill',
                    amount: record.amount
                }
            ],
            totalAmount: record.amount
        });

        doc.save(`PingTap_Invoice_${record.id.slice(0, 8)}.pdf`);
    };

    const handlePayment = async () => {
        // Payments are strictly disabled in this view-only pass.
        // We do not want to allow manual offline subscriptions either to avoid "fake" data creation.
        // User must contact support to activate.
        return;
    };

    const isSubscriptionActive = subscription && ['active', 'pending'].includes(subscription.status);
    const canChoosePlan = !subscription || ['cancelled', 'expired'].includes(subscription.status);

    // Only show "Current Plan" details in card if it's active/pending, OR if user selected a new one.
    // If expired, we treat it as "no plan" for the header card (so it encourages selection).
    const displaySubscription = isSubscriptionActive ? subscription : null;

    const planPrice = displaySubscription?.plan?.price_monthly || selectedPlanForPurchase?.price_monthly || 0;
    const planName = displaySubscription?.plan?.name || selectedPlanForPurchase?.name || 'Select Plan';
    const nextDue = displaySubscription?.end_date ? new Date(displaySubscription.end_date).toLocaleDateString() : 'Now';

    return (
        <div className="min-h-full bg-slate-50 dark:bg-slate-950 pb-24">
            <Script
                id="razorpay-checkout-js"
                src="https://checkout.razorpay.com/v1/checkout.js"
            />

            <div className="lg:hidden p-4 bg-white dark:bg-slate-900 flex items-center gap-3 sticky top-0 z-20 border-b border-slate-100 dark:border-slate-800">
                <h1 className="text-lg font-bold text-slate-900 dark:text-white">Billing & Payments</h1>
            </div>

            <div className="max-w-xl mx-auto p-4 space-y-6">

                {/* Total Payable Card */}
                <div className={`rounded-3xl p-6 text-white shadow-lg shadow-blue-600/20 relative overflow-hidden ${paymentsEnabled && (displaySubscription || selectedPlanForPurchase) ? 'bg-blue-600' : 'bg-slate-600 grayscale'}`}>
                    <div className="relative z-10">
                        {displaySubscription || selectedPlanForPurchase ? (
                            <>
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <p className="text-blue-100 text-sm font-medium">Total Payable</p>
                                        <h2 className="text-4xl font-bold mt-1">₹{planPrice}<span className="text-xl opacity-80">.00</span></h2>
                                    </div>
                                    <div className="bg-white/20 px-3 py-1 rounded-lg text-xs font-bold backdrop-blur-sm">
                                        {planName}
                                    </div>
                                </div>

                                <div className="flex justify-between items-center text-sm border-t border-white/20 pt-4 mt-2">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 opacity-80" />
                                        <span className="opacity-90">Due: {nextDue}</span>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-4">
                                <h2 className="text-2xl font-bold">Select a Plan</h2>
                                <p className="text-blue-100 text-sm mt-1">Choose a broadband plan below to continue.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Available Plans Selection */}
                {canChoosePlan && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {subscription && !isSubscriptionActive && (
                            <div className="mb-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-xl flex items-start gap-3">
                                <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="font-bold text-yellow-900 dark:text-yellow-200">Plan Ended</h4>
                                    <p className="text-sm text-yellow-700 dark:text-yellow-400 mt-1">
                                        Your {subscription.plan?.name || 'previous'} subscription has {subscription.status}. Please select a new plan to resume services.
                                    </p>
                                </div>
                            </div>
                        )}
                        <div>
                            <h3 className="font-bold text-slate-500 text-xs uppercase tracking-wider mb-4 ml-1">Available Plans</h3>
                            <div className="grid grid-cols-1 gap-4">
                                {availablePlans.map((plan) => (
                                    <div
                                        key={plan.id}
                                        onClick={() => setSelectedPlanForPurchase(plan)}
                                        className={`
                                        bg-white dark:bg-slate-900 rounded-2xl border p-5 cursor-pointer transition-all
                                        ${selectedPlanForPurchase?.id === plan.id
                                                ? 'border-blue-600 ring-2 ring-blue-600/20 shadow-md'
                                                : 'border-slate-200 dark:border-slate-800 hover:border-blue-300'
                                            }
                                    `}
                                    >
                                        <div className="flex justify-between items-center mb-2">
                                            <h4 className="font-bold text-lg text-slate-900 dark:text-white">{plan.name}</h4>
                                            <span className="text-blue-600 font-bold">₹{plan.price_monthly}<span className="text-xs text-slate-500 font-normal">/mo</span></span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 mb-3">
                                            <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded textxs font-bold">{plan.speed_mbps} Mbps</span>
                                            <span>•</span>
                                            <span>Unlimited Data</span>
                                        </div>
                                        <div className="text-xs text-slate-500 space-y-1">
                                            {plan.features?.slice(0, 3).map((f: string, i: number) => (
                                                <div key={i} className="flex items-center gap-1.5">
                                                    <div className="h-1 w-1 bg-slate-400 rounded-full" /> {f}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Billing History Section */}
                <div>
                    <h3 className="font-bold text-slate-500 text-xs uppercase tracking-wider mb-4 ml-1">Billing History</h3>
                    <div className="space-y-3">
                        {payments.length === 0 ? (
                            <div className="text-center py-8 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                                <div className="h-10 w-10 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-2 text-slate-400">
                                    <Clock className="h-5 w-5" />
                                </div>
                                <p className="text-sm text-slate-500">No payment history found.</p>
                            </div>
                        ) : (
                            payments.map((record) => (
                                <div key={record.id} className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex justify-between items-center shadow-sm">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`h-2 w-2 rounded-full ${record.status === 'captured' ? 'bg-green-500' : 'bg-orange-500'}`}></span>
                                            <p className="font-bold text-slate-900 dark:text-white capitalize text-sm">{record.status === 'captured' ? 'Payment Successful' : record.status}</p>
                                        </div>
                                        <div className="text-xs text-slate-500 flex items-center gap-2">
                                            <span>{new Date(record.created_at).toLocaleDateString()}</span>
                                            <span>•</span>
                                            <span className="font-mono">{record.id.slice(0, 8)}</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-slate-900 dark:text-white">₹{record.amount}</p>
                                        {record.status === 'captured' && (
                                            <button
                                                onClick={() => handleDownloadInvoice(record)}
                                                className="text-[10px] font-bold text-blue-600 hover:text-blue-700 hover:underline flex items-center justify-end gap-1 mt-1 transition-colors"
                                            >
                                                <Download className="h-3 w-3" /> Invoice
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Payment Options (Show if Subscription Exists OR Plan Selected) */}

            </div>

            {/* Sticky Footer */}
            <div className="fixed bottom-0 lg:left-64 right-0 p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 z-40 lg:z-30 pb-safe">
                <div className="max-w-xl mx-auto flex flex-col items-center gap-3">
                    {errorMessage && (
                        <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm font-medium animate-in slide-in-from-bottom-2">
                            <AlertCircle className="h-4 w-4" />
                            {errorMessage}
                        </div>
                    )}

                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-xl text-center shadow-lg mb-4">
                        <p className="font-bold">Online payments launching soon</p>
                        <p className="text-xs opacity-90 mt-1">To renew your subscription or change plans,<br />please visit our office or contact support.</p>
                        <p className="text-xs font-bold mt-2 bg-white/20 inline-block px-3 py-1 rounded">Helpline: 816-925-700</p>
                    </div>

                    <Button
                        size="lg"
                        className="w-full bg-slate-200 text-slate-500 rounded-xl h-14 text-lg flex items-center justify-center font-bold cursor-not-allowed hover:bg-slate-200"
                        onClick={handlePayment}
                        disabled={true}
                    >
                        <span>Payments Disabled</span>
                    </Button>

                    <div className="flex items-center gap-1.5 text-[10px] text-green-600 font-bold uppercase tracking-wider opacity-80">
                        <Lock className="h-3 w-3" />
                        Secured by PINGTAP Pay
                    </div>
                </div>
            </div>

        </div >
    );
}
