"use client";

import Image from "next/image";
import Link from "next/link";
import { memo } from "react";


const Navbar = memo(function Navbar() {
  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm md:max-w-md px-4">
      <div className="flex items-center justify-between bg-[#1a1a1a] px-3 py-1.5 rounded-full border border-white/10 shadow-xl">
        <div className="flex items-center gap-2 px-1">
          <div className="bg-white rounded-md w-7 h-7 flex items-center justify-center overflow-hidden border border-zinc-200">
            <Image
              src="/logo.png"
              alt="Slidish"
              width={28}
              height={28}
              className="w-full h-full object-cover"
              priority
            />
          </div>
          <span className="font-bold text-xs text-white inline-block">
            Slidish
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/slides">
            <button
              type="button"
              className="bg-white text-black px-4 py-1.5 rounded-full text-[11px] font-bold hover:bg-zinc-200 transition-colors shadow-sm"
            >
              Try Now
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
});

export default Navbar;
