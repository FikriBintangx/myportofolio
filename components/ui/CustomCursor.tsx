'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';

export default function CustomCursor() {
    const [isHovered, setIsHovered] = useState(false);
    const [cursorType, setCursorType] = useState<'default' | 'view' | 'click'>('default');
    const [isMobile, setIsMobile] = useState(false);

    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    const springConfigOuter = { damping: 35, stiffness: 300, mass: 0.5 };
    const springConfigInner = { damping: 45, stiffness: 1000 };
    
    const cursorXSpring = useSpring(cursorX, springConfigOuter);
    const cursorYSpring = useSpring(cursorY, springConfigOuter);
    const innerXSpring = useSpring(cursorX, springConfigInner);
    const innerYSpring = useSpring(cursorY, springConfigInner);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);

        const moveCursor = (e: MouseEvent) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
        };

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const interactive = target.closest('a, button, [role="button"], input, textarea');
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
        <>
            {/* Fluid Outer Ring */}
            <motion.div
                className="fixed top-0 left-0 w-10 h-10 rounded-full border border-foreground/20 z-[9999] pointer-events-none mix-blend-difference hidden md:block"
                style={{
                    x: cursorXSpring,
                    y: cursorYSpring,
                    translateX: '-50%',
                    translateY: '-50%',
                }}
                animate={{
                    scale: isHovered ? 1.5 : 1,
                    opacity: isHovered ? 0.5 : 1,
                }}
            />
            {/* Sharp Inner Dot */}
            <motion.div
                className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-foreground z-[9999] pointer-events-none mix-blend-difference hidden md:block flex items-center justify-center overflow-hidden"
                style={{
                    x: innerXSpring,
                    y: innerYSpring,
                    translateX: '-50%',
                    translateY: '-50%',
                }}
                animate={{
                    scale: isHovered ? (cursorType === 'view' ? 35 : 12) : 1,
                }}
            >
                <AnimatePresence>
                    {isHovered && cursorType === 'view' && (
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-[0.5px] font-bold uppercase tracking-widest text-background"
                        >
                            View
                        </motion.span>
                    )}
                </AnimatePresence>
            </motion.div>
        </>
    );
}
