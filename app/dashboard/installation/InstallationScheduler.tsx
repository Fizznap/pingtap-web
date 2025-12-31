'use client';

import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { getAvailableSlots, scheduleInstallation } from '@/app/actions/installation';
import { useRouter } from 'next/navigation';

export default function InstallationScheduler({
    subscriptionId,
    existingInstallation
}: {
    subscriptionId: string | null,
    existingInstallation: any
}) {
    const router = useRouter();
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [slots, setSlots] = useState<string[]>([]);
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (!existingInstallation && subscriptionId) {
            loadSlots(selectedDate);
        }
    }, [selectedDate, existingInstallation, subscriptionId]);

    const loadSlots = async (date: string) => {
        setLoading(true);
        const res = await getAvailableSlots(date);
        if (res.success && res.slots) {
            setSlots(res.slots);
        }
        setLoading(false);
    };

    const handleSchedule = async () => {
        if (!selectedDate || !selectedSlot) return;
        setSubmitting(true);
        setError(null);

        const dateObj = new Date(selectedDate);
        const res = await scheduleInstallation(dateObj, selectedSlot);

        if (res.success) {
            setSuccess(true);
            router.refresh();
        } else {
            setError(res.error || 'Failed to schedule');
        }
        setSubmitting(false);
    };

    if (!subscriptionId) {
        return (
            <div className="bg-orange-50 dark:bg-orange-900/10 p-6 rounded-xl border border-orange-100 dark:border-orange-900/20 text-center">
                <AlertCircle className="h-10 w-10 text-orange-500 mx-auto mb-2" />
                <h3 className="font-bold text-slate-900 dark:text-white">No Active Subscription</h3>
                <p className="text-sm text-slate-500 mt-1">Please purchase a plan to schedule installation.</p>
            </div>
        );
    }

    if (existingInstallation) {
        return (
            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 text-center max-w-md mx-auto">
                <div className="h-16 w-16 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                    <CheckCircle className="h-8 w-8" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Installation Scheduled</h2>
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl mt-4 text-left space-y-3">
                    <div className="flex items-center gap-3">
                        <CalendarIcon className="h-5 w-5 text-slate-400" />
                        <div>
                            <p className="text-xs text-slate-500 font-bold uppercase">Date</p>
                            <p className="font-medium text-slate-900 dark:text-white">
                                {new Date(existingInstallation.scheduled_at).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-slate-400" />
                        <div>
                            <p className="text-xs text-slate-500 font-bold uppercase">Time Slot</p>
                            <p className="font-medium text-slate-900 dark:text-white">{existingInstallation.slot_time}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 pt-2 border-t border-slate-200 dark:border-slate-700">
                        <div className={`h-2.5 w-2.5 rounded-full ${existingInstallation.status === 'completed' ? 'bg-green-500' :
                                existingInstallation.status === 'confirmed' ? 'bg-blue-500' : 'bg-yellow-500'
                            }`} />
                        <p className="text-sm font-medium capitalize text-slate-600 dark:text-slate-300">
                            Status: {existingInstallation.status}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="bg-green-50 dark:bg-green-900/10 p-8 rounded-2xl border border-green-100 dark:border-green-900/20 text-center">
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Request Received!</h3>
                <p className="text-slate-600 dark:text-slate-400 mt-2">
                    Our technician will visit you on the scheduled time. You can track status here.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5 text-blue-600" />
                    Schedule Installation
                </h2>
                <p className="text-sm text-slate-500 mt-1">Select a convenient date and time for our technician to visit.</p>
            </div>

            <div className="p-6 space-y-6">
                {/* Date Selection */}
                <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Select Date</label>
                    <input
                        type="date"
                        value={selectedDate}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => {
                            setSelectedDate(e.target.value);
                            setSelectedSlot(null);
                        }}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>

                {/* Slot Selection */}
                <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Available Slots</label>
                    {loading ? (
                        <div className="flex items-center justify-center p-8 bg-slate-50 dark:bg-slate-800 rounded-xl">
                            <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {slots.map((slot) => (
                                <button
                                    key={slot}
                                    onClick={() => setSelectedSlot(slot)}
                                    className={`p-3 rounded-xl border text-sm font-medium transition-all ${selectedSlot === slot
                                            ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                                            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-blue-300'
                                        }`}
                                >
                                    {slot}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Error Message */}
                {error && (
                    <div className="p-3 bg-red-50 dark:bg-red-900/10 text-red-600 text-sm rounded-lg flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        {error}
                    </div>
                )}

                {/* Submit Button */}
                <button
                    onClick={handleSchedule}
                    disabled={!selectedSlot || submitting}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:shadow-none transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                    {submitting ? (
                        <>
                            <Loader2 className="h-5 w-5 animate-spin" /> Scheduling...
                        </>
                    ) : 'Confirm Schedule'}
                </button>
            </div>
        </div>
    );
}
