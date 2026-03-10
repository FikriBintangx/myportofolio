'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { useEffect, useState } from 'react';

export default function ThemeTransition() {
    const { theme } = useApp();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={theme}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="fixed inset-0 pointer-events-none z-[1000] mix-blend-difference"
                style={{ backgroundColor: theme === 'dark' ? '#fff' : '#000' }}
            />
        </AnimatePresence>
    );
}

// Note: This is an abstract approach, better to use the circle mask if possible.
// For now, I'll implement a clean CSS-only approach in the background body.
