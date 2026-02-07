"use client";

import * as React from "react";
import {
    Presentation,
    MagicWand,
    TextT,
    Quotes,
    Code,
    Image as ImageIcon,
    Layout,
    Gear,
    CaretLeft
} from "@phosphor-icons/react";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function AppSidebar() {
    const pathname = usePathname();

    const menuItems = [
        { title: "Generate", icon: MagicWand, href: "/slides", active: pathname === "/slides" },
        { title: "Library", icon: Presentation, href: "/slides/library", active: pathname === "/slides/library" },
        { title: "Settings", icon: Gear, href: "/slides/settings", active: pathname === "/slides/settings" },
    ];


    return (
        <Sidebar collapsible="icon" className="border-r border-zinc-200 bg-[#faf9f6]">
            <SidebarHeader className="h-20 flex items-center px-6 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:justify-center border-b border-zinc-100">
                <div className="flex items-center gap-2">
                    <div className="bg-white rounded-lg w-8 h-8 flex items-center justify-center overflow-hidden shadow-sm border border-zinc-200 shrink-0">
                        <img
                            src="/logo.png"
                            alt="Slidish Logo"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <span className="font-bold text-lg text-zinc-900 tracking-tight group-data-[collapsible=icon]:hidden">
                        Slidish
                    </span>
                </div>
            </SidebarHeader>

            <SidebarContent className="px-3 py-4 gap-6">
                <SidebarGroup>
                    <SidebarGroupLabel className="px-3 text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2">
                        Main
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {menuItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={item.active}
                                        tooltip={item.title}
                                        className={`transition-all duration-200 ${item.active ? 'bg-orange-50 text-orange-700 font-medium' : 'text-zinc-600 hover:bg-zinc-100'}`}
                                    >
                                        <Link href={item.href} className="flex items-center gap-3 px-3 py-6 rounded-xl">
                                            <item.icon weight={item.active ? "fill" : "regular"} size={22} className="shrink-0" />
                                            <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="p-4 group-data-[collapsible=icon]:p-2 border-t border-zinc-100">
                <div className="flex items-center gap-3 px-2 py-3 bg-white/50 border border-zinc-100 rounded-2xl shadow-sm group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
                    <div className="w-10 h-10 rounded-full bg-orange-100 border border-orange-200 flex items-center justify-center text-orange-700 font-bold shrink-0">
                        PV
                    </div>
                    <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                        <span className="text-sm font-semibold text-zinc-900">Prashant</span>
                        <Badge variant="secondary" className="w-fit text-[10px] bg-zinc-100 text-zinc-500 hover:bg-zinc-100">PREMIUM</Badge>
                    </div>
                </div>
            </SidebarFooter>
        </Sidebar>
    );
}
