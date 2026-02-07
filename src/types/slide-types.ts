import type { Node } from "@xyflow/react";

export type SlideTemplate =
    | "title"
    | "content"
    | "two-column"
    | "image"
    | "quote"
    | "code"
    | "blank";

export interface SlideNavigation {
    left?: string;
    right?: string;
    up?: string;
    down?: string;
}

export interface SlideData {
    id: string;
    template: SlideTemplate;
    content: string;
    title?: string;
    subtitle?: string;
    imageUrl?: string;
    author?: string;
    codeLanguage?: string;
    backgroundColor?: string;
    accentColor?: string;
    navigation: SlideNavigation;
    [key: string]: unknown;
}

export type SlideNode = Node<SlideData, "slide">;

export interface Presentation {
    id: string;
    title: string;
    slides: SlideData[];
    theme: PresentationTheme;
    createdAt: Date;
    updatedAt: Date;
}

export interface PresentationTheme {
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    textColor: string;
    accentColor: string;
    fontFamily: string;
    headingFont: string;
}

export const DEFAULT_THEME: PresentationTheme = {
    primaryColor: "#6366f1",
    secondaryColor: "#8b5cf6",
    backgroundColor: "#0f0f1a",
    textColor: "#f8fafc",
    accentColor: "#22d3ee",
    fontFamily: "'Inter', sans-serif",
    headingFont: "'Space Grotesk', sans-serif",
};

export const SLIDE_WIDTH = 1920;
export const SLIDE_HEIGHT = 1080;
export const SLIDE_PADDING = 120;
