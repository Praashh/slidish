import type { SlideData, PresentationTheme } from "@/types/slide-types";

export interface Template {
    id: string;
    name: string;
    description: string;
    previewImage: string;
    theme: PresentationTheme;
    initialSlides: SlideData[];
}

export const TEMPLATES: Template[] = [
    {
        id: "clean-professional",
        name: "Clean Professional",
        description: "Minimal white design with indigo accents. Ideal for business and corporate presentations.",
        previewImage: "/templates/clean.png",
        theme: {
            primaryColor: "#6366f1",
            secondaryColor: "#8b5cf6",
            backgroundColor: "#ffffff",
            textColor: "#1e293b",
            accentColor: "#06b6d4",
            fontFamily: "'Inter', sans-serif",
            headingFont: "'Inter', sans-serif",
        },
        initialSlides: [
            {
                id: "cp-1",
                template: "title",
                title: "Your Presentation Title",
                subtitle: "A brief description of what this presentation covers",
                content: "",
                navigation: {},
            },
            {
                id: "cp-2",
                template: "content",
                title: "Key Points",
                content: "- First important point with supporting detail\n- Second point that builds on the first\n- Third point that ties everything together\n- Final point with a call to action",
                navigation: {},
            },
            {
                id: "cp-3",
                template: "quote",
                title: "",
                content: "Design is not just what it looks like and feels like. Design is how it works.",
                author: "Steve Jobs",
                navigation: {},
            },
        ],
    },
    {
        id: "dark-tech",
        name: "Dark Tech",
        description: "Sleek dark theme with electric blue accents. Perfect for tech, AI, and developer presentations.",
        previewImage: "/templates/midnight.png",
        theme: {
            primaryColor: "#818cf8",
            secondaryColor: "#a78bfa",
            backgroundColor: "#0f172a",
            textColor: "#f8fafc",
            accentColor: "#22d3ee",
            fontFamily: "'Inter', sans-serif",
            headingFont: "'Inter', sans-serif",
        },
        initialSlides: [
            {
                id: "dt-1",
                template: "title",
                title: "Future of Innovation",
                subtitle: "Exploring the next frontier of technology",
                content: "",
                navigation: {},
            },
            {
                id: "dt-2",
                template: "content",
                title: "The Vision",
                content: "- **AI Integration** — Seamless intelligent systems\n- **Neural Networks** — Deep learning at scale\n- **Distributed Systems** — Global availability\n- **Edge Computing** — Real-time processing",
                navigation: {},
            },
            {
                id: "dt-3",
                template: "two-column",
                title: "Impact Analysis",
                content: "**Automation**\n- Reducing overhead by 40%\n- Intelligent workflows\n- Self-healing systems\n\n**Precision**\n- 10x accuracy improvement\n- Real-time processing\n- Predictive analytics",
                navigation: {},
            },
        ],
    },
    {
        id: "warm-minimal",
        name: "Warm Minimal",
        description: "Soft amber tones on warm white. Great for creative, education, and storytelling decks.",
        previewImage: "/templates/warm.png",
        theme: {
            primaryColor: "#f59e0b",
            secondaryColor: "#d97706",
            backgroundColor: "#fffbeb",
            textColor: "#451a03",
            accentColor: "#14b8a6",
            fontFamily: "'Inter', sans-serif",
            headingFont: "'Inter', sans-serif",
        },
        initialSlides: [
            {
                id: "wm-1",
                template: "title",
                title: "Creative Storytelling",
                subtitle: "Engaging your audience through narrative",
                content: "",
                navigation: {},
            },
            {
                id: "wm-2",
                template: "content",
                title: "The Power of Story",
                content: "- Stories are remembered 22x more than facts alone\n- Emotional connection drives decision-making\n- Every brand has a story waiting to be told\n- Your audience wants to be part of the narrative",
                navigation: {},
            },
            {
                id: "wm-3",
                template: "quote",
                title: "",
                content: "The most powerful person in the world is the storyteller.",
                author: "Steve Jobs",
                navigation: {},
            },
        ],
    },
    {
        id: "forest-dark",
        name: "Forest",
        description: "Deep green with emerald accents. Suited for sustainability, growth, and nature topics.",
        previewImage: "/templates/forest.png",
        theme: {
            primaryColor: "#34d399",
            secondaryColor: "#6ee7b7",
            backgroundColor: "#022c22",
            textColor: "#ecfdf5",
            accentColor: "#a7f3d0",
            fontFamily: "'Inter', sans-serif",
            headingFont: "'Inter', sans-serif",
        },
        initialSlides: [
            {
                id: "fd-1",
                template: "title",
                title: "Sustainable Growth",
                subtitle: "Building for the future, responsibly",
                content: "",
                navigation: {},
            },
            {
                id: "fd-2",
                template: "content",
                title: "Our Impact",
                content: "- Carbon neutral operations since 2023\n- 50% reduction in water usage\n- 100% renewable energy by 2025\n- Zero-waste packaging initiative",
                navigation: {},
            },
            {
                id: "fd-3",
                template: "two-column",
                title: "Before & After",
                content: "**2020 Baseline**\n- 10,000 tons CO2/year\n- 30% recycled materials\n- Linear supply chain\n\n**2025 Target**\n- Net-zero emissions\n- 100% circular materials\n- Regenerative practices",
                navigation: {},
            },
        ],
    },
];
