import { motion, useScroll, useTransform } from "framer-motion";

export default function SiteNav() {
  const { scrollY } = useScroll();
  const shellOpacity = useTransform(scrollY, [0, 80], [0, 1]);

  return (
    <motion.nav className="fixed inset-x-0 top-0 z-50 px-4 py-4 sm:px-6" aria-label="Main navigation">
      <motion.div
        className="absolute inset-x-3 inset-y-2 rounded-full border border-white/[0.08] bg-[rgba(23,16,47,0.88)] shadow-[0_10px_40px_rgba(10,5,35,0.18)] backdrop-blur-2xl sm:inset-x-5"
        style={{ opacity: shellOpacity }}
        aria-hidden="true"
      />
      <div className="relative mx-auto flex max-w-[76rem] items-center justify-between px-2 sm:px-4">
        <a href="/" className="group flex items-center gap-3 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70">
          <img src="/brand-mark-192.png" alt="" className="h-9 w-9 transition-transform duration-500 group-hover:rotate-[-4deg] group-hover:scale-105" />
          <span className="font-display text-lg font-bold tracking-[-0.02em] text-white">In Person</span>
        </a>

        <div className="hidden items-center gap-8 font-sans text-xs font-medium text-white/56 md:flex">
          <a href="#how-it-works" className="transition hover:text-white">How it works</a>
          <a href="#why-in-person" className="transition hover:text-white">Why In Person</a>
          <a href="#questions" className="transition hover:text-white">Questions</a>
        </div>

        <a
          href="#waitlist"
          className="rounded-full border border-white/[0.14] bg-white/[0.07] px-4 py-2.5 font-sans text-[10px] font-bold uppercase tracking-[0.16em] text-white transition duration-300 hover:border-white/25 hover:bg-white/[0.12] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 sm:px-5"
        >
          Join the waitlist
        </a>
      </div>
    </motion.nav>
  );
}
