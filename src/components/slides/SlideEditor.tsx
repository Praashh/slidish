"use client";

import { useState, useCallback, useMemo, memo, type ComponentType } from "react";
import {
    MagicWand,
    PencilSimple,
    Plus,
    Trash,
    ArrowsLeftRight,
    TextT,
    Layout as LayoutIcon,
    Quotes,
    Code,
    Image as ImageIcon,
    Selection,
    Sparkle,
    type IconProps
} from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";
import { useSlidesStore } from "@/lib/slides-store";
import { createSlide } from "@/lib/slide-utils";
import type { SlideTemplate } from "@/types/slide-types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const TEMPLATES: readonly { value: SlideTemplate; label: string; icon: ComponentType<IconProps> }[] = [
    { value: "title", label: "Title", icon: TextT },
    { value: "content", label: "Content", icon: LayoutIcon },
    { value: "two-column", label: "Two Column", icon: ArrowsLeftRight },
    { value: "image", label: "Image", icon: ImageIcon },
    { value: "quote", label: "Quote", icon: Quotes },
    { value: "code", label: "Code", icon: Code },
    { value: "blank", label: "Blank", icon: Selection },
] as const;

interface SlideEditorProps {
    readonly onGenerate?: (prompt: string) => Promise<void>;
}

function SlideEditorInner({ onGenerate }: SlideEditorProps) {
    const {
        slides,
        currentSlideId,
        presentationTitle,
        isGenerating,
        updateSlide,
        addSlide,
        removeSlide,
        setCurrentSlide,
        setPresentationTitle,
    } = useSlidesStore();

    const [prompt, setPrompt] = useState("");
    const [activeTab, setActiveTab] = useState<"generate" | "edit">("generate");

    const currentSlide = useMemo(
        () => slides.find((s) => s.id === currentSlideId),
        [slides, currentSlideId]
    );
    const currentIndex = useMemo(
        () => slides.findIndex((s) => s.id === currentSlideId),
        [slides, currentSlideId]
    );

    const handleGenerate = useCallback(async () => {
        if (!prompt.trim() || !onGenerate) return;
        await onGenerate(prompt.trim());
        setPrompt("");
        setActiveTab("edit");
    }, [prompt, onGenerate]);

    const handleAddSlide = useCallback(() => {
        const newSlide = createSlide({
            template: "content",
            title: "New Slide",
            content: "Add your content here...",
        });
        addSlide(newSlide, currentSlideId || undefined);
        setCurrentSlide(newSlide.id);
    }, [addSlide, currentSlideId, setCurrentSlide]);

    const handleDeleteSlide = useCallback(() => {
        if (currentSlideId && slides.length > 1) {
            removeSlide(currentSlideId);
        }
    }, [currentSlideId, removeSlide, slides.length]);

    const handleTemplateChange = useCallback(
        (template: SlideTemplate) => {
            if (currentSlideId) {
                updateSlide(currentSlideId, { template });
            }
        },
        [currentSlideId, updateSlide],
    );

    return (
        <aside className="flex flex-col w-[380px] bg-white border-l border-zinc-100 shadow-[-20px_0_50px_rgba(0,0,0,0.02)] z-10">
            <div className="p-6 pb-4">
                <Input
                    type="text"
                    className="p-0 h-auto text-xl font-bold text-zinc-900 border-none shadow-none focus-visible:ring-0 placeholder:text-zinc-300"
                    value={presentationTitle}
                    onChange={(e) => setPresentationTitle(e.target.value)}
                    placeholder="Presentation Title"
                />
            </div>

            <div className="px-6 flex gap-1 mb-6">
                {[
                    { id: "generate", label: "Generate", icon: MagicWand },
                    { id: "edit", label: "Edit content", icon: PencilSimple },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`relative flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors rounded-full ${activeTab === tab.id ? "text-orange-700" : "text-zinc-500 hover:text-zinc-800"
                            }`}
                    >
                        {activeTab === tab.id && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute inset-0 bg-orange-50 rounded-full"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                        <tab.icon weight={activeTab === tab.id ? "fill" : "bold"} size={16} className="relative z-10" />
                        <span className="relative z-10">{tab.label}</span>
                    </button>
                ))}
            </div>

            <Separator className="bg-zinc-50" />

            <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0">
                <AnimatePresence mode="wait">
                    {activeTab === "generate" ? (
                        <motion.div
                            key="generate"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="p-6 space-y-6"
                        >
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-semibold text-zinc-900">Magical Generation</h3>
                                    <Sparkle weight="fill" className="text-orange-400" />
                                </div>
                                <Textarea
                                    className="min-h-[160px] bg-[#fafafa] border-zinc-100 focus:border-orange-200 focus:ring-orange-100 rounded-2xl p-4 text-sm leading-relaxed resize-none shadow-inner"
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    placeholder="e.g. A 5-slide presentation about the future of AI in modern business..."
                                />
                                <Button
                                    className="w-full h-12 bg-zinc-900 hover:bg-zinc-800 text-white rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-zinc-200"
                                    onClick={handleGenerate}
                                    disabled={isGenerating || !prompt.trim()}
                                >
                                    {isGenerating ? (
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                                    ) : (
                                        <MagicWand weight="fill" size={18} />
                                    )}
                                    {isGenerating ? "Generating..." : "Generate Presentation"}
                                </Button>
                            </div>

                            <div className="p-4 bg-zinc-50 rounded-2xl space-y-3 border border-zinc-100">
                                <h4 className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Expert Tips</h4>
                                <ul className="space-y-2 text-xs text-zinc-600">
                                    <li className="flex gap-2">
                                        <div className="w-1 h-1 rounded-full bg-orange-400 mt-1.5 shrink-0" />
                                        <span>Be specific about the tone and target audience</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <div className="w-1 h-1 rounded-full bg-orange-400 mt-1.5 shrink-0" />
                                        <span>Mention key data points or case studies</span>
                                    </li>
                                </ul>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="edit"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className="p-6 space-y-8"
                        >
                            {currentSlide ? (
                                <>
                                    <div className="flex items-center justify-between">
                                        <Badge variant="secondary" className="bg-zinc-100 text-zinc-500 rounded-full px-3 py-1 font-medium border-none">
                                            Slide {currentIndex + 1} of {slides.length}
                                        </Badge>
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="icon" className="w-8 h-8 rounded-full border-zinc-100 hover:bg-zinc-50" onClick={handleAddSlide}>
                                                <Plus weight="bold" size={14} />
                                            </Button>
                                            <Button variant="outline" size="icon" className="w-8 h-8 rounded-full border-zinc-100 hover:bg-zinc-50 text-red-500" onClick={handleDeleteSlide} disabled={slides.length <= 1}>
                                                <Trash weight="bold" size={14} />
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Visual Layout</h3>
                                        <div className="grid grid-cols-4 gap-2">
                                            {TEMPLATES.map((t) => (
                                                <button
                                                    key={t.value}
                                                    onClick={() => handleTemplateChange(t.value)}
                                                    className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all border ${currentSlide.template === t.value
                                                        ? "bg-white border-orange-200 shadow-md shadow-orange-50 ring-2 ring-orange-50"
                                                        : "bg-white border-zinc-100 hover:border-zinc-200 text-zinc-400 hover:text-zinc-600"
                                                        }`}
                                                >
                                                    <t.icon weight={currentSlide.template === t.value ? "fill" : "regular"} size={18} className={currentSlide.template === t.value ? "text-orange-600" : ""} />
                                                    <span className="text-[10px] font-medium">{t.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Slide Headline</label>
                                            <Input
                                                className="bg-white border-zinc-100 rounded-xl focus:ring-orange-50 focus:border-orange-100"
                                                value={currentSlide.title || ""}
                                                onChange={(e) => updateSlide(currentSlide.id, { title: e.target.value })}
                                                placeholder="Enter headline..."
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Body Details / Markdown</label>
                                            <Textarea
                                                className="min-h-[240px] bg-white border-zinc-100 rounded-xl p-4 text-sm leading-relaxed focus:ring-orange-50 focus:border-orange-100 resize-none"
                                                value={currentSlide.content}
                                                onChange={(e) => updateSlide(currentSlide.id, { content: e.target.value })}
                                                placeholder="Write your content here..."
                                            />
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-20 space-y-4">
                                    <div className="text-4xl">🎨</div>
                                    <p className="text-sm text-zinc-500">Your canvas is empty.</p>
                                    <Button variant="outline" className="rounded-full" onClick={() => setActiveTab("generate")}>
                                        Generate something
                                    </Button>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="h-40 border-t border-zinc-100 bg-zinc-50/50 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Timeline</h3>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide no-scrollbar">
                    {slides.map((slide, index) => (
                        <button
                            key={slide.id}
                            onClick={() => setCurrentSlide(slide.id)}
                            className={`shrink-0 w-24 aspect-[16/10] rounded-lg border-2 transition-all flex flex-col items-center justify-center p-2 relative ${slide.id === currentSlideId
                                ? "bg-white border-orange-400 shadow-md shadow-orange-50"
                                : "bg-white/50 border-zinc-100 hover:border-zinc-200"
                                }`}
                        >
                            <span className="absolute top-1 left-1.5 text-[10px] font-bold text-zinc-300">#{index + 1}</span>
                            <span className="text-[9px] font-medium text-zinc-500 text-center line-clamp-2 px-1">
                                {slide.title || "Empty"}
                            </span>
                        </button>
                    ))}
                    <button
                        onClick={handleAddSlide}
                        className="shrink-0 w-24 aspect-[16/10] rounded-lg border-2 border-dashed border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 flex items-center justify-center transition-all"
                    >
                        <Plus size={16} className="text-zinc-300" />
                    </button>
                </div>
            </div>
        </aside>
    );
}

export const SlideEditor = memo(SlideEditorInner);
export default SlideEditor;
