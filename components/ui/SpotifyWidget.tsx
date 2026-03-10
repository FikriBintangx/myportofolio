'use client';

import { motion } from 'framer-motion';
import { Music2 } from 'lucide-react';
import { useEffect, useState } from 'react';

const TRACKS = [
    { name: "Moonlight Sunrise", artist: "TWICE" },
    { name: "Ditto", artist: "NewJeans" },
    { name: "Paint The Town", artist: "LOONA" },
    { name: "Super Shy", artist: "NewJeans" },
    { name: "OMG", artist: "NewJeans" },
    { name: "Hype Boy", artist: "NewJeans" },
];

export default function SpotifyWidget() {
    const [track, setTrack] = useState(TRACKS[0]);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    setTrack(TRACKS[Math.floor(Math.random() * TRACKS.length)]);
                    return 0;
                }
                return prev + 0.1;
            });
        }, 100);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex items-center gap-3 px-4 py-2 bg-foreground/[0.03] border border-foreground/5 rounded-2xl group cursor-pointer hover:bg-foreground/[0.05] transition-all">
            <div className="relative w-8 h-8 rounded-lg bg-green-500 overflow-hidden flex items-center justify-center">
                <Music2 className="w-4 h-4 text-white" />
                <div className="absolute inset-x-0 bottom-0 h-1 bg-black/20">
                    <motion.div
                        className="h-full bg-white/60"
                        animate={{ width: `${progress}%` }}
                    />
                </div>
            </div>
            <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2">
                    <span className="text-[8px] font-bold text-green-500 uppercase tracking-widest leading-none">Spotify</span>
                    <div className="flex items-end gap-0.5 h-2">
                        {[0, 1, 2].map(i => (
                            <motion.div
                                key={i}
                                className="w-0.5 bg-green-500 rounded-full"
                                animate={{ height: [4, 8, 3, 6, 4][i] }}
                                transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }}
                            />
                        ))}
                    </div>
                </div>
                <div className="text-[11px] font-bold text-foreground truncate max-w-[120px] leading-tight mt-0.5">
                    {track.name}
                </div>
                <div className="text-[9px] text-foreground/40 font-medium truncate max-w-[120px] leading-none">
                    {track.artist}
                </div>
            </div>
        </div>
    );
}
