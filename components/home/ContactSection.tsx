'use client';

import { Button } from '@/components/ui/Button';
import { MapPin, Phone, Mail } from 'lucide-react';

export function ContactSection() {
    return (
        <section id="contact" className="py-20 bg-gray-50 dark:bg-transparent relative overflow-hidden">

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    {/* Contact Info & Text */}
                    <div>
                        <div className="inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800/50 px-3 py-1 text-sm font-medium text-primary dark:text-blue-400 mb-4">
                            Get Connected
                        </div>
                        <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl mb-6">
                            Get in touch with us
                        </h2>
                        <p className="text-lg text-text-secondary mb-8">
                            Have questions about our plans? Want to check availability in your area?
                            Our team is here to help you get the best fiber experience.
                        </p>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white dark:bg-slate-800 text-primary border border-border">
                                    <MapPin className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-text-primary">Visit our Office</h3>
                                    <p className="text-text-secondary mt-1">
                                        Shop No. 12, Sai Prasad Building, Near D-Mart,<br />
                                        Kasarvadavali, Ghodbunder Road,<br />
                                        Thane West, Maharashtra - 400615
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white dark:bg-slate-800 text-primary border border-border">
                                    <Phone className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-text-primary">Call Us</h3>
                                    <p className="text-text-secondary mt-1">+91 816925700</p>
                                    <p className="text-sm text-text-tertiary">Mon-Sat: 10am - 8pm</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white dark:bg-slate-800 text-primary border border-border">
                                    <Mail className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-text-primary">Email Us</h3>
                                    <p className="text-text-secondary mt-1">support@pingtap.in</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form - Matching PlanTable Card Style */}
                    <div className="rounded-2xl border border-border bg-white dark:bg-slate-800 p-8 shadow-sm relative overflow-hidden">

                        <h3 className="text-xl font-bold text-text-primary mb-6 relative z-10">Send us a message</h3>
                        <form className="space-y-4 relative z-10">
                            {/* 1. Name */}
                            <div className="space-y-2">
                                <label htmlFor="full-name" className="text-sm font-medium text-text-secondary">Full Name</label>
                                <input
                                    id="full-name"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary focus:border-primary focus:ring-1 focus:ring-primary transition-colors outline-none"
                                    placeholder="Enter your name"
                                />
                            </div>

                            {/* 2. Email */}
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium text-text-secondary">Email Address</label>
                                <input
                                    id="email"
                                    type="email"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary focus:border-primary focus:ring-1 focus:ring-primary transition-colors outline-none"
                                    placeholder="Enter your email"
                                />
                            </div>

                            {/* 3. Subject */}
                            <div className="space-y-2">
                                <label htmlFor="subject" className="text-sm font-medium text-text-secondary">Subject</label>
                                <div className="relative">
                                    <select
                                        id="subject"
                                        className="flex h-10 w-full appearance-none rounded-md border border-input bg-background px-3 py-2 text-sm text-text-primary focus:border-primary focus:ring-1 focus:ring-primary transition-colors outline-none"
                                        defaultValue=""
                                    >
                                        <option value="" disabled className="bg-background text-text-primary">Select a subject</option>
                                        <option value="new_connection" className="bg-background text-text-primary">New Connection</option>
                                        <option value="support" className="bg-background text-text-primary">Technical Support</option>
                                        <option value="billing" className="bg-background text-text-primary">Billing Query</option>
                                        <option value="other" className="bg-background text-text-primary">Other</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-text-tertiary">
                                        <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* 4. Message */}
                            <div className="space-y-2">
                                <label htmlFor="message" className="text-sm font-medium text-text-secondary">Message</label>
                                <textarea
                                    id="message"
                                    className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary focus:border-primary focus:ring-1 focus:ring-primary transition-colors outline-none"
                                    placeholder="How can we help you?"
                                />
                            </div>

                            <Button className="w-full mt-2">
                                Send Message
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
