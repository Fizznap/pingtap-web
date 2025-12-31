'use client';

import { AuthLayout } from '@/components/auth/AuthLayout';
import { RegisterProvider, useRegister } from '@/components/auth/register/RegisterContext';
import { Step1Personal } from '@/components/auth/register/Step1Personal';
import { Step2Address } from '@/components/auth/register/Step2Address';
import { Step3KYC } from '@/components/auth/register/Step3KYC';
import { Step4Plan } from '@/components/auth/register/Step4Plan';
import { Step5Payment } from '@/components/auth/register/Step5Payment';
import { Check } from 'lucide-react';

function WizardContent() {
    const { currentStep } = useRegister();

    const steps = [
        { id: 1, title: 'Personal' },
        { id: 2, title: 'Address' },
        { id: 3, title: 'KYC' },
        { id: 4, title: 'Plan' },
        { id: 5, title: 'Payment' },
    ];

    const getStepTitle = (step: number) => {
        switch (step) {
            case 1: return "Tell us about yourself";
            case 2: return "Where should we install?";
            case 3: return "Verify your identity";
            case 4: return "Choose your plan";
            case 5: return "Complete Payment";
            default: return "Create Account";
        }
    };

    const getStepSubtitle = (step: number) => {
        switch (step) {
            case 1: return "We need your details to create your account.";
            case 2: return "Check availability and schedule installation.";
            case 3: return "Upload government ID proof for verification.";
            case 4: return "Select speeds that match your lifestyle.";
            case 5: return "Securely pay to activate your connection.";
            default: return "Join Pingtap today.";
        }
    };

    return (
        <AuthLayout
            heading={getStepTitle(currentStep)}
            subheading={getStepSubtitle(currentStep)}
        >
            {/* Progress Bar */}
            <div className="flex items-center justify-between mb-8 px-2">
                {steps.map((step) => {
                    const isActive = step.id === currentStep;
                    const isCompleted = step.id < currentStep;

                    return (
                        <div key={step.id} className="flex flex-col items-center z-10">
                            <div className={`
                            w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300
                            ${isActive ? 'bg-blue-600 text-white ring-4 ring-blue-100 dark:ring-blue-900' : ''}
                            ${isCompleted ? 'bg-green-500 text-white' : ''}
                            ${!isActive && !isCompleted ? 'bg-slate-100 dark:bg-slate-800 text-slate-400' : ''}
                        `}>
                                {isCompleted ? <Check className="h-4 w-4" /> : step.id}
                            </div>
                            <span className={`text-[10px] mt-1 font-medium ${isActive ? 'text-blue-600' : 'text-slate-400'}`}>
                                {step.title}
                            </span>
                        </div>
                    );
                })}
                {/* Progress Line Background */}
                <div className="absolute h-[2px] bg-slate-100 dark:bg-slate-800 left-0 right-0 top-[220px] mx-12 -z-0" />
            </div>

            {currentStep === 1 && <Step1Personal />}
            {currentStep === 2 && <Step2Address />}
            {currentStep === 3 && <Step3KYC />}
            {currentStep === 4 && <Step4Plan />}
            {currentStep === 5 && <Step5Payment />}
        </AuthLayout>
    );
}

export function RegisterWizard() {
    return (
        <RegisterProvider>
            <WizardContent />
        </RegisterProvider>
    );
}
