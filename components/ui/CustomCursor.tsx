'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';

export default function CustomCursor() {
    const [isHovered, setIsHovered] = useState(false);
    const [cursorType, setCursorType] = useState<'default' | 'view' | 'click'>('default');
    const [isMobile, setIsMobile] = useState(false);

    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    const springConfig = { damping: 25, stiffness: 700 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);

        const moveCursor = (e: MouseEvent) => {
            cursorX.set(e.clientX - 16);
            cursorY.set(e.clientY - 16);
        };

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const interactive = target.closest('a, button, [role="button"]');
            const type = target.closest('[data-cursor]')?.getAttribute('data-cursor');

            if (type) {
                setCursorType(type as any);
                setIsHovered(true);
            } else if (interactive) {
                setCursorType('click');
                setIsHovered(true);
            } else {
                setCursorType('default');
                setIsHovered(false);
            }
        };

        window.addEventListener('mousemove', moveCursor);
        window.addEventListener('mouseover', handleMouseOver);

        return () => {
            window.removeEventListener('resize', checkMobile);
            window.removeEventListener('mousemove', moveCursor);
            window.removeEventListener('mouseover', handleMouseOver);
        };
    }, [cursorX, cursorY]);

    if (isMobile) return null;

    return (
        <motion.div
            className="fixed top-0 left-0 w-8 h-8 rounded-full border border-white z-[9999] pointer-events-none mix-blend-difference flex items-center justify-center overflow-hidden"
            style={{
                translateX: cursorXSpring,
                translateY: cursorYSpring,
            }}
            animate={{
                scale: isHovered ? (cursorType === 'view' ? 3.5 : 2.5) : 1,
                backgroundColor: isHovered ? 'white' : 'transparent',
                borderColor: isHovered ? 'white' : 'rgba(255,255,255,0.5)',
            }}
        >
            <AnimatePresence>
                {isHovered && cursorType === 'view' && (
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-[4px] font-bold uppercase tracking-widest text-black"
                    >
                        View
                    </motion.span>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
