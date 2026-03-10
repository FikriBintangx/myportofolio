import { BentoGrid, BentoGridItem } from '../ui/BentoGrid';
import SectionReveal from '../ui/SectionReveal';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Terminal, Cpu, Layout, Layers as LayersIcon } from 'lucide-react';

interface StackItem {
    category: string;
    tools: string[];
}

export default function Stack() {
    const [stacks, setStacks] = useState<StackItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStacks = async () => {
            const supabase = createClient();
            if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return;
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

    const icons = [
        <Terminal key="t" className="w-5 h-5 text-indigo-500" />,
        <Cpu key="c" className="w-5 h-5 text-emerald-500" />,
        <Layout key="l" className="w-5 h-5 text-sky-500" />,
        <LayersIcon key="li" className="w-5 h-5 text-orange-500" />,
    ];

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
                    {stacks.map((item, i) => (
                        <BentoGridItem
                            key={item.category}
                            title={item.category}
                            description={item.tools.join(' · ')}
                            header={<div className="flex-1 w-full h-full min-h-[6rem] rounded-2xl bg-gradient-to-br from-foreground/[0.03] to-transparent border border-foreground/[0.05] p-4 flex items-center justify-center group-hover/bento:scale-105 transition-transform duration-500">
                                <div className="text-xl font-bold opacity-10 select-none uppercase tracking-[0.5em]">{item.category}</div>
                            </div>}
                            icon={icons[i % icons.length]}
                            className={i === 0 || i === 3 ? "md:col-span-2" : ""}
                            delay={i * 0.1}
                        />
                    ))}
                </BentoGrid>
            </div>

            {/* Background decorative elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-foreground/[0.01] rounded-full blur-[120px] pointer-events-none" />
        </section>
    );
}
