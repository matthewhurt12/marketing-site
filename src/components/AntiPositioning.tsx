import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const statements = [
  { text: "No infinite scroll.", color: "text-foreground" },
  { text: "No opening lines to craft.", color: "text-foreground" },
  { text: "No ghosting.", color: "text-foreground" },
  { text: "No algorithm games.", color: "text-foreground" },
  { text: "No swiping. No app grind. Just connection.", color: "text-primary" },
];

function FadeUpLine({ text, color, delay }: { text: string; color: string; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <div ref={ref} className="py-6 md:py-8">
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{
          duration: 0.8,
          delay,
          ease: [0.23, 1, 0.32, 1],
        }}
        className={`font-display text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-center ${color}`}
      >
        {text}
      </motion.p>
    </div>
  );
}

export default function AntiPositioning() {
  return (
    <section className="py-32 md:py-48 px-6">
      <div className="mx-auto max-w-3xl">
        {statements.map((s, i) => (
          <FadeUpLine key={i} text={s.text} color={s.color} delay={i * 0.08} />
        ))}
      </div>
    </section>
  );
}
