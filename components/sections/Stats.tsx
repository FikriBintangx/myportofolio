'use client';

import { useInView, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useRef } from 'react';

const stats = [
    { value: 5, label: "Years Exp." },
    { value: 40, label: "Projects" },
    { value: 100, label: "Satisfaction", suffix: "%" },
    { value: 24, label: "Hours/Day" }
];

export default function Stats() {
    return (
        <section className="bg-black text-white py-20 px-6 md:px-20 border-y border-white/10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {stats.map((stat, i) => (
                    <Counter key={i} value={stat.value} label={stat.label} suffix={stat.suffix} />
                ))}
            </div>
        </section>
    );
}

const Counter = ({ value, label, suffix = "" }: { value: number, label: string, suffix?: string }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    const motionValue = useMotionValue(0);
    const springValue = useSpring(motionValue, { stiffness: 100, damping: 30 });
    const displayValue = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        if (isInView) {
            motionValue.set(value);
        }
    }, [isInView, value, motionValue]);

    useEffect(() => {
        const unsubscribe = springValue.on("change", (latest) => {
            if (displayValue.current) {
                displayValue.current.textContent = Math.floor(latest).toString();
            }
        });
        return unsubscribe;
    }, [springValue]);

    return (
        <div ref={ref} className="text-center">
            <div className="text-5xl md:text-7xl font-bold tracking-tighter mb-2">
                <span ref={displayValue}>0</span>{suffix}
            </div>
            <div className="text-sm md:text-base text-gray-400 font-mono uppercase tracking-widest">
                {label}
            </div>
        </div>
    )
}
