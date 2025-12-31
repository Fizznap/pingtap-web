'use client';

import { useState } from 'react';
import { Calendar, MapPin, User, Clock, CheckCircle, Loader2, HardHat } from 'lucide-react';
import { assignTechnician } from '@/app/actions/technician';
import { useRouter } from 'next/navigation';

export default function AdminInstallationsClient({ installations, technicians }: { installations: any[], technicians: any[] }) {
    const router = useRouter();
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [assigningId, setAssigningId] = useState<string | null>(null); // Which installation is being assigned
    const [selectedTech, setSelectedTech] = useState<string>('');

    const handleAssign = async () => {
        if (!selectedTech || !assigningId) return;
        setActionLoading(assigningId);

        const res = await assignTechnician(assigningId, selectedTech);

        if (res.error) {
            alert(res.error);
        } else {
            router.refresh(); // Refresh to show assignment
            setAssigningId(null);
            setSelectedTech('');
        }
        setActionLoading(null);
    };

    const getArea = (address: any) => {
        if (!address) return 'N/A';
        if (typeof address === 'string') return address;
        return address.city || address.area || 'Unknown Area';
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Installation Schedule</h1>
                    <p className="text-slate-500 text-sm">Upcoming installation appointments.</p>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden min-h-[400px]">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date & Time</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Customer & Plan</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Location</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Technician</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {!installations || installations.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-slate-500">
                                    No scheduled installations found.
                                </td>
                            </tr>
                        ) : (
                            installations.map((install: any) => (
                                <tr key={install.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-slate-400" />
                                            {new Date(install.scheduled_at).toLocaleDateString()}
                                        </div>
                                        <div className="text-xs text-slate-500 flex items-center gap-2 mt-1">
                                            <Clock className="h-3 w-3" />
                                            {install.slot_time}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 font-medium text-slate-900 dark:text-white">
                                            <User className="h-4 w-4 text-slate-400" />
                                            {install.profiles?.full_name || 'Unknown User'}
                                        </div>
                                        <div className="text-xs text-slate-500 mt-1">
                                            Plan: {install.subscriptions?.plans?.name || 'Unknown Plan'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4 text-slate-400" />
                                            {getArea(install.profiles?.address)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {assigningId === install.id ? (
                                            <div className="flex gap-2">
                                                <select
                                                    className="text-xs p-1.5 rounded border dark:bg-slate-800 dark:border-slate-700 w-32"
                                                    value={selectedTech}
                                                    onChange={e => setSelectedTech(e.target.value)}
                                                >
                                                    <option value="">Select Tech...</option>
                                                    {technicians.map(t => (
                                                        <option key={t.id} value={t.id}>{t.full_name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        ) : (
                                            <div className="text-sm border-l-2 border-slate-200 dark:border-slate-800 pl-3">
                                                {install.technician_id ? (
                                                    <div className="flex items-center gap-2">
                                                        <HardHat className="h-4 w-4 text-orange-500" />
                                                        <span className="font-medium text-slate-700 dark:text-slate-300">
                                                            {technicians.find(t => t.id === install.technician_id)?.full_name || 'Assigned Tech'}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="text-slate-400 italic text-xs">Unassigned</span>
                                                )}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {assigningId === install.id ? (
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => setAssigningId(null)}
                                                    className="text-xs text-slate-500 hover:text-slate-800 px-2 py-1"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={handleAssign}
                                                    disabled={actionLoading === install.id || !selectedTech}
                                                    className="bg-blue-600 text-white text-xs px-3 py-1.5 rounded font-bold disabled:opacity-50"
                                                >
                                                    {actionLoading === install.id ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Save'}
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => {
                                                    setAssigningId(install.id);
                                                    setSelectedTech(install.technician_id || '');
                                                }}
                                                className="text-xs font-bold text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/10 px-3 py-1.5 rounded transition-colors"
                                            >
                                                {install.technician_id ? 'Reassign' : 'Assign'}
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
