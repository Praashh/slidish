"use client";

import {
  ArrowsLeftRightIcon,
  CheckCircleIcon,
  CopyIcon,
} from "@phosphor-icons/react";
import { WrapText } from "lucide-react";
import { memo } from "react";
import ReactMarkdown from "react-markdown";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/cjs/styles/hljs";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

interface MarkdownRendererProps {
  content: string;
  isWrapped: boolean;
  copied: boolean;
  onCopy: (content: string) => void;
  onToggleWrap: () => void;
  fontClassName: string;
}


const MarkdownRenderer = memo(function MarkdownRenderer({
  content,
  isWrapped,
  copied,
  onCopy,
  onToggleWrap,
  fontClassName,
}: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code(props) {
          const { children, className, ...rest } = props;
          const match = /language-(\w+)/.exec(className ?? "");
          const isInline = !match;
          const codeContent = Array.isArray(children)
            ? children.join("")
            : typeof children === "string"
              ? children
              : "";

          return isInline ? (
            <code
              className={cn(
                "bg-zinc-100 rounded-md px-1.5 py-0.5 text-sm font-semibold text-zinc-900",
                fontClassName,
              )}
              {...rest}
            >
              {children}
            </code>
          ) : (
            <div
              className={`${fontClassName} my-6 overflow-hidden rounded-xl border border-white/10 shadow-xl`}
            >
              <div className="bg-[#1a1a1a] flex items-center justify-between px-4 py-2 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-red-500/50" />
                  <div className="size-2 rounded-full bg-amber-500/50" />
                  <div className="size-2 rounded-full bg-green-500/50" />
                  <span className="ml-2">{match ? match[1] : "text"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={onToggleWrap}
                    className="hover:text-white transition-colors"
                    type="button"
                    aria-label={isWrapped ? "Unwrap lines" : "Wrap lines"}
                  >
                    {isWrapped ? (
                      <ArrowsLeftRightIcon weight="bold" className="size-3.5" />
                    ) : (
                      <WrapText className="size-3.5" />
                    )}
                  </button>
                  <button
                    onClick={() => onCopy(codeContent)}
                    className="hover:text-white transition-colors"
                    type="button"
                    aria-label="Copy code"
                  >
                    {copied ? (
                      <CheckCircleIcon
                        weight="bold"
                        className="size-3.5 text-green-400"
                      />
                    ) : (
                      <CopyIcon className="size-3.5" />
                    )}
                  </button>
                </div>
              </div>
              <SyntaxHighlighter
                language={match ? match[1] : "text"}
                style={atomOneDark}
                customStyle={{
                  margin: 0,
                  padding: "1.25rem",
                  backgroundColor: "#0d0d0d",
                  fontSize: "0.9rem",
                  lineHeight: "1.5",
                }}
                wrapLongLines={isWrapped}
              >
                {codeContent}
              </SyntaxHighlighter>
            </div>
          );
        },
        p: (props) => <p className="mb-4 last:mb-0">{props.children}</p>,
        ol: (props) => (
          <ol className="list-decimal pl-6 mb-4 space-y-2">{props.children}</ol>
        ),
        ul: (props) => (
          <ul className="list-disc pl-6 mb-4 space-y-2">{props.children}</ul>
        ),
        li: (props) => <li className="pl-1">{props.children}</li>,
      }}
    >
      {content}
    </ReactMarkdown>
  );
});

export default MarkdownRenderer;
