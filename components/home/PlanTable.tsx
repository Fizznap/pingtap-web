'use client';

import { useState } from 'react';
import { Check, X, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

type BillingCycle = 'monthly' | 'quarterly' | 'yearly';

const plans = [
    {
        name: 'Starter',
        speed: 30,
        price: { monthly: 400, quarterly: 1200, yearly: 4800 },
        features: ['Unlimited Data', 'Basic browsing', '24/7 Support', false, false],
        recommended: false,
    },
    {
        name: 'Basic',
        speed: 50,
        price: { monthly: 450, quarterly: 1350, yearly: 5400 },
        features: ['Unlimited Data', 'HD Streaming', 'Work from home', false, false],
        recommended: false,
    },
    {
        name: 'Standard',
        speed: 100,
        price: { monthly: 500, quarterly: 1500, yearly: 6720 },
        features: ['Unlimited Data', 'Multi-device', 'Family Plan', true, false],
        recommended: true,
    },
    {
        name: 'Pro',
        speed: 200,
        price: { monthly: 600, quarterly: 1800, yearly: 7680 },
        features: ['Unlimited Data', 'Gaming Optimized', 'Large files', true, true],
        recommended: false,
    },
    {
        name: 'Ultra',
        speed: 300,
        price: { monthly: 700, quarterly: 2100, yearly: 8400 },
        features: ['Unlimited Data', '4K Streaming', 'Smart Home', true, true],
        recommended: false,
    },
];

const featureLabels = [
    'Data Limit',
    'Best For',
    'Support',
    'OTT Bundle',
    'Priority Service'
];

export function PlanTable() {
    const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');

    return (
        <section className="hidden lg:block py-20 bg-gray-50 dark:bg-transparent">
            <div className="container mx-auto px-4">
                <div className="mb-12 text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
                        Compare Our Plans
                    </h2>
                    <p className="mt-4 text-lg text-text-secondary">
                        Detailed breakdown for power users.
                    </p>

                    {/* Billing Cycle Toggle */}
                    <div className="mt-8 flex justify-center">
                        <div className="inline-flex rounded-lg border border-border bg-white dark:bg-slate-800 p-1">
                            {(['monthly', 'quarterly', 'yearly'] as BillingCycle[]).map((cycle) => (
                                <button
                                    key={cycle}
                                    onClick={() => setBillingCycle(cycle)}
                                    className={cn(
                                        "rounded-md px-4 py-2 text-sm font-medium transition-all",
                                        billingCycle === cycle
                                            ? "bg-primary text-white shadow-sm"
                                            : "text-text-secondary hover:text-text-primary"
                                    )}
                                >
                                    {cycle.charAt(0).toUpperCase() + cycle.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="overflow-hidden rounded-xl border border-border bg-white dark:bg-slate-800 shadow-sm">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-slate-900/50">
                                <th className="p-6 text-left text-sm font-semibold text-text-secondary">Plan Features</th>
                                {plans.map((plan) => (
                                    <th key={plan.name} className={cn("p-6 text-center relative", plan.recommended ? "bg-primary/5 dark:bg-primary/10" : "")}>
                                        {plan.recommended && (
                                            <span className="absolute top-0 left-1/2 -translate-x-1/2 rounded-b-md bg-amber-500 px-3 py-1 text-[10px] font-bold uppercase text-white shadow-sm">
                                                Best Value
                                            </span>
                                        )}
                                        <div className="text-lg font-bold text-text-primary">{plan.name}</div>
                                        <div className="mt-2 text-3xl font-extrabold text-primary">
                                            {plan.speed} <span className="text-sm font-medium text-text-secondary">Mbps</span>
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {/* Price Row */}
                            <tr>
                                <td className="p-6 text-sm font-medium text-text-secondary">Monthly Price</td>
                                {plans.map((plan) => (
                                    <td key={plan.name} className={cn("p-6 text-center", plan.recommended ? "bg-primary/5 dark:bg-primary/10" : "")}>
                                        <div className="text-2xl font-bold text-text-primary">₹{plan.price[billingCycle]}</div>
                                        <div className="text-xs text-text-tertiary">excl. GST</div>
                                    </td>
                                ))}
                            </tr>
                            {/* Dynamic feature rows matching the array index logic */}
                            {/* Row 1: Data */}
                            <tr>
                                <td className="p-6 text-sm font-medium text-text-secondary">Data Limit</td>
                                {plans.map((plan) => (
                                    <td key={plan.name} className={cn("p-6 text-center text-sm font-medium text-text-primary", plan.recommended ? "bg-primary/5 dark:bg-primary/10" : "")}>
                                        Unlimited
                                    </td>
                                ))}
                            </tr>

                            {/* Row 2: OTT Bundle (Simulated logic from features array) */}
                            <tr>
                                <td className="p-6 text-sm font-medium text-text-secondary flex items-center gap-2">
                                    OTT Subscription
                                    <HelpCircle className="h-4 w-4 text-text-tertiary" />
                                </td>
                                {plans.map((plan) => (
                                    <td key={plan.name} className={cn("p-6 text-center", plan.recommended ? "bg-primary/5 dark:bg-primary/10" : "")}>
                                        {/* Logic based primarily on speed for demo */}
                                        {plan.speed >= 100 ? (
                                            <div className="flex justify-center text-success"><Check className="h-5 w-5" /></div>
                                        ) : (
                                            <div className="flex justify-center text-text-tertiary"><X className="h-5 w-5" /></div>
                                        )}
                                    </td>
                                ))}
                            </tr>

                            {/* Action Row */}
                            <tr>
                                <td className="p-6"></td>
                                {plans.map((plan) => (
                                    <td key={plan.name} className={cn("p-6 text-center", plan.recommended ? "bg-primary/5 dark:bg-primary/10" : "")}>
                                        <Button variant={plan.recommended ? "primary" : "outline"} className="w-full">
                                            Choose {plan.name}
                                        </Button>
                                    </td>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}
