'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function Loader({ progress, onComplete }: { progress: number, onComplete: () => void }) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        if (progress === 100) {
            const timer = setTimeout(() => {
                setIsVisible(false);
                onComplete();
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [progress, onComplete]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 1, ease: [0.76, 0, 0.24, 1] } }}
                    className="fixed top-0 left-0 w-screen h-screen z-[100] bg-background flex flex-col items-center justify-center overflow-hidden"
                >
                    {/* Abstract background movement */}
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            rotate: [0, 90, 180, 270, 360],
                            opacity: [0.1, 0.3, 0.1]
                        }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-foreground/5 rounded-full blur-[120px]"
                    />

                    <div className="relative z-10 flex flex-col items-center justify-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-12"
                        >
                            <h1 className="text-2xl font-bold tracking-[0.5em] uppercase text-foreground/40">
                                IS4GI<span className="text-foreground">.dev</span>
                            </h1>
                        </motion.div>

                        <div className="w-64 h-[1px] bg-foreground/10 relative overflow-hidden">
                            <motion.div
                                className="absolute inset-y-0 left-0 bg-foreground"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.5 }}
                            />
                        </div>

                        <motion.div
                            className="mt-4 font-mono text-[10px] tracking-[0.2em] text-foreground/30 uppercase"
                        >
                            Initializing Systems — {Math.round(progress)}%
                        </motion.div>
                    </div>

                    {/* Minimal scanline effect */}
                    <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[length:100%_2px,3px_100%]" />
                </motion.div>
            )}
        </AnimatePresence>
    );
}
