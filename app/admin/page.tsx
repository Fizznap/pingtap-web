
import { CheckCircle, Menu } from 'lucide-react';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import Link from 'next/link';

export default async function AdminDashboardPage() {
    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                    // No-op
                },
            },
        }
    );

    // Fetch Total Tickets
    const { count: totalTickets } = await supabase
        .from('support_tickets')
        .select('*', { count: 'exact', head: true });

    // Fetch Pending Tickets (Open or In Progress)
    const { count: pendingTickets } = await supabase
        .from('support_tickets')
        .select('*', { count: 'exact', head: true })
        .in('status', ['open', 'in_progress']);

    // Fetch Recent Tickets
    const { data: recentTickets } = await supabase
        .from('support_tickets')
        .select(`
            *,
            profiles (
                full_name
            )
        `)
        .order('created_at', { ascending: false })
        .limit(5);

    const activeTechs = 0; // Not implemented

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">

            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Command Center</h1>
                    <p className="text-slate-500 text-sm">Real-time overview of field operations.</p>
                </div>
                <div className="flex gap-3">
                    <span className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                        <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></span>
                        System Online
                    </span>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Total Tickets</div>
                    <div className="flex justify-between items-end">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{totalTickets || 0}</h2>
                        <span className="text-slate-400 text-xs font-bold flex items-center gap-1"> All Time</span>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Pending Assign</div>
                    <div className="flex justify-between items-end">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{pendingTickets || 0}</h2>
                        <span className="text-orange-500 text-xs font-bold">Action Req</span>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm opacity-60">
                    <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Active Techs</div>
                    <div className="flex justify-between items-end">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{activeTechs}</h2>
                        <span className="text-xs text-slate-400 font-medium ml-2">(Coming Soon)</span>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm opacity-60">
                    <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Avg Resolution</div>
                    <div className="flex justify-between items-end">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">--</h2>
                        <span className="text-xs text-slate-400 font-medium ml-2">(Coming Soon)</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Available Technicians List - Placeholder */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm lg:col-span-1 opacity-80">
                    <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                        <h3 className="font-bold text-slate-900 dark:text-white">Technician Status</h3>
                        {/* <button className="text-xs text-blue-600 font-bold hover:underline">View All</button> */}
                    </div>
                    <div className="p-8 text-center">
                        <p className="text-sm text-slate-400">Technician management module is currently disabled.</p>
                    </div>
                </div>

                {/* Live Ticket Queue */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm lg:col-span-2">
                    <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                        <h3 className="font-bold text-slate-900 dark:text-white">Live Ticket Queue</h3>
                        <Link href="/admin/tickets">
                            <button className="text-xs text-blue-600 font-bold hover:underline">Manage Queue</button>
                        </Link>
                    </div>
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">

                        {(!recentTickets || recentTickets.length === 0) && (
                            <div className="p-12 text-center text-slate-500">
                                <CheckCircle className="h-10 w-10 mx-auto text-slate-300 mb-2" />
                                <p>Queue is empty.</p>
                            </div>
                        )}

                        {recentTickets?.map((ticket: any) => (
                            <div key={ticket.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex justify-between items-center">
                                <div>
                                    <div className="font-bold text-slate-900 dark:text-white text-sm">
                                        {ticket.subject}
                                    </div>
                                    <div className="text-xs text-slate-500 flex items-center gap-2 mt-1">
                                        <span>#{ticket.id.slice(0, 8)}</span>
                                        <span>•</span>
                                        <span>{ticket.profiles?.full_name || 'Unknown User'}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider
                                        ${ticket.priority === 'critical' ? 'bg-red-100 text-red-700' :
                                            ticket.priority === 'high' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}
                                    `}>
                                        {ticket.priority}
                                    </span>
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider
                                        ${ticket.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}
                                    `}>
                                        {ticket.status.replace('_', ' ')}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
