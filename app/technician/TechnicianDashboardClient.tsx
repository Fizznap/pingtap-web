'use client';

import { useState } from 'react';
import { Calendar, MapPin, Clock, User, CheckCircle, Navigation, Loader2 } from 'lucide-react';
import { updateJobStatus } from '@/app/actions/technician';
import { useRouter } from 'next/navigation';

export default function TechnicianDashboardClient({ jobs }: { jobs: any[] }) {
    const router = useRouter();
    const [loading, setLoading] = useState<string | null>(null);

    const handleStatusUpdate = async (id: string, newStatus: any) => {
        setLoading(id);
        const res = await updateJobStatus(id, newStatus);

        if (res.error) {
            alert(res.error);
        } else {
            router.refresh();
        }
        setLoading(null);
    };

    const getArea = (address: any) => {
        if (!address) return 'N/A';
        if (typeof address === 'string') return address;
        return address.city || address.area || 'Unknown Area';
    };

    // Filter into sections
    const upcomingJobs = jobs.filter(j => j.status !== 'completed' && j.status !== 'cancelled');
    const completedJobs = jobs.filter(j => j.status === 'completed');

    return (
        <div className="space-y-6 pb-20">
            <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">Active Jobs ({upcomingJobs.length})</h1>
                <p className="text-slate-500 text-sm">Your assigned schedule.</p>
            </div>

            <div className="space-y-4">
                {upcomingJobs.length === 0 ? (
                    <div className="p-8 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-center text-slate-500">
                        <CheckCircle className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                        No active jobs assigned.
                    </div>
                ) : (
                    upcomingJobs.map(job => (
                        <div key={job.id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider">
                                    <Calendar className="h-3 w-3" />
                                    {new Date(job.scheduled_at).toLocaleDateString()} • {job.slot_time}
                                </div>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${job.status === 'in_progress' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
                                    }`}>
                                    {job.status.replace('_', ' ')}
                                </span>
                            </div>

                            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1">
                                {job.profiles?.full_name || 'Unknown Customer'}
                            </h3>

                            <div className="space-y-2 mb-6">
                                <div className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                                    <MapPin className="h-4 w-4 text-slate-400 mt-0.5" />
                                    <span>
                                        {typeof job.profiles?.address === 'string'
                                            ? job.profiles.address
                                            : `${job.profiles?.address?.street || ''}, ${getArea(job.profiles?.address)}`
                                        }
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                    <Clock className="h-4 w-4 text-slate-400" />
                                    <span>Plan: {job.subscriptions?.plans?.name}</span>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors">
                                    <Navigation className="h-4 w-4" />
                                    Navigate
                                </button>

                                {job.status === 'confirmed' || job.status === 'pending' ? (
                                    <button
                                        onClick={() => handleStatusUpdate(job.id, 'in_progress')}
                                        disabled={loading === job.id}
                                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg text-sm font-bold shadow-lg shadow-blue-600/20 transition-all active:scale-[0.98] disabled:opacity-50"
                                    >
                                        {loading === job.id ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : 'Start Job'}
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleStatusUpdate(job.id, 'completed')}
                                        disabled={loading === job.id}
                                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg text-sm font-bold shadow-lg shadow-green-600/20 transition-all active:scale-[0.98] disabled:opacity-50"
                                    >
                                        {loading === job.id ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : 'Complete Job'}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {completedJobs.length > 0 && (
                <div className="pt-8 border-t border-slate-200 dark:border-slate-800">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Completed Today</h2>
                    <div className="space-y-4 opacity-70">
                        {completedJobs.map(job => (
                            <div key={job.id} className="bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 flex justify-between items-center">
                                <div>
                                    <p className="font-bold text-sm text-slate-900 dark:text-white">{job.profiles?.full_name}</p>
                                    <p className="text-xs text-slate-500">{getArea(job.profiles?.address)}</p>
                                </div>
                                <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase flex items-center gap-1">
                                    <CheckCircle className="h-3 w-3" /> Done
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
