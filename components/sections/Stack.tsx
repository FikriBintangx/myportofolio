import { InfiniteMovingCards } from '../ui/InfiniteMovingCards';
import SectionReveal from '../ui/SectionReveal';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

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
            const { data } = await supabase.from('stack').select('*').order('order', { ascending: true });

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

    if (isLoading || stacks.length === 0) return null;

    return (
        <section id="stack" className="bg-background py-20 md:py-40 overflow-hidden border-t border-foreground/5 relative">
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-background via-transparent to-background z-10" />

            <SectionReveal>
                <div className="max-w-7xl mx-auto px-6 md:px-20 mb-12 md:mb-20 text-center">
                    <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-foreground mb-4">The Stack</h2>
                    <p className="text-foreground/40 text-[10px] md:text-xs uppercase tracking-[0.3em]">Technologies & Tools I use daily</p>
                </div>
            </SectionReveal>

            <SectionReveal delay={0.2} className="flex flex-col gap-10 md:gap-16 relative z-0">
                {stacks.map((item, i) => (
                    <div key={item.category} className="w-full">
                        <InfiniteMovingCards
                            items={[...item.tools, ...item.tools, ...item.tools]} // Duplicate to ensure enough width for loop if items are few
                            direction={i % 2 === 0 ? "left" : "right"}
                            speed="slow"
                            className="w-full"
                        />
                    </div>
                ))}
            </SectionReveal>
        </section>
    );
}
