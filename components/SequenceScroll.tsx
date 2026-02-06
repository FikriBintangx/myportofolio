'use client';

import { useScroll, useTransform, useMotionValueEvent, motion, AnimatePresence } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils'; // Assuming cn utility exists, will create it
import MagneticButton from './ui/MagneticButton';
import RevealText from './ui/RevealText';

const frameCount = 192;

export default function SequenceScroll() {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [loadedCount, setLoadedCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end end'],
    });

    const currentIndex = useTransform(scrollYProgress, [0, 1], [1, frameCount - 1]);

    // Text Opacity Transforms
    const opacity1 = useTransform(scrollYProgress, [0, 0.1, 0.2], [1, 1, 0]);
    const opacity2 = useTransform(scrollYProgress, [0.25, 0.35, 0.45], [0, 1, 0]);
    const opacity3 = useTransform(scrollYProgress, [0.55, 0.65, 0.75], [0, 1, 0]);
    const opacity4 = useTransform(scrollYProgress, [0.85, 0.95, 1], [0, 1, 0]);

    useEffect(() => {
        const loadImages = async () => {
            const loadedImages: HTMLImageElement[] = [];
            const promises = [];

            for (let i = 1; i <= frameCount; i++) {
                const promise = new Promise<void>((resolve) => {
                    const img = new Image();
                    const src = `/sequence/ezgif-frame-${i.toString().padStart(3, '0')}.jpg`;
                    img.src = src;
                    img.onload = () => {
                        setLoadedCount((prev) => prev + 1);
                        resolve();
                    };
                    img.onerror = () => resolve(); // Keep going on error
                    loadedImages[i - 1] = img;
                });
                promises.push(promise);
            }

            await Promise.all(promises);
            setImages(loadedImages);
            // Artificial delay for smooth exit
            setTimeout(() => setIsLoading(false), 500);
        };

        loadImages();
    }, []);

    const render = useCallback((index: number) => {
        if (images.length === 0) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const img = images[index]; // 0-indexed in array, index passed is 0-indexed approx
        if (img) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            // Calculate cover
            const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
            const x = (canvas.width / 2) - (img.width / 2) * scale;
            const y = (canvas.height / 2) - (img.height / 2) * scale;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
        }
    }, [images]);

    // Handle Resize
    useEffect(() => {
        const handleResize = () => {
            const currentIdx = Math.floor(currentIndex.get());
            render(currentIdx);
        }
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [render, currentIndex]);


    useMotionValueEvent(currentIndex, 'change', (latest) => {
        const frameIndex = Math.floor(latest);
        render(frameIndex);
    });

    // Initial render when not loading
    useEffect(() => {
        if (!isLoading && images.length > 0) {
            render(0);
        }
    }, [isLoading, images, render]);


    return (
        <>
            <AnimatePresence mode='wait'>
                {isLoading && (
                    <motion.div
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center text-white"
                    >
                        <div className="text-4xl font-bold font-mono tracking-tighter mb-4">IS4GI.dev</div>
                        <div className="w-64 h-1 bg-gray-800 overflow-hidden rounded-full">
                            <motion.div
                                className="h-full bg-white"
                                initial={{ width: 0 }}
                                animate={{ width: `${(loadedCount / frameCount) * 100}%` }}
                            />
                        </div>
                        <p className="mt-2 text-xs font-mono text-gray-500">{Math.round((loadedCount / frameCount) * 100)}%</p>
                    </motion.div>
                )}
            </AnimatePresence>

            <div ref={containerRef} className="h-[400vh] relative bg-black">
                <canvas ref={canvasRef} className="sticky top-0 h-screen w-full object-cover" />

                {/* Overlays */}
                <div className="fixed top-0 left-0 w-full h-full pointer-events-none flex items-center justify-center">
                    {/* Slide 1: 0% */}
                    <motion.div style={{ opacity: opacity1 }} className="absolute text-center">
                        <RevealText text="This is my daily device" className="text-6xl md:text-8xl font-bold tracking-tighter text-white mb-4" />
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                            className="text-xl md:text-2xl text-gray-400"
                        >
                            The hardware behind IS4GI.dev
                        </motion.p>
                    </motion.div>

                    {/* Slide 2: 30% */}
                    <motion.div style={{ opacity: opacity2 }} className="absolute w-full px-10 md:px-20 text-left">
                        <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-white max-w-2xl leading-[1.1]">
                            Designed for <span className="text-zinc-500">speed</span>, focus, and <span className="italic">clarity</span>
                        </h2>
                    </motion.div>

                    {/* Slide 3: 60% */}
                    <motion.div style={{ opacity: opacity3 }} className="absolute w-full px-10 md:px-20 text-right flex justify-end">
                        <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-white max-w-2xl leading-[1.1]">
                            The tool that powers my <span className="text-zinc-500 underline decoration-1 underline-offset-8">workflow</span>
                        </h2>
                    </motion.div>

                    {/* Slide 4: 90% */}
                    <motion.div style={{ opacity: opacity4 }} className="absolute text-center pointer-events-auto">
                        <MagneticButton
                            className="px-8 py-4 bg-white text-black text-xl font-bold rounded-full hover:bg-gray-200 transition-colors"
                        >
                            Explore my stack
                        </MagneticButton>
                    </motion.div>
                </div>
            </div>
        </>
    );
}
