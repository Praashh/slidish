"use client";

import { Twitter, Github } from "lucide-react";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="relative z-10 py-24 px-6 border-t border-zinc-200/20">
            <div className="max-w-7xl mx-auto flex flex-col items-center gap-6">

                {/* Icons */}
                <div className="flex items-center gap-8">
                    <Link
                        href="https://github.com/praashh"
                        target="_blank"
                        className="text-zinc-500 hover:text-zinc-900 transition-colors"
                    >
                        <Github className="w-5 h-5 transition-transform hover:scale-110" />
                    </Link>
                    <Link
                        href="https://x.com/10xpraash"
                        target="_blank"
                        className="text-zinc-500 hover:text-zinc-900 transition-colors"
                    >
                        <Twitter className="w-5 h-5 transition-transform hover:scale-110" />
                    </Link>
                </div>

                {/* Text */}
                <div className="flex items-center gap-1.5 text-xs font-medium tracking-wide text-zinc-500">
                    <span>built by</span>
                    <span className="font-bold text-zinc-900">praash</span>
                </div>

            </div>
        </footer>
    );
}
