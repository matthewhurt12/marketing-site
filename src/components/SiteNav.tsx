import { motion, useScroll, useTransform } from "framer-motion";

export default function SiteNav() {
  const { scrollY } = useScroll();
  const bgOpacity = useTransform(scrollY, [0, 100], [0, 1]);

  return (
    <motion.nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <motion.div
        className="absolute inset-0 border-b border-border/50 backdrop-blur-xl bg-background/70"
        style={{ opacity: bgOpacity }}
      />
      <div className="relative mx-auto flex max-w-5xl items-center justify-between">
        <a href="#" className="flex items-center gap-2.5">
          <img src="/logo.png" alt="In Person" className="h-8 w-8 drop-shadow-sm" />
          <span className="font-display text-lg font-light tracking-tight text-foreground">
            In Person
          </span>
        </a>
        <a
          href="#waitlist"
          className="bg-primary text-primary-foreground px-6 py-2.5 rounded-full text-xs font-medium tracking-widest uppercase aura-transition hover:opacity-90"
        >
          Join Waitlist
        </a>
      </div>
    </motion.nav>
  );
}
