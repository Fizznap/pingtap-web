'use client';

import { useState } from 'react';
import { Plus, Search, MessageSquare, ChevronRight, HelpCircle, ChevronDown, Filter, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { createTicket } from '@/app/actions/ticket';

type SupportTicket = {
    id: string;
    subject: string;
    description: string;
    status: string;
    priority: string;
    created_at: string;
    category?: string;
};

const FAQS = [
    { q: 'How do I change my WiFi password?', a: 'You can change your WiFi password through the "My Connection" tab in the dashboard or by logging into your router settings at 192.168.1.1.' },
    { q: 'Why is my internet slow?', a: 'Slow speeds can be caused by network congestion, router placement, or background updates. Try restarting your router first.' },
    { q: 'What is the billing cycle?', a: 'Your billing cycle starts on the date of activation. For example, if you activated on the 5th, your bill is generated on the 5th of every month.' },
];

export default function SupportClient({ initialTickets }: { initialTickets: SupportTicket[] }) {
    const [activeTab, setActiveTab] = useState<'tickets' | 'faq'>('tickets');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [tickets, setTickets] = useState<SupportTicket[]>(initialTickets);
    // const [loading, setLoading] = useState(false); // No loading state needed initially as we have SSR data
    const [submitting, setSubmitting] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        category: 'Technical Issue',
        subject: '',
        description: ''
    });


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        const result = await createTicket(
            formData.subject,
            formData.description,
            formData.category,
            'medium' // Default priority
        );

        if (result.error) {
            alert('Failed to create ticket: ' + result.error);
        } else {
            alert('Ticket created successfully!');
            setShowCreateModal(false);
            setFormData({ category: 'Technical Issue', subject: '', description: '' });
            // Ideally we should just refresh the page data here, 
            // but for now we rely on revalidatePath in the action to update the SSR data if we refresh.
            // Or we could append to local state optimistically, but let's stick to safe.
            window.location.reload();
        }
        setSubmitting(false);
    };

    return (
        <div className="p-4 lg:p-8 max-w-5xl mx-auto min-h-screen pb-24 relative">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Support & Helpdesk</h1>
                    <p className="text-slate-500">We are here to help you 24/7.</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-bold shadow-lg shadow-blue-600/20 active:scale-95 transition-all"
                >
                    <Plus className="h-5 w-5" />
                    Raise New Ticket
                </button>
            </div>

            {/* Quick Tabs */}
            <div className="flex gap-4 border-b border-slate-200 dark:border-slate-800 mb-6 overflow-x-auto">
                <button
                    onClick={() => setActiveTab('tickets')}
                    className={`pb-4 px-2 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'tickets' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                >
                    My Tickets
                </button>
                <button
                    onClick={() => setActiveTab('faq')}
                    className={`pb-4 px-2 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'faq' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                >
                    Knowledge Base
                </button>
            </div>

            {/* Content: My Tickets */}
            {activeTab === 'tickets' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">

                    {/* Filter & Search Bar */}
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search ticket ID or subject..."
                                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <button className="px-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800">
                            <Filter className="h-4 w-4" />
                        </button>
                    </div>

                    {/* Ticket List */}
                    <div className="grid gap-3">
                        {tickets.length === 0 ? (
                            <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                                <div className="h-14 w-14 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                                    <MessageSquare className="h-6 w-6" />
                                </div>
                                <h3 className="font-bold text-slate-900 dark:text-white mb-1">No Tickets Found</h3>
                                <p className="text-sm text-slate-500 mb-6">You haven't raised any support tickets yet.</p>
                                <button
                                    onClick={() => setShowCreateModal(true)}
                                    className="text-blue-600 font-bold text-sm hover:underline"
                                >
                                    Raise a Ticket
                                </button>
                            </div>
                        ) : (
                            tickets.map((ticket) => (
                                <Link
                                    href={`/dashboard/support/${ticket.id}`}
                                    key={ticket.id}
                                    className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 transition-colors group relative"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] font-mono px-2 py-0.5 rounded uppercase tracking-wider font-bold">
                                                #{ticket.id.slice(0, 8)}
                                            </span>
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider
                                                ${ticket.status === 'open' ? 'bg-green-100 text-green-700' : ''}
                                                ${ticket.status === 'resolved' ? 'bg-slate-100 text-slate-500' : ''}
                                                ${ticket.status === 'in_progress' ? 'bg-blue-100 text-blue-700' : ''}
                                            `}>
                                                {ticket.status.replace('_', ' ')}
                                            </span>
                                        </div>
                                        <span className="text-xs text-slate-400">{new Date(ticket.created_at).toLocaleDateString()}</span>
                                    </div>

                                    <h3 className="font-bold text-slate-900 dark:text-white mb-1 group-hover:text-blue-600 transition-colors">{ticket.subject}</h3>

                                    <div className="flex items-center gap-4 text-xs text-slate-500 mt-3">
                                        <div className="flex items-center gap-1">
                                            <Filter className="h-3 w-3" />
                                            {ticket.priority} Priority
                                        </div>
                                    </div>

                                    <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                                </Link>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* Content: FAQ */}
            {activeTab === 'faq' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    {FAQS.map((faq, idx) => (
                        <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                            <button className="w-full flex justify-between items-center p-5 text-left font-bold text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
                                <span className="flex items-center gap-3">
                                    <HelpCircle className="h-5 w-5 text-blue-600" />
                                    {faq.q}
                                </span>
                                <ChevronDown className="h-5 w-5 text-slate-400 group-hover:text-blue-600" />
                            </button>
                            <div className="px-5 pb-5 pt-0 text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                                <p>{faq.a}</p>
                            </div>
                        </div>
                    ))}
                    <div className="bg-blue-50 dark:bg-blue-900/10 p-6 rounded-2xl text-center mt-8">
                        <p className="font-bold text-slate-900 dark:text-white mb-2">Can't find what you're looking for?</p>
                        <button onClick={() => setShowCreateModal(true)} className="text-blue-600 font-bold hover:underline">Raise a ticket</button>
                    </div>
                </div>
            )}

            {/* Create Ticket Modal Overlay */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl p-6 relative animate-in zoom-in-95 duration-200">
                        <button
                            onClick={() => setShowCreateModal(false)}
                            className="absolute right-5 top-5 text-slate-400 hover:text-slate-900 dark:hover:text-white"
                        >
                            ✕
                        </button>

                        <div className="mb-6">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Create New Ticket</h2>
                            <p className="text-sm text-slate-500">Describe your issue and we'll connect you with an expert.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Category</label>
                                <select
                                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                >
                                    <option>Technical Issue</option>
                                    <option>Billing & Payments</option>
                                    <option>Plan Upgrade/Change</option>
                                    <option>Relocation Request</option>
                                    <option>Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Subject</label>
                                <input
                                    type="text"
                                    placeholder="Brief description of the issue"
                                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Description</label>
                                <textarea
                                    rows={4}
                                    placeholder="Please provide specific details..."
                                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-colors disabled:opacity-50"
                                >
                                    {submitting ? 'Submitting...' : 'Submit Ticket'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}
