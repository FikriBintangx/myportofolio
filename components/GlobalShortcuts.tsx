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

        // Konami Code Easter Egg: Up Up Down Down Left Right Left Right B A
        const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
        let current = 0;

        const handleKonami = (e: KeyboardEvent) => {
            if (e.key === konamiCode[current]) {
                current++;
                if (current === konamiCode.length) {
                    current = 0;
                    document.documentElement.classList.add('konami-active');
                    alert('SECRET UNLOCKED: Golden Mode Activated!');
                }
            } else {
                current = 0;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keydown', handleKonami);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keydown', handleKonami);
        };
    }, [toggleLanguage, cvUrl, router]);

    return null;
}
