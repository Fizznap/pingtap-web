'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { User, Mail, Phone, Lock, Save, Loader2, Camera } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        email: ''
    });
    const [passwordData, setPasswordData] = useState({
        newPassword: '',
        confirmPassword: ''
    });
    const [updatingPassword, setUpdatingPassword] = useState(false);

    const router = useRouter();
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        const fetchUser = async () => {
            // 1. Get Auth User
            const { data: { user }, error: authError } = await supabase.auth.getUser();
            if (authError || !user) {
                router.push('/login');
                return;
            }
            setUser(user);

            // 2. Get Profile Data (SSOT)
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (profile) {
                // Happy Path: Profile exists
                setFormData({
                    fullName: profile.full_name || '',
                    phone: profile.phone || '',
                    email: user.email || '' // Email always from Auth
                });
            } else {
                // Fallback: Profile missing (Sync from Metadata)
                const metadataName = user.user_metadata?.full_name || '';
                const metadataPhone = user.user_metadata?.phone || '';

                // Auto-create profile to fix consistency
                const { error: insertError } = await supabase
                    .from('profiles')
                    .insert({
                        id: user.id,
                        full_name: metadataName,
                        email: user.email,
                        phone: metadataPhone
                    });

                if (!insertError) {
                    setFormData({
                        fullName: metadataName,
                        phone: metadataPhone,
                        email: user.email || ''
                    });
                }
            }
            setLoading(false);
        };
        fetchUser();
    }, []);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setUpdating(true);
        try {
            if (!user) return;

            // Update SSOT (profiles table)
            const { error } = await supabase
                .from('profiles')
                .update({
                    full_name: formData.fullName,
                    phone: formData.phone,
                    updated_at: new Date().toISOString()
                })
                .eq('id', user.id);

            if (error) throw error;

            // Optional: Sync back to Auth Metadata if needed for other apps/legacy
            // await supabase.auth.updateUser({ data: { full_name: formData.fullName, phone: formData.phone } });

            alert('Profile updated successfully!');
            router.refresh();
        } catch (error: any) {
            alert(error.message);
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="p-4 lg:p-8 max-w-4xl mx-auto space-y-8 pb-24">

            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Profile</h1>
                <p className="text-slate-500">Manage your account settings and preferences.</p>
            </div>

            {/* Profile Header Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center gap-6">
                <div className="relative">
                    <div className="h-24 w-24 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 border-4 border-white dark:border-slate-800 shadow-lg">
                        <User className="h-10 w-10" />
                    </div>
                    <button className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-md">
                        <Camera className="h-4 w-4" />
                    </button>
                </div>
                <div className="text-center md:text-left">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white capitalize">{formData.fullName || 'User'}</h2>
                    <p className="text-slate-500 text-sm">Customer ID: {user?.id?.substring(0, 8).toUpperCase()}</p>
                    <span className="inline-block mt-2 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs font-bold px-3 py-1 rounded-full">
                        Active Subscriber
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Personal Information Form */}
                <div className="space-y-6">
                    <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <User className="h-5 w-5 text-blue-600" /> Personal Information
                    </h3>

                    <form onSubmit={handleUpdateProfile} className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                <input
                                    type="text"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    className="w-full pl-10 h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                <input
                                    type="email"
                                    value={formData.email}
                                    disabled
                                    className="w-full pl-10 h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/50 text-slate-500 text-sm cursor-not-allowed"
                                />
                            </div>
                            <p className="text-[10px] text-slate-400">Email cannot be changed directly.</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Phone Details</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full pl-10 h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={updating}
                            className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold py-3 rounded-xl mt-4 hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {updating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                            Save Changes
                        </button>
                    </form>
                </div>



            </div>
        </div>
    );
}
