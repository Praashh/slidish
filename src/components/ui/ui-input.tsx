"use client";

import {
  ChatCircleDotsIcon,
  MicrophoneIcon,
  SpinnerGapIcon,
} from "@phosphor-icons/react";
import { fetchServerSentEvents, useChat } from "@tanstack/ai-react";
import { Globe, Paperclip } from "lucide-react";
import { Geist_Mono } from "next/font/google";
import type React from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSpeechSynthesis } from "react-speech-kit";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { toast } from "sonner";
import {
  ChatLoadingIndicator,
  MessageBubble,
  WelcomeScreen,
} from "@/components/chat";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  type ChatMessage,
  generateChatId,
  generateChatTitle,
  saveChat,
} from "@/lib/indexeddb";
import type { MessagePart } from "@/types/chat";

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  preload: true,
  display: "swap",
});

interface UIInputProps {
  chatId?: string;
  initialMessages?: {
    id: string;
    role: "user" | "assistant";
    parts: { type: string; content: string }[];
  }[];
  onChatUpdate?: () => void;
}


const UIInput = ({ chatId: existingChatId, initialMessages, onChatUpdate }: UIInputProps) => {
  const [modeOfChatting, setModeOfChatting] = useState<"text" | "voice">(
    "text",
  );
  const [query, setQuery] = useState<string>("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [search, setSearch] = useState<boolean>(false);
  const [showWelcome, setShowWelcome] = useState(!initialMessages?.length);
  const [copied, setCopied] = useState(false);
  const [isWrapped, setIsWrapped] = useState(false);
  const [chatId] = useState(() => existingChatId || generateChatId());

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const welcomeSpokenRef = useRef(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, isLoading } = useChat({
    connection: fetchServerSentEvents("/api/chat"),
  });

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const {
    speak,
    cancel,
    speaking,
    supported: ttsSupported,
    voices,
  } = useSpeechSynthesis();
  const [selectedVoice, setSelectedVoice] =
    useState<SpeechSynthesisVoice | null>(null);

  const typedMessages = useMemo(() => {
    // Combine initial messages with new messages
    const allMessages = [
      ...(initialMessages || []),
      ...messages.map((m) => ({
        id: m.id,
        role: m.role as "user" | "assistant",
        parts: m.parts
          .filter((p) => "type" in p && "content" in p)
          .map((p) => ({
            type: ("type" in p ? String(p.type) : "text"),
            content: "content" in p ? String(p.content) : "",
          })),
      })),
    ];

    return allMessages.map((msg) => ({
      id: msg.id,
      role: msg.role,
      parts: msg.parts.map((p) => ({
        type: p.type as MessagePart["type"],
        content: p.content,
      })),
    }));
  }, [messages, initialMessages]);

  const scrollToBottom = useCallback(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, []);

  const toggleWrap = useCallback(() => {
    setIsWrapped((prev) => !prev);
  }, []);

  const handleCopy = useCallback(async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  }, []);

  const handleStartListening = useCallback(() => {
    resetTranscript();
    SpeechRecognition.startListening({ continuous: true });
    toast.success("Listening...", {
      description: "Speak now...",
      duration: 5000,
    });
  }, [resetTranscript]);

  const handleStopListening = useCallback(() => {
    SpeechRecognition.stopListening();
    toast.success("Stopped listening", {
      description: "Processing your voice input...",
    });
  }, []);

  const toggleMode = useCallback(() => {
    if (modeOfChatting === "voice" && speaking) {
      cancel();
    }
    setModeOfChatting(modeOfChatting === "text" ? "voice" : "text");
  }, [modeOfChatting, speaking, cancel]);

  const handleFileInput = useCallback(() => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        setAttachments((prev) => [...prev, file]);
      }
    };
    fileInput.click();
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (query.trim() && !isLoading) {
        sendMessage(query);
        setQuery("");
      }
    },
    [query, isLoading, sendMessage],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (query.trim() && !isLoading) {
          sendMessage(query);
          setQuery("");
        }
      }
    },
    [query, isLoading, sendMessage],
  );

  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      toast.error("Your browser doesn't support speech recognition.");
    }
  }, [browserSupportsSpeechRecognition]);

  useEffect(() => {
    if (modeOfChatting === "voice" && !ttsSupported) {
      toast.error("Text-to-speech not supported in your browser");
      setModeOfChatting("text");
    }
  }, [modeOfChatting, ttsSupported]);

  useEffect(() => {
    if (ttsSupported && voices.length > 0) {
      const defaultVoice = voices.find((v) => v.default) || voices[0];
      setSelectedVoice(defaultVoice!);
    }
  }, [voices, ttsSupported]);

  useEffect(() => {
    if (listening) {
      setQuery(transcript);
    }
  }, [listening, transcript]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    // Only save when there are new messages being added
    if (messages.length > 0 || initialMessages?.length) {
      // Combine initial messages with new messages
      const allMessagesForSave: ChatMessage[] = [
        ...(initialMessages || []).map((m) => ({
          id: m.id,
          role: m.role,
          parts: m.parts.map((p) => ({
            type: p.type,
            content: p.content,
          })),
        })),
        ...messages.map((m) => ({
          id: m.id,
          role: m.role as "user" | "assistant",
          parts: m.parts
            .filter((p) => "type" in p && "content" in p)
            .map((p) => ({
              type: "type" in p ? String(p.type) : "text",
              content: "content" in p ? String(p.content) : "",
            })),
        })),
      ];

      // Only save if we have actual messages
      if (allMessagesForSave.length === 0) return;

      // Get title from first user message (could be from initial or new messages)
      const firstUserMessage = allMessagesForSave.find((m) => m.role === "user");
      const title = firstUserMessage
        ? generateChatTitle(
          firstUserMessage.parts
            .filter((p) => p.type === "text")
            .map((p) => p.content)
            .join(""),
        )
        : "New Chat";

      saveChat({
        id: chatId,
        messages: allMessagesForSave,
        createdAt: new Date(),
        updatedAt: new Date(),
        isSaved: false,
        title,
      }).then(() => {
        onChatUpdate?.();
      });
    }
  }, [messages, chatId, onChatUpdate, initialMessages]);

  useEffect(() => {
    if (
      showWelcome &&
      messages.length === 0 &&
      modeOfChatting === "voice" &&
      ttsSupported &&
      selectedVoice &&
      !welcomeSpokenRef.current
    ) {
      welcomeSpokenRef.current = true;
      speak({
        text: "Hello mate, how may I help you today?",
        voice: selectedVoice,
      });
    }
  }, [
    showWelcome,
    messages.length,
    modeOfChatting,
    ttsSupported,
    selectedVoice,
    speak,
  ]);

  const showWelcomeScreen = !query && showWelcome && messages.length === 0;

  return (
    <div className="flex h-full w-full overflow-hidden">
      <div className="relative flex h-full w-full flex-col">
        {showWelcomeScreen ? (
          <WelcomeScreen query={query} onQueryChange={setQuery} />
        ) : (
          <div
            ref={scrollContainerRef}
            className="no-scrollbar flex w-full flex-1 flex-col gap-6 overflow-y-auto px-4 pt-4 pb-24 md:px-0"
          >
            <div className="mx-auto w-full">
              {typedMessages.map((message) => (
                <MessageBubble
                  key={message.id}
                  id={message.id}
                  role={message.role}
                  parts={message.parts}
                  isWrapped={isWrapped}
                  copied={copied}
                  onCopy={handleCopy}
                  onToggleWrap={toggleWrap}
                  fontClassName={geistMono.className}
                />
              ))}
              {isLoading && <ChatLoadingIndicator />}
              <div ref={messagesEndRef} />
            </div>
          </div>
        )}

        <div className="w-full pb-4 pt-2">
          <div className="w-full px-2 sm:px-4">
            <div className="bg-white/80 backdrop-blur-xl border border-black/5 rounded-3xl p-1.5 md:p-2 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 focus-within:shadow-[0_8px_30px_rgb(0,0,0,0.08)] focus-within:border-black/10">
              <form
                className="flex w-full flex-col px-1.5 md:px-3"
                onSubmit={handleSubmit}
              >
                <Textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    modeOfChatting === "voice"
                      ? "Or type here..."
                      : "Ask Slidish anything..."
                  }
                  className="min-h-15 max-h-50 resize-none rounded-none border-none bg-transparent px-0 py-3 shadow-none ring-0 focus-visible:ring-0 text-zinc-800 placeholder:text-zinc-400 text-base"
                  disabled={isLoading}
                />
                <div className="mt-1 flex items-center justify-between border-t border-black/5 pt-2 pb-1 gap-2">
                  <div className="no-scrollbar flex flex-1 items-center gap-1 overflow-x-auto">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={toggleMode}
                      className="h-8 shrink-0 rounded-full bg-zinc-100/50 px-2.5 text-[11px] text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
                    >
                      <span className="hidden sm:inline">
                        {modeOfChatting === "text" ? "Voice Mode" : "Text Mode"}
                      </span>
                      <span className="flex items-center justify-center sm:hidden">
                        {modeOfChatting === "text" ? (
                          <MicrophoneIcon className="size-3.5" />
                        ) : (
                          <ChatCircleDotsIcon className="size-3.5" />
                        )}
                      </span>
                    </Button>

                    {modeOfChatting === "voice" && (
                      <button
                        type="button"
                        className={`flex size-8 shrink-0 items-center justify-center rounded-full transition-all ${listening
                          ? "bg-red-500 scale-110 shadow-lg shadow-red-200"
                          : "bg-zinc-100 hover:bg-zinc-200"
                          }`}
                        onClick={
                          listening ? handleStopListening : handleStartListening
                        }
                        disabled={!browserSupportsSpeechRecognition}
                        aria-label={
                          listening ? "Stop listening" : "Start listening"
                        }
                      >
                        <MicrophoneIcon
                          weight="bold"
                          className={`size-4 ${listening ? "text-white" : "text-zinc-600"}`}
                        />
                      </button>
                    )}

                    <Button
                      type="button"
                      variant="ghost"
                      className={`h-8 w-8 shrink-0 rounded-full p-0 text-zinc-500 transition-colors hover:text-zinc-900 ${search ? "bg-orange-50 text-orange-600" : ""
                        }`}
                      onClick={() => setSearch(!search)}
                      aria-label="Toggle search"
                    >
                      <Globe className="size-4" />
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      className="h-8 w-8 shrink-0 rounded-full p-0 text-zinc-500 transition-colors hover:text-zinc-900"
                      onClick={handleFileInput}
                      aria-label="Attach file"
                    >
                      <Paperclip className="size-4" />
                    </Button>
                  </div>
                  <Button
                    type="submit"
                    size="sm"
                    className={`rounded-full h-8 px-3 transition-all duration-300 ${!query.trim()
                      ? "bg-zinc-200 text-zinc-400"
                      : "text-white bg-[#d97706] hover:bg-[#d97706]/80 hover:scale-105 active:scale-95"
                      }`}
                    disabled={isLoading || !query.trim()}
                  >
                    {isLoading ? (
                      <SpinnerGapIcon className="animate-spin size-4" />
                    ) : (
                      <span className="text-[11px] font-bold">Ask</span>
                    )}
                  </Button>
                </div>
              </form>
            </div>
            <p className="mt-3 text-center text-[10px] text-zinc-400 font-medium">
              Slidish can make mistakes. Consider checking important
              information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UIInput;
