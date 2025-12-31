'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Phone, User } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function Navbar() {
    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'Plans', href: '#plans' },
        { name: 'Coverage', href: '#coverage' },
        { name: 'Support', href: '#contact' },
        { name: 'Portal', href: '#portal' },
    ];

    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="h-5 w-5"
                                >
                                    <path d="M12 2a10 10 0 1 0 10 10 10 10 0 0 0-10-10zm0 14a4 4 0 1 1 4-4 4 4 0 0 1-4 4z" />
                                </svg>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xl font-bold tracking-tight text-primary leading-none">
                                    PINGTAP
                                </span>
                                <span className="text-[10px] font-bold tracking-wider text-success leading-none">
                                    LIVE IN THANE
                                </span>
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex md:items-center md:gap-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-sm font-medium text-text-secondary transition-colors hover:text-primary"
                            >
                                {link.name}
                            </Link>
                        ))}
                        <div className="flex items-center gap-2 ml-4">
                            <div className="hidden lg:flex flex-col items-end mr-2">
                                <span className="text-xs text-text-tertiary">24/7 Support</span>
                                <span className="text-sm font-bold text-text-primary">816-925-700</span>
                            </div>
                            <Button variant="ghost" size="sm" className="hidden lg:flex">
                                <User className="mr-2 h-4 w-4" />
                                Login
                            </Button>
                            <Button size="sm">
                                Get Connected
                            </Button>
                        </div>
                    </div>

                    {/* Mobile Action (Minimal) */}
                    <div className="flex md:hidden items-center gap-2">
                        <Button size="sm" variant="outline" className="h-8 px-3">
                            Login
                        </Button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
