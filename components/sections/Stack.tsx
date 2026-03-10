'use client';

import { BentoGrid, BentoGridItem } from '../ui/BentoGrid';
import SectionReveal from '../ui/SectionReveal';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Terminal, Cpu, Layout, Layers as LayersIcon, Code2, Globe, Smartphone, Database, Wind, Box } from 'lucide-react';
import { motion } from 'framer-motion';

interface StackItem {
    category: string;
    tools: string[];
}

// Config per jenis stack category (dengan warna gradient dan icon yang beda-beda)
const categoryConfig: Record<string, {
    gradient: string;
    bgDots: string;
    accentColor: string;
    icon: React.ReactNode;
    darkBg: string;
}> = {
    default: {
        gradient: 'from-violet-500/20 via-purple-400/10 to-transparent',
        bgDots: 'rgba(139,92,246,0.15)',
        accentColor: '#7c3aed',
        darkBg: 'rgba(91,33,182,0.08)',
        icon: <Box className="w-12 h-12 text-violet-400 opacity-80" />,
    },
    Languages: {
        gradient: 'from-indigo-500/20 via-blue-400/10 to-transparent',
        bgDots: 'rgba(99,102,241,0.2)',
        accentColor: '#4f46e5',
        darkBg: 'rgba(55,48,163,0.1)',
        icon: <Terminal className="w-12 h-12 text-indigo-400 opacity-80" />,
    },
    'Frameworks & Libraries': {
        gradient: 'from-sky-500/20 via-cyan-400/10 to-transparent',
        bgDots: 'rgba(14,165,233,0.2)',
        accentColor: '#0284c7',
        darkBg: 'rgba(7,89,133,0.1)',
        icon: <Globe className="w-12 h-12 text-sky-400 opacity-80" />,
    },
    'Tools & AI': {
        gradient: 'from-emerald-500/20 via-teal-400/10 to-transparent',
        bgDots: 'rgba(16,185,129,0.2)',
        accentColor: '#059669',
        darkBg: 'rgba(6,78,59,0.1)',
        icon: <Cpu className="w-12 h-12 text-emerald-400 opacity-80" />,
    },
    Hardware: {
        gradient: 'from-orange-400/20 via-amber-300/10 to-transparent',
        bgDots: 'rgba(251,146,60,0.2)',
        accentColor: '#d97706',
        darkBg: 'rgba(120,53,15,0.1)',
        icon: <Smartphone className="w-12 h-12 text-orange-400 opacity-80" />,
    },
    Database: {
        gradient: 'from-rose-500/20 via-pink-400/10 to-transparent',
        bgDots: 'rgba(244,63,94,0.2)',
        accentColor: '#e11d48',
        darkBg: 'rgba(136,19,55,0.1)',
        icon: <Database className="w-12 h-12 text-rose-400 opacity-80" />,
    },
    Design: {
        gradient: 'from-pink-500/20 via-fuchsia-400/10 to-transparent',
        bgDots: 'rgba(236,72,153,0.2)',
        accentColor: '#db2777',
        darkBg: 'rgba(131,24,67,0.1)',
        icon: <Layout className="w-12 h-12 text-pink-400 opacity-80" />,
    },
};

function StackHeader({ category, tools }: { category: string; tools: string[] }) {
    const config = categoryConfig[category] || categoryConfig.default;

    return (
        <div
            className={`relative flex-1 w-full min-h-[120px] rounded-2xl overflow-hidden group-hover/bento:scale-[1.02] transition-transform duration-500`}
            style={{ background: config.darkBg }}
        >
            {/* Gradient overlay */}
            <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient}`} />

            {/* Animated dot pattern */}
            <div
                className="absolute inset-0 opacity-40"
                style={{
                    backgroundImage: `radial-gradient(circle at 2px 2px, ${config.bgDots} 1px, transparent 0)`,
                    backgroundSize: '24px 24px',
                }}
            />

            {/* Glow orb */}
            <div
                className="absolute -top-6 -right-6 w-32 h-32 rounded-full blur-2xl opacity-30"
                style={{ background: config.accentColor }}
            />

            {/* Tools pills */}
            <div className="absolute bottom-0 inset-x-0 p-3 flex flex-wrap gap-1.5">
                {tools.slice(0, 5).map((tool, idx) => (
                    <motion.span
                        key={tool}
                        initial={{ opacity: 0, y: 8 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        viewport={{ once: true }}
                        className="px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider border"
                        style={{
                            borderColor: `${config.accentColor}40`,
                            background: `${config.accentColor}15`,
                            color: config.accentColor,
                        }}
                    >
                        {tool}
                    </motion.span>
                ))}
                {tools.length > 5 && (
                    <span className="px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider text-foreground/30 border border-foreground/10">
                        +{tools.length - 5} more
                    </span>
                )}
            </div>

            {/* Big icon */}
            <div className="absolute top-4 right-4 opacity-60 group-hover/bento:scale-110 group-hover/bento:opacity-100 transition-all duration-500">
                {config.icon}
            </div>
        </div>
    );
}

export default function Stack() {
    const [stacks, setStacks] = useState<StackItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStacks = async () => {
            const supabase = createClient();
            if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
                setIsLoading(false);
                return;
            }
            const { data } = await supabase.from('stack').select('*').order('id', { ascending: true });

            if (data) {
                setStacks(data.map((item: any) => ({
                    category: item.category,
                    tools: item.tools.split(',').map((t: string) => t.trim())
                })));
            }
            setIsLoading(false);
        };
        fetchStacks();
    }, []);

    if (isLoading) return null;

    return (
        <section id="stack" className="bg-background py-20 md:py-40 border-t border-foreground/5 relative overflow-hidden">
            <SectionReveal>
                <div className="max-w-7xl mx-auto px-6 md:px-20 mb-12 md:mb-20 text-left">
                    <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-foreground mb-4">Core Stack</h2>
                    <p className="text-foreground/40 text-[10px] md:text-xs uppercase tracking-[0.3em]">The digital toolbox behind every build</p>
                </div>
            </SectionReveal>

            <div className="max-w-7xl mx-auto px-6 md:px-20 relative z-10">
                <BentoGrid>
                    {stacks.map((item, i) => {
                        const config = categoryConfig[item.category] || categoryConfig.default;
                        return (
                            <BentoGridItem
                                key={item.category}
                                title={item.category}
                                description={item.tools.join(' · ')}
                                header={<StackHeader category={item.category} tools={item.tools} />}
                                icon={config.icon}
                                className={i === 0 || i === 3 ? "md:col-span-2" : ""}
                                delay={i * 0.12}
                            />
                        );
                    })}
                </BentoGrid>
            </div>

            {/* Background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-foreground/[0.01] rounded-full blur-[120px] pointer-events-none" />
        </section>
    );
}
