import {
    type SlideData,
} from "@/types/slide-types";

/**
 * Creates a new slide with default values
 */
export function createSlide(
    overrides: Partial<SlideData> = {},
): SlideData {
    return {
        id: `slide-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        template: "content",
        content: "",
        title: "",
        navigation: {},
        ...overrides,
    };
}

/**
 * Converts structured JSON slides from the API into SlideData objects
 */
export function parseJsonSlides(slides: Array<Record<string, unknown>>): SlideData[] {
    return slides.map((slide) => {
        const template = (slide.template as SlideData["template"]) || "content";
        return createSlide({
            template,
            title: (slide.title as string) || "",
            content: (slide.content as string) || "",
            subtitle: (slide.subtitle as string) || undefined,
            author: (slide.author as string) || undefined,
        });
    });
}

/**
 * Parses AI-generated markdown into individual slides (legacy fallback)
 * Expected format: slides separated by ---
 */
export function parseMarkdownToSlides(markdown: string): SlideData[] {
    const slideContents = markdown
        .split(/\n\s*---\s*\n|\n---\n|---/)
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

    return slideContents.map((content, index) => {
        let template: SlideData["template"] = "content";
        let title = "";
        let extractedContent = content;

        const titleMatch = content.match(/^#\s+(.+)/m);
        if (titleMatch) {
            title = titleMatch[1].trim();
            extractedContent = content.replace(/^#\s+.+$/m, "").trim();

            if (index === 0 || (extractedContent.length < 100 && !extractedContent.includes("##"))) {
                template = "title";
            }
        }

        const subtitleMatch = content.match(/^##\s+(.+)/m);
        if (subtitleMatch && template !== "title") {
            if (!title) {
                title = subtitleMatch[1].trim();
                extractedContent = content.replace(/^##\s+.+$/m, "").trim();
            }
            template = "content";
        }

        if (content.includes("> ") && content.split("\n").length <= 8) {
            template = "quote";
        }

        if (content.includes("```")) {
            template = "code";
        }

        if (content.match(/!\[.*\]\(.*\)/)) {
            template = "image";
        }

        return createSlide({
            template,
            title: title || (template === "title" ? "" : "Slide " + (index + 1)),
            content: extractedContent || content,
        });
    });
}
