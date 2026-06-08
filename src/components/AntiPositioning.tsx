import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const statements = [
  { text: "No infinite scroll.", color: "text-foreground" },
  { text: "No opening lines to craft.", color: "text-foreground" },
  { text: "No ghosting. No maybes.", color: "text-foreground" },
  { text: "No marketplace of faces.", color: "text-foreground" },
  { text: "No small talk. No maybe. Just go.", color: "text-lilac" },
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
          duration: 1.2,
          delay,
          ease: [0.23, 1, 0.32, 1],
        }}
        className={`font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-normal text-center ${color}`}
      >
        {text}
      </motion.p>
    </div>
  );
}

export default function AntiPositioning() {
  return (
    <section className="py-24 md:py-36 px-6">
      <div className="container-readable">
        {statements.map((s, i) => (
          <FadeUpLine key={i} text={s.text} color={s.color} delay={i * 0.15} />
        ))}
      </div>
    </section>
  );
}
