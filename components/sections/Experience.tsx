'use client';

import { motion } from 'framer-motion';
import ColorBends from '@/components/ui/ColorBends/ColorBends';
import SectionReveal from '@/components/ui/SectionReveal';
import { useApp } from '@/context/AppContext';

const education = [
    {
        role: "University Student",
        company: "Kampus",
        period: "Present",
        description: "Currently pursuing a degree."
    }
];

const experience = [
    {
        role: "Crew Member",
        company: "McDonald's",
        period: "Past",
        description: "Melayani customer dengan ramah dan ikhlas. Ensuring high-quality service and customer satisfaction in a fast-paced environment."
    },
    {
        role: "Operator Mesin (CNC)",
        company: "Manufacturing",
        period: "Past",
        description: "Memproduksi berbagai sparepart motor dan mobil menggunakan mesin CNC. Precision machining and quality control for automotive components."
    },
    {
        role: "Admin Delivery",
        company: "Logistics Branch",
        period: "Past",
        description: "Menginput barang keluar dan masuk dari cabang. Managing inventory data and coordinating logistics flow."
    }
];

export default function Experience() {
    const { theme } = useApp();
    return (
        <section id="experience" className="bg-background py-20 md:py-40 px-6 md:px-20 border-t border-foreground/5 relative overflow-hidden">
            <div className="absolute inset-0 z-0 opacity-30">
                <ColorBends colors={theme === 'dark' ? [] : ['#ffffff', '#f0f0f0', '#e0e0e0']} />
            </div>
            <div className="max-w-4xl mx-auto relative z-10">
                <SectionReveal>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-bold tracking-tighter text-foreground mb-12 md:mb-20"
                    >
                        Experience
                    </motion.h2>

                    <div className="space-y-12 md:space-y-20">
                        {/* Work Experience */}
                        <div className="relative border-l border-foreground/10 pl-6 md:pl-12 space-y-12 md:space-y-16">
                            {experience.map((job, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="relative group"
                                >
                                    <div className="absolute -left-[31px] md:-left-[53px] top-2 w-3 h-3 rounded-full bg-zinc-800 border border-zinc-600 group-hover:bg-white group-hover:scale-125 transition-all duration-300" />

                                    <div className="flex flex-col md:flex-row md:items-baseline md:justify-between mb-2 gap-1 md:gap-0">
                                        <h3 className="text-xl md:text-2xl font-bold text-foreground transition-colors group-hover:text-blue-200">{job.role}</h3>
                                        <span className="text-[10px] md:text-xs font-mono text-foreground/40 uppercase tracking-widest">{job.period}</span>
                                    </div>

                                    <div className="text-xs md:text-sm font-medium text-foreground/60 mb-3 md:mb-4">{job.company}</div>
                                    <p className="text-sm md:text-base text-foreground/50 leading-relaxed max-w-2xl group-hover:text-foreground/80 transition-colors">
                                        {job.description}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </SectionReveal>
            </div>
        </section>
    );
}
