"use client";

import { memo, useMemo, type CSSProperties } from "react";
import { Quotes } from "@phosphor-icons/react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import type { SlideData } from "@/types/slide-types";
import { useSlidesStore } from "@/lib/slides-store";
import { cn } from "@/lib/utils";

const SLIDE_W = 1920;
const SLIDE_H = 1080;

const markdownComponents: Components = {
    h1: ({ node, ...props }) => <h1 className="text-[120px] font-bold mb-10 text-white tracking-[-4px]" {...props} />,
    h2: ({ node, ...props }) => <h2 className="text-[72px] font-bold mb-8 text-white tracking-[-2px]" {...props} />,
    h3: ({ node, ...props }) => <h3 className="text-[48px] font-semibold mb-6 text-white opacity-90" {...props} />,
    p: ({ node, ...props }) => <p className="text-[36px] leading-[1.6] text-zinc-300 mb-6" {...props} />,
    ul: ({ node, ...props }) => <ul className="text-[32px] leading-[1.8] text-zinc-300 pl-12 mb-6 list-disc marker:text-indigo-400" {...props} />,
    ol: ({ node, ...props }) => <ol className="text-[32px] leading-[1.8] text-zinc-300 pl-12 mb-6 list-decimal marker:text-indigo-400 marker:font-semibold" {...props} />,
    li: ({ node, ...props }) => <li className="mb-4 relative" {...props} />,
    strong: ({ node, ...props }) => <strong className="text-white font-semibold" {...props} />,
    em: ({ node, ...props }) => <em className="text-indigo-300 italic" {...props} />,
    code: ({ node, ...props }) => (
        <code className="font-['JetBrains_Mono','Fira_Code',monospace] bg-indigo-500/10 px-3 py-1 rounded-md text-[0.85em] text-indigo-300 border border-indigo-500/20" {...props} />
    ),
    blockquote: ({ node, ...props }) => (
        <blockquote className="border-l-4 border-indigo-500/50 pl-8 my-10 text-[42px] italic text-slate-300 font-light" {...props} />
    ),
    a: ({ node, ...props }) => (
        <a className="text-indigo-400 no-underline border-b-2 border-indigo-400/30 transition-all hover:text-indigo-300 hover:border-indigo-300" {...props} />
    )
};

const remarkPlugins = [remarkGfm];

interface SlideProps {
    readonly data: SlideData;
    readonly id: string;
    readonly index?: number;
    readonly totalSlides?: number;
}

