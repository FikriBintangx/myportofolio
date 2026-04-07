'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.5,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            touchMultiplier: 2,
            infinite: false,
        });

        function raf(time: number) {
            lenis.raf(time);
            
            // Calculate velocity and apply to CSS variable for "Smushing" (Point 48)
            const velocity = Math.abs(lenis.velocity);
            const smush = Math.min(0.05, velocity * 0.005);
            document.documentElement.style.setProperty('--scroll-smush', `-${smush}em`);
            
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        return () => {
            lenis.destroy();
        };
    }, []);

    return <>{children}</>;
}
