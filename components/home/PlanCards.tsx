'use client';

import { useState } from 'react';
import { Check, Star } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

type BillingCycle = 'monthly' | 'quarterly' | 'yearly';

const plans = [
    {
        name: 'Starter',
        speed: 30,
        price: { monthly: 400, quarterly: 1200, yearly: 4800 },
        features: ['Unlimited Data', 'Basic browsing & email', '24/7 Support'],
        recommended: false,
    },
    {
        name: 'Basic',
        speed: 50,
        price: { monthly: 450, quarterly: 1350, yearly: 5400 }, // Calculated based on readme (quarterly same monthly rate? Readme says 450*3=1350)
        features: ['Unlimited Data', 'HD Streaming capable', 'Work from home ready'],
        recommended: false,
    },
    {
        name: 'Standard',
        speed: 100,
        price: { monthly: 500, quarterly: 1500, yearly: 6720 }, // Yearly: 560/mo -> 6720
        features: ['Best Value for money', 'Unlimited Data', 'Seamless Multi-device streaming', 'Ideal for families'],
        recommended: true,
    },
    {
        name: 'Pro', // Renamed from Super to Pro to match common naming or keep Super? Readme says Super/Premium. Let's use Pro as per mock image if visible, mock image says "Standard", "Super", "Ultra". I'll stick to Readme names/speeds.
        speed: 200,
        price: { monthly: 600, quarterly: 1800, yearly: 7680 },
        features: ['Unlimited Data', 'Gaming Optimized (Low Latency)', 'Large file downloads'],
        recommended: false,
    },
    {
        name: 'Ultra',
        speed: 300,
        price: { monthly: 700, quarterly: 2100, yearly: 8400 }, // Extrapolated yearly
        features: ['Unlimited Data', '4K Streaming Support', 'Smart Home Ready'],
        recommended: false,
    },
    {
        name: 'Giga Lite', // 400Mbps
        speed: 400,
        price: { monthly: 800, quarterly: 2400, yearly: 9600 },
        features: ['Unlimited Data', 'Ultra Low Latency', 'Priority Support'],
        recommended: false,
    },
];

export function PlanCards() {
    const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');

    return (
        <section id="plans" className="py-20 bg-gray-50 dark:bg-transparent">
            <div className="container mx-auto px-4 md:px-6">
                <div className="mb-12 text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
                        Choose Your Perfect Plan
                    </h2>
                    <p className="mt-4 text-lg text-text-secondary">
                        No hidden charges, no speed throttling. Just pure speed.
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
                    {billingCycle === 'yearly' && (
                        <p className="mt-2 text-sm text-success font-medium">
                            Save up to 20% with yearly plans
                        </p>
                    )}
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {plans.map((plan) => (
                        <div
                            key={plan.name}
                            className={cn(
                                "relative flex flex-col rounded-2xl border bg-white dark:bg-slate-800 p-6 shadow-sm transition-all hover:shadow-md",
                                plan.recommended ? "border-primary ring-1 ring-primary shadow-md" : "border-border"
                            )}
                        >
                            {plan.recommended && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-semibold text-white shadow-sm">
                                    MOST POPULAR
                                </div>
                            )}

                            <div className="mb-4">
                                <h3 className="text-lg font-bold text-text-primary">{plan.name}</h3>
                                <div className="mt-2 flex items-baseline">
                                    <span className="text-4xl font-extrabold tracking-tight text-text-primary">
                                        ₹{plan.price[billingCycle]}
                                    </span>
                                    <span className="ml-1 text-sm font-medium text-text-secondary">
                                        /mo
                                        {billingCycle !== 'monthly' && '*'}
                                    </span>
                                </div>
                                {billingCycle !== 'monthly' && (
                                    <p className="text-xs text-text-tertiary mt-1">
                                        *Billed {billingCycle}
                                    </p>
                                )}
                                <div className="mt-2 inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                                    {plan.speed} Mbps Speed
                                </div>
                            </div>

                            <ul className="mb-6 space-y-3 flex-1">
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex items-start text-sm text-text-secondary">
                                        <Check className="mr-2 h-4 w-4 shrink-0 text-primary" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <Button
                                variant={plan.recommended ? 'primary' : 'outline'}
                                className="w-full"
                            >
                                Select Plan
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
