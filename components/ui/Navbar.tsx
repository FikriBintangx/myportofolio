'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const navLinks = [
    { href: '#about', label: 'About' },
    { href: '#work', label: 'Work' },
    { href: '#stack', label: 'Stack' },
    { href: '#contact', label: 'Contact' },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMenu = () => setIsOpen(!isOpen);

    const menuVariants = {
        closed: {
            opacity: 0,
            clipPath: "circle(0% at 100% 0%)",
            transition: { duration: 0.8, ease: [0.42, 0, 0.58, 1] as const }
        },
        open: {
            opacity: 1,
            clipPath: "circle(150% at 100% 0%)",
            transition: { duration: 0.8, ease: [0.42, 0, 0.58, 1] as const }
        }
    };

    const linkVariants = {
        closed: { y: 100, opacity: 0 },
        open: (i: number) => ({
            y: 0,
            opacity: 1,
            transition: { delay: 0.2 + i * 0.1, duration: 0.8, ease: [0.76, 0, 0.24, 1] as const } // Custom easing
        })
    };

    return (
        <>
            <nav className={cn("fixed top-0 w-full z-40 px-6 py-4 flex justify-between items-center transition-all duration-300",
                scrolled ? "bg-black/20 backdrop-blur-md text-white" : "text-white"
            )}>
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-2xl font-bold tracking-tighter z-50 relative"
                >
                    IS4GI.dev
                </motion.div>

                <motion.button
                    onClick={toggleMenu}
                    className="z-50 relative p-2 focus:outline-none"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    {isOpen ? <X size={32} /> : <Menu size={32} />}
                </motion.button>
            </nav>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        variants={menuVariants}
                        initial="closed"
                        animate="open"
                        exit="closed"
                        className="fixed inset-0 z-30 bg-white text-black flex flex-col items-center justify-center"
                    >
                        <div className="flex flex-col gap-8 items-center">
                            {navLinks.map((link, i) => (
                                <div key={link.label} className="overflow-hidden">
                                    <motion.a
                                        custom={i}
                                        variants={linkVariants}
                                        href={link.href}
                                        onClick={() => setIsOpen(false)}
                                        className="text-6xl md:text-8xl font-bold tracking-tighter hover:text-gray-500 transition-colors"
                                    >
                                        {link.label}
                                    </motion.a>
                                </div>
                            ))}
                        </div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1, transition: { delay: 0.8 } }}
                            className="absolute bottom-10 flex gap-6 text-sm font-mono text-gray-500"
                        >
                            <a href="#" className="hover:text-black">Twitter</a>
                            <a href="#" className="hover:text-black">GitHub</a>
                            <a href="#" className="hover:text-black">Instagram</a>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
