"use client";

import { memo } from "react";
import TabsSuggestion from "@/components/ui/tab-suggestion";

interface WelcomeScreenProps {
  query: string;
  onQueryChange: (query: string) => void;
}

const WelcomeScreen = memo(function WelcomeScreen({
  query,
  onQueryChange,
}: WelcomeScreenProps) {
  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex h-full w-full flex-col items-center justify-center">
        <h1 className="text-4xl font-extrabold text-[#d97706] tracking-tight mb-2">
          Slidish
        </h1>
        <p className="text-xl text-zinc-500 font-medium mb-12">
          What kind of slides should we design today?
        </p>
        <TabsSuggestion
          suggestedInput={query}
          setSuggestedInput={onQueryChange}
        />
      </div>
    </div>
  );
});

export default WelcomeScreen;
