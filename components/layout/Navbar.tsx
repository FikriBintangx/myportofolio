'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Home, Smartphone, Layers, Mail, Code } from 'lucide-react';
import { cn } from '@/lib/utils';
import MagneticButton from '../ui/MagneticButton';
import { useApp } from '@/context/AppContext';
import { translations } from '@/lib/translations';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { language, toggleTheme, toggleLanguage } = useApp();
    const t = translations[language];

    const links = [
        { name: t.home, href: '#', icon: <Home className="w-5 h-5" /> },
        { name: t.profile, href: '#profile', icon: <Smartphone className="w-5 h-5" /> },
        { name: t.projects, href: '#projects', icon: <Layers className="w-5 h-5" /> },
        { name: t.stack, href: '#stack', icon: <Code className="w-5 h-5" /> },
        { name: t.contact, href: '#contact', icon: <Mail className="w-5 h-5" /> },
    ];

    return (
        <>
            <motion.nav
                // ... (motion config remains same) ...
                className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-4 pointer-events-none"
            >
                <div className="pointer-events-auto flex items-center gap-2 p-2 rounded-full border border-foreground/10 bg-background/50 backdrop-blur-md shadow-2xl ring-1 ring-foreground/10 transition-all duration-500 hover:bg-background/80">
                    {/* Desktop / Dock View */}
                    <div className="flex items-center gap-1">
                        {links.map((link) => (
                            <MagneticButton key={link.name} className="relative group">
                                <a
                                    href={link.href}
                                    className="w-12 h-12 flex items-center justify-center rounded-full bg-transparent hover:bg-foreground/10 transition-colors text-foreground/70 hover:text-foreground"
                                >
                                    {link.icon}
                                    {/* Tooltip */}
                                    <span className="absolute -top-12 left-1/2 -translate-x-1/2 px-2 py-1 bg-background/80 backdrop-blur border border-foreground/10 rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none text-foreground">
                                        {link.name}
                                    </span>
                                </a>
                            </MagneticButton>
                        ))}
                    </div>

                    <div className="w-[1px] h-6 bg-foreground/10 mx-2" />

                    {/* Shortcuts Visual */}
                    <div className="hidden md:flex flex-col items-center text-[8px] uppercase tracking-tighter text-foreground/30 mr-2 font-mono">
                        <span>Ctrl + T</span>
                        <span>Theme</span>
                    </div>

                    <div className="hidden md:flex flex-col items-center text-[8px] uppercase tracking-tighter text-foreground/30 mr-4 font-mono">
                        <span>Ctrl + U</span>
                        <span>Lang</span>
                    </div>

                    {/* Menu Toggle */}
                    <MagneticButton>
                        <button
                            onClick={() => setIsOpen(true)}
                            className="w-12 h-12 flex items-center justify-center rounded-full bg-foreground text-background font-bold hover:scale-110 transition-transform"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                    </MagneticButton>
                </div>

                {/* Shortcut Legend */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-4 text-[10px] uppercase tracking-[0.2em] text-foreground/20"
                >
                    <span>T: Theme</span>
                    <span>U: Lang</span>
                </motion.div>
            </motion.nav>

            {/* Fullscreen Overlay Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, clipPath: "circle(0% at 50% 100%)" }}
                        animate={{ opacity: 1, clipPath: "circle(150% at 50% 100%)" }}
                        exit={{ opacity: 0, clipPath: "circle(0% at 50% 100%)" }}
                        transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
                        className="fixed inset-0 z-[60] bg-background flex flex-col items-center justify-center text-foreground"
                    >
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute bottom-10 left-1/2 -translate-x-1/2 p-4 bg-foreground/10 hover:bg-foreground/20 rounded-full text-foreground transition-colors"
                        >
                            <X className="w-8 h-8" />
                        </button>

                        <div className="flex flex-col items-center gap-8">
                            {links.map((link, i) => (
                                <motion.a
                                    key={link.name}
                                    href={link.href}
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    onClick={() => setIsOpen(false)}
                                    className="group relative text-5xl md:text-8xl font-bold tracking-tighter text-foreground/50 hover:text-foreground transition-colors overflow-hidden"
                                >
                                    <span className="inline-block transition-transform duration-500 group-hover:-translate-y-full">
                                        {link.name}
                                    </span>
                                    <span className="absolute left-0 top-0 inline-block transition-transform duration-500 translate-y-full group-hover:translate-y-0 text-foreground">
                                        {link.name}
                                    </span>
                                </motion.a>
                            ))}
                        </div>

                        <div className="absolute top-10 flex gap-4 text-sm uppercase tracking-widest text-foreground/30">
                            <span>Instagram</span>
                            <span>LinkedIn</span>
                            <span>GitHub</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
