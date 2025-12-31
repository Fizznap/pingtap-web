import { Zap, Infinity, Headset } from 'lucide-react';
import { cn } from '@/lib/utils';

export function FeaturesSection() {
    const features = [
        {
            title: 'Lightning Fast',
            description: 'Up to 400Mbps symmetric speeds for seamless 4K streaming and low-latency gaming.',
            icon: Zap,
            color: 'bg-blue-100 text-primary',
        },
        {
            title: 'Unlimited Data',
            description: 'No FUP limits. Truly unlimited downloading and browsing all month long.',
            icon: Infinity,
            color: 'bg-purple-100 text-accent',
        },
        {
            title: '24/7 Support',
            description: 'Instant priority support via call, chat, or WhatsApp anytime you need us.',
            icon: Headset,
            color: 'bg-green-100 text-success',
        },
    ];

    return (
        <section className="py-16 bg-background">
            <div className="container mx-auto px-4 md:px-6">
                <div className="mb-12 text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
                        Why PINGTAP?
                    </h2>
                    <p className="mt-4 text-lg text-text-secondary">
                        Built for streaming, gaming, and working from home.
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-3">
                    {features.map((feature) => (
                        <div
                            key={feature.title}
                            className="flex flex-col items-start rounded-2xl border border-border bg-white dark:bg-slate-800 p-6 shadow-sm transition-shadow hover:shadow-md"
                        >
                            <div className={cn("mb-4 flex h-12 w-12 items-center justify-center rounded-xl", feature.color)}>
                                <feature.icon className="h-6 w-6" />
                            </div>
                            <h3 className="mb-2 text-xl font-bold text-text-primary">
                                {feature.title}
                            </h3>
                            <p className="text-text-secondary">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
