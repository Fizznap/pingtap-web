'use client';

import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Paperclip, CheckCheck, ShieldCheck, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { sendMessage } from '@/app/actions/ticket';

type Message = {
    id: string;
    message: string;
    sender_role: 'user' | 'admin';
    created_at: string;
};

type Ticket = {
    id: string;
    subject: string;
    status: string;
    priority: string;
    created_at: string;
};

export default function SupportDetailClient({ ticket, initialMessages, currentUserId }: { ticket: Ticket, initialMessages: Message[], currentUserId: string }) {
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [input, setInput] = useState('');
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || sending) return;
        setSending(true);

        const currentMsg = input;
        setInput(''); // Optimistic Clear

        // Optimistic Update
        const optimisticMsg: Message = {
            id: 'temp-' + Date.now(),
            message: currentMsg,
            sender_role: 'user',
            created_at: new Date().toISOString()
        };
        setMessages(prev => [...prev, optimisticMsg]);

        const result = await sendMessage(ticket.id, currentMsg);

        if (result.error) {
            alert('Failed to send message: ' + result.error);
            // Revert optimistic update? For simplicity, we just reload or let revalidate fix it.
            window.location.reload();
        } else {
            // Success - In a real app with Supabase Realtime we'd get the new message via subscription.
            // Here we rely on revalidatePath. Ideally we should replace the temp ID or refetch.
            // For this MVP, since we used revalidatePath, the server should send fresh data if we refreshed, 
            // but strictly client-side the optimistic update holds. 
            // To be strictly safe and truthful to DB, we could refresh.
            // Let's keep it optimistic for UX, assuming success.
        }
        setSending(false);
    };

    const isClosed = ticket.status === 'resolved' || ticket.status === 'closed';

    return (
        <div className="flex flex-col h-[calc(100vh-64px)] lg:h-screen bg-white dark:bg-slate-950">

            {/* Header */}
            <header className="h-16 px-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <Link href="/dashboard/support" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                        <ArrowLeft className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                    </Link>
                    <div>
                        <h1 className="font-bold text-slate-900 dark:text-white text-sm">Ticket #{ticket.id.slice(0, 8)}</h1>
                        <p className="text-xs text-slate-500 capitalize">{ticket.subject}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider
                        ${ticket.status === 'open' ? 'bg-green-100 text-green-700' : ''}
                        ${ticket.status === 'resolved' ? 'bg-slate-100 text-slate-500' : ''}
                        ${ticket.status === 'in_progress' ? 'bg-blue-100 text-blue-700' : ''}
                    `}>
                        {ticket.status.replace('_', ' ')}
                    </span>
                    {/* Close button could go here if we implement updateStatus for users */}
                </div>
            </header>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50 dark:bg-slate-950/50">

                {/* Status Banner if Closed */}
                {isClosed && (
                    <div className="bg-yellow-50 dark:bg-yellow-900/10 text-yellow-800 dark:text-yellow-200 p-3 text-center text-xs rounded-xl font-medium mb-4">
                        This ticket is closed. You can no longer send messages.
                    </div>
                )}

                {/* Date Separator (Simplified) */}
                <div className="flex justify-center">
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-200 dark:bg-slate-800 px-3 py-1 rounded-full">
                        {new Date(ticket.created_at).toLocaleDateString()}
                    </span>
                </div>

                {messages.length === 0 ? (
                    <div className="text-center text-slate-400 text-sm mt-10">
                        No messages yet. Start the conversation.
                    </div>
                ) : (
                    messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.sender_role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`
                                max-w-[85%] md:max-w-[70%] p-4 rounded-2xl text-sm relative group
                                ${msg.sender_role === 'user'
                                    ? 'bg-blue-600 text-white rounded-tr-sm'
                                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-sm shadow-sm'
                                }
                            `}>
                                {/* Sender Name (Agent Only) */}
                                {msg.sender_role === 'admin' && (
                                    <p className="text-[10px] font-bold text-blue-600 mb-1 flex items-center gap-1">
                                        <ShieldCheck className="h-3 w-3" /> Support Agent
                                    </p>
                                )}

                                <p className="leading-relaxed whitespace-pre-wrap">{msg.message}</p>

                                <p className={`text-[10px] mt-2 text-right opacity-70 flex items-center justify-end gap-1`}>
                                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
                <div className="max-w-4xl mx-auto relative flex items-center gap-3">
                    <button
                        disabled={isClosed}
                        className="p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/10 rounded-xl transition-all disabled:opacity-50"
                    >
                        <Paperclip className="h-5 w-5" />
                    </button>

                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder={isClosed ? "Ticket is closed" : "Type your message..."}
                        disabled={isClosed || sending}
                        className="flex-1 bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-slate-50 dark:disabled:bg-slate-900"
                    />

                    <button
                        onClick={handleSend}
                        className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100"
                        disabled={!input.trim() || sending || isClosed}
                    >
                        {sending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                    </button>
                </div>
            </div>

        </div>
    );
}
