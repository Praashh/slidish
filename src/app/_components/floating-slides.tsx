"use client";

import { motion } from "framer-motion";

export default function FloatingSlides() {
    const slides = [
        { id: 1, color: "from-orange-400 to-orange-600", delay: 0 },
        { id: 2, color: "from-blue-400 to-blue-600", delay: 0.2 },
        { id: 3, color: "from-purple-400 to-purple-600", delay: 0.4 },
    ];

    return (
        <div className="relative w-full h-full flex items-center justify-center">
            {slides.map((slide, index) => (
                <motion.div
                    key={slide.id}
                    initial={{ opacity: 0, x: 100, rotateY: -30, scale: 0.8 }}
                    animate={{
                        opacity: 0.9,
                        x: index * 40 - 40,
                        y: index * -20 + 20,
                        rotateY: -25,
                        scale: 1 - index * 0.05,
                        z: -index * 50,
                    }}
                    transition={{
                        duration: 1.2,
                        delay: slide.delay,
                        ease: "easeOut",
                        repeat: Infinity,
                        repeatType: "reverse",
                        repeatDelay: 5,
                    }}
                    className={`absolute w-64 h-40 md:w-80 md:h-48 rounded-2xl shadow-2xl p-4 overflow-hidden bg-white/10 backdrop-blur-md border border-white/20`}
                    style={{
                        transformStyle: "preserve-3d",
                        perspective: "1000px",
                    }}
                >
                    {/* Slide Content Mockup */}
                    <div className={`w-full h-full rounded-lg bg-linear-to-br ${slide.color} opacity-20 absolute inset-0 -z-10`} />
                    <div className="flex flex-col gap-2 h-full">
                        <div className="w-1/2 h-4 bg-white/40 rounded-full" />
                        <div className="w-3/4 h-3 bg-white/20 rounded-full" />
                        <div className="w-full h-20 mt-2 bg-white/10 rounded-lg flex items-center justify-center">
                            <div className="w-12 h-12 rounded-full bg-white/20 animate-pulse" />
                        </div>
                        <div className="mt-auto flex justify-between items-center">
                            <div className="w-12 h-3 bg-white/30 rounded-full" />
                            <div className="w-6 h-6 rounded-full bg-white/40" />
                        </div>
                    </div>

                    {/* Glow effect */}
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-white/20 to-transparent pointer-events-none" />
                </motion.div>
            ))}

            {/* Laser/Light beams from horizon to slides */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.1, 0.3, 0.1] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -right-20 top-1/2 -translate-y-1/2 w-[150%] h-px bg-linear-to-r from-transparent via-orange-400/50 to-transparent rotate-[-15deg] blur-[2px]"
            />
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.1, 0.2, 0.1] }}
                transition={{ duration: 5, repeat: Infinity, delay: 1 }}
                className="absolute -right-20 top-[60%] -translate-y-1/2 w-[150%] h-px bg-linear-to-r from-transparent via-blue-400/30 to-transparent rotate-[-10deg] blur-[2px]"
            />
        </div>
    );
}
