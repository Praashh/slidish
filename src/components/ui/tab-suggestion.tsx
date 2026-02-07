import { BookOpen, Code, Search, Sparkles } from "lucide-react";
import React, { useState } from "react";

const TabsSuggestion = ({
  suggestedInput,
  setSuggestedInput,
}: {
  suggestedInput: any;
  setSuggestedInput: any;
}) => {
  const [activeTab, setActiveTab] = useState("create");

  const tabs = [
    {
      id: "create",
      label: "Create",
      icon: <Sparkles className="h-4 w-4" />,
      content: [
        "Write a short story about a robot discovering emotions",
        "Help me outline a sci-fi novel set in a post-apocalyptic world",
        "How many Rs are in the word 'strawberry'? ",
        "Give me 5 creative writing prompts for flash fiction",
      ],
    },
    {
      id: "explore",
      label: "Explore",
      icon: <Search className="h-4 w-4" />,
      content: [
        "Analyze the themes in contemporary dystopian literature",
        "Compare different narrative structures in modern novels",
        "Explore the evolution of science fiction from the 1950s to today",
        "Discuss the impact of AI on creative writing",
      ],
    },
    {
      id: "code",
      label: "Code",
      icon: <Code className="h-4 w-4" />,
      content: [
        "Build a React component for a text editor with syntax highlighting",
        "Create a Python script to analyze writing patterns in text files",
        "Develop a web app for collaborative story writing",
        "Write a function to generate random plot elements for writers",
      ],
    },
    {
      id: "learn",
      label: "Learn",
      icon: <BookOpen className="h-4 w-4" />,
      content: [
        "Teach me the fundamentals of narrative structure",
        "Explain different point-of-view techniques in storytelling",
        "Help me understand character development arcs",
        "Break down the elements of effective dialogue writing",
      ],
    },
  ];

  const activeTabData = tabs.find((tab) => tab.id === activeTab);

  return (
    <div className="mt-7 h-fit w-full max-w-2xl px-4 md:px-0 text-foreground">
      <div className="mx-auto w-full">
        {/* Tab Navigation */}
        <div className="no-scrollbar mb-4 flex items-center justify-start md:justify-center gap-2 overflow-x-auto pb-1 md:gap-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-[#d97706] text-primary-foreground shadow-lg"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:text-foreground"
              } `}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mx-auto flex w-full max-w-md flex-col items-center space-y-2">
          {activeTabData?.content.map((item, index) => (
            <div
              key={index}
              onClick={() => {
                if (suggestedInput || suggestedInput === "") {
                  setSuggestedInput(item);
                }
              }}
              className="group w-full cursor-pointer rounded-xl border bg-muted/80 py-3 px-4 text-center transition-all duration-200 hover:bg-accent/80"
            >
              <p className="text-sm leading-relaxed text-card-foreground">
                {item}
              </p>
            </div>
          ))}
        </div>

        {/* Optional: Add some visual feedback for the active tab */}
      </div>
    </div>
  );
};

export default TabsSuggestion;
