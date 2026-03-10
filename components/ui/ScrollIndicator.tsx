'use client';

import { motion, useScroll, useSpring } from 'framer-motion';

export default function ScrollIndicator() {
    const { scrollYProgress } = useScroll();
    const scaleY = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    return (
        <div className="fixed right-4 top-1/2 -translate-y-1/2 h-32 w-[2px] bg-foreground/5 z-50 rounded-full overflow-hidden hidden md:block">
            <motion.div
                className="w-full bg-foreground origin-top"
                style={{ scaleY }}
            />
        </div>
    );
}
