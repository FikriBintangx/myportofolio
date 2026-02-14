import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import TiltCard from '../ui/TiltCard';
import RippleGrid from '@/components/ui/RippleGrid/RippleGrid';
import SectionReveal from '@/components/ui/SectionReveal';
import ThumbnailGrid from '@/components/ui/ThumbnailGrid/ThumbnailGrid';

interface Project {
    id: string;
    title: string;
    description: string;
    thumbnail_url: string; // Keep for backward compatibility or primary
    thumbnails?: string[]; // New field for multiple images
    project_date: string;
    category: string;
    link: string;
    order: number;
}

export default function Projects() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            const supabase = createClient();
            if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
                setIsLoading(false);
                return;
            }

            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .order('order', { ascending: true });

            if (data && !error) {
                // Parse thumbnail_url or check for multiple images
                // Assuming user might enter comma-separated URLs in the single text field for now if no array column exists
                const projectsWithParsedImages = data.map((p: any) => ({
                    ...p,
                    thumbnails: p.thumbnail_url ? p.thumbnail_url.split(',').map((url: string) => url.trim()) : []
                }));
                setProjects(projectsWithParsedImages);
            }
            setIsLoading(false);
        };

        fetchProjects();
    }, []);

    if (isLoading) return (
        <section id="projects" className="bg-background py-40 px-6 md:px-20 min-h-[50vh] flex items-center justify-center">
            <div className="text-foreground/20 animate-pulse font-mono uppercase tracking-[0.4em] text-xs">Loading Projects...</div>
        </section>
    );

    if (projects.length === 0) return null;

    return (
        <section id="projects" className="bg-background py-20 md:py-40 px-6 md:px-20 relative overflow-hidden">
            <div className="absolute inset-0 z-0 opacity-40">
                <RippleGrid />
            </div>
            <div className="max-w-7xl mx-auto relative z-10">
                <SectionReveal>
                    <div className="flex justify-between items-end mb-24 border-b border-foreground/5 pb-12">
                        <div>
                            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-foreground">Selected Works</h2>
                            <p className="text-foreground/40 mt-4 max-w-sm uppercase text-[10px] tracking-[0.2em]">A collection of digital objects and interfaces.</p>
                        </div>
                        <div className="text-foreground/20 text-xs font-mono">03 — Projects</div>
                    </div>
                </SectionReveal>

                <SectionReveal delay={0.2}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">
                        {projects.map((project, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: i * 0.1 }}
                                viewport={{ once: true }}
                                className={i === 1 ? "md:mt-32" : ""}

                            >
                                <TiltCard>
                                    <div className="group relative aspect-[4/5] bg-zinc-900 rounded-2xl overflow-hidden mb-8">
                                        <div className="absolute inset-0 w-full h-full">
                                            <ThumbnailGrid
                                                images={project.thumbnails && project.thumbnails.length > 0 ? project.thumbnails : [project.thumbnail_url]}
                                                alt={project.title}
                                            />
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent flex flex-col justify-end p-8 pointer-events-none">
                                            <div className="text-[10px] uppercase tracking-widest text-foreground/50 mb-2">{project.category}</div>
                                            <h3 className="text-3xl font-bold text-foreground tracking-tighter">{project.title}</h3>
                                        </div>
                                    </div>
                                </TiltCard>
                                <div className="flex justify-between items-center text-xs text-foreground/40 font-mono">
                                    <span>{project.link ? 'View Case Study' : 'Case Study Coming Soon'}</span>
                                    <span>{project.project_date}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </SectionReveal>
            </div>
        </section>
    );
}
