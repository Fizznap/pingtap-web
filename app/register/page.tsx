'use client';

import { RegisterWizard } from '@/components/auth/register/RegisterWizard';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function RegisterContent() {
    const searchParams = useSearchParams();
    const planName = searchParams.get('plan') || undefined;

    return <RegisterWizard selectedPlanName={planName} />;
}

export default function RegisterPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <RegisterContent />
        </Suspense>
    );
}
