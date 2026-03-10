'use client';

import { motion } from 'framer-motion';
import RevealText from '../ui/RevealText';
import Iridescence from '@/components/ui/Iridescence/Iridescence';
import Lanyard from '@/components/ui/Lanyard/Lanyard';
import SectionReveal from '@/components/ui/SectionReveal';
import { createClient } from '@/lib/supabase/client'; // Use client for now due to animation context or switch to server component passing props
import { useEffect, useState } from 'react';
import { useApp } from '@/context/AppContext';
import { translations } from '@/lib/translations';
import LocalTimeWidget from '@/components/ui/LocalTimeWidget';

// Define the interface
interface ProfileData {
    full_name: string;
    role: string;
    bio: string;
    location: string;
    status: string;
    lanyard_texture_url?: string;
    is_available?: boolean;
}

const defaultProfile: ProfileData = {
    full_name: "Fikri Bintang",
    role: "Creative Technologist",
    bio: "Currently a student based in <span class='text-foreground font-medium'>Cikupa, Tangerang Regency</span>. I specialize in crafting high-end web interactions and cinematic motion.",
    location: "Cikupa, Indonesia",
    status: "University Student",
    is_available: true
};

export default function ProfilePreview() {
    const { language, theme } = useApp();
    const t = translations[language];
    const [profile, setProfile] = useState<ProfileData>(defaultProfile);

    useEffect(() => {
        const fetchProfile = async () => {
            const supabase = createClient();
            // Check if supabase is configured
            if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return;

            const { data, error } = await supabase
                .from('profile')
                .select('*')
                .single();

            if (data && !error) {
                // Allow HTML in bio from DB for formatting
                setProfile(data as ProfileData); // Cast data to ProfileData
            }
        };

        fetchProfile();
    }, []);

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Helper to determine Lanyard props based on screen size
    const lanyardProps = isMobile ? {
        position: [0, 0, 35] as [number, number, number], // Further away on mobile
        anchorPosition: [2, 6, 0] as [number, number, number], // Slightly right but closer to center
        gravity: [0, -40, 0] as [number, number, number]
    } : {
        position: [0, 0, 30] as [number, number, number],
        anchorPosition: [4, 6, 0] as [number, number, number],
        gravity: [0, -40, 0] as [number, number, number]
    };

    return (
        <section id="profile" className="relative min-h-screen bg-transparent overflow-hidden">
            {/* Background: Heavy Iridescence on Desktop, Simple Gradient on Mobile */}
            <div className="absolute inset-0 z-0">
                {!isMobile ? (
                    <Iridescence
                        color={theme === 'dark' ? [0.1, 0.1, 0.1] : [0.9, 0.9, 0.9]}
                        mouseReact={true}
                        amplitude={0.1}
                        speed={1.0}
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-b from-zinc-100 to-white dark:from-zinc-900 dark:to-black" />
                )}
            </div>

            {/* Lanyard: Only render on Desktop to save massive resources */}
            {!isMobile && (
                <div className="absolute inset-0 z-10 pointer-events-auto">
                    <Lanyard
                        position={lanyardProps.position}
                        gravity={lanyardProps.gravity}
                        anchorPosition={lanyardProps.anchorPosition}
                        cardTextureUrl={profile.lanyard_texture_url} // Correct prop for card image
                    />
                </div>
            )}

            {/* Mobile Fallback visual (Optional) or just clean styling */}
            {isMobile && (
                <div className="absolute inset-0 z-10 pointer-events-none opacity-20 bg-[url('/noise.png')] opacity-10 mix-blend-overlay" />
            )}

            {/* Main content wrapper - pointer-events-none to let clicks pass through to Lanyard in empty spaces */}
            <div className="w-full h-full flex flex-col justify-center px-6 md:px-20 relative z-20 pointer-events-none">
                {/* Left side: Text content - pointer-events-auto to allow text selection/interaction */}
                <div className="max-w-2xl pointer-events-auto">
                    <SectionReveal delay={0.3}>
                        <div className="space-y-4 mb-8">
                            {profile.is_available && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full"
                                >
                                    <span className="relative flex h-1.5 w-1.5">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
                                    </span>
                                    <span className="text-[8px] uppercase tracking-widest text-green-500 font-bold">Available for hire</span>
                                </motion.div>
                            )}

                            <div>
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.8 }}
                                    viewport={{ once: true }}
                                    className="inline-block px-4 py-1 border border-foreground/10 rounded-full text-[10px] uppercase tracking-[0.3em] text-foreground/40"
                                >
                                    {profile.role}
                                </motion.div>
                            </div>
                        </div>

                        <h2 className="text-4xl sm:text-6xl md:text-8xl font-bold tracking-tighter text-foreground mb-6 md:mb-8 leading-[1.0] md:leading-[0.9]">
                            {language === 'id' ? 'Halo, Saya' : "Hello, I'm"} <span className="text-foreground/40 italic">{profile.full_name}</span>.
                        </h2>

                        <p
                            className="text-base sm:text-lg md:text-2xl text-foreground/60 max-w-2xl font-light leading-relaxed mb-8 md:mb-12"
                            dangerouslySetInnerHTML={{ __html: profile.bio }}
                        />

                        <div className="flex flex-col sm:flex-row flex-wrap gap-8 md:gap-12 text-foreground">
                            <div>
                                <div className="text-[9px] md:text-[10px] uppercase tracking-widest text-foreground/30 mb-1 md:mb-2">{t.focus}</div>
                                <div className="text-sm text-foreground/80">Next.js / Motion / UI</div>
                            </div>
                            <div>
                                <div className="text-[9px] md:text-[10px] uppercase tracking-widest text-foreground/30 mb-1 md:mb-2">{t.status}</div>
                                <div className="text-sm text-foreground/80">{language === 'id' && profile.status === 'University Student' ? t.student : profile.status}</div>
                            </div>
                            <div>
                                <div className="text-[9px] md:text-[10px] uppercase tracking-widest text-foreground/30 mb-1 md:mb-2">{t.location}</div>
                                <div className="text-sm text-foreground/80">{profile.location}</div>
                            </div>
                            <div className="flex items-center">
                                <span className="h-8 w-[1px] bg-foreground/10 mx-6 md:mx-10 hidden sm:block" />
                                <LocalTimeWidget />
                            </div>
                        </div>
                    </SectionReveal>
                </div>
            </div>


            <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 text-foreground/20 z-20"
            >
                <div className="w-[1px] h-12 bg-gradient-to-b from-white/20 to-transparent" />
            </motion.div>
        </section >
    );
}
