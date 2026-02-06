'use client';

import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function GearList() {
    const [gear, setGear] = useState<any[]>([]);

    useEffect(() => {
        const fetchGear = async () => {
            const supabase = createClient();
            if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return;

            const { data, error } = await supabase
                .from('gear')
                .select('*')
                .eq('is_active', true)
                .order('order', { ascending: true });

            if (data && !error) {
                setGear(data);
            }
        };

        fetchGear();
    }, []);

    if (gear.length === 0) return null;

    return (
        <section id="gear" className="bg-black py-40 px-6 md:px-20 border-t border-white/5">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-24">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-3xl md:text-5xl font-bold tracking-tighter text-white mb-4"
                    >
                        Hardware & <span className="text-white/20 italic">Gadgets</span>
                    </motion.h2>
                    <p className="text-white/40 uppercase text-[10px] tracking-[0.4em]">The tools I use to create digital experiences.</p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-16">
                    {gear.map((item, i) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: i * 0.1 }}
                            viewport={{ once: true }}
                            className="group flex flex-col items-center text-center"
                        >
                            <div className="w-full aspect-square relative bg-zinc-950 border border-white/5 rounded-[2rem] p-8 mb-8 overflow-hidden group-hover:border-white/20 transition-all duration-500 shadow-2xl">
                                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent" />
                                <img
                                    src={item.image_url}
                                    alt={item.name}
                                    className="w-full h-full object-contain relative z-10 filter grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                                />
                            </div>
                            <h3 className="text-sm font-bold tracking-widest uppercase text-white mb-2">{item.name}</h3>
                            <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-light">{item.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
