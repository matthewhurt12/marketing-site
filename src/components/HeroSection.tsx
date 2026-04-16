import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown } from "lucide-react";

const ease = [0.23, 1, 0.32, 1] as const;

export default function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.15]);
  const opacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const chevronOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
      <motion.div
        className="text-center"
        style={{ scale, opacity }}
      >
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1, ease }}
          className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground mb-5"
        >
          Dating, without the app part
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1.2, ease }}
          className="flex flex-col items-center mb-12 md:mb-16"
        >
          <img src="/logo.png" alt="" className="w-20 h-20 md:w-28 md:h-28 mb-6 drop-shadow-lg" />
          <h1 className="font-display text-6xl md:text-[15vw] font-light tracking-tight text-foreground leading-[0.9]">
            In Person
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8, ease }}
          className="flex flex-col items-center gap-4"
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 1, ease }}
            className="text-lg md:text-xl text-muted-foreground font-sans mb-8 max-w-md mx-auto"
          >
            An AI concierge plans your dates. You just show up.
          </motion.p>
          <a
            href="#waitlist"
            className="animate-cta-breathe bg-primary text-primary-foreground px-8 py-4 rounded-full text-sm font-medium tracking-widest uppercase aura-transition hover:opacity-90"
          >
            Join the Waitlist
          </a>
        </motion.div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-20 text-[10px] uppercase tracking-[0.25em] text-muted-foreground"
      >
        Scroll to see how it works ↓
      </motion.p>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 1 }}
        style={{ opacity: chevronOpacity }}
        className="absolute bottom-6 flex flex-col items-center gap-1"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-5 h-5 text-muted-foreground/50" />
        </motion.div>
      </motion.div>
    </section>
  );
}
