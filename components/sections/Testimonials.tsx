'use client';

import { motion, useMotionValue } from 'framer-motion';
import { useEffect, useState } from 'react';

const testimonials = [
    "“The attention to detail is unmatched.”",
    "“Defining the future of digital identity.”",
    "“A masterpiece of performance and aesthetics.”",
    "“Minimalism at its absolute finest.”"
];

export default function Testimonials() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % testimonials.length);
        }, 4000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="h-screen bg-black flex flex-col justify-center items-center overflow-hidden">
            <div className="relative w-full max-w-6xl px-6 text-center">
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 50, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -50, filter: 'blur(10px)' }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="absolute inset-0 flex items-center justify-center p-8"
                >
                    <h3 className="text-4xl md:text-7xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40">
                        {testimonials[index]}
                    </h3>
                </motion.div>

                {/* Spacing placeholder since absolute positioning removes height */}
                <div className="h-[200px] visible"></div>
            </div>

            {/* Progress Bar */}
            <div className="absolute bottom-20 w-64 h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                    key={index}
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 4, ease: "linear" }}
                    className="h-full bg-white"
                />
            </div>
        </section>
    );
}
