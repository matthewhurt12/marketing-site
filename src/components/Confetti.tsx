import { useMemo } from "react";
import { motion } from "framer-motion";

const COLORS = ["#5d48db", "#8F7CFF", "#FFC857", "#FF6B9A", "#4CC9F0", "#2f9f6b"];

/** Lightweight one-shot confetti burst from the center. No library. */
export default function Confetti({ count = 18 }: { count?: number }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        x: (Math.random() - 0.5) * 210,
        y: (Math.random() - 0.62) * 240,
        rot: Math.random() * 420 - 60,
        color: COLORS[i % COLORS.length],
        delay: Math.random() * 0.12,
        w: 5 + Math.random() * 3,
        h: 8 + Math.random() * 5,
      })),
    [count]
  );

  return (
    <div className="pointer-events-none absolute inset-0 z-40 flex items-center justify-center overflow-hidden">
      {pieces.map((p, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 1, x: 0, y: -10, rotate: 0 }}
          animate={{ opacity: 0, x: p.x, y: p.y, rotate: p.rot }}
          transition={{ duration: 1.3, delay: p.delay, ease: "easeOut" }}
          className="absolute rounded-[1px]"
          style={{ width: p.w, height: p.h, background: p.color }}
        />
      ))}
    </div>
  );
}
