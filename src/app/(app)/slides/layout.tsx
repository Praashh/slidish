"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/slides";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SlidesLayoutInner({
    children,
}: {
    children: React.ReactNode;
}) {
    const searchParams = useSearchParams();
    const isPrintMode = searchParams.get("print-pdf") !== null;

    if (isPrintMode) {
        return <>{children}</>;
    }

    return (
        <SidebarProvider>
            <AppSidebar />
            {children}
        </SidebarProvider>
    );
}

export default function SlidesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <Suspense>
            <SlidesLayoutInner>{children}</SlidesLayoutInner>
        </Suspense>
    );
}
