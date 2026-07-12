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
    type IconProps,
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
import { cn } from "@/lib/utils";

const TEMPLATES: readonly { value: SlideTemplate; label: string; icon: ComponentType<IconProps> }[] = [
    { value: "title", label: "Title", icon: TextT },
    { value: "content", label: "Content", icon: LayoutIcon },
    { value: "two-column", label: "Columns", icon: ArrowsLeftRight },
    { value: "image", label: "Image", icon: ImageIcon },
    { value: "quote", label: "Quote", icon: Quotes },
    { value: "code", label: "Code", icon: Code },
    { value: "blank", label: "Blank", icon: Selection },
] as const;

const AUDIENCES = ["General", "Executives", "Developers", "Students", "Investors"] as const;
const TONES = ["Professional", "Casual", "Inspirational", "Technical", "Persuasive"] as const;

const THEME_PRESETS = [
    { name: "Clean", bg: "#ffffff", text: "#1e293b", primary: "#6366f1", secondary: "#8b5cf6" },
    { name: "Dark", bg: "#0f172a", text: "#f8fafc", primary: "#818cf8", secondary: "#a78bfa" },
    { name: "Navy", bg: "#1e3a5f", text: "#f0f9ff", primary: "#38bdf8", secondary: "#7dd3fc" },
    { name: "Warm", bg: "#fffbeb", text: "#451a03", primary: "#f59e0b", secondary: "#d97706" },
    { name: "Forest", bg: "#022c22", text: "#ecfdf5", primary: "#34d399", secondary: "#6ee7b7" },
    { name: "Rose", bg: "#fff1f2", text: "#4c0519", primary: "#f43f5e", secondary: "#fb7185" },
] as const;

interface GenerateOptions {
    prompt: string;
    audience?: string;
    tone?: string;
    slideCount?: number;
}

