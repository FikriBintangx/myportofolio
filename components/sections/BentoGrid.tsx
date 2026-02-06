'use client';

import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { MouseEvent } from 'react';
import { Monitor, Smartphone, Cpu, Workflow, Database, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';

const items = [
    {
        title: "Daily Driver",
        description: "ROG Flow X13",
        icon: <Monitor className="w-6 h-6" />,
        className: "md:col-span-2 md:row-span-2",
        gradient: "from-purple-500/20 to-blue-500/20"
    },
    {
        title: "Mobile",
        description: "Oppo Reno 14",
        icon: <Smartphone className="w-6 h-6" />,
        className: "md:col-span-1",
        gradient: "from-green-500/20 to-emerald-500/20"
    },
    {
        title: "Performance",
        description: "High-End Processing",
        icon: <Cpu className="w-6 h-6" />,
        className: "md:col-span-1",
        gradient: "from-orange-500/20 to-red-500/20"
    },
    {
        title: "Workflow",
        description: "Optimized Stack",
        icon: <Workflow className="w-6 h-6" />,
        className: "md:col-span-2",
        gradient: "from-blue-500/20 to-cyan-500/20"
    },
    {
        title: "Legacy & modern",
        description: "CodeIgniter 3 to Next.js",
        icon: <Database className="w-6 h-6" />,
        className: "md:col-span-2",
        gradient: "from-pink-500/20 to-rose-500/20"
    },
    {
        title: "Design",
        description: "Minimalist / Futurist",
        icon: <Layers className="w-6 h-6" />,
        className: "md:col-span-1",
        gradient: "from-white/20 to-white/5"
    }
];

export default function BentoGrid() {
    return (
        <section id="work" className="min-h-screen bg-background px-6 md:px-20 py-32 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="text-5xl md:text-7xl font-bold mb-20 text-foreground tracking-tighter"
                >
                    My Arsenal
                </motion.h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[280px]">
                    {items.map((item, i) => (
                        <SpotlightCard key={i} className={item.className} gradient={item.gradient}>
                            <div className="relative z-10 h-full flex flex-col justify-between">
                                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-foreground mb-4 group-hover:scale-110 transition-transform duration-300">
                                    {item.icon}
                                </div>
                                <div>
                                    <h3 className="text-3xl font-bold text-foreground mb-2 tracking-tight">{item.title}</h3>
                                    <p className="text-foreground/50">{item.description}</p>
                                </div>
                            </div>
                        </SpotlightCard>
                    ))}
                </div>
            </div>
        </section>
    );
}

function SpotlightCard({ children, className, gradient }: { children: React.ReactNode, className?: string, gradient?: string }) {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            onMouseMove={handleMouseMove}
            className={cn(
                "group relative border border-foreground/10 bg-zinc-900/30 overflow-hidden rounded-3xl p-8 backdrop-blur-sm hover:border-white/20 transition-colors duration-500",
                className
            )}
        >
            {/* Hover Spotlight */}
            <motion.div
                className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300 group-hover:opacity-100"
                style={{
                    background: useMotionTemplate`
                        radial-gradient(
                            600px circle at ${mouseX}px ${mouseY}px,
                            rgba(255,255,255,0.06),
                            transparent 80%
                        )
                    `,
                }}
            />

            {/* Static Gradient Blob */}
            <div className={cn("absolute -right-20 -bottom-20 w-64 h-64 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-br", gradient)} />

            {children}
        </motion.div>
    );
}
