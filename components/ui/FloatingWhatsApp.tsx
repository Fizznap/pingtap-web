'use client';

import { MessageCircle } from 'lucide-react';

export function FloatingWhatsApp() {
    return (
        <a
            href="https://wa.me/918169295700"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-20 md:bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2"
            aria-label="Chat on WhatsApp"
        >
            <MessageCircle className="h-8 w-8" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
            </span>
        </a>
    );
}
