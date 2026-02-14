'use client';

import { motion } from 'framer-motion';

interface ThumbnailGridProps {
    images: string[];
    alt: string;
}

export default function ThumbnailGrid({ images, alt }: ThumbnailGridProps) {
    // If no images, show placeholder or empty
    if (!images || images.length === 0) return <div className="w-full h-full bg-zinc-900" />;

    // 1 Image - Full Cover
    if (images.length === 1) {
        return (
            <motion.div
                className="w-full h-full"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            >
                <img
                    src={images[0]}
                    alt={alt}
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500"
                />
            </motion.div>
        );
    }

    // 2 Images - Split Vertically
    if (images.length === 2) {
        return (
            <motion.div
                className="w-full h-full grid grid-cols-2 gap-1"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            >
                {images.map((src, i) => (
                    <div key={i} className="relative w-full h-full overflow-hidden">
                        <img
                            src={src}
                            alt={`${alt} ${i + 1}`}
                            className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500"
                        />
                    </div>
                ))}
            </motion.div>
        );
    }

    // 3 Images - 1 Big Left, 2 Small Right (Stacked)
    if (images.length === 3) {
        return (
            <motion.div
                className="w-full h-full grid grid-cols-2 gap-1"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            >
                <div className="relative w-full h-full overflow-hidden">
                    <img
                        src={images[0]}
                        alt={`${alt} 1`}
                        className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500"
                    />
                </div>
                <div className="grid grid-rows-2 gap-1 w-full h-full">
                    <div className="relative w-full h-full overflow-hidden">
                        <img
                            src={images[1]}
                            alt={`${alt} 2`}
                            className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500"
                        />
                    </div>
                    <div className="relative w-full h-full overflow-hidden">
                        <img
                            src={images[2]}
                            alt={`${alt} 3`}
                            className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500"
                        />
                    </div>
                </div>
            </motion.div>
        );
    }

    // 4+ Images - 2x2 Grid (Show first 4)
    return (
        <motion.div
            className="w-full h-full grid grid-cols-2 grid-rows-2 gap-1"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        >
            {images.slice(0, 4).map((src, i) => (
                <div key={i} className="relative w-full h-full overflow-hidden">
                    <img
                        src={src}
                        alt={`${alt} ${i + 1}`}
                        className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500"
                    />
                </div>
            ))}
        </motion.div>
    );
}
