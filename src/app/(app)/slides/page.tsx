"use client";

import { useCallback, useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import {
    SlideEditor,
    RevealCanvas,
    SlideControls,
    Slide,
} from "@/components/slides";
import { useSlidesStore } from "@/lib/slides-store";
import { parseJsonSlides, parseMarkdownToSlides } from "@/lib/slide-utils";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

function SlidesLoading() {
    return (
        <div className="w-screen h-screen flex items-center justify-center bg-[#fafafa]">
            <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 rounded-full border-2 border-zinc-200 border-t-zinc-800 animate-spin" />
                <p className="text-zinc-400 text-sm">Loading...</p>
            </div>
        </div>
    );
}

function SlidesPageInner() {
    const { setSlides, setIsGenerating, slides } = useSlidesStore();
    const { update } = useSession();
    const [showCreditsDialog, setShowCreditsDialog] = useState(false);
    const [hasHydrated, setHasHydrated] = useState(false);
    const searchParams = useSearchParams();
    const isPrintMode = searchParams.get("print-pdf") !== null;

    useEffect(() => {
        setHasHydrated(true);
    }, []);

    const handleGenerate = useCallback(
        async (options: { prompt: string; audience?: string; tone?: string; slideCount?: number }) => {
            setIsGenerating(true);

            try {
                const response = await fetch("/api/slides/generate", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(options),
                });

                const data = await response.json();

                if (!response.ok) {
                    if (response.status === 400 && data.error === "Insufficient credits") {
                        setShowCreditsDialog(true);
                        throw new Error("Insufficient credits");
                    }
                    throw new Error(data.error || "Failed to generate slides");
                }

                // New API returns structured JSON slides
                if (data.slides && Array.isArray(data.slides)) {
                    const parsedSlides = parseJsonSlides(data.slides);
                    if (parsedSlides.length > 0) {
                        setSlides(parsedSlides);
                        update();
                        toast.success(`Generated ${parsedSlides.length} slides`);
                    } else {
                        throw new Error("No slides could be parsed from the response");
                    }
                }
                // Fallback for markdown response
                else if (data.markdown && data.markdown.trim().length > 0) {
                    const parsedSlides = parseMarkdownToSlides(data.markdown);
                    if (parsedSlides.length > 0) {
                        setSlides(parsedSlides);
                        update();
                    } else {
                        throw new Error("No slides could be parsed from the response");
                    }
                } else {
                    throw new Error("Empty response from AI");
                }
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : "An error occurred";
                if (errorMessage !== "Insufficient credits") {
                    toast.error(errorMessage);
                }
            } finally {
                setIsGenerating(false);
            }
        },
        [setSlides, setIsGenerating, update],
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
            const timer = setTimeout(() => {
                window.print();
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [isPrintMode, slides.length, hasHydrated]);

    if (!hasHydrated) {
        return <SlidesLoading />;
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
        <SidebarInset className="flex w-full flex-row overflow-hidden bg-[#f5f5f5] rounded-none">
            {/* Canvas Area */}
            <main className="relative flex-1 bg-[#f5f5f5]">
                <div className="absolute top-4 left-4 z-50">
                    <SidebarTrigger />
                </div>
                <RevealCanvas />

                {/* Floating Controls */}
                {slides.length > 0 && <SlideControls />}
            </main>

            {/* Editor Panel */}
            <SlideEditor onGenerate={handleGenerate} />

            {/* Credits Dialog */}
            <Dialog open={showCreditsDialog} onOpenChange={setShowCreditsDialog}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Out of Credits</DialogTitle>
                        <DialogDescription className="pt-2">
                            You've used all your generation credits. Purchase more to continue creating presentations.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="pt-2 space-y-3">
                        <div className="flex items-center justify-between p-3 bg-zinc-50 rounded-lg border border-zinc-200">
                            <div>
                                <p className="text-sm font-medium text-zinc-900">20 Credits</p>
                                <p className="text-xs text-zinc-500">1 credit per generation</p>
                            </div>
                            <span className="text-lg font-bold text-zinc-900">$5</span>
                        </div>
                        <p className="text-xs text-zinc-500">
                            After purchase, email <a href="mailto:hello.praash@gmail.com" className="underline">hello.praash@gmail.com</a> for activation.
                        </p>
                        <Button className="w-full" onClick={() => setShowCreditsDialog(false)}>
                            Got it
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
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
