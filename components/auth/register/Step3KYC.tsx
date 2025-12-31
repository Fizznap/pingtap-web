'use client';

import { useRegister } from './RegisterContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { kycSchema, KycData } from '@/lib/validations/register';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Upload, X, FileImage, CreditCard } from 'lucide-react';
import { useState, useRef } from 'react';

export function Step3KYC() {
    const { formData, updateFormData, nextStep, prevStep } = useRegister();

    // Local state for files (since they can't be seamlessly serialized in some contexts, but Context handles objects fine)
    const [aadharFront, setAadharFront] = useState<File | null>(formData.aadharFront || null);
    const [aadharBack, setAadharBack] = useState<File | null>(formData.aadharBack || null);
    const [previewFront, setPreviewFront] = useState<string | null>(null);
    const [previewBack, setPreviewBack] = useState<string | null>(null);

    const frontInputRef = useRef<HTMLInputElement>(null);
    const backInputRef = useRef<HTMLInputElement>(null);

    const { register, handleSubmit, formState: { errors } } = useForm<KycData>({
        resolver: zodResolver(kycSchema),
        defaultValues: {
            aadharNumber: formData.aadharNumber || '',
        },
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, side: 'front' | 'back') => {
        const file = e.target.files?.[0];
        if (file) {
            if (side === 'front') {
                setAadharFront(file);
                setPreviewFront(URL.createObjectURL(file));
            } else {
                setAadharBack(file);
                setPreviewBack(URL.createObjectURL(file));
            }
        }
    };

    const removeFile = (side: 'front' | 'back') => {
        if (side === 'front') {
            setAadharFront(null);
            setPreviewFront(null);
            if (frontInputRef.current) frontInputRef.current.value = '';
        } else {
            setAadharBack(null);
            setPreviewBack(null);
            if (backInputRef.current) backInputRef.current.value = '';
        }
    };

    const onSubmit = (data: KycData) => {
        if (!aadharFront || !aadharBack) {
            alert("Please upload both sides of your Aadhar Card.");
            return;
        }

        updateFormData({
            ...data,
            aadharFront,
            aadharBack
        });
        nextStep();
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 animate-in slide-in-from-right-8 duration-500">

            <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30 mb-6">
                <h4 className="flex items-center gap-2 font-semibold text-blue-700 dark:text-blue-400 text-sm mb-1">
                    <CreditCard className="h-4 w-4" />
                    Identity Verification
                </h4>
                <p className="text-xs text-blue-600 dark:text-blue-500">
                    Government regulations require us to collect KYC documents for new broadband connections. Your data is encrypted and secure.
                </p>
            </div>

            {/* Aadhar Number */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Aadhar Card Number</label>
                <input
                    {...register('aadharNumber')}
                    maxLength={12}
                    className="block w-full px-3 h-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all tracking-widest font-mono"
                    placeholder="0000 0000 0000"
                />
                {errors.aadharNumber && <p className="text-xs text-red-500">{errors.aadharNumber.message}</p>}
            </div>

            {/* File Uploads */}
            <div className="grid grid-cols-2 gap-4">

                {/* Front Side */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Front Side</label>

                    {!aadharFront ? (
                        <div
                            onClick={() => frontInputRef.current?.click()}
                            className="h-32 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        >
                            <Upload className="h-6 w-6 text-slate-400 mb-2" />
                            <span className="text-xs text-slate-500">Upload Front</span>
                        </div>
                    ) : (
                        <div className="relative h-32 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden group">
                            {previewFront ? (
                                <img src={previewFront} alt="Front Preview" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-slate-800">
                                    <FileImage className="h-8 w-8 text-slate-400" />
                                </div>
                            )}
                            <button
                                type="button"
                                onClick={() => removeFile('front')}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X className="h-3 w-3" />
                            </button>
                            <div className="absolute bottom-0 inset-x-0 bg-black/50 text-white text-[10px] p-1 text-center truncate">
                                {aadharFront.name}
                            </div>
                        </div>
                    )}

                    <input
                        type="file"
                        ref={frontInputRef}
                        className="hidden"
                        accept="image/*,.pdf"
                        onChange={(e) => handleFileChange(e, 'front')}
                    />
                </div>

                {/* Back Side */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Back Side</label>

                    {!aadharBack ? (
                        <div
                            onClick={() => backInputRef.current?.click()}
                            className="h-32 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        >
                            <Upload className="h-6 w-6 text-slate-400 mb-2" />
                            <span className="text-xs text-slate-500">Upload Back</span>
                        </div>
                    ) : (
                        <div className="relative h-32 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden group">
                            {previewBack ? (
                                <img src={previewBack} alt="Back Preview" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-slate-800">
                                    <FileImage className="h-8 w-8 text-slate-400" />
                                </div>
                            )}
                            <button
                                type="button"
                                onClick={() => removeFile('back')}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X className="h-3 w-3" />
                            </button>
                            <div className="absolute bottom-0 inset-x-0 bg-black/50 text-white text-[10px] p-1 text-center truncate">
                                {aadharBack.name}
                            </div>
                        </div>
                    )}

                    <input
                        type="file"
                        ref={backInputRef}
                        className="hidden"
                        accept="image/*,.pdf"
                        onChange={(e) => handleFileChange(e, 'back')}
                    />
                </div>
            </div>

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
                >
                    View Plans
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
        </form>
    );
}
