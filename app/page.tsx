'use client';

import { useState, useEffect } from 'react';
import Navbar from "@/components/layout/Navbar";
import Loader from "@/components/layout/Loader";
import ProfilePreview from "@/components/sections/ProfilePreview";
import Devices from "@/components/sections/Devices";
import Projects from "@/components/sections/Projects";
import Stack from "@/components/sections/Stack";
import GearList from "@/components/sections/GearList";
import Experience from "@/components/sections/Experience"; // Added import
import CustomCursor from "@/components/ui/CustomCursor";
import MagneticButton from "@/components/ui/MagneticButton";
import ScrollProgress from "@/components/ui/ScrollProgress";

const frameCount = 192;

export default function Home() {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const [whatsapp, setWhatsapp] = useState('');

  useEffect(() => {
    let loadedCount = 0;
    const totalAssets = frameCount;

    const preloadImages = async () => {
      for (let i = 1; i <= frameCount; i++) {
        const img = new Image();
        const src = `/sequence/ezgif-frame-${i.toString().padStart(3, '0')}.jpg`;
        img.src = src;
        img.onload = () => {
          loadedCount++;
          setLoadingProgress((loadedCount / totalAssets) * 100);
        };
        img.onerror = () => {
          loadedCount++;
          setLoadingProgress((loadedCount / totalAssets) * 100);
        };
      }
    };

    const fetchConfig = async () => {
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();
      const { data } = await supabase.from('profile').select('whatsapp').single();
      if (data?.whatsapp) {
        // Clean characters except numbers
        const cleaned = data.whatsapp.replace(/\D/g, '');
        // Handle leading 0 -> 62
        const formatted = cleaned.startsWith('0') ? '62' + cleaned.slice(1) : cleaned;
        setWhatsapp(formatted);
      }
    };

    preloadImages();
    fetchConfig();
  }, []);

  return (
    <main className="bg-black text-white selection:bg-white selection:text-black cursor-none overflow-x-hidden">
      <Loader progress={loadingProgress} onComplete={() => setIsLoaded(true)} />

      {isLoaded && (
        <>
          <CustomCursor />
          <ScrollProgress />
          <div className="bg-noise opacity-[0.03] scale-150"></div>
          <Navbar />

          <div className="relative z-10">
            <ProfilePreview />

            {/* Signature Devices Section */}
            <Devices />

            <Projects />
            <Stack />
            <GearList />
            <Experience />

            {/* Final Contact Section */}
            <section id="contact" className="min-h-screen bg-black flex flex-col items-center justify-center px-6 relative overflow-hidden border-t border-white/5">
              <div className="absolute inset-0 bg-gradient-to-t from-white/[0.02] to-transparent pointer-events-none" />

              <h2 className="text-5xl md:text-9xl font-bold tracking-tighter text-center mb-16 leading-[0.85]">
                Let’s build <br />
                <span className="text-white/20 italic">something</span> <br />
                meaningful.
              </h2>

              <a
                href={whatsapp ? `https://wa.me/${whatsapp}` : '#contact'}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MagneticButton className="group relative px-12 py-5 bg-white text-black text-xs uppercase tracking-[0.4em] font-bold rounded-full hover:scale-105 transition-transform">
                  Get in Touch
                  <div className="absolute inset-0 rounded-full bg-white blur-xl opacity-0 group-hover:opacity-30 transition-opacity" />
                </MagneticButton>
              </a>

              <footer className="absolute bottom-10 left-0 w-full px-10 flex justify-between items-center text-[10px] uppercase tracking-widest text-white/20 font-mono">
                <p>© 2026 IS4GI.dev</p>
                <p>Awwwards level / Next.js / Motion</p>
              </footer>
            </section>
          </div>
        </>
      )}
    </main>
  );
}
