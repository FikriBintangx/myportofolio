'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Command as CmdIcon, Home, User, Layers, Code, Mail, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CommandPalette() {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const router = useRouter();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen(prev => !prev);
            }
            if (e.key === 'Escape') setIsOpen(false);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const actions = [
        { id: 'home', name: 'Home', icon: <Home className="w-4 h-4" />, href: '#' },
        { id: 'profile', name: 'Profile', icon: <User className="w-4 h-4" />, href: '#profile' },
        { id: 'projects', name: 'Projects', icon: <Layers className="w-4 h-4" />, href: '#projects' },
        { id: 'stack', name: 'Tech Stack', icon: <Code className="w-4 h-4" />, href: '#stack' },
        { id: 'contact', name: 'Contact', icon: <Mail className="w-4 h-4" />, href: '#contact' },
    ];

    const filteredActions = actions.filter(action =>
        action.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[1000] flex items-start justify-center pt-[15vh] px-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="absolute inset-0 bg-background/40 backdrop-blur-md"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        className="relative w-full max-w-2xl bg-background/80 border border-foreground/10 shadow-[0_30px_60px_rgba(0,0,0,0.5)] rounded-2xl overflow-hidden"
                    >
                        <div className="p-4 border-b border-foreground/5 flex items-center gap-3">
                            <Search className="w-5 h-5 text-foreground/30" />
                            <input
                                autoFocus
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search commands or sections..."
                                className="w-full bg-transparent outline-none text-lg text-foreground placeholder:text-foreground/20"
                            />
                            <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-foreground/5 text-[10px] font-bold text-foreground/40 border border-foreground/10">
                                <CmdIcon className="w-3 h-3" />
                                <span>K</span>
                            </div>
                        </div>

                        <div className="p-2 max-h-[60vh] overflow-y-auto">
                            {filteredActions.map((action, idx) => (
                                <button
                                    key={action.id}
                                    onClick={() => {
                                        window.location.href = action.href;
                                        setIsOpen(false);
                                    }}
                                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-foreground/5 transition-all text-left group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-foreground/5 flex items-center justify-center group-hover:bg-foreground/10 transition-colors">
                                            {action.icon}
                                        </div>
                                        <span className="font-medium text-foreground/70 group-hover:text-foreground">{action.name}</span>
                                    </div>
                                    <span className="text-[10px] text-foreground/20 uppercase tracking-widest font-bold opacity-0 group-hover:opacity-100 transition-opacity">Jump to</span>
                                </button>
                            ))}
                            {filteredActions.length === 0 && (
                                <div className="p-8 text-center text-foreground/30">
                                    No results found for "{search}"
                                </div>
                            )}
                        </div>

                        <div className="p-3 bg-foreground/[0.02] border-t border-foreground/5 flex items-center justify-between text-[10px] text-foreground/30 font-bold uppercase tracking-widest">
                            <div className="flex gap-4 px-2">
                                <span>↑↓ to navigate</span>
                                <span>↵ to select</span>
                            </div>
                            <div className="px-2">esc to close</div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
