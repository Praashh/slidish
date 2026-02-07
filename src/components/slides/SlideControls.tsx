"use client";

import { useSlidesStore } from "@/lib/slides-store";
import { CaretLeft, CaretRight, Play, Download } from "@phosphor-icons/react";

interface SlideControlsProps {
    onFullscreen?: () => void;
    onPresent?: () => void;
}

export function SlideControls({ onFullscreen, onPresent }: SlideControlsProps) {
    const {
        slides,
        currentSlideId,
        goToNextSlide,
        goToPrevSlide,
        getSlideIndex,
        setIsPresenting,
    } = useSlidesStore();

    const currentIndex = currentSlideId ? getSlideIndex(currentSlideId) : -1;
    const totalSlides = slides.length;

    const handlePresent = () => {
        setIsPresenting(true);
        onPresent?.();
        // Request fullscreen
        document.documentElement.requestFullscreen?.();
    };

    const handleDownloadPDF = () => {
        const url = new URL(window.location.href);
        url.searchParams.set("print-pdf", "");
        window.open(url.toString(), "_blank");
    };

    if (totalSlides === 0) return null;

    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 p-2 bg-white/80 border border-black/5 rounded-[20px] backdrop-blur-[20px] shadow-[0_10px_40px_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.02)] z-50 transition-all duration-300 ease-in-out">
            {/* Navigation */}
            <div className="flex items-center gap-1 px-2">
                <button
                    type="button"
                    className="flex items-center justify-center w-10 h-10 bg-transparent border-none rounded-xl text-[#71717a] cursor-pointer transition-all duration-200 hover:bg-[#f4f4f5] hover:text-[#18181b] disabled:opacity-30 disabled:cursor-not-allowed"
                    onClick={goToPrevSlide}
                    disabled={currentIndex <= 0}
                    title="Previous slide (←)"
                >
                    <CaretLeft weight="bold" size={20} />
                </button>

                <div className="flex items-center gap-1.5 text-[13px] text-[#a1a1aa] mx-3 font-medium tracking-wide">
                    <span className="text-[#f97316] font-bold">{currentIndex + 1}</span>
                    <span className="opacity-50">/</span>
                    <span className="opacity-80">{totalSlides}</span>
                </div>

                <button
                    type="button"
                    className="flex items-center justify-center w-10 h-10 bg-transparent border-none rounded-xl text-[#71717a] cursor-pointer transition-all duration-200 hover:bg-[#f4f4f5] hover:text-[#18181b] disabled:opacity-30 disabled:cursor-not-allowed"
                    onClick={goToNextSlide}
                    disabled={currentIndex >= totalSlides - 1}
                    title="Next slide (→)"
                >
                    <CaretRight weight="bold" size={20} />
                </button>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pl-2 border-l border-black/5">
                <button
                    type="button"
                    className="flex items-center justify-center w-10 h-10 bg-transparent border-none rounded-xl text-[#71717a] cursor-pointer transition-all duration-200 hover:bg-[#f4f4f5] hover:text-[#18181b] disabled:opacity-30 disabled:cursor-not-allowed"
                    onClick={handleDownloadPDF}
                    title="Download as PDF"
                >
                    <Download weight="bold" size={20} />
                </button>

                <button
                    type="button"
                    className="flex items-center justify-center w-auto h-11 px-5 bg-[#18181b] text-white border-none rounded-[14px] font-semibold flex items-center gap-2.5 shadow-[0_4px_12px_rgba(0,0,0,0.1)] cursor-pointer transition-all duration-200 hover:bg-[#27272a] hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(0,0,0,0.15)] disabled:opacity-30 disabled:cursor-not-allowed"
                    onClick={handlePresent}
                    title="Present (F11)"
                >
                    <Play weight="fill" size={18} className="text-[#f97316]" />
                    <span>Present</span>
                </button>
            </div>
        </div>
    );
}

export default SlideControls;
