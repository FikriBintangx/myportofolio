'use client';

import { motion } from 'framer-motion';
import RevealText from '../ui/RevealText';
import { createClient } from '@/lib/supabase/client'; // Use client for now due to animation context or switch to server component passing props
import { useEffect, useState } from 'react';
import { useApp } from '@/context/AppContext';
import { translations } from '@/lib/translations';

// Define the interface
interface ProfileData {
    full_name: string;
    role: string;
    bio: string;
    location: string;
    status: string;
}

const defaultProfile: ProfileData = {
    full_name: "Fikri Bintang",
    role: "Creative Technologist",
    bio: "Currently a student based in <span class='text-foreground font-medium'>Cikupa, Tangerang Regency</span>. I specialize in crafting high-end web interactions and cinematic motion.",
    location: "Cikupa, Indonesia",
    status: "University Student"
};

export default function ProfilePreview() {
    const { language } = useApp();
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

    return (
        <section id="profile" className="min-h-screen bg-background dark:bg-background light:bg-zinc-50 flex flex-col justify-center px-6 md:px-20 relative overflow-hidden transition-colors">
            {/* Abstract light diffusion */}
            <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-white/5 rounded-full blur-[120px] dark:block hidden" />

            <div className="max-w-4xl relative z-10">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="mb-6 inline-block px-4 py-1 border border-foreground/10 dark:border-foreground/10 light:border-black/10 rounded-full text-[10px] uppercase tracking-[0.3em] text-foreground/40 dark:text-foreground/40 light:text-black/40"
                >
                    {profile.role}
                </motion.div>

                <h2 className="text-4xl sm:text-6xl md:text-8xl font-bold tracking-tighter text-foreground dark:text-foreground light:text-black mb-6 md:mb-8 leading-[1.0] md:leading-[0.9]">
                    {language === 'id' ? 'Halo, Saya' : "Hello, I'm"} <span className="text-foreground/40 italic">{profile.full_name}</span>.
                </h2>

                <p
                    className="text-base sm:text-lg md:text-2xl text-foreground/60 dark:text-foreground/60 light:text-black/60 max-w-2xl font-light leading-relaxed mb-8 md:mb-12"
                    dangerouslySetInnerHTML={{ __html: profile.bio }}
                />

                <div className="flex flex-col sm:flex-row flex-wrap gap-8 md:gap-12 text-foreground dark:text-foreground light:text-black">
                    <div>
                        <div className="text-[9px] md:text-[10px] uppercase tracking-widest text-foreground/30 mb-1 md:mb-2">{t.focus}</div>
                        <div className="text-sm text-foreground/80 dark:text-foreground/80 light:text-black/80">Next.js / Motion / UI</div>
                    </div>
                    <div>
                        <div className="text-[9px] md:text-[10px] uppercase tracking-widest text-foreground/30 mb-1 md:mb-2">{t.status}</div>
                        <div className="text-sm text-foreground/80 dark:text-foreground/80 light:text-black/80">{language === 'id' && profile.status === 'University Student' ? t.student : profile.status}</div>
                    </div>
                    <div>
                        <div className="text-[9px] md:text-[10px] uppercase tracking-widest text-foreground/30 mb-1 md:mb-2">{t.location}</div>
                        <div className="text-sm text-foreground/80 dark:text-foreground/80 light:text-black/80">{profile.location}</div>
                    </div>
                </div>
            </div>


            <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 text-foreground/20"
            >
                <div className="w-[1px] h-12 bg-gradient-to-b from-white/20 to-transparent" />
            </motion.div>
        </section >
    );
}
