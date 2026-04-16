import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const statements = [
  { text: "You've spent hours swiping.", color: "text-foreground" },
  { text: "You've had conversations that went nowhere.", color: "text-foreground" },
  { text: "What if you just... showed up?", color: "text-foreground" },
  { text: "AI that thinks like a matchmaker, not an algorithm.", color: "text-primary" },
];

const lineVariants = {
  hidden: { opacity: 0, y: 16, filter: "blur(4px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
};

export default function IndictmentScroll() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });

  return (
    <section
      ref={ref}
      className="py-28 md:py-40 px-6 flex items-center justify-center"
    >
      <div className="mx-auto max-w-3xl flex flex-col items-center gap-5 md:gap-7">
        {statements.map((s, i) => (
          <motion.p
            key={i}
            variants={lineVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            transition={{
              duration: 0.6,
              delay: i * 0.8,
              ease: [0.23, 1, 0.32, 1],
            }}
            className={`font-display text-3xl sm:text-4xl md:text-6xl font-light tracking-tight text-center ${s.color}`}
          >
            {s.text}
          </motion.p>
        ))}
      </div>
    </section>
  );
}
