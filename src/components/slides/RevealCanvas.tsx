import { useEffect, useRef, memo } from "react";
import Reveal from "reveal.js";
import "reveal.js/dist/reveal.css";
import "reveal.js/dist/theme/white.css";
import { Slide } from "./Slide";
import { useSlidesStore } from "@/lib/slides-store";
import { cn } from "@/lib/utils";
import type { SlideData } from "@/types/slide-types";

interface RevealCanvasProps {
    readonly className?: string;
}

const SlideSection = memo(function SlideSection({
    slide,
    index,
    totalSlides,
}: {
    slide: SlideData;
    index: number;
    totalSlides: number;
}) {
    return (
        <section
            key={slide.id}
            data-transition={slide.template === "title" ? "fade" : "slide"}
        >
            <Slide
                data={slide}
                id={slide.id}
                index={index}
                totalSlides={totalSlides}
            />
        </section>
    );
});

function RevealCanvasInner({ className = "" }: RevealCanvasProps) {
    const deckRef = useRef<HTMLDivElement>(null);
    const revealRef = useRef<Reveal.Api | null>(null);
    const isInitializing = useRef(false);
    const { slides, currentSlideId, setCurrentSlide } = useSlidesStore();

    const isPrintMode = typeof window !== "undefined" && window.location.search.includes("print-pdf");

    useEffect(() => {
        if (!deckRef.current || revealRef.current || isInitializing.current || slides.length === 0) return;

        isInitializing.current = true;

        const deck = new Reveal(deckRef.current, {
            hash: false,
            history: false,
            controls: false,
            progress: false,
            center: true,
            embedded: !isPrintMode,
            touch: true,
            help: false,
            transition: "slide",
            backgroundTransition: "fade",
            width: 1920,
            height: 1080,
            margin: 0,
            minScale: 0.1,
            maxScale: 1.0,
            pdfMaxPagesPerSlide: 1,
            pdfSeparateFragments: false,
            pdfPageHeightOffset: -1,
        });

        deck.initialize().then(() => {
            revealRef.current = deck;
            isInitializing.current = false;

            if (currentSlideId) {
                const index = slides.findIndex((s) => s.id === currentSlideId);
                if (index !== -1) {
                    deck.slide(index);
                }
            }

            deck.on("slidechanged", (event: any) => {
                const currentSlide = slides[event.indexh];
                if (currentSlide && currentSlide.id !== currentSlideId) {
                    setCurrentSlide(currentSlide.id);
                }
            });
        }).catch(err => {
            console.error("[RevealCanvas] Failed to initialize:", err);
            isInitializing.current = false;
        });

        return () => {
            if (revealRef.current) {
                revealRef.current = null;
            }
        };
    }, [slides.length > 0]);

    useEffect(() => {
        if (revealRef.current && currentSlideId) {
            const index = slides.findIndex((s) => s.id === currentSlideId);
            const currentIndices = revealRef.current.getIndices();
            if (index !== -1 && index !== currentIndices.h) {
                revealRef.current.slide(index);
            }
        }
    }, [currentSlideId, slides]);

    useEffect(() => {
        if (revealRef.current) {
            revealRef.current.sync();
        }
    }, [slides]);

    useEffect(() => {
        if (isPrintMode) {
            document.body.classList.add("print-pdf");
            return () => {
                document.body.classList.remove("print-pdf");
            };
        }
    }, [isPrintMode]);

    return (
        <div className={cn(
            "reveal-canvas w-full h-full relative overflow-hidden bg-[#faf9f6]",
            isPrintMode && "print-mode",
            className
        )}>
            <div className="reveal w-full h-full" ref={deckRef}>
                <div className="slides">
                    {slides.map((slide, index) => (
                        <SlideSection
                            key={slide.id}
                            slide={slide}
                            index={index}
                            totalSlides={slides.length}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export const RevealCanvas = memo(RevealCanvasInner);
export default RevealCanvas;
