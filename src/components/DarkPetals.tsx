import { motion, useReducedMotion } from "framer-motion";
import { useMemo } from "react";

const PETAL_COUNT = 6;

function Petal({
  delay,
  duration,
  startX,
  startY,
  size,
}: {
  delay: number;
  duration: number;
  startX: number;
  startY: number;
  size: number;
}) {
  return (
    <motion.div
      className="absolute bg-primary/25 blur-[0.5px]"
      style={{
        width: size,
        height: size * 0.55,
        borderRadius: "50% 0 50% 0",
      }}
      initial={{ x: `${startX}vw`, y: `${startY}vh`, opacity: 0, rotate: 0 }}
      animate={{
        x: [`${startX}vw`, `${startX - 25}vw`, `${startX - 45}vw`],
        y: [`${startY}vh`, `${startY + 35}vh`, "105vh"],
        opacity: [0, 0.7, 0],
        rotate: [0, 140, 300],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

export default function DarkPetals() {
  const reduced = useReducedMotion();
  const petals = useMemo(
    () =>
      Array.from({ length: PETAL_COUNT }, (_, i) => ({
        id: i,
        delay: i * 3,
        duration: 18 + Math.random() * 7,
        startX: 60 + Math.random() * 40,
        startY: -10 - Math.random() * 15,
        size: 10 + Math.random() * 8,
      })),
    []
  );

  if (reduced) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {petals.map((p) => (
        <Petal key={p.id} {...p} />
      ))}
    </div>
  );
}
