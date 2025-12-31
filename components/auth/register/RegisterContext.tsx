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

export function RegisterProvider({ children }: { children: ReactNode }) {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<Partial<RegistrationFormData>>({
        city: 'Thane',
        state: 'Maharashtra'
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
