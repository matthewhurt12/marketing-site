import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const statements = [
  { text: "Dating apps gave you a thousand faces.", color: "text-foreground" },
  { text: "Hundreds of matches. Nothing real.", color: "text-foreground" },
  { text: "What if you just… showed up?", color: "text-foreground" },
  { text: "We're doing the opposite.", color: "text-lilac" },
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
      className="py-24 md:py-36 px-6 flex items-center justify-center"
    >
      <div className="container-readable flex flex-col items-center gap-5 md:gap-7">
        {statements.map((s, i) => (
          <motion.p
            key={i}
            variants={lineVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            transition={{
              duration: 0.9,
              delay: i * 1.3,
              ease: [0.23, 1, 0.32, 1],
            }}
            className={`font-display text-3xl sm:text-4xl md:text-6xl font-bold tracking-normal text-center ${s.color}`}
          >
            {s.text}
          </motion.p>
        ))}
      </div>
    </section>
  );
}
