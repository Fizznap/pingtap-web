'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { RegistrationFormData as ZodRegistrationData } from '@/lib/validations/register';

export type RegistrationFormData = ZodRegistrationData & {
    aadharFront?: File | null;
    aadharBack?: File | null;
};

interface RegisterContextType {
    currentStep: number;
    formData: Partial<RegistrationFormData>;
    updateFormData: (data: Partial<RegistrationFormData>) => void;
    nextStep: () => void;
    prevStep: () => void;
    stepValid: boolean;
    setStepValid: (valid: boolean) => void;
}

const RegisterContext = createContext<RegisterContextType | undefined>(undefined);

export function RegisterProvider({ children, initialPlanName }: { children: ReactNode; initialPlanName?: string }) {
    const [currentStep, setCurrentStep] = useState(1);

    // Map homepage plan names to Step4Plan IDs
    const getPlanIdFromName = (name?: string): string | undefined => {
        if (!name) return undefined;
        const lowerName = name.toLowerCase();

        // Map homepage plans to registration flow plans
        if (['starter', 'basic', 'standard'].some(p => lowerName.includes(p))) return 'speedster';
        if (['pro', 'super'].some(p => lowerName.includes(p))) return 'streamer';
        if (['ultra', 'giga'].some(p => lowerName.includes(p))) return 'gamer';

        return undefined;
    };

    const [formData, setFormData] = useState<Partial<RegistrationFormData>>({
        city: 'Thane',
        state: 'Maharashtra',
        planId: getPlanIdFromName(initialPlanName)
    });
    const [stepValid, setStepValid] = useState(false);

    const updateFormData = (data: Partial<RegistrationFormData>) => {
        setFormData((prev) => ({ ...prev, ...data }));
    };

    const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 5));
    const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

    return (
        <RegisterContext.Provider value={{ currentStep, formData, updateFormData, nextStep, prevStep, stepValid, setStepValid }}>
            {children}
        </RegisterContext.Provider>
    );
}

export const useRegister = () => {
    const context = useContext(RegisterContext);
    if (!context) throw new Error('useRegister must be used within RegisterProvider');
    return context;
};
