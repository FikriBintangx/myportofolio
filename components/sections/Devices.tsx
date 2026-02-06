import { useScroll, useTransform, useMotionValueEvent, motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface GearItem {
    name: string;
    description: string;
    sequencePath: string;
    frameCount: number;
    startFrame: number;
    isCustom: boolean;
}

export default function Devices() {
    const [gearItems, setGearItems] = useState<GearItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchGear = async () => {
            const supabase = createClient();
            if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
                setIsLoading(false);
                return;
            }

            const { data } = await supabase.from('gear')
                .select('*')
                .eq('is_active', true)
                .eq('is_pinned', true)
                .order('order', { ascending: true });

            if (data && data.length > 0) {
                setGearItems(data.map(item => ({
                    name: item.name,
                    description: item.description,
                    sequencePath: item.sequence_path,
                    frameCount: item.frame_count || 192,
                    startFrame: item.start_frame || 0,
                    isCustom: !!item.sequence_path
                })));
            }
            setIsLoading(false);
        };
        fetchGear();
    }, []);

    if (!isLoading && gearItems.length === 0) return null;

    if (isLoading) {
        return (
            <section className="h-screen bg-black flex items-center justify-center">
                <div className="text-white/20 animate-pulse font-mono text-xs uppercase tracking-[0.4em]">Loading Arsenal...</div>
            </section>
        );
    }

    return (
        <div className="bg-black py-20">
            {gearItems.map((item, idx) => (
                <SingleDevice key={idx} item={item} isFirst={idx === 0} index={idx} />
            ))}
        </div>
    );
}

function SingleDevice({ item, isFirst, index }: { item: GearItem, isFirst: boolean, index: number }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const isEven = index % 2 === 0;

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start end', 'end start'],
    });

    // We want the animation to happen primarily when the item is in the center
    // Let's use a more localized scroll range for the sequence
    const sequenceProgress = useTransform(scrollYProgress, [0.3, 0.7], [0, 1]);

    useEffect(() => {
        const loadImages = async () => {
            const loadedImages: HTMLImageElement[] = [];
            const promises = [];

            for (let i = 1; i <= item.frameCount; i++) {
                const promise = new Promise<void>((resolve) => {
                    const img = new Image();
                    img.src = item.isCustom
                        ? `${item.sequencePath}${i.toString().padStart(3, '0')}.jpg`
                        : `/sequence/ezgif-frame-${i.toString().padStart(3, '0')}.jpg`;
                    img.onload = () => resolve();
                    img.onerror = () => resolve();
                    loadedImages[i - 1] = img;
                });
                promises.push(promise);
            }
            await Promise.all(promises);
            setImages(loadedImages);
        };
        loadImages();
    }, [item]);

    const render = useCallback((frameIdx: number) => {
        const canvas = canvasRef.current;
        const wrapper = wrapperRef.current;
        if (!canvas || !wrapper || images.length === 0) return;
        const ctx = canvas.getContext('2d', { alpha: false });
        if (!ctx) return;

        const img = images[frameIdx];
        if (img && img.complete && img.naturalWidth !== 0) {
            const dpr = window.devicePixelRatio || 1;
            const rect = wrapper.getBoundingClientRect();
            const w = rect.width;
            const h = rect.height;

            if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
                canvas.width = w * dpr;
                canvas.height = h * dpr;
                ctx.scale(dpr, dpr);
            }

            const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
            const x = (w - img.naturalWidth * scale) / 2;
            const y = (h - img.naturalHeight * scale) / 2;

            ctx.fillStyle = "#000";
            ctx.fillRect(0, 0, w, h);
            ctx.drawImage(img, x, y, img.naturalWidth * scale, img.naturalHeight * scale);
        }
    }, [images]);

    const currentIndex = useTransform(
        sequenceProgress,
        [0, 1],
        [item.startFrame, item.frameCount - 1]
    );

    useMotionValueEvent(currentIndex, 'change', (latest) => {
        render(Math.max(0, Math.min(images.length - 1, Math.floor(latest))));
    });

    useEffect(() => {
        render(item.startFrame);
    }, [render, item.startFrame]);

    const scrollHintOpacity = useTransform(scrollYProgress, [0.3, 0.4], [1, 0]);

    return (
        <section ref={containerRef} className="h-[120vh] relative -mt-[20vh] first:mt-0">
            <div className="sticky top-0 h-screen w-full flex items-center justify-center px-6 md:px-24 overflow-hidden">
                <div className={`flex flex-col md:flex-row items-center justify-between gap-12 w-full max-w-7xl ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}>

                    {/* Text Side */}
                    <div className={`flex-1 space-y-6 z-10 ${isEven ? 'text-left' : 'md:text-right text-center'}`}>
                        <motion.h2
                            initial={{ opacity: 0, x: isEven ? -20 : 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="text-5xl md:text-8xl font-bold tracking-tighter text-white leading-none"
                        >
                            {item.name}
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="text-white/60 text-sm md:text-lg uppercase tracking-[0.4em] font-light max-w-md mx-auto md:mx-0 inline-block"
                        >
                            {item.description}
                        </motion.p>
                    </div>

                    {/* Sequence Side */}
                    <div className="flex-1 w-full flex justify-center items-center">
                        <div
                            ref={wrapperRef}
                            className="relative w-full max-w-lg aspect-[4/3] rounded-[2rem] overflow-hidden border border-white/10 shadow-3xl bg-zinc-900/30 backdrop-blur-sm"
                        >
                            <canvas ref={canvasRef} className="w-full h-full object-cover pointer-events-none" />
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />
                        </div>
                    </div>
                </div>

                {isFirst && (
                    <motion.p
                        style={{ opacity: scrollHintOpacity }}
                        className="absolute bottom-10 text-white/30 text-[10px] uppercase tracking-[0.5em] font-mono"
                    >
                        Scroll to Explore
                    </motion.p>
                )}
            </div>
        </section>
    );
}

