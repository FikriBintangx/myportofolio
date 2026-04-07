'use client';

import { usePathname } from 'next/navigation';
import SmoothScroll from "@/components/SmoothScroll";
import ScrollProgress from "@/components/ui/ScrollProgress";

export default function ClientEffects({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith('/admin');

    if (isAdmin) {
        return <div className="bg-black min-h-screen">{children}</div>;
    }

    return (
        <SmoothScroll>
            <ScrollProgress />
            <div className="bg-noise" />
            {children}
        </SmoothScroll>
    );
}
