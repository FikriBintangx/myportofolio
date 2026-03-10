'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Calendar, Tag, Layers, ArrowRight } from 'lucide-react';
import { useEffect } from 'react';
import MagneticButton from './MagneticButton';

interface Project {
    id: string | number;
    title: string;
    description: string;
    thumbnail_url: string;
    project_date: string;
    category: string;
    link: string;
    content?: string;
    stack?: string;
}

interface ProjectDetailModalProps {
    project: Project | null;
    onClose: () => void;
}

export default function ProjectDetailModal({ project, onClose }: ProjectDetailModalProps) {
    // Prevent scrolling when modal is open
    useEffect(() => {
        if (project) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [project]);

    if (!project) return null;

    const thumbnails = project.thumbnail_url ? project.thumbnail_url.split(',').map(url => url.trim()) : [];
    const stackItems = project.stack ? project.stack.split(',').map(item => item.trim()) : [];

    return (
        <AnimatePresence>
            {project && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/90 backdrop-blur-xl"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
                        className="relative w-full max-w-5xl max-h-[90vh] bg-zinc-950 border border-white/10 rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-2xl"
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 z-50 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors text-white"
                        >
                            <X size={20} />
                        </button>

                        {/* Image Side */}
                        <div className="w-full md:w-1/2 h-64 md:h-auto overflow-y-auto bg-zinc-900 custom-scrollbar">
                            <div className="flex flex-col gap-2 p-2">
                                {thumbnails.map((src, idx) => (
                                    <motion.img
                                        key={idx}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        src={src}
                                        alt={`${project.title} - ${idx + 1}`}
                                        className="w-full h-auto rounded-xl object-cover"
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Info Side */}
                        <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto flex flex-col custom-scrollbar">
                            <div className="flex items-center gap-2 text-white/40 text-[10px] uppercase tracking-[0.2em] mb-4">
                                <Tag size={12} />
                                <span>{project.category}</span>
                            </div>

                            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tighter mb-6">
                                {project.title}
                            </h2>

                            <div className="flex flex-wrap gap-6 mb-8 text-sm">
                                <div className="flex items-center gap-2 text-white/60">
                                    <Calendar size={16} className="text-white/30" />
                                    <span>{project.project_date}</span>
                                </div>
                                {project.link && (
                                    <a
                                        href={project.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-white hover:text-white/70 transition-colors"
                                    >
                                        <ExternalLink size={16} className="text-white/30" />
                                        <span>View Live Project</span>
                                    </a>
                                )}
                            </div>

                            <div className="space-y-8">
                                <div>
                                    <h3 className="text-xs uppercase tracking-widest text-white/30 mb-3 font-bold">About Project</h3>
                                    <p className="text-white/70 leading-relaxed text-lg whitespace-pre-line">
                                        {project.content || project.description}
                                    </p>
                                </div>

                                {stackItems.length > 0 && (
                                    <div>
                                        <h3 className="text-xs uppercase tracking-widest text-white/30 mb-4 font-bold">Technology Stack</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {stackItems.map((item, idx) => (
                                                <span
                                                    key={idx}
                                                    className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-white/60 font-medium"
                                                >
                                                    {item}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="mt-auto pt-12">
                                {project.link ? (
                                    <MagneticButton>
                                        <a
                                            href={project.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-3 bg-white text-black px-8 py-4 rounded-full font-bold text-sm hover:scale-105 transition-transform"
                                        >
                                            Launch Project <ArrowRight size={18} />
                                        </a>
                                    </MagneticButton>
                                ) : (
                                    <div className="text-white/20 text-xs font-mono italic">Case study is currently being detailed.</div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