interface SlideEditorProps {
    readonly onGenerate?: (options: GenerateOptions) => Promise<void>;
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
        setTheme,
    } = useSlidesStore();

    const [prompt, setPrompt] = useState("");
    const [audience, setAudience] = useState<string>("");
    const [tone, setTone] = useState<string>("");
    const [slideCount, setSlideCount] = useState<number>(7);
    const [activeTab, setActiveTab] = useState<"generate" | "edit">(
        slides.length > 0 ? "edit" : "generate"
    );

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
        await onGenerate({
            prompt: prompt.trim(),
            audience: audience || undefined,
            tone: tone || undefined,
            slideCount,
        });
        setActiveTab("edit");
    }, [prompt, audience, tone, slideCount, onGenerate]);

    const handleAddSlide = useCallback(() => {
        const newSlide = createSlide({
            template: "content",
            title: "New Slide",
            content: "- Add your content here",
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
        <aside className="flex flex-col w-[400px] bg-white border-l border-zinc-200/60 z-10">
            {/* Header */}
            <div className="p-5 pb-3">
                <Input
                    type="text"
                    className="p-0 h-auto text-lg font-bold text-zinc-900 border-none shadow-none focus-visible:ring-0 placeholder:text-zinc-300"
                    value={presentationTitle}
                    required={true}
                    onChange={(e) => setPresentationTitle(e.target.value)}
                    placeholder="Presentation Title"
                />
            </div>

            {/* Tabs */}
            <div className="px-5 flex gap-1 mb-4">
                {[
                    { id: "generate" as const, label: "Generate", icon: MagicWand },
                    { id: "edit" as const, label: "Edit", icon: PencilSimple },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`relative flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors rounded-full ${activeTab === tab.id ? "text-zinc-900" : "text-zinc-400 hover:text-zinc-600"}`}
                    >
                        {activeTab === tab.id && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute inset-0 bg-zinc-100 rounded-full"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                            />
                        )}
                        <tab.icon weight={activeTab === tab.id ? "fill" : "bold"} size={15} className="relative z-10" />
                        <span className="relative z-10">{tab.label}</span>
                    </button>
                ))}
            </div>

            <Separator className="bg-zinc-100" />

            {/* Content */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0">
                <AnimatePresence mode="wait">
                    {activeTab === "generate" ? (
                        <motion.div
                            key="generate"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.2 }}
                            className="p-5 space-y-5"
                        >
                            {/* Prompt */}
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">What's your presentation about?</label>
                                <Textarea
                                    className="min-h-[120px] bg-zinc-50 border-zinc-200 focus:border-zinc-400 focus:ring-zinc-200 rounded-xl p-4 text-sm leading-relaxed resize-none"
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    placeholder="e.g. A pitch deck for our AI-powered analytics SaaS product targeting enterprise companies..."
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && e.metaKey) handleGenerate();
                                    }}
                                />
                            </div>

                            {/* Context options */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Audience</label>
                                    <select
                                        value={audience}
                                        onChange={(e) => setAudience(e.target.value)}
                                        className="w-full h-9 px-3 text-sm bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-200 appearance-none"
                                    >
                                        <option value="">Auto</option>
                                        {AUDIENCES.map((a) => <option key={a} value={a}>{a}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Tone</label>
                                    <select
                                        value={tone}
                                        onChange={(e) => setTone(e.target.value)}
                                        className="w-full h-9 px-3 text-sm bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-200 appearance-none"
                                    >
                                        <option value="">Auto</option>
                                        {TONES.map((t) => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                </div>
                            </div>

                            {/* Slide count */}
                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Slides</label>
                                    <span className="text-xs text-zinc-500 font-medium">{slideCount}</span>
                                </div>
                                <input
                                    type="range"
                                    min={4}
                                    max={15}
                                    value={slideCount}
                                    onChange={(e) => setSlideCount(Number(e.target.value))}
                                    className="w-full h-1.5 bg-zinc-200 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-zinc-800 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
                                />
                            </div>

                            {/* Generate button */}
                            <Button
                                className="w-full h-11 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl font-semibold flex items-center gap-2 shadow-sm"
                                onClick={handleGenerate}
                                disabled={isGenerating || !prompt.trim()}
                            >
                                {isGenerating ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white" />
                                ) : (
                                    <Sparkle weight="fill" size={16} />
                                )}
                                {isGenerating ? "Generating..." : "Generate Slides"}
                            </Button>

                            {/* Tips */}
                            <div className="p-3.5 bg-zinc-50 rounded-xl space-y-2 border border-zinc-100">
                                <h4 className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Tips for better results</h4>
                                <ul className="space-y-1.5 text-xs text-zinc-500 leading-relaxed">
                                    <li>Be specific about your topic and key points</li>
                                    <li>Mention data, examples, or case studies to include</li>
                                    <li>Describe the desired outcome (inform, persuade, teach)</li>
                                </ul>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="edit"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.2 }}
                            className="p-5 space-y-6"
                        >
                            {currentSlide ? (
                                <>
                                    {/* Slide counter + actions */}
                                    <div className="flex items-center justify-between">
                                        <Badge variant="secondary" className="bg-zinc-100 text-zinc-600 rounded-md px-2.5 py-1 font-medium text-xs border-none">
                                            Slide {currentIndex + 1} / {slides.length}
                                        </Badge>
                                        <div className="flex gap-1.5">
                                            <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg text-zinc-400 hover:text-zinc-700" onClick={handleAddSlide} title="Add slide">
                                                <Plus weight="bold" size={14} />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg text-zinc-400 hover:text-red-500" onClick={handleDeleteSlide} disabled={slides.length <= 1} title="Delete slide">
                                                <Trash weight="bold" size={14} />
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Template picker */}
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Layout</label>
                                        <div className="grid grid-cols-4 gap-1.5">
                                            {TEMPLATES.map((t) => (
                                                <button
                                                    key={t.value}
                                                    onClick={() => handleTemplateChange(t.value)}
                                                    className={cn(
                                                        "flex flex-col items-center gap-1.5 p-2.5 rounded-lg transition-all text-xs font-medium",
                                                        currentSlide.template === t.value
                                                            ? "bg-zinc-900 text-white shadow-sm"
                                                            : "bg-zinc-50 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700"
                                                    )}
                                                >
                                                    <t.icon weight={currentSlide.template === t.value ? "fill" : "regular"} size={16} />
                                                    <span className="text-[10px]">{t.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Theme picker */}
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Theme</label>
                                        <div className="grid grid-cols-6 gap-1.5">
                                            {THEME_PRESETS.map((preset) => (
                                                <button
                                                    key={preset.name}
                                                    onClick={() => setTheme({
                                                        backgroundColor: preset.bg,
                                                        textColor: preset.text,
                                                        primaryColor: preset.primary,
                                                        secondaryColor: preset.secondary,
                                                    })}
                                                    className="flex flex-col items-center gap-1 p-1.5 rounded-lg hover:bg-zinc-50 transition-all"
                                                    title={preset.name}
                                                >
                                                    <div
                                                        className="w-8 h-8 rounded-md border border-zinc-200 shadow-sm relative overflow-hidden"
                                                        style={{ background: preset.bg }}
                                                    >
                                                        <div
                                                            className="absolute bottom-0 left-0 right-0 h-[40%] rounded-t-sm"
                                                            style={{ background: preset.primary }}
                                                        />
                                                    </div>
                                                    <span className="text-[9px] text-zinc-400 font-medium">{preset.name}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Editable fields */}
                                    <div className="space-y-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Headline</label>
                                            <Input
                                                className="bg-zinc-50 border-zinc-200 rounded-lg focus:ring-zinc-200 focus:border-zinc-400 text-sm"
                                                value={currentSlide.title || ""}
                                                onChange={(e) => updateSlide(currentSlide.id, { title: e.target.value })}
                                                placeholder="Slide headline..."
                                            />
                                        </div>

                                        {currentSlide.template === "title" && (
                                            <div className="space-y-1.5">
                                                <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Subtitle</label>
                                                <Input
                                                    className="bg-zinc-50 border-zinc-200 rounded-lg focus:ring-zinc-200 focus:border-zinc-400 text-sm"
                                                    value={currentSlide.subtitle || ""}
                                                    onChange={(e) => updateSlide(currentSlide.id, { subtitle: e.target.value })}
                                                    placeholder="Optional subtitle..."
                                                />
                                            </div>
                                        )}

                                        {currentSlide.template === "quote" && (
                                            <div className="space-y-1.5">
                                                <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Attribution</label>
                                                <Input
                                                    className="bg-zinc-50 border-zinc-200 rounded-lg focus:ring-zinc-200 focus:border-zinc-400 text-sm"
                                                    value={currentSlide.author || ""}
                                                    onChange={(e) => updateSlide(currentSlide.id, { author: e.target.value })}
                                                    placeholder="Quote author..."
                                                />
                                            </div>
                                        )}

                                        <div className="space-y-1.5">
                                            <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Content (Markdown)</label>
                                            <Textarea
                                                className="min-h-[200px] bg-zinc-50 border-zinc-200 rounded-lg p-3.5 text-sm leading-relaxed focus:ring-zinc-200 focus:border-zinc-400 resize-none font-mono text-[13px]"
                                                value={currentSlide.content}
                                                onChange={(e) => updateSlide(currentSlide.id, { content: e.target.value })}
                                                placeholder="Write your content here..."
                                            />
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-16 space-y-3">
                                    <p className="text-sm text-zinc-400">No slides yet</p>
                                    <Button variant="outline" size="sm" className="rounded-lg" onClick={() => setActiveTab("generate")}>
                                        Generate slides
                                    </Button>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Timeline */}
            {slides.length > 0 && (
                <div className="border-t border-zinc-100 bg-zinc-50/50 p-4">
                    <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                        {slides.map((slide, index) => (
                            <button
                                key={slide.id}
                                onClick={() => setCurrentSlide(slide.id)}
                                className={cn(
                                    "shrink-0 w-20 aspect-video rounded-md border-2 transition-all flex flex-col items-center justify-center p-1.5 relative",
                                    slide.id === currentSlideId
                                        ? "border-zinc-900 bg-white shadow-sm"
                                        : "border-zinc-200 bg-white/60 hover:border-zinc-300"
                                )}
                            >
                                <span className="absolute top-0.5 left-1 text-[9px] font-bold text-zinc-300">{index + 1}</span>
                                <span className="text-[8px] font-medium text-zinc-500 text-center line-clamp-2 leading-tight">
                                    {slide.title || "Empty"}
                                </span>
                            </button>
                        ))}
                        <button
                            onClick={handleAddSlide}
                            className="shrink-0 w-20 aspect-video rounded-md border-2 border-dashed border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 flex items-center justify-center transition-all"
                        >
                            <Plus size={14} className="text-zinc-300" />
                        </button>
                    </div>
                </div>
            )}
        </aside>
    );
}

export const SlideEditor = memo(SlideEditorInner);
export default SlideEditor;
