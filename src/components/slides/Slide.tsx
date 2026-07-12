"use client";

import { memo, useMemo, type CSSProperties } from "react";
import { Quotes } from "@phosphor-icons/react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import type { SlideData } from "@/types/slide-types";
import { useSlidesStore } from "@/lib/slides-store";

const SLIDE_W = 1920;
const SLIDE_H = 1080;

function createMarkdownComponents(isLight: boolean): Components {
    const textClass = isLight ? "text-slate-800" : "text-white";
    const mutedClass = isLight ? "text-slate-600" : "text-white/80";
    return {
        h1: ({ node, ...props }) => (
            <h1 className={`text-[56px] font-extrabold mb-6 ${textClass} tracking-tight leading-[1.15]`} {...props} />
        ),
        h2: ({ node, ...props }) => (
            <h2 className={`text-[42px] font-bold mb-5 ${textClass} tracking-tight leading-[1.2]`} {...props} />
        ),
        h3: ({ node, ...props }) => (
            <h3 className={`text-[34px] font-semibold mb-4 ${textClass} leading-[1.3]`} {...props} />
        ),
        p: ({ node, ...props }) => (
            <p className={`text-[26px] leading-[1.8] ${mutedClass} mb-3`} {...props} />
        ),
        ul: ({ node, ...props }) => (
            <ul className={`text-[26px] leading-[1.7] ${mutedClass} pl-0 mb-3 space-y-6 list-none`} {...props} />
        ),
        ol: ({ node, ...props }) => (
            <ol className={`text-[26px] leading-[1.7] ${mutedClass} pl-0 mb-3 space-y-6 list-none`} {...props} />
        ),
        li: ({ node, ...props }) => (
            <li
                className="relative pl-12 before:absolute before:left-0 before:top-[12px] before:w-[18px] before:h-[18px] before:rounded-[5px] before:bg-[var(--slide-primary)]"
                {...props}
            />
        ),
        strong: ({ node, ...props }) => (
            <strong className={`${textClass} font-bold`} {...props} />
        ),
        em: ({ node, ...props }) => (
            <em className="italic opacity-80" {...props} />
        ),
        code: ({ node, ...props }) => (
            <code className={`font-mono ${isLight ? 'bg-slate-100 text-slate-700' : 'bg-white/10 text-white/90'} px-3 py-1 rounded text-[0.85em]`} {...props} />
        ),
        blockquote: ({ node, ...props }) => (
            <blockquote className="border-l-[5px] border-[var(--slide-primary)] pl-8 my-6 text-[30px] italic opacity-85" {...props} />
        ),
        a: ({ node, ...props }) => (
            <a className="text-[var(--slide-primary)] underline underline-offset-4" {...props} />
        ),
    };
}

const remarkPlugins = [remarkGfm];

interface SlideProps {
    readonly data: SlideData;
    readonly id: string;
    readonly index?: number;
    readonly totalSlides?: number;
}

function SlideInner({ data, id, index, totalSlides }: SlideProps) {
    const { theme } = useSlidesStore();

    const isLight = useMemo(() => {
        // Determine if background is light or dark
        const bg = theme.backgroundColor;
        if (bg.startsWith('#')) {
            const r = parseInt(bg.slice(1, 3), 16);
            const g = parseInt(bg.slice(3, 5), 16);
            const b = parseInt(bg.slice(5, 7), 16);
            return (r * 299 + g * 587 + b * 114) / 1000 > 128;
        }
        return false;
    }, [theme.backgroundColor]);

    const themeStyles = useMemo<CSSProperties>(() => ({
        "--slide-bg": theme.backgroundColor,
        "--slide-text": theme.textColor,
        "--slide-primary": theme.primaryColor,
        "--slide-secondary": theme.secondaryColor,
        "--slide-accent": theme.accentColor,
        "--slide-font-main": theme.fontFamily,
        "--slide-font-heading": theme.headingFont,
    } as CSSProperties), [theme]);

    return (
        <article
            className="w-[1920px] h-[1080px] overflow-hidden relative flex flex-col mx-auto"
            style={{
                width: SLIDE_W,
                height: SLIDE_H,
                fontFamily: `var(--slide-font-main), system-ui, sans-serif`,
                background: `var(--slide-bg)`,
                color: `var(--slide-text)`,
                ...themeStyles,
            }}
        >
            {data.template === "title" && <TitleSlide data={data} isLight={isLight} />}
            {data.template === "quote" && <QuoteSlide data={data} isLight={isLight} />}
            {data.template === "code" && <CodeSlide data={data} isLight={isLight} />}
            {data.template === "two-column" && <TwoColumnSlide data={data} isLight={isLight} />}
            {data.template === "image" && <ImageSlide data={data} />}
            {(data.template === "content" || data.template === "blank") && <ContentSlide data={data} isLight={isLight} />}

            {/* Slide number — subtle */}
            {(index !== undefined && totalSlides !== undefined) && (
                <div className="absolute bottom-8 right-12 z-10">
                    <span className={`text-[16px] font-medium tabular-nums ${isLight ? 'text-slate-400' : 'text-white/30'}`}>
                        {String(index + 1).padStart(2, '0')}
                    </span>
                </div>
            )}
        </article>
    );
}

