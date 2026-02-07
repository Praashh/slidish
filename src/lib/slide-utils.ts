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
 * Parses AI-generated markdown into individual slides
 * Expected format: slides separated by ---
 */
export function parseMarkdownToSlides(markdown: string): SlideData[] {
    // More robust splitting that handles variations in newlines around the separator
    const slideContents = markdown
        .split(/\n\s*---\s*\n|\n---\n|---/)
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

    return slideContents.map((content, index) => {
        // Detect template based on content patterns
        let template: SlideData["template"] = "content";
        let title = "";
        let extractedContent = content;

        // Check for title slide (# heading at start)
        const titleMatch = content.match(/^#\s+(.+)/m);
        if (titleMatch) {
            title = titleMatch[1].trim();
            // Remove the title line from content
            extractedContent = content.replace(/^#\s+.+$/m, "").trim();

            // If it's the first slide or has very little content after title, it's a title slide
            if (index === 0 || (extractedContent.length < 100 && !extractedContent.includes("##"))) {
                template = "title";
            }
        }

        // Second level headings usually indicate a content slide
        const subtitleMatch = content.match(/^##\s+(.+)/m);
        if (subtitleMatch && template !== "title") {
            if (!title) {
                title = subtitleMatch[1].trim();
                extractedContent = content.replace(/^##\s+.+$/m, "").trim();
            }
            template = "content";
        }

        // Check for quote slide
        if (content.includes("> ") && content.split("\n").length <= 8) {
            template = "quote";
        }

        // Check for code slide
        if (content.includes("```")) {
            template = "code";
        }

        // Check for image slide
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
