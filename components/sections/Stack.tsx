'use client';

import { motion } from 'framer-motion';

const stack = [
    {
        category: "Languages",
        tools: ["HTML/CSS", "Dart", "JavaScript", "PHP"]
    },
    {
        category: "Frameworks",
        tools: ["React", "Next.js", "Flutter", "CodeIgniter 3"]
    },
    {
        category: "AI Tools",
        tools: ["ChatGPT", "Gemini", "Antigravity"]
    },
    {
        category: "Environment",
        tools: ["Visual Studio", "Cursor", "Git"]
    },
    {
        category: "Hardware",
        tools: ["ROG Flow X13", "Oppo Reno 14"]
    }
];

export default function Stack() {
    return (
        <section id="stack" className="bg-background py-40 px-6 md:px-20 border-t border-foreground/5">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-foreground mb-24">The Toolkit</h2>

                <div className="space-y-12">
                    {stack.map((item, i) => (
                        <motion.div
                            key={item.category}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            viewport={{ once: true }}
                            className="group flex flex-col md:flex-row md:items-center justify-between border-b border-foreground/5 pb-12"
                        >
                            <div className="text-sm uppercase tracking-[0.3em] text-foreground/30 group-hover:text-foreground transition-colors mb-4 md:mb-0">
                                {item.category}
                            </div>
                            <div className="flex flex-wrap gap-4 md:gap-8 justify-end">
                                {item.tools.map((tool) => (
                                    <span key={tool} className="text-2xl md:text-4xl font-bold tracking-tighter text-foreground/60 group-hover:text-foreground transition-colors">
                                        {tool}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
