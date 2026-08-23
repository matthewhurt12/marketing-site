import { motion, useScroll, useTransform } from "framer-motion";

export default function SiteNav() {
  const { scrollY } = useScroll();
  const shellOpacity = useTransform(scrollY, [0, 80], [0, 1]);

  return (
    <motion.nav className="fixed inset-x-0 top-0 z-50 px-4 py-4 sm:px-6" aria-label="Main navigation">
      <motion.div
        className="absolute inset-x-3 inset-y-2 rounded-full border border-white/[0.08] bg-[rgba(23,16,47,0.9)] shadow-[0_10px_40px_rgba(10,5,35,0.18)] backdrop-blur-2xl sm:inset-x-5"
        style={{ opacity: shellOpacity }}
        aria-hidden="true"
      />
      <div className="relative mx-auto flex max-w-[76rem] items-center justify-between px-2 sm:px-4">
        <a href="/" className="group flex items-center gap-3 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70">
          <img src="/brand-mark-192.png" alt="" className="h-9 w-9 transition-transform duration-500 group-hover:-rotate-3 group-hover:scale-105" />
          <span className="font-display text-lg font-bold tracking-[-0.02em] text-white">In Person</span>
        </a>

        <div className="flex items-center gap-3">
          <a href="#how-it-works" className="hidden font-sans text-xs font-medium text-white/55 transition hover:text-white sm:block">
            How it works
          </a>
          <a
            href="#waitlist"
            className="rounded-full border border-white/[0.14] bg-white/[0.08] px-4 py-2.5 font-sans text-[10px] font-bold uppercase tracking-[0.15em] text-white transition duration-300 hover:border-white/25 hover:bg-white/[0.13] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 sm:ml-4 sm:px-5"
          >
            Get early access
          </a>
        </div>
      </div>
    </motion.nav>
  );
}
