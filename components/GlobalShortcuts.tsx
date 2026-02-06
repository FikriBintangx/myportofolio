'use client';

import { useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { useRouter } from 'next/navigation';

export default function GlobalShortcuts() {
    const { toggleLanguage, cvUrl } = useApp();
    const router = useRouter();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ctrl + U: Toggle Language
            if (e.ctrlKey && e.key.toLowerCase() === 'u') {
                e.preventDefault();
                toggleLanguage();
            }

            // Ctrl + L: Print CV
            if (e.ctrlKey && e.key.toLowerCase() === 'l') {
                e.preventDefault();
                if (cvUrl) {
                    window.open(cvUrl, '_blank');
                } else {
                    alert('CV belum diunggah di dashboard admin.');
                }
            }

            // Secret Shortcut: Ctrl + Alt + A for Login
            if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'a') {
                e.preventDefault();
                router.push('/login');
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [toggleLanguage, cvUrl, router]);

    return null;
}
