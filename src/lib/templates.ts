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
        id: "midnight-tech",
        name: "Midnight Tech",
        description: "Dark futuristic theme with neon accents, perfect for tech showcases and AI presentations.",
        previewImage: "/templates/midnight.png",
        theme: {
            primaryColor: "#3b82f6", // Blue 500
            secondaryColor: "#8b5cf6", // Violet 500
            backgroundColor: "#020617", // Slate 950
            textColor: "#f8fafc",
            accentColor: "#22d3ee", // Cyan 400
            fontFamily: "'Inter', sans-serif",
            headingFont: "'Space Grotesk', sans-serif",
        },
        initialSlides: [
            {
                id: "mt-1",
                template: "title",
                title: "Future of Innovation",
                subtitle: "Exploring the next frontier of technology",
                content: "# Future of Innovation\nExploring the next frontier of technology",
                navigation: {},
            },
            {
                id: "mt-2",
                template: "content",
                title: "The Vision",
                content: "### Strategic Pillars\n- **AI Integration**: Seamless systems\n- **Neural Networks**: Deep learning at scale\n- **Distributed Systems**: Global availability",
                navigation: {},
            },
            {
                id: "mt-3",
                template: "two-column",
                title: "Impact Analysis",
                content: "#### Automation\nReducing overhead by 40% through intelligent workflows.\n\n#### Precision\nIncreasing accuracy in data processing by 10x.",
                navigation: {},
            },
        ],
    },
    {
        id: "aurora-creative",
        name: "Aurora Creative",
        description: "Soft gradients and playful typography for artistic projects and creative agencies.",
        previewImage: "/templates/aurora.png",
        theme: {
            primaryColor: "#ec4899", // Pink 500
            secondaryColor: "#a855f7", // Purple 500
            backgroundColor: "#fafafa", // Zinc 50
            textColor: "#18181b", // Zinc 900
            accentColor: "#14b8a6", // Teal 500
            fontFamily: "'Outfit', sans-serif",
            headingFont: "'Quicksand', sans-serif",
        },
        initialSlides: [
            {
                id: "ac-1",
                template: "title",
                title: "Creative Synergy",
                subtitle: "Where art meets strategy",
                content: "# Creative Synergy\nWhere art meets strategy",
                navigation: {},
            },
            {
                id: "ac-2",
                template: "image",
                title: "Visual First",
                imageUrl: "/feature-design.png",
                content: "## Visual First\nDesigning for impact through thoughtful aesthetics.",
                navigation: {},
            },
            {
                id: "ac-3",
                template: "quote",
                content: "Creativity is intelligence having fun.",
                author: "Albert Einstein",
                navigation: {},
            },
        ],
    },
    {
        id: "minimalist-exec",
        name: "Minimalist Executive",
        description: "Clean, high-contrast professional design for board meetings and executive summaries.",
        previewImage: "/templates/minimalist.png",
        theme: {
            primaryColor: "#27272a", // Zinc 800
            secondaryColor: "#52525b", // Zinc 600
            backgroundColor: "#ffffff",
            textColor: "#09090b",
            accentColor: "#a1a1aa", // Zinc 400
            fontFamily: "'Inter', sans-serif",
            headingFont: "'Lora', serif",
        },
        initialSlides: [
            {
                id: "me-1",
                template: "title",
                title: "Quarterly Review",
                subtitle: "Strategic Outlook & Financial Performance",
                content: "# Quarterly Review\nStrategic Outlook & Financial Performance",
                navigation: {},
            },
            {
                id: "me-2",
                template: "two-column",
                title: "Key Metrics",
                content: "### Growth\n- Revenue +24%\n- Retention 92%\n\n### Efficiency\n- CAC -15%\n- LTV +10%",
                navigation: {},
            },
            {
                id: "me-3",
                template: "content",
                title: "Next Steps",
                content: "1. Finalize Q3 budget\n2. Launch market expansion\n3. Complete talent acquisition cycle",
                navigation: {},
            },
        ],
    },
    {
        id: "vibrant-startup",
        name: "Vibrant Startup",
        description: "Bold colors and energetic layouts for high-impact pitch decks.",
        previewImage: "/templates/startup.png",
        theme: {
            primaryColor: "#f97316", // Orange 500
            secondaryColor: "#3b82f6", // Blue 500
            backgroundColor: "#0f172a", // Slate 900
            textColor: "#ffffff",
            accentColor: "#facc15", // Yellow 400
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            headingFont: "'Plus Jakarta Sans', sans-serif",
        },
        initialSlides: [
            {
                id: "vs-1",
                template: "title",
                title: "Ignite Your Future",
                subtitle: "The Next Generation Startup Deck",
                content: "# Ignite Your Future\nThe Next Generation Startup Deck",
                navigation: {},
            },
            {
                id: "vs-2",
                template: "quote",
                content: "The best way to predict the future is to create it.",
                author: "Peter Drucker",
                navigation: {},
            },
            {
                id: "vs-3",
                template: "two-column",
                title: "Market Opportunity",
                content: "#### TAM\n$45B addressable market globally.\n\n#### SAM\n$12B reachable in the next 3 years.",
                navigation: {},
            },
        ],
    },
];
