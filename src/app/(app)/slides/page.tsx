"use client";

import { useCallback, useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { SlideEditor, RevealCanvas, SlideControls, Slide } from "@/components/slides";
import { useSlidesStore } from "@/lib/slides-store";
import { parseMarkdownToSlides } from "@/lib/slide-utils";

function SlidesLoading() {
    return (
        <div className="w-screen h-screen flex items-center justify-center bg-[#faf9f6]">
            <div className="animate-pulse flex flex-col items-center gap-4">
                <div className="w-12 h-12 rounded-full border-4 border-orange-200 border-t-orange-500 animate-spin" />
                <p className="text-zinc-400 text-sm font-medium">Preparing slides...</p>
            </div>
        </div>
    );
}

function SlidesPageInner() {
    const { setSlides, setIsGenerating, slides } = useSlidesStore();
    const [error, setError] = useState<string | null>(null);
    const [hasHydrated, setHasHydrated] = useState(false);
    const searchParams = useSearchParams();
    const isPrintMode = searchParams.get("print-pdf") !== null;

    useEffect(() => {
        setHasHydrated(true);
    }, []);

    const handleGenerate = useCallback(
        async (prompt: string) => {
            setIsGenerating(true);
            setError(null);

            try {
                console.log("[Slides] Generating with prompt:", prompt);

                const response = await fetch("/api/slides/generate", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ prompt }),
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || "Failed to generate slides");
                }

                console.log("[Slides] Received markdown:", data.markdown?.substring(0, 200));

                // Parse the complete markdown into slides
                if (data.markdown && data.markdown.trim().length > 0) {
                    const parsedSlides = parseMarkdownToSlides(data.markdown);
                    console.log("[Slides] Parsed slides:", parsedSlides.length);

                    if (parsedSlides.length > 0) {
                        setSlides(parsedSlides);
                    } else {
                        setError("No slides could be parsed from the response");
                    }
                } else {
                    setError("Empty response from AI");
                }
            } catch (err) {
                console.error("Failed to generate slides:", err);
                setError(err instanceof Error ? err.message : "An error occurred");
            } finally {
                setIsGenerating(false);
            }
        },
        [setSlides, setIsGenerating],
    );

    useEffect(() => {
        if (isPrintMode) {
            document.documentElement.classList.add("print-pdf");
            document.body.classList.add("print-pdf");
            return () => {
                document.documentElement.classList.remove("print-pdf");
                document.body.classList.remove("print-pdf");
            };
        }
    }, [isPrintMode]);

    useEffect(() => {
        if (isPrintMode && slides.length > 0 && hasHydrated) {
            // Give a moment for styles to apply
            const timer = setTimeout(() => {
                window.print();
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [isPrintMode, slides.length, hasHydrated]);

    if (!hasHydrated) {
        return (
            <div className="w-screen h-screen flex items-center justify-center bg-[#faf9f6]">
                <div className="animate-pulse flex flex-col items-center gap-4">
                    <div className="w-12 h-12 rounded-full border-4 border-orange-200 border-t-orange-500 animate-spin" />
                    <p className="text-zinc-400 text-sm font-medium">Preparing slides...</p>
                </div>
            </div>
        );
    }

    if (isPrintMode) {
        return (
            <div className="print-container">
                {slides.map((slide, index) => (
                    <Slide
                        key={slide.id}
                        data={slide}
                        id={slide.id}
                        index={index}
                        totalSlides={slides.length}
                    />
                ))}
            </div>
        );
    }

    return (
        <SidebarInset className="flex w-full flex-row overflow-hidden bg-[#faf9f6] rounded-none">
            {/* Canvas Area */}
            <main className="relative flex-1 bg-linear-to-b from-[#faf9f6] to-[#f5f4ef] bg-[radial-gradient(circle_at_20%_80%,rgba(217,119,6,0.03)_0%,transparent_40%),radial-gradient(circle_at_80%_20%,rgba(217,119,6,0.03)_0%,transparent_40%)]">
                <div className="absolute top-4 left-4 z-50">
                    <SidebarTrigger />
                </div>
                <RevealCanvas />

                {/* Floating Controls */}
                {slides.length > 0 && <SlideControls />}

                {/* Error display */}
                {error && (
                    <div className="slides-page__error fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-red-100 bg-white p-4 shadow-xl">
                        <span className="text-sm font-medium text-red-600">⚠️ {error}</span>
                        <button
                            type="button"
                            onClick={() => setError(null)}
                            className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-red-50 text-red-400"
                            aria-label="Dismiss error"
                        >
                            ✕
                        </button>
                    </div>
                )}
            </main>

            {/* Editor Panel */}
            <SlideEditor onGenerate={handleGenerate} />
        </SidebarInset>
    );
}

export default function SlidesPage() {
    return (
        <Suspense fallback={<SlidesLoading />}>
            <SlidesPageInner />
        </Suspense>
    );
}

