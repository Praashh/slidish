"use client";
import {
  BookmarkIcon,
  DotsThreeVertical,
  MagnifyingGlassIcon,
  ShareFatIcon,
  SignOutIcon,
  TrashIcon,
} from "@phosphor-icons/react";
import { Share, ShareIcon } from "lucide-react";
import { Geist } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  deleteChat as deleteIndexedDBChat,
  getChats,
  type Chat as IndexedDBChat,
  toggleSaveChat,
} from "@/lib/indexeddb";
import { Button } from "./button";
import { Input } from "./input";
import { Separator } from "./separator";
import { useSession } from "next-auth/react";

const giest = Geist({
  display: "swap",
  subsets: ["latin"],
});

interface Chat {
  id: string;
  updatedAt: Date;
  isSaved: boolean;
  title?: string;
  messages: {
    id: string;
    role: string;
    parts: { type: string; content: string }[];
  }[];
}

interface UIStructureProps {
  refreshTrigger?: number;
}

export function UIStructure({ refreshTrigger }: UIStructureProps) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [hoverChatId, setHoverChatId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { data: session } = useSession();

  // Fetch chats from IndexedDB
  const fetchChats = useCallback(async () => {
    try {
      const storedChats = await getChats();
      setChats(storedChats as Chat[]);
    } catch (error) {
      console.error("Failed to fetch chats:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchChats();
  }, [fetchChats, refreshTrigger]);

  const handleDeleteChat = async (id: string) => {
    try {
      await deleteIndexedDBChat(id);
      setChats((prev) => prev.filter((chat) => chat.id !== id));
      toast.success("Chat deleted");
    } catch (error) {
      toast.error("Failed to delete chat");
    }
  };

  const handleToggleSave = async (id: string) => {
    try {
      await toggleSaveChat(id);
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === id ? { ...chat, isSaved: !chat.isSaved } : chat,
        ),
      );
      toast.success("Chat updated");
    } catch (error) {
      toast.error("Failed to update chat");
    }
  };

  const handleSignOut = () => {
    // Clear auth cookie
    document.cookie =
      "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push("/signin");
    router.refresh();
  };

  const getChatTitle = (chat: Chat) => {
    if (chat.title) return chat.title;
    const firstUserMessage = chat.messages.find((m) => m.role === "user");
    if (firstUserMessage) {
      const content = firstUserMessage.parts
        .filter((p) => p.type === "text")
        .map((p) => p.content)
        .join("");
      return content.slice(0, 30) + (content.length > 30 ? "..." : "");
    }
    return "New Chat";
  };

  return (
    <Sidebar className={`border py-2 pl-2`}>
      <SidebarContent className="rounded-2xl">
        <SidebarGroup className="flex flex-col gap-8 pt-3">
          <SidebarGroupLabel className="h-fit p-0">
            <div className="flex h-12 w-full flex-col items-center gap-2 rounded-lg">
              <div className="flex w-full items-center gap-2 rounded-lg p-1 text-lg">
                <SidebarTrigger className="shrink-0" />
                <div className="flex w-full flex-1 items-center gap-2">
                  {/* <div className="bg-linear-to-b from-orange-400 via-white to-green-400 rounded-md w-6 h-6 flex items-center justify-center p-0.5 shadow-inner shrink-0">
                                        <img
                                            src="https://upload.wikimedia.org/wikipedia/commons/1/17/Ashoka_Chakra.svg"
                                            alt="Slidish Logo"
                                            className="w-full h-full text-blue-800"
                                        />
                                    </div> */}
                  <span className="font-bold text-[#d97706] text-sm dark:text-primary-foreground">
                    Slidish
                  </span>
                </div>
                <span className="size-6"></span>
              </div>
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  router.push("/slides");
                }}
                className="w-full bg-[#d97706] hover:bg-[#d97706]/90"
              >
                New Chat
              </Button>
              {/* <SidebarTrigger /> */}
            </div>
          </SidebarGroupLabel>
          <SidebarGroupContent className="mt-4">
            <div className="mb-4 flex items-center gap-2 border-b">
              <MagnifyingGlassIcon className="text-foreground" weight="bold" />
              <Input
                placeholder="Search for chats"
                className="rounded-none border-none bg-transparent px-0 py-1 shadow-none ring-0 focus-visible:ring-0 dark:bg-transparent"
              />
            </div>
            <SidebarGroupLabel className="p-0">
              <Badge
                variant="secondary"
                className="text-foreground flex items-center gap-2 rounded-lg"
              >
                <span className="font-semibold">Saved Chats</span>
              </Badge>
            </SidebarGroupLabel>
            <SidebarMenu className="mt-2 p-0">
              {isLoading
                ? // Skeleton loader while loading saved chats
                Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-primary/15 mb-2 h-7 w-full animate-pulse rounded-md"
                  />
                ))
                : chats
                  ?.filter((chat: Chat) => chat.isSaved)
                  .map((chat: Chat) => (
                    <SidebarMenuItem key={chat.id}>
                      <SidebarMenuButton
                        className="group hover:bg-primary/20 relative"
                        onMouseEnter={() => setHoverChatId(chat.id)}
                        onMouseLeave={() => setHoverChatId("")}
                        asChild
                      >
                        <div className="flex w-full items-center justify-between">
                          <Link href={`/ask/${chat.id}`}>
                            <span className="z-[-1]">
                              {getChatTitle(chat)}
                            </span>
                            <div
                              className={`absolute top-0 right-0 z-5 h-full w-12 rounded-r-md blur-[2em] ${chat.id === hoverChatId ? "bg-primary" : ""}`}
                            />
                            <div
                              className={`absolute top-1/2 -right-16 z-10 flex h-full -translate-y-1/2 items-center justify-center gap-1.5 rounded-r-md bg-transparent px-1 backdrop-blur-xl transition-all duration-200 ease-in-out ${chat.id === hoverChatId ? "group-hover:right-0" : ""}`}
                            >
                              <div
                                className="flex items-center justify-center rounded-md"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleToggleSave(chat.id);
                                }}
                              >
                                <BookmarkIcon
                                  weight="fill"
                                  className="hover:text-foreground size-4"
                                />
                              </div>
                              {/* <div
                                  className="flex items-center justify-center rounded-md"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    const shareLink =
                                      process.env.NEXT_PUBLIC_APP_URL +
                                      `/chat/share/${chat.id}`;
                                    navigator.clipboard.writeText(shareLink);
                                    toast.success(
                                      "Share link copied to clipboard",
                                    );
                                  }}
                                >
                                  <ShareFatIcon
                                    weight="fill"
                                    className="hover:text-foreground size-4"
                                  />
                                </div> */}
                              <div
                                className="flex items-center justify-center rounded-md"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleDeleteChat(chat.id);
                                }}
                              >
                                <TrashIcon
                                  weight="bold"
                                  className="hover:text-foreground size-4"
                                />
                              </div>
                            </div>
                          </Link>
                        </div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
            </SidebarMenu>

            <Separator className="my-2" />
            <SidebarGroupLabel className="p-0">
              <Badge
                variant="secondary"
                className="text-foreground flex items-center gap-2 rounded-lg"
              >
                <span className="font-semibold">Recent Chats</span>
              </Badge>
            </SidebarGroupLabel>

            <SidebarMenu className="mt-2 w-full p-0">
              {isLoading
                ? // Skeleton loader while loading saved chats
                Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-primary/15 mb-2 h-7 w-full animate-pulse rounded-md"
                  />
                ))
                : chats
                  ?.filter((chat: Chat) => !chat.isSaved)
                  .map((chat: Chat) => (
                    <SidebarMenuItem key={chat.id}>
                      <SidebarMenuButton
                        className="group hover:bg-primary/20 relative"
                        onMouseEnter={() => setHoverChatId(chat.id)}
                        onMouseLeave={() => setHoverChatId("")}
                        asChild
                      >
                        <div className="flex w-full items-center justify-between">
                          <Link href={`/ask/${chat.id}`}>
                            <span className="z-[-1]">
                              {getChatTitle(chat)}
                            </span>
                            <div
                              className={`absolute top-0 right-0 z-5 h-full w-12 rounded-r-md blur-[2em] ${chat.id === hoverChatId ? "bg-primary" : ""}`}
                            />
                            <div
                              className={`absolute top-1/2 -right-16 z-10 flex h-full -translate-y-1/2 items-center justify-center gap-1.5 rounded-r-md bg-transparent px-1 backdrop-blur-xl transition-all duration-200 ease-in-out ${chat.id === hoverChatId ? "group-hover:right-0" : ""}`}
                            >
                              <div
                                className="flex items-center justify-center rounded-md"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleToggleSave(chat.id);
                                }}
                              >
                                <BookmarkIcon
                                  weight={"bold"}
                                  className="hover:text-foreground size-4"
                                />
                              </div>

                              {/* <div
                                className="flex items-center justify-center rounded-md"
                                onClick={(e) => {
                                  e.preventDefault();
                                  const shareLink =
                                    process.env.NEXT_PUBLIC_APP_URL +
                                    `/chat/share/${chat.id}`;
                                  navigator.clipboard.writeText(shareLink);
                                  toast.success(
                                    "Share link copied to clipboard",
                                  );
                                }}
                              >
                                <ShareFatIcon
                                  weight="fill"
                                  className="hover:text-foreground size-4"
                                />
                              </div> */}

                              <div
                                className="flex items-center justify-center rounded-md"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleDeleteChat(chat.id);
                                }}
                              >
                                <TrashIcon
                                  weight={"bold"}
                                  className="hover:text-foreground size-4"
                                />
                              </div>
                            </div>
                          </Link>
                        </div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarFooter className="bg-background absolute bottom-0 z-70 h-24 w-full px-4 py-3">
          {session && (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src={session.user.image ?? "/default-avatar.png"}
                  alt={session.user.name ?? "User"}
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div className="flex flex-col text-sm">
                  <span className="font-medium text-zinc-900">
                    {session.user.name ?? "Anonymous"}
                  </span>
                  <span className="w-36 truncate text-xs text-zinc-500">
                    {session.user.email ?? ""}
                  </span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSignOut}
                className="text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100"
              >
                <SignOutIcon weight="bold" className="size-5" />
              </Button>
            </div>
          )}
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  );
}
