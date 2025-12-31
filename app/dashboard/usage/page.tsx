'use client';

import { Activity, ArrowDown, ArrowUp, Calendar, Clock, Download, Laptop, Smartphone, Upload, Wifi } from 'lucide-react';

export default function UsagePage() {
    return (
        <div className="p-4 lg:p-8 max-w-5xl mx-auto space-y-8 pb-24">

            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Data Usage</h1>
                <p className="text-slate-500">Track your consumption and session history.</p>
            </div>

            {/* Total Usage Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Total Consumption */}
                <div className="md:col-span-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                        <div>
                            <p className="text-blue-100 font-medium mb-1 flex items-center gap-2"><Activity className="h-4 w-4" /> Total Data Consumed</p>
                            <h2 className="text-5xl font-bold">452.8 <span className="text-2xl opacity-80">GB</span></h2>
                            <p className="text-sm text-blue-100 mt-2 opacity-80">Cycle: Oct 01 - Oct 31, 2023</p>
                        </div>

                        {/* Split Stats */}
                        <div className="flex gap-8">
                            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 min-w-[140px]">
                                <p className="text-xs text-blue-100 mb-1 flex items-center gap-1"><ArrowDown className="h-3 w-3" /> Download</p>
                                <p className="text-2xl font-bold">410.2 GB</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 min-w-[140px]">
                                <p className="text-xs text-blue-100 mb-1 flex items-center gap-1"><ArrowUp className="h-3 w-3" /> Upload</p>
                                <p className="text-2xl font-bold">42.6 GB</p>
                            </div>
                        </div>
                    </div>
                    {/* Background Decor */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-900 opacity-20 rounded-full translate-y-1/2 -translate-x-1/2"></div>
                </div>
            </div>

            {/* Monthly Chart */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-slate-900 dark:text-white">Daily Consumption (Oct)</h3>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Used</span>
                    </div>
                </div>

                <div className="h-48 flex items-end justify-between gap-1">
                    {Array.from({ length: 30 }).map((_, i) => {
                        const height = Math.floor(Math.random() * 80) + 10; // Mock data
                        const isToday = i === 24;
                        return (
                            <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                                <div
                                    className={`w-full rounded-t-sm transition-all duration-300 relative ${isToday ? 'bg-blue-600' : 'bg-slate-100 dark:bg-slate-800 group-hover:bg-blue-400'}`}
                                    style={{ height: `${height}%` }}
                                >
                                    {/* Tooltip */}
                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                        {height + 12} GB
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 mt-2 border-t border-slate-100 dark:border-slate-800 pt-2">
                    <span>Oct 1</span>
                    <span>Oct 15</span>
                    <span>Oct 30</span>
                </div>
            </div>

            {/* Detailed Session History */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="font-bold text-slate-900 dark:text-white mb-6">Recent Sessions</h3>

                <div className="space-y-4">
                    {[
                        { device: 'Desktop - Windows', time: 'Active Now', download: '2.4 GB', upload: '150 MB', icon: Laptop, color: 'text-green-500' },
                        { device: 'iPhone 14 Pro', time: '2 hours ago', download: '450 MB', upload: '20 MB', icon: Smartphone, color: 'text-slate-500' },
                        { device: 'Smart TV', time: '5 hours ago', download: '8.2 GB', upload: '12 MB', icon: Wifi, color: 'text-slate-500' },
                        { device: 'MacBook Air', time: 'Yesterday', download: '1.2 GB', upload: '400 MB', icon: Laptop, color: 'text-slate-500' },
                    ].map((session, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 bg-white dark:bg-slate-700 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-400 shadow-sm">
                                    <session.icon className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="font-bold text-sm text-slate-900 dark:text-white">{session.device}</p>
                                    <p className={`text-xs flex items-center gap-1 ${session.color}`}>
                                        <Clock className="h-3 w-3" /> {session.time}
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-6 text-right">
                                <div className="hidden sm:block">
                                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">Download</p>
                                    <p className="font-bold text-slate-900 dark:text-white text-sm">{session.download}</p>
                                </div>
                                <div className="hidden sm:block">
                                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">Upload</p>
                                    <p className="font-bold text-slate-900 dark:text-white text-sm">{session.upload}</p>
                                </div>
                                <div className="sm:hidden">
                                    <p className="font-bold text-slate-900 dark:text-white text-sm">{session.download}</p>
                                    <p className="text-[10px] text-slate-500">Total</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <button className="w-full mt-6 py-3 text-sm font-bold text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-colors">
                    View All History
                </button>
            </div>

        </div>
    );
}
