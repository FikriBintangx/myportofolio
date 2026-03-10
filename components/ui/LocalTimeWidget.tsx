'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function LocalTimeWidget() {
    const [time, setTime] = useState<string>('');
    const [seconds, setSeconds] = useState<number>(0);

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            // Offset for GMT+7 (WIB)
            const wibDate = new Date(now.getTime() + (now.getTimezoneOffset() + 420) * 60000);
            setTime(wibDate.toLocaleTimeString('en-US', {
                hour12: false,
                hour: '2-digit',
                minute: '2-digit'
            }));
            setSeconds(wibDate.getSeconds());
        };

        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col gap-1 select-none pointer-events-none group">
            <div className="flex items-center gap-1.5 overflow-hidden">
                <span className="text-[10px] font-bold text-foreground/20 uppercase tracking-widest transition-transform duration-500 group-hover:-translate-x-1/2">
                    Tangerang ID
                </span>
                <span className="h-[1px] w-4 bg-foreground/10" />
            </div>
            <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold tracking-tighter text-foreground font-mono tabular-nums leading-none">
                    {time || '00:00'}
                </span>
                <div className="w-1 h-4 bg-foreground/5 rounded-full overflow-hidden relative">
                    <motion.div
                        className="absolute inset-x-0 bottom-0 bg-foreground"
                        animate={{ height: `${(seconds / 60) * 100}%` }}
                        transition={{ duration: 1, ease: "linear" }}
                    />
                </div>
            </div>
            <div className="text-[8px] font-bold uppercase tracking-[0.2em] text-foreground/40 mt-1">
                Local Time
            </div>
        </div>
    );
}
