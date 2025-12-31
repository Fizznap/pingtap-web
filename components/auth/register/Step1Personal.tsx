'use client';

import { useRegister } from './RegisterContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { personalDetailsSchema, PersonalDetailsData } from '@/lib/validations/register';
import { Button } from '@/components/ui/Button';
import { ArrowRight, User, Mail, Phone, Calendar, Lock } from 'lucide-react';
import { useEffect } from 'react';

export function Step1Personal() {
    const { formData, updateFormData, nextStep } = useRegister();

    const { register, handleSubmit, formState: { errors }, watch } = useForm<PersonalDetailsData>({
        resolver: zodResolver(personalDetailsSchema),
        defaultValues: {
            fullName: formData.fullName || '',
            email: formData.email || '',
            phone: formData.phone || '+91',
            dob: formData.dob || '',
        }
    });

    const onSubmit = (data: PersonalDetailsData) => {
        updateFormData(data);
        nextStep();
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 animate-in slide-in-from-right-8 duration-500">
            <div className="space-y-4">
                {/* Full Name */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                            <User className="h-4 w-4" />
                        </div>
                        <input
                            {...register('fullName')}
                            className="block w-full pl-10 h-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            placeholder="Enter your full name"
                        />
                    </div>
                    {errors.fullName && <p className="text-xs text-red-500">{errors.fullName.message}</p>}
                </div>

                {/* Password and Confirm Password */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Create Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                <Lock className="h-4 w-4" />
                            </div>
                            <input
                                {...register('password')}
                                type="password"
                                className="block w-full pl-10 h-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                placeholder="••••••"
                            />
                        </div>
                        {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Confirm Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                <Lock className="h-4 w-4" />
                            </div>
                            <input
                                {...register('confirmPassword')}
                                type="password"
                                className="block w-full pl-10 h-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                placeholder="••••••"
                            />
                        </div>
                        {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>}
                    </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                            <Mail className="h-4 w-4" />
                        </div>
                        <input
                            {...register('email')}
                            type="email"
                            className="block w-full pl-10 h-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            placeholder="name@example.com"
                        />
                    </div>
                    {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                </div>

                {/* Phone */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Mobile Number</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                            <Phone className="h-4 w-4" />
                        </div>
                        <input
                            {...register('phone')}
                            className="block w-full pl-10 h-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            placeholder="+91 98765 43210"
                        />
                    </div>
                    {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
                    <p className="text-xs text-slate-500">We will send an OTP to verify this number.</p>
                </div>

                {/* DOB */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Date of Birth</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                            <Calendar className="h-4 w-4" />
                        </div>
                        <input
                            {...register('dob')}
                            type="date"
                            className="block w-full pl-10 h-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900 dark:text-white"
                        />
                    </div>
                    {errors.dob && <p className="text-xs text-red-500">{errors.dob.message}</p>}
                </div>
            </div>

            <Button type="submit" className="w-full h-12 mt-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
                Select Address
                <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
        </form>
    );
}
