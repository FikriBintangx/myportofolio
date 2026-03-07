'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Home, Smartphone, Layers, Mail, Code, Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';
import MagneticButton from '../ui/MagneticButton';
import { useApp } from '@/context/AppContext';
import { translations } from '@/lib/translations';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('');
    const { language, theme, toggleTheme, toggleLanguage } = useApp();
    const t = translations[language];

    const links = [
        { id: 'top', name: t.home, href: '#', icon: <Home className="w-5 h-5" /> },
        { id: 'profile', name: t.profile, href: '#profile', icon: <Smartphone className="w-5 h-5" /> },
        { id: 'projects', name: t.projects, href: '#projects', icon: <Layers className="w-5 h-5" /> },
        { id: 'stack', name: t.stack, href: '#stack', icon: <Code className="w-5 h-5" /> },
        { id: 'contact', name: t.contact, href: '#contact', icon: <Mail className="w-5 h-5" /> },
    ];

    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: '-40% 0px -40% 0px', // Trigger when section is in the middle of the screen
            threshold: 0
        };

        const observerCallback = (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id || 'top');
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        // Sections to observe
        const sectionIds = ['profile', 'projects', 'stack', 'contact'];
        sectionIds.forEach(id => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        // Special case for top/home
        const handleScroll = () => {
            if (window.scrollY < 100) {
                setActiveSection('top');
            }
        };
        window.addEventListener('scroll', handleScroll);

        return () => {
            observer.disconnect();
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <>
            <motion.nav
                initial={{ y: 100, x: "-50%", opacity: 0 }}
                animate={{ y: 0, x: "-50%", opacity: 1 }}
                className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-4 pointer-events-none"
            >
                <div className="pointer-events-auto flex items-center gap-2 p-2 rounded-full border border-foreground/10 bg-background/50 backdrop-blur-md shadow-2xl ring-1 ring-foreground/10 transition-all duration-500 hover:bg-background/80">
                    {/* Desktop / Dock View */}
                    <div className="flex items-center gap-1 relative">
                        {links.map((link) => {
                            const isActive = activeSection === link.id || (link.id === 'top' && activeSection === '');
                            return (
                                <MagneticButton key={link.name} className="relative group">
                                    <a
                                        href={link.href}
                                        className={cn(
                                            "w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full transition-colors relative z-10",
                                            isActive ? "text-background" : "text-foreground/70 hover:text-foreground hover:bg-foreground/10"
                                        )}
                                    >
                                        {link.icon}
                                        {/* Tooltip */}
                                        <span className="absolute -top-12 left-1/2 -translate-x-1/2 px-2 py-1 bg-background/80 backdrop-blur border border-foreground/10 rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none text-foreground">
                                            {link.name}
                                        </span>

                                        {/* Active Background Pill */}
                                        {isActive && (
                                            <motion.div
                                                layoutId="nav-active-pill"
                                                className="absolute inset-0 bg-foreground rounded-full -z-10"
                                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                            />
                                        )}
                                    </a>
                                </MagneticButton>
                            );
                        })}
                    </div>

                    {/* Theme Toggle Button */}
                    <MagneticButton>
                        <button
                            onClick={toggleTheme}
                            className="p-2 text-foreground/50 hover:text-foreground transition-colors mr-1"
                            title="Toggle Theme (Alt + A)"
                        >
                            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>
                    </MagneticButton>

                    <div className="w-[1px] h-6 bg-foreground/10 mx-2" />

                    {/* Shortcuts Visual */}
                    <div className="hidden md:flex flex-col items-center text-[8px] uppercase tracking-tighter text-foreground/30 mr-2 font-mono">
                        <span>Alt + A</span>
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
                            className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-foreground text-background font-bold hover:scale-110 transition-transform"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                    </MagneticButton>
                </div>

                {/* Shortcut Legend - Hidden on Mobile */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hidden md:flex gap-4 text-[10px] uppercase tracking-[0.2em] text-foreground/20"
                >
                    <span>Alt+A: Theme</span>
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

                        <div className="absolute top-10 flex flex-col md:flex-row gap-6 md:gap-12 text-[10px] md:text-xs uppercase tracking-[0.3em] text-foreground/40 font-mono text-center">
                            <div className="flex flex-col gap-1">
                                <span className="text-foreground/20">Kontak</span>
                                <a href="https://wa.me/6281292870932" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors text-foreground/60">
                                    081292870932
                                </a>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-foreground/20">Instagram</span>
                                <a href="https://instagram.com/starbeside_u" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors text-foreground/60">
                                    starbeside_u
                                </a>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
