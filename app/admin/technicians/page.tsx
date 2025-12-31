'use client';

import { useState } from 'react';
import { Users, Search, Filter, Plus, Phone, MapPin, MoreVertical } from 'lucide-react';

// Initially empty state or fetched from API in future
// For now, I'll keep it empty or minimal real-looking data as per user request to "remove fake tickets", 
// but for technicians list, we usually need *some* staff to assign to. 
// I will create a minimal list, or better, fetch from DB. 
// Since we don't have a 'technicians' table yet, I will create a schema migration next.
// But for UI "working", detailed fake data is "fake". 
// User asked to "remove fake tickets from everywhere".
// Technicians aren't tickets, but likely wants a clean slate.
// I will show an empty state or a button to "Add Technician".

export default function techniciansPage() {
    // Placeholder state
    const [technicians, setTechnicians] = useState<any[]>([]);

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Field Technicians</h1>
                    <p className="text-slate-500 text-sm">Manage your on-ground workforce.</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold shadow-sm transition-colors">
                    <Plus className="h-4 w-4" />
                    Add Technician
                </button>
            </div>

            {technicians.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center">
                    <div className="h-16 w-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <UserIcon className="h-8 w-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Technicians Found</h3>
                    <p className="text-slate-500 max-w-sm mx-auto mt-2">Start by adding your field staff to the system to enable ticket assignment.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* List would go here */}
                </div>
            )}
        </div>
    );
}

function UserIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    )
}
