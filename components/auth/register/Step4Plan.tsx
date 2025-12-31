'use client';

import { useRegister } from './RegisterContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { planSchema, PlanData } from '@/lib/validations/register';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Check, Wifi, Zap } from 'lucide-react';
import { useState } from 'react';

const PLANS = [
    {
        id: 'speedster',
        name: 'Speedster',
        speed: '100 Mbps',
        monthlyPrice: 699,
        popular: false,
        color: 'bg-blue-500',
        features: ['Unlimited Data', 'Free Router', 'No Installation Charges']
    },
    {
        id: 'streamer',
        name: 'Streamer',
        speed: '200 Mbps',
        monthlyPrice: 999,
        popular: true,
        color: 'bg-purple-500',
        features: ['Unlimited Data', 'Free Dual-band Router', 'OTT Bundle Included']
    },
    {
        id: 'gamer',
        name: 'Gamer',
        speed: '500 Mbps',
        monthlyPrice: 1499,
        popular: false,
        color: 'bg-orange-500',
        features: ['Unlimited Data', 'Prioritized Traffic', 'Static IP Included']
    }
];

export function Step4Plan() {
    const { formData, updateFormData, nextStep, prevStep } = useRegister();
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'quarterly' | 'yearly'>('monthly');

    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<PlanData>({
        resolver: zodResolver(planSchema),
        defaultValues: {
            planId: formData.planId || '',
            billingCycle: formData.billingCycle || 'monthly'
        }
    });

    const selectedPlanId = watch('planId');

    const handlePlanSelect = (id: string) => {
        setValue('planId', id);
    };

    const calculateTotal = (price: number) => {
        let multiplier = 1;
        let discount = 0;

        if (billingCycle === 'quarterly') {
            multiplier = 3;
            discount = 0.05; // 5% discount
        } else if (billingCycle === 'yearly') {
            multiplier = 12;
            discount = 0.15; // 15% discount
        }

        const total = price * multiplier;
        const final = total - (total * discount);

        return {
            total: Math.round(total),
            final: Math.round(final),
            saved: Math.round(total * discount)
        };
    };

    const onSubmit = (data: PlanData) => {
        updateFormData({ ...data, billingCycle });
        nextStep();
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 animate-in slide-in-from-right-8 duration-500">

            {/* Billing Cycle Toggle */}
            <div className="flex bg-slate-100 dark:bg-slate-800/50 p-1 rounded-xl mb-6">
                {(['monthly', 'quarterly', 'yearly'] as const).map((cycle) => (
                    <button
                        key={cycle}
                        type="button"
                        onClick={() => setBillingCycle(cycle)}
                        className={`
                    flex-1 py-2 text-xs font-medium rounded-lg capitalize transition-all
                    ${billingCycle === cycle
                                ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm'
                                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}
                `}
                    >
                        {cycle}
                        {cycle === 'yearly' && <span className="ml-1 text-[9px] bg-green-100 text-green-700 px-1 py-0.5 rounded-full">-15%</span>}
                    </button>
                ))}
            </div>

            {/* Plan Cards */}
            <div className="space-y-3">
                {PLANS.map((plan) => {
                    const pricing = calculateTotal(plan.monthlyPrice);
                    const isSelected = selectedPlanId === plan.id;

                    return (
                        <div
                            key={plan.id}
                            onClick={() => handlePlanSelect(plan.id)}
                            className={`
                        relative group cursor-pointer border-2 rounded-xl p-4 transition-all duration-200
                        ${isSelected
                                    ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/10'
                                    : 'border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-slate-700 bg-white dark:bg-slate-900'}
                    `}
                        >
                            {plan.popular && (
                                <div className="absolute -top-3 right-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                                    POPULAR
                                </div>
                            )}

                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-3">
                                    <div className={`h-10 w-10 rounded-lg ${plan.color} bg-opacity-10 flex items-center justify-center text-blue-600`}>
                                        {plan.id === 'gamer' ? <Zap className="h-5 w-5" /> : <Wifi className="h-5 w-5" />}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 dark:text-white">{plan.name}</h3>
                                        <p className="text-blue-600 font-bold text-sm">{plan.speed}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-baseline justify-end gap-1">
                                        <span className="text-lg font-bold text-slate-900 dark:text-white">₹{pricing.final}</span>
                                        {billingCycle !== 'monthly' && (
                                            <span className="text-xs text-slate-400 line-through">₹{pricing.total}</span>
                                        )}
                                    </div>
                                    <p className="text-[10px] text-slate-500">/{billingCycle}</p>
                                </div>
                            </div>

                            <ul className="space-y-1 mb-0">
                                {plan.features.slice(0, 2).map((feat, i) => (
                                    <li key={i} className="flex items-center text-xs text-slate-600 dark:text-slate-400">
                                        <Check className="h-3 w-3 mr-1.5 text-green-500" />
                                        {feat}
                                    </li>
                                ))}
                            </ul>

                            {isSelected && (
                                <div className="absolute inset-0 border-2 border-blue-500 rounded-xl pointer-events-none shadow-lg shadow-blue-500/10 ring-1 ring-blue-500" />
                            )}
                        </div>
                    );
                })}
            </div>
            {errors.planId && <p className="text-xs text-red-500 text-center">{errors.planId.message}</p>}

            <div className="flex gap-3 pt-4">
                <Button
                    type="button"
                    variant="outline"
                    className="flex-1 h-12"
                    onClick={prevStep}
                >
                    Back
                </Button>
                <Button
                    type="submit"
                    className="flex-[2] h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
                    disabled={!selectedPlanId}
                >
                    Proceed to Pay
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
        </form>
    );
}
