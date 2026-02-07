"use client";

import Image from "next/image";
import { memo } from "react";


const ChatLoadingIndicator = memo(function ChatLoadingIndicator() {
  return (
    <div className="flex items-center gap-2 px-1 mb-8">
      <div className="bg-white rounded-md size-5 flex items-center justify-center overflow-hidden border border-zinc-200 animate-pulse relative">
        <Image
          src="/logo.png"
          alt="Slidish Logo"
          width={20}
          height={20}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex gap-1">
        <div className="size-1 bg-zinc-300 rounded-full animate-bounce [animation-delay:-0.3s]" />
        <div className="size-1 bg-zinc-300 rounded-full animate-bounce [animation-delay:-0.15s]" />
        <div className="size-1 bg-zinc-300 rounded-full animate-bounce" />
      </div>
    </div>
  );
});

export default ChatLoadingIndicator;
