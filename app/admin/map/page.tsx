'use client';

import { MapPin, Navigation, Info, Layers, Map } from 'lucide-react';

export default function AdminMapPage() {
    return (
        <div className="p-6 h-[calc(100vh-4rem)] flex flex-col">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Live Operations Map</h1>

            <div className="flex-1 bg-slate-200 dark:bg-slate-800 rounded-2xl border border-slate-300 dark:border-slate-700 flex items-center justify-center relative overflow-hidden group">
                {/* Placeholder for Map Integration (Google Maps / Mapbox) */}
                <div className="text-center p-8 z-10">
                    <div className="bg-white dark:bg-slate-900 p-4 rounded-full shadow-xl inline-block mb-4">
                        <Map className="h-8 w-8 text-indigo-600" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Map View</h3>
                    <p className="text-slate-500">Integrate Google Maps or Mapbox API here to visualize technician locations.</p>
                </div>

                {/* Grid Pattern Background */}
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #6366f1 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
            </div>
        </div>
    );
}
