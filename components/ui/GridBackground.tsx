'use client';

import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function GridBackground() {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize();
        window.addEventListener('resize', handleResize);

        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };
        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    if (isMobile) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-20">
            <div
                className="absolute inset-0"
                style={{
                    backgroundImage: `radial-gradient(circle at 2px 2px, rgba(120,120,120,0.15) 1px, transparent 0)`,
                    backgroundSize: '40px 40px'
                }}
            />
            <motion.div
                className="absolute inset-0 bg-[radial-gradient(circle_at_var(--x)_var(--y),rgba(120,120,120,0.15)_0%,transparent_10%)]"
                style={{
                    // @ts-ignore
                    '--x': mouseX,
                    // @ts-ignore
                    '--y': mouseY
                } as any}
            />
        </div>
    );
}
