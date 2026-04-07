'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Home, Smartphone, Layers, Mail, Code, Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';
import MagneticButton from '../ui/MagneticButton';
import { useApp } from '@/context/AppContext';
import { translations } from '@/lib/translations';
import SpotifyWidget from '../ui/SpotifyWidget';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('');
    const { language, theme, toggleTheme, toggleLanguage } = useApp();
    const t = translations[language];

    const links = [
        { id: 'top', name: t.home, href: '#', icon: <Home className="w-4 h-4" /> },
        { id: 'profile', name: t.profile, href: '#profile', icon: <Smartphone className="w-4 h-4" /> },
        { id: 'projects', name: t.projects, href: '#projects', icon: <Layers className="w-4 h-4" /> },
        { id: 'stack', name: t.stack, href: '#stack', icon: <Code className="w-4 h-4" /> },
        { id: 'contact', name: t.contact, href: '#contact', icon: <Mail className="w-4 h-4" /> },
    ];

    const [lastScrollY, setLastScrollY] = useState(0);
    const [hidden, setHidden] = useState(false);

    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.5 
        };

        const observerCallback = (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        const sections = ['profile', 'projects', 'stack', 'contact', 'experience'];
        sections.forEach(id => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        const handleScroll = () => {
            if (window.scrollY < 100) setActiveSection('profile');
            
            // Hide/Show Navbar on Scroll
            if (window.scrollY > lastScrollY && window.scrollY > 300) {
                setHidden(true);
            } else {
                setHidden(false);
            }
            setLastScrollY(window.scrollY);
        };
        window.addEventListener('scroll', handleScroll);

        return () => {
            observer.disconnect();
            window.removeEventListener('scroll', handleScroll);
        };
    }, [lastScrollY]);

    const activeIndex = links.findIndex(l => l.id === activeSection || (l.id === 'top' && activeSection === 'profile'));
    const totalSections = links.length;

    return (
        <>
            <motion.nav
                initial={{ y: 100, opacity: 0 }}
                animate={{ 
                    y: hidden ? 120 : 0, 
                    opacity: hidden ? 0 : 1 
                }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="fixed bottom-8 left-0 w-full z-50 flex flex-col items-center gap-4 pointer-events-none"
            >
                {/* Section Indicator - Point 16 */}
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="px-4 py-1.5 rounded-full bg-background/20 backdrop-blur-md border border-foreground/5 text-[9px] font-mono tracking-[0.3em] text-foreground/40 uppercase"
                >
                    {activeIndex + 1 >= 1 ? `0${activeIndex + 1}` : '01'} / 0{totalSections}
                </motion.div>

                <motion.div
                    layout
                    className="pointer-events-auto flex items-center gap-1 p-2 rounded-full border border-foreground/10 bg-background/40 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] ring-1 ring-white/5 transition-all duration-500 hover:bg-background/60"
                >
                    <div className="hidden lg:block mr-2">
                        <SpotifyWidget />
                    </div>

                    <div className="flex items-center gap-1">
                        {links.map((link) => {
                            const isActive = activeSection === link.id || (link.id === 'top' && activeSection === 'profile');

                            return (
                                <MagneticButton key={link.id} className="relative group">
                                    <a
                                        href={link.href}
                                        className={cn(
                                            "w-9 h-9 md:w-11 md:h-11 flex items-center justify-center rounded-full transition-all relative z-10",
                                            isActive ? "text-background scale-100" : "text-foreground/40 hover:text-foreground hover:bg-foreground/5"
                                        )}
                                    >
                                        <div className="relative">
                                            {link.icon}
                                            {isActive && (
                                                <motion.div
                                                    layoutId="nav-glow"
                                                    className="absolute -inset-4 bg-foreground/20 blur-xl rounded-full -z-20"
                                                />
                                            )}
                                        </div>

                                        <span className="absolute -top-14 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-background border border-foreground/10 rounded-xl text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 whitespace-nowrap pointer-events-none text-foreground shadow-2xl">
                                            {link.name}
                                        </span>

                                        {isActive && (
                                            <motion.div
                                                layoutId="nav-active-dock"
                                                className="absolute inset-0 bg-foreground rounded-full -z-10 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                                                transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                                            />
                                        )}
                                    </a>
                                </MagneticButton>
                            );
                        })}
                    </div>

                    <div className="w-[1px] h-8 bg-foreground/10 mx-2" />

                    <MagneticButton>
                        <button
                            onClick={toggleTheme}
                            className="w-9 h-9 md:w-11 md:h-11 flex items-center justify-center rounded-full text-foreground/40 hover:text-foreground transition-all"
                        >
                            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                        </button>
                    </MagneticButton>

                    <MagneticButton>
                        <button
                            onClick={() => setIsOpen(true)}
                            className="w-10 h-10 md:w-14 md:h-14 flex items-center justify-center rounded-full bg-foreground text-background shadow-lg hover:scale-110 active:scale-95 transition-all"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                    </MagneticButton>
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
                        className="fixed inset-0 z-[60] bg-background flex flex-col items-center overflow-y-auto py-20 text-foreground"
                    >
                        <button
                            onClick={() => setIsOpen(false)}
                            className="fixed top-8 right-8 z-[70] p-4 bg-foreground/10 hover:bg-foreground hover:text-background rounded-full transition-all duration-300"
                        >
                            <X className="w-6 h-6" />
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
                                    className="group relative text-5xl md:text-8xl font-bold tracking-tighter text-foreground/40 hover:text-foreground transition-all duration-300 overflow-hidden"
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

                        {/* Social Info at the bottom of the menu */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="mt-12 flex flex-col items-center gap-8 text-center"
                        >
                            <SpotifyWidget />

                            <div className="flex flex-col gap-4">
                                <span className="text-[10px] uppercase tracking-[0.3em] text-foreground/20 font-mono">Kontak</span>
                                <button 
                                    onClick={() => {
                                        navigator.clipboard.writeText("081292870932");
                                        alert("Nomor telepon disalin ke papan klip!");
                                    }}
                                    className="text-xl md:text-2xl font-bold hover:text-foreground/80 transition-colors cursor-pointer"
                                >
                                    081292870932
                                </button>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] uppercase tracking-[0.3em] text-foreground/20 font-mono">Instagram</span>
                                <button 
                                    onClick={() => {
                                        navigator.clipboard.writeText("@starbeside_u");
                                        alert("Instagram handle disalin ke papan klip!");
                                    }}
                                    className="text-xl md:text-2xl font-bold hover:text-foreground/80 transition-colors cursor-pointer"
                                >
                                    @starbeside_u
                                </button>
                            </div>
                        </motion.div>

                        <button
                            onClick={() => setIsOpen(false)}
                            className="mt-12 p-4 bg-foreground/10 hover:bg-foreground/20 rounded-full text-foreground transition-colors"
                        >
                            <X className="w-8 h-8" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
