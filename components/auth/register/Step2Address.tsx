'use client';

import { useRegister } from './RegisterContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addressDetailsSchema, AddressDetailsData } from '@/lib/validations/register';
import { Button } from '@/components/ui/Button';
import { ArrowRight, MapPin, Building, Home, Store, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';

const THANE_AREAS = [
    'Kasarvadavali',
    'Ghodbunder Road',
    'Majiwada',
    'Manpada',
    'Wagle Estate',
    'Khopat',
    'Naupada',
    'Other'
];

export function Step2Address() {
    const { formData, updateFormData, nextStep, prevStep } = useRegister();
    const [checkingCoverage, setCheckingCoverage] = useState(false);
    const [coverageStatus, setCoverageStatus] = useState<'idle' | 'available' | 'limited' | 'unavailable'>('idle');

    const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<AddressDetailsData>({
        resolver: zodResolver(addressDetailsSchema),
        defaultValues: {
            street: formData.street || '',
            landmark: formData.landmark || '',
            city: 'Thane',
            state: 'Maharashtra',
            pincode: formData.pincode || '',
            // @ts-ignore
            area: formData.area || '',
            // @ts-ignore
            addressType: formData.addressType || 'home'
        }
    });

    const selectedArea = watch('area'); // @ts-ignore
    const selectedPincode = watch('pincode');

    // Reset coverage status when inputs change
    useEffect(() => {
        if (coverageStatus !== 'idle') {
            setCoverageStatus('idle');
        }
    }, [selectedArea, selectedPincode]);

    const checkCoverage = async () => {
        setCheckingCoverage(true);
        setCoverageStatus('idle');

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Mock Logic
        const isThanePincode = selectedPincode?.startsWith('400');

        if (!isThanePincode) {
            setCoverageStatus('unavailable');
        } else if (selectedArea === 'Wagle Estate' || selectedArea === 'Khopat') {
            setCoverageStatus('unavailable');
        } else if (selectedArea === 'Naupada') {
            setCoverageStatus('limited');
        } else {
            setCoverageStatus('available');
        }
        setCheckingCoverage(false);
    };

    const onSubmit = (data: AddressDetailsData) => {
        if (coverageStatus === 'idle') {
            checkCoverage();
            return;
        }

        if (coverageStatus === 'unavailable') {
            return;
        }

        updateFormData(data);
        nextStep();
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 animate-in slide-in-from-right-8 duration-500">

            {/* Address Type */}
            <div className="grid grid-cols-3 gap-2">
                {[
                    { id: 'home', label: 'Home', icon: Home },
                    { id: 'office', label: 'Office', icon: Building },
                    { id: 'shop', label: 'Shop', icon: Store }
                ].map((type) => (
                    <label
                        key={type.id}
                        className={`
                    cursor-pointer border rounded-xl p-3 flex flex-col items-center justify-center gap-2 transition-all
                    ${watch('addressType' as any) === type.id
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 Ring-1 Ring-blue-500'
                                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'}
                `}
                    >
                        <input
                            type="radio"
                            value={type.id}
                            {...register('addressType' as any)}
                            className="sr-only"
                        />
                        <type.icon className="h-5 w-5" />
                        <span className="text-xs font-medium">{type.label}</span>
                    </label>
                ))}
            </div>

            {/* Complete Address */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Complete Address</label>
                <textarea
                    {...register('street')}
                    rows={3}
                    className="block w-full p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                    placeholder="Flat 101, Sai Prasad Building, Near D-Mart, Kasarvadavali"
                />
                {errors.street && <p className="text-xs text-red-500">{errors.street.message}</p>}
            </div>

            {/* Landmark */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Landmark (Optional)</label>
                <input
                    {...register('landmark')}
                    className="block w-full px-3 h-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="Near D-Mart, Opposite Bank"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                {/* Area */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Area/Locality</label>
                    <select
                        {...register('area' as any)}
                        className="block w-full px-3 h-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    >
                        <option value="" disabled>Select Area</option>
                        {THANE_AREAS.map(area => (
                            <option key={area} value={area}>{area}</option>
                        ))}
                    </select>
                    {/* @ts-ignore */}
                    {errors.area && <p className="text-xs text-red-500">{errors.area.message}</p>}
                </div>

                {/* Pincode */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Pincode</label>
                    <input
                        {...register('pincode')}
                        maxLength={6}
                        className="block w-full px-3 h-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        placeholder="400615"
                    />
                    {errors.pincode && <p className="text-xs text-red-500">{errors.pincode.message}</p>}
                </div>
            </div>

            {/* Coverage Result */}
            {coverageStatus === 'available' && (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-100 dark:border-green-900/30 flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                        <h4 className="font-semibold text-green-700 dark:text-green-400 text-sm">Service Available!</h4>
                        <p className="text-xs text-green-600 dark:text-green-500 mt-1">High-speed fiber is ready for installation in your area.</p>
                    </div>
                </div>
            )}

            {coverageStatus === 'limited' && (
                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-100 dark:border-amber-900/30 flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div>
                        <h4 className="font-semibold text-amber-700 dark:text-amber-400 text-sm">Limited Connectivity</h4>
                        <p className="text-xs text-amber-600 dark:text-amber-500 mt-1">Some plans might not be available in {selectedArea}.</p>
                    </div>
                </div>
            )}

            {coverageStatus === 'unavailable' && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-900/30 flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                    <div>
                        <h4 className="font-semibold text-red-700 dark:text-red-400 text-sm">Not Available Yet</h4>
                        <p className="text-xs text-red-600 dark:text-red-500 mt-1">We are expanding to your area soon. Join our waitlist.</p>
                    </div>
                </div>
            )}


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
                    disabled={checkingCoverage || coverageStatus === 'unavailable'}
                >
                    {checkingCoverage ? <Loader2 className="animate-spin h-5 w-5" /> : (
                        <>
                            {coverageStatus === 'idle' ? 'Check Coverage' : 'Next Step'}
                            {coverageStatus !== 'idle' && <ArrowRight className="ml-2 h-4 w-4" />}
                        </>
                    )}
                </Button>
            </div>
        </form>
    );
}
