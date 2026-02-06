'use client';

import { useScroll, useTransform, motion } from 'framer-motion';
import { useRef } from 'react';

const phrase = "A digital craftsman building premium experiences. Focused on motion, performance, and attention to detail.";

export default function About() {
    const container = useRef(null);
    const { scrollYProgress } = useScroll({
        target: container,
        offset: ["start 0.9", "start 0.25"]
    });

    const words = phrase.split(" ");

    return (
        <section id="about" ref={container} className="min-h-screen flex items-center justify-center px-6 md:px-20 py-20 bg-black">
            <div className="max-w-4xl text-center flex flex-wrap justify-center gap-x-3 gap-y-2">
                {words.map((word, i) => {
                    const start = i / words.length;
                    const end = start + (1 / words.length);
                    return <Word key={i} children={word} progress={scrollYProgress} range={[start, end]} />
                })}
            </div>
        </section>
    );
}

const Word = ({ children, progress, range }: { children: string, progress: any, range: [number, number] }) => {
    const opacity = useTransform(progress, range, [0.1, 1]);
    return (
        <motion.span style={{ opacity }} className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white transition-opacity duration-300">
            {children}
        </motion.span>
    )
}
