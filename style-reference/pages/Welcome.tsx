import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";

const PETAL_COUNT = 8;

const Petal = ({
  delay,
  duration,
  startX,
  startY,
  size,
  zIndex = 0,
}: {
  delay: number;
  duration: number;
  startX: number;
  startY: number;
  size: number;
  zIndex?: number;
}) => (
  <motion.div
    className="absolute bg-primary/25 blur-[0.5px]"
    style={{
      width: size,
      height: size * 0.55,
      borderRadius: "50% 0 50% 0",
      zIndex,
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

const Welcome = () => {
  const navigate = useNavigate();

  const petals = useMemo(
    () =>
      Array.from({ length: PETAL_COUNT }, (_, i) => ({
        id: i,
        delay: i * 2.2,
        duration: 14 + Math.random() * 5,
        startX: 65 + Math.random() * 35,
        startY: -8 - Math.random() * 15,
        size: 10 + Math.random() * 8,
        zIndex: 0,
      })),
    []
  );

  // One special petal that drifts near the title area (behind text, z-0)
  const titlePetal = useMemo(
    () => ({
      delay: 6,
      duration: 18,
      startX: 80,
      startY: 30,
      size: 14,
      zIndex: 0,
    }),
    []
  );

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background overflow-hidden">
      {/* Background petals */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {petals.map((p) => (
          <Petal key={p.id} {...p} />
        ))}
        {/* Occasional petal near title area */}
        <Petal {...titlePetal} />
      </div>

      {/* Content — z-10 so text is always in front */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, ease: [0.23, 1, 0.32, 1] }}
        className="relative z-10 text-center px-8"
      >
        {/* Tagline first — smaller, lighter */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1, ease: [0.23, 1, 0.32, 1] }}
          className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground mb-5"
        >
          Meet people the way it should happen
        </motion.p>

        {/* Product name — large focal point */}
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
          className="font-display text-6xl font-light tracking-tight text-foreground mb-16"
        >
          In Person
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          className="flex flex-col gap-4 max-w-xs mx-auto"
        >
          <button
            onClick={() => navigate("/onboarding")}
            className="flex items-center gap-4 bg-primary text-primary-foreground px-8 py-4 rounded-full text-sm font-medium tracking-widest uppercase aura-transition hover:bg-aura-charcoal w-full justify-center"
          >
            Let's get to know you
          </button>
        </motion.div>
      </motion.div>

      {/* Bottom tagline */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-12 text-[10px] uppercase tracking-[0.25em] text-muted-foreground z-10"
      >
        No swiping · No messaging · Just connection
      </motion.p>
    </div>
  );
};

export default Welcome;
