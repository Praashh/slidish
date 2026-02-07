"use client";

import {
  ChatCircleDotsIcon,
  CheckIcon,
  CopyIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
} from "@phosphor-icons/react";
import Image from "next/image";
import { memo } from "react";
import { cn } from "@/lib/utils";
import type { MessagePart } from "@/types/chat";
import MarkdownRenderer from "./markdown-renderer";

interface MessageBubbleProps {
  id: string;
  role: "user" | "assistant";
  parts: MessagePart[];
  isWrapped: boolean;
  copied: boolean;
  onCopy: (content: string) => void;
  onToggleWrap: () => void;
  fontClassName: string;
}

function getMessageContent(parts: MessagePart[]): string {
  return parts
    .filter((part) => part.type === "text")
    .map((part) => part.content)
    .join("");
}


function getThinkingContent(parts: MessagePart[]): string {
  return parts
    .filter((part) => part.type === "thinking")
    .map((part) => part.content)
    .join("");
}


const MessageBubble = memo(function MessageBubble({
  id,
  role,
  parts,
  isWrapped,
  copied,
  onCopy,
  onToggleWrap,
  fontClassName,
}: MessageBubbleProps) {
  const messageContent = getMessageContent(parts);
  const thinkingContent = getThinkingContent(parts);

  return (
    <div
      key={id}
      className={`group mb-6 md:mb-10 flex w-full flex-col ${role === "assistant" ? "items-start" : "items-end"
        }`}
    >
      {role === "assistant" && (
        <div className="flex items-center gap-2 mb-3 px-1">
          <div className="bg-white rounded-md size-5 flex items-center justify-center overflow-hidden border border-zinc-200">
            <Image
              src="/logo.png"
              alt="Slidish"
              width={20}
              height={20}
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-xs font-bold text-zinc-800 tracking-tight">
            Slidish
          </span>
        </div>
      )}

      <div
        className={cn(
          "prose prose-zinc dark:prose-invert max-w-none transition-all duration-300",
          role === "user"
            ? "bg-zinc-100/80 backdrop-blur-sm border border-black/5 rounded-2xl px-4 py-2.5 text-zinc-900 font-medium text-[15px] shadow-sm"
            : "w-full text-zinc-800 text-[16px] leading-relaxed",
        )}
      >
        {role === "assistant" && thinkingContent && (
          <div className="mb-4 rounded-lg bg-zinc-50 border border-zinc-100 p-3 text-sm text-zinc-500 italic">
            <div className="flex items-center gap-2 mb-1 opacity-70">
              <ChatCircleDotsIcon weight="bold" className="size-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-wider">
                Thought Process
              </span>
            </div>
            {thinkingContent}
          </div>
        )}
        <MarkdownRenderer
          content={messageContent}
          isWrapped={isWrapped}
          copied={copied}
          onCopy={onCopy}
          onToggleWrap={onToggleWrap}
          fontClassName={fontClassName}
        />
      </div>

      <div className="mt-2 px-1 flex items-center gap-3">
        {role === "assistant" && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              type="button"
              onClick={() => onCopy(messageContent)}
              className="p-1.5 rounded-md hover:bg-zinc-100 text-zinc-400 hover:text-zinc-600 transition-all"
              aria-label="Copy message"
            >
              {copied ? (
                <CheckIcon weight="bold" className="size-3.5" />
              ) : (
                <CopyIcon weight="bold" className="size-3.5" />
              )}
            </button>
            <button
              type="button"
              className="p-1.5 rounded-md hover:bg-zinc-100 text-zinc-400 hover:text-zinc-600 transition-all"
              aria-label="Like message"
            >
              <ThumbsUpIcon weight="bold" className="size-3.5" />
            </button>
            <button
              type="button"
              className="p-1.5 rounded-md hover:bg-zinc-100 text-zinc-400 hover:text-zinc-600 transition-all"
              aria-label="Dislike message"
            >
              <ThumbsDownIcon weight="bold" className="size-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
});

export default MessageBubble;
