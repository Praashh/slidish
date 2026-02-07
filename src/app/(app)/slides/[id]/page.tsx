"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSlidesStore } from "@/lib/slides-store";
import { TEMPLATES } from "@/lib/templates";
import { MagicWand } from "@phosphor-icons/react";
import { motion } from "framer-motion";

export default function TemplatePage() {
    const params = useParams();
    const router = useRouter();
    const { setSlides, setTheme, setPresentationTitle } = useSlidesStore();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const templateId = params.id as string;
        const template = TEMPLATES.find((t) => t.id === templateId);

        if (template) {
            // Load template data into the store
            setTheme(template.theme);
            setSlides(template.initialSlides);
            setPresentationTitle(template.name);

            // Redirect to the main slides editor
            // We use a short delay to ensure store update is processed
            const timer = setTimeout(() => {
                router.replace("/slides");
            }, 800);

            return () => clearTimeout(timer);
        } else {
            // Handle template not found
            router.replace("/slides/library");
        }
    }, [params.id, setSlides, setTheme, setPresentationTitle, router]);

    return (
        <div className="flex flex-col items-center justify-center h-screen w-full bg-[#faf9f6]">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-6"
            >
                <div className="relative">
                    <div className="w-16 h-16 rounded-3xl bg-white shadow-xl flex items-center justify-center border border-zinc-100">
                        <MagicWand size={32} weight="fill" className="text-orange-600 animate-pulse" />
                    </div>
                    <div className="absolute -inset-4 bg-orange-100/50 blur-2xl rounded-full -z-10 animate-pulse" />
                </div>

                <div className="text-center">
                    <h2 className="text-xl font-bold text-zinc-900 mb-2">Preparing Masterpiece</h2>
                    <p className="text-zinc-500 text-sm">Applying AI design intelligence...</p>
                </div>

                <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.3, 1, 0.3]
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                delay: i * 0.2
                            }}
                            className="w-1.5 h-1.5 rounded-full bg-orange-600"
                        />
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
