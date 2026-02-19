"use client";

import { useCallback, useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import {
    SlideEditor,
    RevealCanvas,
    SlideControls,
    Slide,
} from "@/components/slides";
import { useSlidesStore } from "@/lib/slides-store";
import { parseMarkdownToSlides } from "@/lib/slide-utils";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import BuyMeCoffee from "@/components/buy-me-coffee";

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
    const [showSponsorDialog, setShowSponsorDialog] = useState(false);
    const [hasHydrated, setHasHydrated] = useState(false);
    const searchParams = useSearchParams();
    const isPrintMode = searchParams.get("print-pdf") !== null;

    useEffect(() => {
        setHasHydrated(true);
    }, []);

    const handleGenerate = useCallback(
        async (prompt: string) => {
            setIsGenerating(true);

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
                    if (
                        response.status === 400 &&
                        data.error === "Insufficient credits"
                    ) {
                        setShowSponsorDialog(true);
                        throw new Error("Insufficient credits");
                    }
                    throw new Error(data.error || "Failed to generate slides");
                }

                console.log(
                    "[Slides] Received markdown:",
                    data.markdown?.substring(0, 200),
                );

                // Parse the complete markdown into slides
                if (data.markdown && data.markdown.trim().length > 0) {
                    const parsedSlides = parseMarkdownToSlides(data.markdown);
                    console.log("[Slides] Parsed slides:", parsedSlides.length);

                    if (parsedSlides.length > 0) {
                        setSlides(parsedSlides);
                    } else {
                        throw new Error("No slides could be parsed from the response");
                    }
                } else {
                    throw new Error("Empty response from AI");
                }
            } catch (err) {
                console.error("Failed to generate slides:", err);
                const errorMessage =
                    err instanceof Error ? err.message : "An error occurred";
                toast.error(errorMessage);
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
                    <p className="text-zinc-400 text-sm font-medium">
                        Preparing slides...
                    </p>
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
            </main>

            {/* Editor Panel */}
            <SlideEditor onGenerate={handleGenerate} />

            <Dialog open={showSponsorDialog} onOpenChange={setShowSponsorDialog}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Insufficient Credits</DialogTitle>
                        <DialogDescription>
                            Please support us by buying a coffee to get more credits!
                            <p className="text-red-800 text-sm mt-2">Note: This is a paid feature. in $5 you will get 20 credits. and
                                each slide generation costs 1 credit. After sponsor mail at{" "}
                                <a href="mailto:hello.praash@gmail.com">hello.praash@gmail.com</a>
                            </p>
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-center py-4">
                        <BuyMeCoffee classname="w-full max-w-sm m-0 p-4 h-auto" />
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
