import { create } from "zustand";
import { subscribeWithSelector, persist } from "zustand/middleware";
import type {
    SlideData,
    PresentationTheme,
} from "@/types/slide-types";

interface SlidesState {
    slides: SlideData[];
    currentSlideId: string | null;
    presentationTitle: string;
    theme: PresentationTheme;
    isPresenting: boolean;
    isGenerating: boolean;

    setSlides: (slides: SlideData[]) => void;
    addSlide: (slide: SlideData, afterId?: string) => void;
    removeSlide: (id: string) => void;
    updateSlide: (id: string, updates: Partial<SlideData>) => void;
    reorderSlides: (fromIndex: number, toIndex: number) => void;
    setCurrentSlide: (id: string | null) => void;
    setTheme: (theme: Partial<PresentationTheme>) => void;
    setPresentationTitle: (title: string) => void;
    setIsPresenting: (isPresenting: boolean) => void;
    setIsGenerating: (isGenerating: boolean) => void;

    goToNextSlide: () => void;
    goToPrevSlide: () => void;
    getCurrentSlide: () => SlideData | undefined;
    getSlideIndex: (id: string) => number;
}

const buildNavigation = (slides: SlideData[]): SlideData[] => {
    return slides.map((slide, index) => ({
        ...slide,
        navigation: {
            left: index > 0 ? slides[index - 1].id : undefined,
            right: index < slides.length - 1 ? slides[index + 1].id : undefined,
        },
    }));
};

export const useSlidesStore = create<SlidesState>()(
    persist(
        subscribeWithSelector((set, get) => ({
            slides: [],
            currentSlideId: null,
            presentationTitle: "Untitled Presentation",
            theme: {
                primaryColor: "#6366f1",
                secondaryColor: "#8b5cf6",
                backgroundColor: "#0f0f1a",
                textColor: "#f8fafc",
                accentColor: "#22d3ee",
                fontFamily: "'Inter', sans-serif",
                headingFont: "'Space Grotesk', sans-serif",
            },
            isPresenting: false,
            isGenerating: false,

            setSlides: (slides) => {
                const withNavigation = buildNavigation(slides);
                set({
                    slides: withNavigation,
                    currentSlideId: withNavigation[0]?.id || null,
                });
            },

            addSlide: (slide, afterId) => {
                set((state) => {
                    const newSlides = [...state.slides];
                    if (afterId) {
                        const afterIndex = newSlides.findIndex((s) => s.id === afterId);
                        newSlides.splice(afterIndex + 1, 0, slide);
                    } else {
                        newSlides.push(slide);
                    }
                    return { slides: buildNavigation(newSlides) };
                });
            },

            removeSlide: (id) => {
                set((state) => {
                    const newSlides = state.slides.filter((s) => s.id !== id);
                    const newCurrentId =
                        state.currentSlideId === id
                            ? newSlides[0]?.id || null
                            : state.currentSlideId;
                    return {
                        slides: buildNavigation(newSlides),
                        currentSlideId: newCurrentId,
                    };
                });
            },

            updateSlide: (id, updates) => {
                set((state) => ({
                    slides: state.slides.map((slide) =>
                        slide.id === id ? { ...slide, ...updates } : slide,
                    ),
                }));
            },

            reorderSlides: (fromIndex, toIndex) => {
                set((state) => {
                    const newSlides = [...state.slides];
                    const [removed] = newSlides.splice(fromIndex, 1);
                    newSlides.splice(toIndex, 0, removed);
                    return { slides: buildNavigation(newSlides) };
                });
            },

            setCurrentSlide: (id) => set({ currentSlideId: id }),

            setTheme: (theme) =>
                set((state) => ({
                    theme: { ...state.theme, ...theme },
                })),

            setPresentationTitle: (title) => set({ presentationTitle: title }),

            setIsPresenting: (isPresenting) => set({ isPresenting }),

            setIsGenerating: (isGenerating) => set({ isGenerating }),

            goToNextSlide: () => {
                const { slides, currentSlideId } = get();
                const currentIndex = slides.findIndex((s) => s.id === currentSlideId);
                if (currentIndex < slides.length - 1) {
                    set({ currentSlideId: slides[currentIndex + 1].id });
                }
            },

            goToPrevSlide: () => {
                const { slides, currentSlideId } = get();
                const currentIndex = slides.findIndex((s) => s.id === currentSlideId);
                if (currentIndex > 0) {
                    set({ currentSlideId: slides[currentIndex - 1].id });
                }
            },

            getCurrentSlide: () => {
                const { slides, currentSlideId } = get();
                return slides.find((s) => s.id === currentSlideId);
            },

            getSlideIndex: (id) => {
                return get().slides.findIndex((s) => s.id === id);
            },
        })),
        {
            name: "slides-storage",
        },
    ),
);
