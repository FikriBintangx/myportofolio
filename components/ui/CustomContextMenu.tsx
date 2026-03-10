'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CustomContextMenu() {
    const [isVisible, setIsVisible] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault();
            setPosition({ x: e.clientX, y: e.clientY });
            setIsVisible(true);
        };

        const handleClick = () => setIsVisible(false);

        window.addEventListener('contextmenu', handleContextMenu);
        window.addEventListener('click', handleClick);

        return () => {
            window.removeEventListener('contextmenu', handleContextMenu);
            window.removeEventListener('click', handleClick);
        };
    }, []);

    if (!isVisible) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 10 }}
                    style={{ left: position.x, top: position.y }}
                    className="fixed z-[9999] bg-background/80 backdrop-blur-xl border border-foreground/10 p-2 rounded-2xl shadow-2xl min-w-[180px]"
                >
                    <div className="flex flex-col gap-1">
                        <ContextMenuItem label="Copy Link" onClick={() => navigator.clipboard.writeText(window.location.href)} />
                        <ContextMenuItem label="Switch Theme" onClick={() => document.documentElement.classList.toggle('dark')} />
                        <div className="h-[1px] bg-foreground/5 my-1 mx-2" />
                        <ContextMenuItem label="Command Palette" sublabel="⌘ + K" />
                        <div className="h-[1px] bg-foreground/5 my-1 mx-2" />
                        <ContextMenuItem label="IS4GI.dev v2.2" sublabel="Creative Developer" />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

function ContextMenuItem({ label, sublabel, onClick }: { label: string, sublabel?: string, onClick?: () => void }) {
    return (
        <button
            onClick={onClick}
            className="w-full text-left px-4 py-2 rounded-xl hover:bg-foreground/5 transition-colors flex flex-col"
        >
            <span className="text-sm font-medium">{label}</span>
            {sublabel && <span className="text-[10px] text-foreground/30 uppercase tracking-widest">{sublabel}</span>}
        </button>
    );
}
