"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { useSlidesStore } from "@/lib/slides-store";
import { TEMPLATES, type Template } from "@/lib/templates";
import { MagicWand, ArrowRight, Palette, Layout } from "@phosphor-icons/react";

export default function LibraryPage() {
    const router = useRouter();
    const { setSlides, setTheme, setPresentationTitle } = useSlidesStore();

    const handleSelectTemplate = (template: Template) => {
        // Navigate to the dynamic template loader route
        router.push(`/slides/${template.id}`);
    };

    return (
        <SidebarInset className="flex w-full flex-col overflow-y-auto bg-[#faf9f6] p-8">
            <div className="absolute top-4 left-4 z-50">
                <SidebarTrigger />
            </div>
            <div className="max-w-6xl mx-auto w-full">
                {/* Header */}
                <div className="mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 text-orange-600 font-bold text-sm tracking-widest uppercase mb-4"
                    >
                        <MagicWand weight="bold" />
                        Template Library
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-bold text-zinc-900 tracking-tight mb-4"
                    >
                        Start with a <span className="text-orange-600">Masterpiece</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-zinc-500 max-w-2xl"
                    >
                        Choose from our curated selection of high-performance templates.
                        Each one is fully customizable and optimized for modern presentations.
                    </motion.p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    {TEMPLATES.map((template, index) => (
                        <motion.div
                            key={template.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * index + 0.3 }}
                            className="group cursor-pointer"
                            onClick={() => handleSelectTemplate(template)}
                        >
                            <div className="relative aspect-16/10 rounded-3xl overflow-hidden border border-zinc-200 bg-white shadow-sm transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-orange-100 group-hover:-translate-y-2 group-hover:border-orange-200">
                                {/* Preview Image */}
                                <Image
                                    src={template.previewImage}
                                    alt={template.name}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />

                                {/* Overlay on hover */}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                                    <div className="bg-white text-zinc-900 px-6 py-3 rounded-full font-bold flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                        Use Template
                                        <ArrowRight weight="bold" />
                                    </div>
                                </div>

                                {/* Theme Indicators */}
                                <div className="absolute top-4 left-4 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div
                                        className="w-6 h-6 rounded-full border border-white/20"
                                        style={{ backgroundColor: template.theme.primaryColor }}
                                    />
                                    <div
                                        className="w-6 h-6 rounded-full border border-white/20"
                                        style={{ backgroundColor: template.theme.accentColor }}
                                    />
                                    <div
                                        className="w-6 h-6 rounded-full border border-white/20"
                                        style={{ backgroundColor: template.theme.backgroundColor }}
                                    />
                                </div>
                            </div>

                            <div className="mt-6 px-2">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-2xl font-bold text-zinc-900 transition-colors group-hover:text-orange-600">
                                        {template.name}
                                    </h3>
                                    <div className="flex items-center gap-4 text-zinc-400">
                                        <div className="flex items-center gap-1.5 text-sm font-medium">
                                            <Layout weight="bold" />
                                            {template.initialSlides.length} Slides
                                        </div>
                                    </div>
                                </div>
                                <p className="text-zinc-500 leading-relaxed">
                                    {template.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </SidebarInset>
    );
}
