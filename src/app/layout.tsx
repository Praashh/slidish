import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Outfit } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { SessionProviderWrapper } from "@/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "Slidish - AI Powered Presentation Designer",
    template: "%s | Slidish",
  },
  description:
    "Create stunning, professional presentations in seconds with AI. Generate beautiful slides, export to PDF/PPT, and collaborate seamlessly. No design skills needed.",
  keywords: [
    "AI presentations",
    "slide generator",
    "presentation design",
    "AI slides",
    "PowerPoint alternative",
    "presentation tool",
    "slide maker",
    "AI presentation maker",
    "professional slides",
    "auto generate slides",
  ],
  authors: [{ name: "Slidish Team" }],
  creator: "Slidish",
  publisher: "Slidish",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://slidish.site",
    siteName: "Slidish",
    title: "Slidish - AI Powered Presentation Designer",
    description:
      "Create stunning, professional presentations in seconds with AI. No design skills needed.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Slidish - AI Powered Presentation Designer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Slidish - AI Powered Presentation Designer",
    description:
      "Create stunning, professional presentations in seconds with AI.",
    images: ["/og.png"],
    creator: "@10xpraash",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/logo.png",
  },
  manifest: "/manifest.json",
  metadataBase: new URL("https://slidish.site"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${outfit.variable} ${inter.variable} antialiased font-outfit`}
      >
        <SessionProviderWrapper>
          {children}
        </SessionProviderWrapper>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