function SlideInner({ data, id, index, totalSlides }: SlideProps) {
    const { theme } = useSlidesStore();

    const themeStyles = useMemo<CSSProperties>(() => ({
        "--slide-bg": theme.backgroundColor,
        "--slide-text": theme.textColor,
        "--slide-primary": theme.primaryColor,
        "--slide-secondary": theme.secondaryColor,
        "--slide-accent": theme.accentColor,
        "--slide-font-main": theme.fontFamily,
        "--slide-font-heading": theme.headingFont,
    } as CSSProperties), [theme]);

    const templateBg = useMemo<CSSProperties>(() => {
        const primarySoft = "color-mix(in srgb, var(--slide-primary), transparent 92%)";
        const secondarySoft = "color-mix(in srgb, var(--slide-secondary), transparent 92%)";

        switch (data.template) {
            case "title":
                return {
                    backgroundImage: `radial-gradient(circle at 0% 0%, ${primarySoft} 0, transparent 50%), radial-gradient(circle at 100% 100%, ${secondarySoft} 0, transparent 50%)`
                };
            case "quote":
                return {
                    backgroundImage: `radial-gradient(circle at 50% 50%, ${secondarySoft} 0%, transparent 60%)`
                };
            case "code":
                return {
                    background: `linear-gradient(135deg, #0a0a14 0%, #0f0f1a 100%)`
                };
            case "image":
                return { padding: 0 };
            default:
                return {};
        }
    }, [data.template]);

    return (
        <article
            className={cn(
                "w-[1920px] h-[1080px] bg-(--slide-bg) rounded-none overflow-hidden relative flex flex-col font-[family-name:var(--slide-font-main),system-ui,sans-serif] text-white shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)] transition-all duration-500 ease-in-out mx-auto",
                data.template === "title" && "justify-center items-center text-center",
                data.template === "quote" && "justify-center"
            )}
            style={{
                width: SLIDE_W,
                height: SLIDE_H,
                ...themeStyles,
                ...templateBg
            }}
        >
            <div className="slide-grain-overlay" />

            {(data.template === "title") && (
                <div className="slide-mesh-gradient" />
            )}

            {data.template === "image" && data.imageUrl && (
                <>
                    <div className="absolute inset-0 z-0">
                        <img
                            src={data.imageUrl}
                            alt=""
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="absolute inset-0 z-1 bg-zinc-950/80" />
                </>
            )}

            <div className={cn(
                "relative z-2 flex-1 flex flex-col p-[80px_100px]",
                data.template === "title" && "justify-center items-center max-w-[1400px]",
                data.template === "quote" && "justify-center items-center text-center px-20 max-w-[1400px] mx-auto",
                data.template === "two-column" && "grid grid-cols-2 gap-20"
            )}>
                {data.template === "title" ? (
                    <>
                        <div className="flex flex-col items-center justify-center h-full text-center relative">
                            {data.title && (
                                <h1 className="font-[family-name:var(--slide-font-heading),var(--slide-font-main),sans-serif] text-[140px] font-bold leading-[1.1] mb-8 text-white! tracking-[-4px] animate-slide-in fill-mode-both delay-100 drop-shadow-sm">
                                    {data.title}
                                </h1>
                            )}
                            {data.subtitle && (
                                <p className="text-[42px] text-zinc-300 font-medium tracking-[4px] uppercase animate-slide-in fill-mode-both delay-200">
                                    {data.subtitle}
                                </p>
                            )}
                            <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-32 h-1 bg-indigo-500/20 rounded-full" />
                        </div>
                    </>
                ) : data.template === "quote" ? (
                    <div className="flex flex-col items-center justify-center h-full text-center relative">
                        <Quotes weight="fill" size={80} className="text-indigo-500/10 mb-8 animate-slide-in fill-mode-both delay-100" />
                        <blockquote className="border-none p-0 text-[64px] font-medium text-[#f8fafc] my-8 leading-[1.3] tracking-[-1px] animate-slide-in fill-mode-both delay-200">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {data.content}
                            </ReactMarkdown>
                        </blockquote>
                        {data.author && (
                            <div className="text-[24px] text-zinc-500 font-medium tracking-[2px] uppercase animate-slide-in fill-mode-both delay-300">
                                {data.author}
                            </div>
                        )}
                    </div>
                ) : data.template === "code" ? (
                    <div className="flex-1 flex flex-col gap-10">
                        {data.title && (
                            <h2 className="font-[family-name:var(--slide-font-heading),var(--slide-font-main),sans-serif] text-[64px] font-semibold leading-[1.2] mb-10 text-white! opacity-95 tracking-[-1px] animate-slide-in fill-mode-both delay-100">
                                {data.title}
                            </h2>
                        )}
                        <pre className="flex-1 bg-black/40 border border-white/5 rounded-2xl p-8 overflow-x-auto shadow-[0_0_40px_-10px_rgba(0,0,0,0.4)] animate-slide-in fill-mode-both delay-200">
                            <div className="flex items-center gap-3 pb-4 border-b border-white/5 mb-6">
                                <span className="w-3 h-3 rounded-full bg-[#333]" />
                                <span className="w-3 h-3 rounded-full bg-[#333]" />
                                <span className="w-3 h-3 rounded-full bg-[#333]" />
                            </div>
                            <div className="text-[28px] leading-[1.6] font-['JetBrains_Mono','Fira_Code',monospace] text-indigo-200/90">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {data.content}
                                </ReactMarkdown>
                            </div>
                        </pre>
                    </div>
                ) : (
                    <>
                        {data.title && (
                            <h2 className={cn(
                                "font-[family-name:var(--slide-font-heading),var(--slide-font-main),sans-serif] text-[72px] font-bold leading-[1.2] mb-12 text-white! border-b border-white/5 pb-8 tracking-[-1px] animate-slide-in fill-mode-both delay-100"
                            )}>
                                {data.title}
                            </h2>
                        )}
                        <div className="flex-1 animate-slide-in fill-mode-both delay-200">
                            <ReactMarkdown
                                remarkPlugins={remarkPlugins}
                                components={markdownComponents}
                            >
                                {data.content}
                            </ReactMarkdown>
                        </div>
                    </>
                )}
            </div>

            {(index !== undefined && totalSlides !== undefined) && (
                <footer className="absolute bottom-10 right-15 z-10 flex items-center gap-6">
                    <div className="text-[20px] text-slate-500 font-medium tracking-[1px]">
                        <span className="text-indigo-400 font-bold">{index + 1}</span>
                        <span className="opacity-40"> / {totalSlides}</span>
                    </div>
                </footer>
            )}
        </article>
    );
}

export const Slide = memo(SlideInner);
export default Slide;
