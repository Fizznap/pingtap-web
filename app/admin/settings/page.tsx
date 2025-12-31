'use client';

export default function AdminSettingsPage() {
    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">System Settings</h1>

            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm divide-y divide-slate-100 dark:divide-slate-800">
                <div className="p-6 flex justify-between items-center">
                    <div>
                        <h3 className="font-bold text-slate-900 dark:text-white">Auto-Assignment</h3>
                        <p className="text-sm text-slate-500">Automatically assign tickets based on location.</p>
                    </div>
                    <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out bg-indigo-600 rounded-full cursor-pointer">
                        <span className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform translate-x-6"></span>
                    </div>
                </div>

                <div className="p-6 flex justify-between items-center">
                    <div>
                        <h3 className="font-bold text-slate-900 dark:text-white">Email Notifications</h3>
                        <p className="text-sm text-slate-500">Send email updates to customers.</p>
                    </div>
                    <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out bg-indigo-600 rounded-full cursor-pointer">
                        <span className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform translate-x-6"></span>
                    </div>
                </div>

                <div className="p-6 flex justify-between items-center">
                    <div>
                        <h3 className="font-bold text-slate-900 dark:text-white">WhatsApp Integration</h3>
                        <p className="text-sm text-slate-500">Enable WhatsApp Business API.</p>
                    </div>
                    <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out bg-indigo-600 rounded-full cursor-pointer">
                        <span className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform translate-x-6"></span>
                    </div>
                </div>
            </div>
        </div>
    );
}
