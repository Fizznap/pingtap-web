import Link from 'next/link';
import { Facebook, Instagram, Twitter, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
    return (
        <footer className="bg-slate-950 text-slate-300">
            <div className="container mx-auto px-4 py-12 md:px-6 lg:py-16">
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {/* Brand & About */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
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
                            <span className="text-xl font-bold text-white">PINGTAP</span>
                        </div>
                        <p className="text-sm leading-relaxed mb-6">
                            Thane's most reliable high-speed fiber broadband service.
                            Experience buffer-free streaming, gaming, and work-from-home connectivity.
                        </p>
                        <div className="flex gap-4">
                            <Link href="#" className="hover:text-white transition-colors"><Facebook className="h-5 w-5" /></Link>
                            <Link href="#" className="hover:text-white transition-colors"><Instagram className="h-5 w-5" /></Link>
                            <Link href="#" className="hover:text-white transition-colors"><Twitter className="h-5 w-5" /></Link>
                            <Link href="#" className="hover:text-white transition-colors"><Linkedin className="h-5 w-5" /></Link>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="#" className="hover:text-white transition-colors">Home</Link></li>
                            <li><Link href="#plans" className="hover:text-white transition-colors">Broadband Plans</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">About Us</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Careers</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Support</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="#" className="hover:text-white transition-colors">My Account</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Pay Bill</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Track Request</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">FAQs</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Contact Support</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Contact Us</h3>
                        <ul className="space-y-4 text-sm">
                            <li className="flex items-start gap-3">
                                <MapPin className="h-5 w-5 shrink-0 text-primary" />
                                <span>
                                    Shop No. 12, Sai Prasad Building,<br />
                                    Near D-Mart, Kasarvadavali,<br />
                                    Thane West - 400615
                                </span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="h-5 w-5 shrink-0 text-primary" />
                                <span>+91 816-925-700</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="h-5 w-5 shrink-0 text-primary" />
                                <span>support@pingtap.in</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-800 mt-12 pt-8 text-center text-sm text-slate-500">
                    © {new Date().getFullYear()} PINGTAP Broadband. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
