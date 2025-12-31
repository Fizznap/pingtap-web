'use client';

import { useRegister } from './RegisterContext';
import { Button } from '@/components/ui/Button';
import { CheckCircle, CreditCard, Lock, ShieldCheck, Loader2, ArrowLeft, Download, Router, Cable, HardHat } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';

export function Step5Payment() {
    const { formData, prevStep } = useRegister();
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    const INSTALLATION_TOKEN_AMOUNT = 1500;
    const INVOICE_NUMBER = `INV-${Math.floor(100000 + Math.random() * 900000)}`;

    const handlePayment = async () => {
        setIsProcessing(true);

        try {
            const supabase = createBrowserClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            );

            // 1. Sign Up User
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: formData.email!,
                password: formData.password!,
                options: {
                    data: {
                        full_name: formData.fullName,
                        phone: formData.phone,
                    },
                },
            });

            if (authError) throw authError;

            // 2. Insert into Profiles (Optional but recommended if you have a profiles table)
            // For now, we rely on Auth metadata or a trigger. 
            // If you have a Trigger setup on 'auth.users' -> 'public.profiles', it's automatic.

            // Simulate Payment Gateway delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            setPaymentSuccess(true);
            setTimeout(() => {
                router.push('/dashboard');
            }, 5000);

        } catch (error: any) {
            alert(`Registration Failed: ${error.message}`);
        } finally {
            setIsProcessing(false);
        }
    };

    const downloadInvoice = () => {
        // In a real app, this would use pdfMake or jsPDF
        window.print();
    };

    if (paymentSuccess) {
        return (
            <div className="flex flex-col items-center justify-center py-6 text-center animate-in zoom-in duration-300">
                <div className="h-16 w-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-500" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Registration Successful!</h2>
                <p className="text-slate-600 dark:text-slate-400 max-w-md text-sm mb-6">
                    Payment of <span className="font-bold">₹{INSTALLATION_TOKEN_AMOUNT}</span> was successful.
                    Transaction ID: <span className="font-mono text-slate-500">TXN{Math.floor(Math.random() * 1000000000)}</span>
                </p>

                {/* Auto-Generated Invoice View */}
                <div className="bg-white text-slate-900 p-6 rounded-lg shadow-xl border border-slate-200 w-full max-w-md text-left text-xs mb-6 font-mono leading-relaxed" id="invoice-area">
                    <div className="flex justify-between border-b pb-4 mb-4">
                        <div>
                            <h1 className="font-bold text-lg">PINGTAP</h1>
                            <p>Broadband Services Pvt Ltd</p>
                            <p>GSTIN: 27AABCT1234K1Z5</p>
                        </div>
                        <div className="text-right">
                            <h2 className="font-bold text-base">INVOICE</h2>
                            <p>#{INVOICE_NUMBER}</p>
                            <p>{new Date().toLocaleDateString()}</p>
                        </div>
                    </div>

                    <div className="mb-4">
                        <p className="font-bold">Bill To:</p>
                        <p>{formData.fullName || 'Customer Name'}</p>
                        <p>{formData.street || 'Address Line 1'}</p>
                        <p>{formData.area}, {formData.city} - {formData.pincode}</p>
                        <p>{formData.phone}</p>
                    </div>

                    <table className="w-full mb-4">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left py-1">Item</th>
                                <th className="text-right py-1">Qty</th>
                                <th className="text-right py-1">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="py-2">Installation Token</td>
                                <td className="text-right">1</td>
                                <td className="text-right">₹{INSTALLATION_TOKEN_AMOUNT.toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td className="py-1 text-slate-500">CGST (9%)</td>
                                <td className="text-right"></td>
                                <td className="text-right">Included</td>
                            </tr>
                            <tr>
                                <td className="py-1 text-slate-500">SGST (9%)</td>
                                <td className="text-right"></td>
                                <td className="text-right">Included</td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr className="border-t font-bold">
                                <td className="pt-2">Total Paid</td>
                                <td></td>
                                <td className="text-right pt-2">₹{INSTALLATION_TOKEN_AMOUNT.toFixed(2)}</td>
                            </tr>
                        </tfoot>
                    </table>

                    <div className="text-center border-t pt-4 text-[10px] text-slate-400">
                        This is a computer generated invoice.
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={downloadInvoice}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors"
                    >
                        <Download className="h-4 w-4" />
                        Print / Download Invoice
                    </button>
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                        Go to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">

            {/* Order Breakdown & Payment */}
            <div className="space-y-6">
                {/* Order Summary */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                    <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                        <h3 className="font-semibold text-slate-900 dark:text-white">Review & Pay</h3>
                        <span className="text-xs bg-blue-100 text-blue-700 font-bold px-2 py-1 rounded">50% Complete</span>
                    </div>
                    <div className="p-6 space-y-4">

                        {/* Billing Address Preview */}
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
                            <p className="font-bold text-slate-900 dark:text-white mb-1">Billing Address:</p>
                            <p>{formData.fullName}</p>
                            <p>{formData.street}, {formData.landmark}</p>
                            <p>{formData.area}, {formData.city}, {formData.state} - {formData.pincode}</p>
                            <p className="mt-1">+91 {formData.phone}</p>
                        </div>

                        {/* Selected Plan (Pay Later) */}
                        <div className="flex justify-between items-center opacity-70">
                            <div>
                                <p className="font-medium text-slate-900 dark:text-white">{formData.planId ? formData.planId.toUpperCase() : 'Selected Plan'} (Broadband)</p>
                                <p className="text-xs text-slate-500">Cycle: {formData.billingCycle} (Pay after installation)</p>
                            </div>
                            <div className="text-right">
                                <p className="font-medium text-slate-900 dark:text-white text-sm">Post-paid</p>
                            </div>
                        </div>

                        <div className="h-px bg-slate-100 dark:bg-slate-800" />

                        {/* Installation Token (Pay Now) */}
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="font-bold text-slate-900 dark:text-white">Installation Token</p>
                                <p className="text-xs text-slate-500">Refundable feasibility deposit</p>
                            </div>
                            <p className="font-bold text-slate-900 dark:text-white">₹{INSTALLATION_TOKEN_AMOUNT.toFixed(2)}</p>
                        </div>

                        {/* Taxes */}
                        <div className="flex justify-between items-center text-xs text-slate-500">
                            <p>GST (Included)</p>
                            <p>₹{(INSTALLATION_TOKEN_AMOUNT * 0.18).toFixed(2)}</p>
                        </div>

                        <div className="h-px bg-slate-100 dark:bg-slate-800" />

                        {/* Total */}
                        <div className="flex justify-between items-center pt-2">
                            <p className="text-lg font-bold text-slate-900 dark:text-white">Total Payable</p>
                            <p className="text-2xl font-bold text-blue-600">₹{INSTALLATION_TOKEN_AMOUNT}</p>
                        </div>
                    </div>
                </div>

                {/* Secure Payment Badge */}
                <div className="flex items-center justify-center gap-2 text-xs text-slate-500 bg-green-50 dark:bg-green-900/10 p-2 rounded-lg border border-green-100 dark:border-green-900/20">
                    <ShieldCheck className="h-4 w-4 text-green-600" />
                    <span>Payment information is encrypted (SSL).</span>
                </div>

                <div className="flex gap-3 pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        className="flex-1 h-12"
                        onClick={prevStep}
                        disabled={isProcessing}
                    >
                        Back
                    </Button>
                    <Button
                        onClick={handlePayment}
                        className="flex-[2] h-12 bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-lg shadow-green-600/20"
                        disabled={isProcessing}
                    >
                        {isProcessing ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <Lock className="mr-2 h-4 w-4" />
                                Pay ₹{INSTALLATION_TOKEN_AMOUNT}
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {/* Included Benefits (Stacked below) */}
            <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                <h4 className="font-bold text-slate-900 dark:text-white text-center text-sm">Installation Includes:</h4>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                    <ul className="space-y-3">
                        <li className="flex gap-3 items-center">
                            <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                                <Router className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                                <p className="font-bold text-xs text-slate-900 dark:text-white">Dual-Band Router</p>
                                <p className="text-[10px] text-slate-500">Worth ₹2,999</p>
                            </div>
                        </li>
                        <li className="flex gap-3 items-center">
                            <div className="h-8 w-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center shrink-0">
                                <Cable className="h-4 w-4 text-orange-600" />
                            </div>
                            <div>
                                <p className="font-bold text-xs text-slate-900 dark:text-white">Fiber Drop Cable</p>
                                <p className="text-[10px] text-slate-500">Up to 100m included</p>
                            </div>
                        </li>
                        <li className="flex gap-3 items-center">
                            <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
                                <HardHat className="h-4 w-4 text-green-600" />
                            </div>
                            <div>
                                <p className="font-bold text-xs text-slate-900 dark:text-white">Professional Setup</p>
                                <p className="text-[10px] text-slate-500">Certified Engineers</p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