/* ============================================
   TITLE SLIDE
   Large centered title with decorative elements
   ============================================ */
function TitleSlide({ data, isLight }: { data: SlideData; isLight: boolean }) {
    return (
        <div className="flex-1 flex relative overflow-hidden">
            {/* Decorative background shapes */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {/* Large circle - top right */}
                <div
                    className="absolute -top-[200px] -right-[200px] w-[700px] h-[700px] rounded-full opacity-[0.07]"
                    style={{ background: `var(--slide-primary)` }}
                />
                {/* Small circle - bottom left */}
                <div
                    className="absolute -bottom-[100px] -left-[100px] w-[400px] h-[400px] rounded-full opacity-[0.05]"
                    style={{ background: `var(--slide-secondary)` }}
                />
                {/* Gradient sweep */}
                <div
                    className="absolute bottom-0 left-0 right-0 h-[300px] opacity-[0.04]"
                    style={{ background: `linear-gradient(to top, var(--slide-primary), transparent)` }}
                />
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col items-start justify-center px-[140px] relative z-1 max-w-[1500px]">
                {/* Accent bar */}
                <div className="w-16 h-[6px] rounded-full mb-12" style={{ background: `var(--slide-primary)` }} />

                {data.title && (
                    <h1
                        className="text-[88px] font-extrabold leading-[1.05] tracking-[-2px] mb-8"
                        style={{ fontFamily: `var(--slide-font-heading), var(--slide-font-main), system-ui` }}
                    >
                        {data.title}
                    </h1>
                )}
                {data.subtitle && (
                    <p className={`text-[30px] leading-[1.6] font-normal max-w-[900px] ${isLight ? 'text-slate-500' : 'text-white/50'}`}>
                        {data.subtitle}
                    </p>
                )}
            </div>
        </div>
    );
}

/* ============================================
   CONTENT SLIDE
   Title + bullet content with left accent
   ============================================ */
function ContentSlide({ data, isLight }: { data: SlideData; isLight: boolean }) {
    const mdComponents = useMemo(() => createMarkdownComponents(isLight), [isLight]);

    return (
        <div className="flex-1 flex flex-col p-[90px_120px]">
            {data.title && (
                <div className="flex items-center gap-5 mb-10">
                    <div className="w-[6px] h-[44px] rounded-full shrink-0" style={{ background: `var(--slide-primary)` }} />
                    <h2
                        className="text-[48px] font-bold tracking-tight leading-[1.2]"
                        style={{ fontFamily: `var(--slide-font-heading), var(--slide-font-main), system-ui` }}
                    >
                        {data.title}
                    </h2>
                </div>
            )}
            <div className="flex-1 flex flex-col justify-center pl-4">
                <ReactMarkdown remarkPlugins={remarkPlugins} components={mdComponents}>
                    {data.content}
                </ReactMarkdown>
            </div>
        </div>
    );
}

/* ============================================
   QUOTE SLIDE
   Centered quote with large decorative marks
   ============================================ */
function QuoteSlide({ data, isLight }: { data: SlideData; isLight: boolean }) {
    return (
        <div className="flex-1 flex flex-col items-center justify-center px-[200px] relative">
            {/* Background accent */}
            <div
                className="absolute inset-0 pointer-events-none opacity-[0.03]"
                style={{ background: `radial-gradient(circle at 50% 50%, var(--slide-primary), transparent 70%)` }}
            />

            <div className="relative z-1 flex flex-col items-center text-center max-w-[1200px]">
                {/* Quotation mark */}
                <Quotes
                    weight="fill"
                    size={80}
                    className="mb-10 opacity-15"
                    style={{ color: `var(--slide-primary)` }}
                />

                <blockquote className="text-[44px] font-medium leading-[1.5] tracking-[-0.5px] mb-10">
                    {data.content}
                </blockquote>

                {data.author && (
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-[3px] rounded-full" style={{ background: `var(--slide-primary)` }} />
                        <span className={`text-[22px] font-medium ${isLight ? 'text-slate-400' : 'text-white/40'}`}>
                            {data.author}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}

/* ============================================
   CODE SLIDE
   Code block with syntax highlighting feel
   ============================================ */
function CodeSlide({ data, isLight }: { data: SlideData; isLight: boolean }) {
    const mdComponents = useMemo(() => createMarkdownComponents(false), []);

    return (
        <div className="flex-1 flex flex-col p-[80px_100px] gap-8">
            {data.title && (
                <h2
                    className="text-[44px] font-bold tracking-tight"
                    style={{ fontFamily: `var(--slide-font-heading), var(--slide-font-main), system-ui` }}
                >
                    {data.title}
                </h2>
            )}
            <div className="flex-1 rounded-2xl overflow-hidden border" style={{
                background: isLight ? '#1e293b' : 'rgba(0,0,0,0.4)',
                borderColor: isLight ? '#334155' : 'rgba(255,255,255,0.08)',
            }}>
                {/* Window chrome */}
                <div className="flex items-center gap-2 px-7 py-4 border-b" style={{
                    borderColor: isLight ? '#334155' : 'rgba(255,255,255,0.06)',
                }}>
                    <span className="w-3.5 h-3.5 rounded-full bg-[#ef4444]/70" />
                    <span className="w-3.5 h-3.5 rounded-full bg-[#eab308]/70" />
                    <span className="w-3.5 h-3.5 rounded-full bg-[#22c55e]/70" />
                </div>
                {/* Code content */}
                <div className="p-8 text-[22px] leading-[1.8] font-mono text-slate-200">
                    <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
                        {data.content}
                    </ReactMarkdown>
                </div>
            </div>
        </div>
    );
}

/* ============================================
   TWO-COLUMN SLIDE
   Side by side comparison
   ============================================ */
function TwoColumnSlide({ data, isLight }: { data: SlideData; isLight: boolean }) {
    const mdComponents = useMemo(() => createMarkdownComponents(isLight), [isLight]);

    // Split content into two columns
    const parts = data.content.split(/\n\n(?=\*\*)/);
    const leftContent = parts[0] || "";
    const rightContent = parts.slice(1).join("\n\n") || "";

    return (
        <div className="flex-1 flex flex-col p-[90px_120px]">
            {data.title && (
                <div className="flex items-center gap-5 mb-12">
                    <div className="w-[6px] h-[44px] rounded-full shrink-0" style={{ background: `var(--slide-primary)` }} />
                    <h2
                        className="text-[48px] font-bold tracking-tight leading-[1.2]"
                        style={{ fontFamily: `var(--slide-font-heading), var(--slide-font-main), system-ui` }}
                    >
                        {data.title}
                    </h2>
                </div>
            )}
            <div className="flex-1 grid grid-cols-2 gap-0">
                <div className="flex flex-col justify-center pr-14">
                    <ReactMarkdown remarkPlugins={remarkPlugins} components={mdComponents}>
                        {leftContent}
                    </ReactMarkdown>
                </div>
                <div className="flex flex-col justify-center pl-14 border-l-[3px]" style={{
                    borderColor: isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.08)',
                }}>
                    <ReactMarkdown remarkPlugins={remarkPlugins} components={mdComponents}>
                        {rightContent}
                    </ReactMarkdown>
                </div>
            </div>
        </div>
    );
}

/* ============================================
   IMAGE SLIDE
   Full bleed image with text overlay
   ============================================ */
function ImageSlide({ data }: { data: SlideData }) {
    return (
        <div className="flex-1 relative">
            {data.imageUrl && (
                <>
                    <div className="absolute inset-0 z-0">
                        <img src={data.imageUrl} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="absolute inset-0 z-1 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                </>
            )}
            <div className="relative z-2 flex flex-col justify-end h-full p-[100px_120px]">
                {data.title && (
                    <h2
                        className="text-[56px] font-bold text-white tracking-tight mb-4"
                        style={{ fontFamily: `var(--slide-font-heading), var(--slide-font-main), system-ui` }}
                    >
                        {data.title}
                    </h2>
                )}
                {data.content && (
                    <p className="text-[26px] text-white/70 max-w-[800px] leading-relaxed">
                        {data.content}
                    </p>
                )}
            </div>
        </div>
    );
}

export const Slide = memo(SlideInner);
export default Slide;
