"use client";
import { type MotionValue, motion, useTransform } from "framer-motion";

interface SideCardProps {
  icon: string;
  title: string;
  amount: string;
  status: string;
  id: string;
  rotation: number;
  progress: MotionValue<number>;
}

export default function SideCard({
  icon,
  title,
  amount,
  status,
  id,
  rotation,
  progress,
}: SideCardProps) {
  const currentRotation = useTransform(progress, [0, 1], [0, rotation]);

  return (
    <motion.div
      style={{ rotate: currentRotation }}
      whileHover={{ scale: 1.05, rotate: rotation * 0.8 }}
      className="bg-white/40 backdrop-blur-xl p-4 rounded-2xl shadow-[0_8px_40px_rgba(217,119,6,0.08)] border border-white/60 min-w-60 flex items-center gap-4 transition-all duration-500"
    >
      <div className="w-11 h-11 rounded-xl bg-linear-to-br from-orange-50 to-white flex items-center justify-center text-xl shadow-sm border border-orange-100/50">
        {icon}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <span className="font-bold text-zinc-800 text-sm whitespace-nowrap">
            {title}
          </span>
          <span className="font-black text-zinc-900 text-sm">{amount}</span>
        </div>
        <div className="flex items-center justify-between text-[9px] text-zinc-500 mt-0.5 uppercase tracking-tighter font-bold">
          <span>{status}</span>
          <span className="opacity-60">1a...{id}</span>
        </div>
      </div>
    </motion.div>
  );
}
