'use client';

import { useState } from 'react';
import { Search, Filter, MapPin, User, AlertCircle, CheckCircle, Loader2, Check } from 'lucide-react';
import { updateTicketStatus } from '@/app/actions/ticket';
import { useRouter } from 'next/navigation';

type Ticket = {
    id: string;
    subject: string;
    status: string;
    priority: string;
    created_at: string;
    customer_id: string;
    profiles: {
        full_name: string;
        address: any;
    };
};

export default function AdminTicketsClient({ initialTickets }: { initialTickets: Ticket[] }) {
    const router = useRouter(); // For refreshing server data
    const [filterStatus, setFilterStatus] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    // Use initialTickets for rendering, but we might want to refresh. 
    // For simplicity, we filter locally on initialTickets. Real-world would be server params.
    const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const handleStatusUpdate = async (ticketId: string, newStatus: 'in_progress' | 'resolved') => {
        setActionLoading(ticketId);
        const result = await updateTicketStatus(ticketId, newStatus);

        if (result.success) {
            // Optimistic Local Update
            setTickets(prev => prev.map(t =>
                t.id === ticketId ? { ...t, status: newStatus } : t
            ));
            // Refresh Server Data
            router.refresh();
        } else {
            alert('Failed to update ticket: ' + result.error);
        }
        setActionLoading(null);
    };

    const filteredTickets = tickets.filter(ticket => {
        const matchesStatus = filterStatus === 'All' || ticket.status === filterStatus.toLowerCase();
        const customerName = ticket.profiles?.full_name || 'Unknown';
        const matchesSearch = ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            customerName.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const getArea = (address: any) => {
        if (!address) return 'N/A';
        if (typeof address === 'string') return address;
        return address.city || address.area || 'Unknown Area';
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Tickets Queue</h1>
                    <p className="text-slate-500 text-sm">Manage and assign support tickets.</p>
                </div>

                <div className="flex gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search tickets..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
                        />
                    </div>
                </div>
            </div>

            {/* Status Tabs */}
            <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-1">
                {['All', 'open', 'in_progress', 'resolved'].map(status => (
                    <button
                        key={status}
                        className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors border-b-2 capitalize ${filterStatus === status
                            ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/10'
                            : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                            }`}
                        onClick={(e) => {
                            e.preventDefault();
                            setFilterStatus(status);
                        }}
                    >
                        {status.replace('_', ' ')}
                    </button>
                ))}
            </div>

            {/* Tickets Table */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden min-h-[400px]">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Ticket ID & Subject</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Customer & Area</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Priority</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {filteredTickets.map(ticket => (
                            <tr key={ticket.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                        {ticket.subject}
                                    </div>
                                    <div className="text-xs text-slate-500 font-mono mt-1">#{ticket.id.slice(0, 8)} • {new Date(ticket.created_at).toLocaleDateString()}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm font-medium text-slate-900 dark:text-white flex items-center gap-2">
                                        <User className="h-3 w-3 text-slate-400" /> {ticket.profiles?.full_name || 'Unknown User'}
                                    </div>
                                    <div className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                                        <MapPin className="h-3 w-3" /> {getArea(ticket.profiles?.address)}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold capitalize
                                        ${ticket.priority === 'high' ? 'bg-red-100 text-red-700' :
                                            ticket.priority === 'medium' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                                        }`}>
                                        <AlertCircle className="h-3 w-3" />
                                        {ticket.priority}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-block px-2.5 py-1 rounded text-xs font-bold capitalize
                                        ${ticket.status === 'open' ? 'bg-slate-100 text-slate-600' :
                                            ticket.status === 'resolved' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-600'
                                        }`}>
                                        {ticket.status.replace('_', ' ')}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        {ticket.status === 'open' && (
                                            <button
                                                onClick={() => handleStatusUpdate(ticket.id, 'in_progress')}
                                                disabled={actionLoading === ticket.id}
                                                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors shadow-sm disabled:opacity-70 flex items-center gap-2"
                                            >
                                                {actionLoading === ticket.id ? <Loader2 className="h-3 w-3 animate-spin" /> : null}
                                                Take
                                            </button>
                                        )}

                                        {ticket.status === 'in_progress' && (
                                            <button
                                                onClick={() => handleStatusUpdate(ticket.id, 'resolved')}
                                                disabled={actionLoading === ticket.id}
                                                className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors shadow-sm disabled:opacity-70 flex items-center gap-2"
                                            >
                                                {actionLoading === ticket.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
                                                Resolve
                                            </button>
                                        )}

                                        {ticket.status === 'resolved' && (
                                            <span className="text-slate-400 text-xs italic">Closed</span>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredTickets.length === 0 && (
                    <div className="p-8 text-center text-slate-500">
                        <CheckCircle className="h-10 w-10 mx-auto text-slate-300 mb-2" />
                        <p>No tickets found matching your filter.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
