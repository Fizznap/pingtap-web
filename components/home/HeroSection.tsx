import { Button } from '@/components/ui/Button';
import { ArrowRight, Wifi, Shield, Zap } from 'lucide-react';

export function HeroSection() {
    return (
        <section className="relative w-full overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 pt-10 pb-20 lg:py-32">
            {/* Background Pattern */}
            <div className="absolute inset-0 z-0 opacity-20">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            </div>

            <div className="container relative z-10 mx-auto px-4 md:px-6">
                <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 lg:items-center">

                    {/* Text Content */}
                    <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
                        <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium text-primary-light mb-6 backdrop-blur-xl">
                            <span className="flex h-2 w-2 rounded-full bg-success mr-2 animate-pulse"></span>
                            LIVE IN THANE
                        </div>

                        <h1 className="mb-6 max-w-3xl text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
                            Ultra-Fast Fiber <br className="hidden sm:inline" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Broadband</span>
                        </h1>

                        <p className="mb-8 max-w-[600px] text-lg text-slate-300 md:text-xl">
                            Experience symmetric speeds up to 400 Mbps with zero lag.
                            Perfect for 4K streaming, competitive gaming, and work from home.
                        </p>

                        <div className="flex flex-col w-full gap-4 sm:flex-row sm:w-auto">
                            <Button size="lg" className="w-full sm:w-auto h-12 px-8 text-base">
                                Check Availability
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="lg" className="w-full sm:w-auto h-12 px-8 text-base border-white/20 text-white hover:bg-white/10 hover:text-white hover:border-white">
                                View Plans
                            </Button>
                        </div>

                        <div className="mt-10 flex items-center gap-6 text-sm font-medium text-slate-400">
                            <div className="flex items-center gap-2">
                                <Shield className="h-5 w-5 text-primary-light" />
                                <span>99.9% Uptime</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Zap className="h-5 w-5 text-primary-light" />
                                <span>Low Latency</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Wifi className="h-5 w-5 text-primary-light" />
                                <span>Fiber Optic</span>
                            </div>
                        </div>
                    </div>

                    {/* Visual Content (Desktop Only/Enhanced) */}
                    <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
                        {/* Speedometer Animation / Visual Representation */}
                        <div className="relative aspect-square w-full max-w-md mx-auto lg:mr-0">
                            {/* Abstract Circles */}
                            <div className="absolute inset-0 rounded-full border border-blue-500/20 animate-[spin_10s_linear_infinite]"></div>
                            <div className="absolute inset-4 rounded-full border border-cyan-500/20 animate-[spin_15s_linear_infinite_reverse]"></div>
                            <div className="absolute inset-8 rounded-full border border-purple-500/20 animate-[spin_20s_linear_infinite]"></div>

                            {/* Center Content glassmorphism */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="relative flex flex-col items-center justify-center h-48 w-48 rounded-full bg-slate-900/50 backdrop-blur-xl border border-white/10 shadow-2xl shadow-blue-500/20">
                                    <div className="text-5xl font-black text-white tracking-tighter">
                                        400
                                    </div>
                                    <div className="text-sm font-bold text-blue-400 uppercase tracking-widest mt-1">
                                        Mbps
                                    </div>
                                    <div className="absolute -bottom-6 px-4 py-1.5 rounded-lg bg-success text-white text-xs font-bold shadow-lg">
                                        SPEEDTEST
                                    </div>
                                </div>
                            </div>

                            {/* Floating Elements */}
                            <div className="absolute top-10 left-0 bg-slate-800/80 backdrop-blur-md p-3 rounded-xl border border-white/10 shadow-lg animate-bounce duration-[3000ms]">
                                <Wifi className="h-6 w-6 text-blue-400" />
                            </div>
                            <div className="absolute bottom-20 right-0 bg-slate-800/80 backdrop-blur-md p-3 rounded-xl border border-white/10 shadow-lg animate-bounce duration-[4000ms]">
                                <Zap className="h-6 w-6 text-amber-400" />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
