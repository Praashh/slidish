"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";
import FloatingSlides from "./floating-slides";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const contentY = useTransform(scrollYProgress, [0, 0.4], [0, -100]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const slidesX = useTransform(scrollYProgress, [0, 0.4], [0, 100]);
  const slidesRotation = useTransform(scrollYProgress, [0, 0.4], [0, 15]);

  return (
    <section ref={containerRef} className="relative min-h-[180vh]">
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        {/* Main Content Grid */}
        <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center z-20">

          <motion.div
            style={{ x: slidesX, rotateY: slidesRotation }}
            className="relative h-150 w-full hidden lg:block lg:translate-x-20"
          >

          </motion.div>

          {/* Right Side: Text and CTA */}
          <motion.div
            style={{ y: contentY, opacity: contentOpacity }}
            className="flex flex-col items-start lg:items-end gap-8 max-w-2xl lg:text-right"
          >
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full  backdrop-blur-md border  shadow-sm"
            >
              {/* <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              <span className="text-sm font-bold text-zinc-900 uppercase tracking-widest">AI-Powered Design</span> */}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-7xl md:text-8xl font-extrabold tracking-tight text-[#1a1a1a] leading-[0.9]"
            >
              Beyond the <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-600 via-orange-500 to-amber-500">
                Horizon.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl font-medium text-zinc-800/80 leading-relaxed max-w-lg"
            >
              Transform your raw ideas into cinematic presentations. Let AI handle the design while you focus on the vision.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap lg:flex-row-reverse gap-4"
            >
              <Link
                href="/slides"
                className="group relative bg-[#1a1a1a] text-white px-10 py-5 rounded-2xl font-bold shadow-2xl transition-all active:scale-95 overflow-hidden"
              >
                <div className="relative z-10 flex items-center gap-3">
                  <span>Start Creation</span>
                </div>
                <div className="absolute inset-0 bg-linear-to-r from-orange-600 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>

              <Link
                href="#features"
                className="bg-white/40 backdrop-blur-md text-zinc-900 px-10 py-5 rounded-2xl font-bold border border-white/60 hover:bg-white/60 transition-all shadow-sm"
              >
                Explore magic
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1.5 }}
              className="flex items-center gap-6 mt-4 lg:flex-row-reverse"
            >
              <div className="flex -space-x-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-12 h-12 rounded-full border-4 border-white overflow-hidden bg-zinc-200">
                    <img src={`https://i.pravatar.cc/150?u=${i}`} alt="user" />
                  </div>
                ))}
              </div>
              <p className="text-sm font-bold text-zinc-600 uppercase tracking-tighter">
                Joined by <span className="text-zinc-900">2,000+</span> creators
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div className="h-[80vh]" />
    </section>
  );
}

