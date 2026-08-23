import { ArrowDown, ArrowUpRight, CalendarDays, MapPin, Sparkles } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

const reveal = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0 },
};

export default function HeroSection() {
  const reduceMotion = useReducedMotion();
  const initial = reduceMotion ? "visible" : "hidden";

  return (
    <section className="relative min-h-[100svh] overflow-hidden px-5 pb-12 pt-28 sm:px-6 lg:pt-36">
      <div className="v2-hero-grid" aria-hidden="true" />
      <div className="v2-hero-glow v2-hero-glow-one" aria-hidden="true" />
      <div className="v2-hero-glow v2-hero-glow-two" aria-hidden="true" />

      <div className="relative mx-auto grid min-h-[calc(100svh-10rem)] max-w-[76rem] items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
        <motion.div
          initial={initial}
          animate="visible"
          transition={{ staggerChildren: 0.11, delayChildren: 0.15 }}
          className="relative z-10"
        >
          <motion.div
            variants={reveal}
            transition={{ duration: 0.8, ease }}
            className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.055] px-4 py-2 font-sans text-[10px] font-semibold uppercase tracking-[0.24em] text-white/70 backdrop-blur-xl"
          >
            <Sparkles className="h-3.5 w-3.5 text-[#f6a6ca]" aria-hidden="true" />
            Dating, arranged differently
          </motion.div>

          <motion.h1
            variants={reveal}
            transition={{ duration: 0.95, ease }}
            className="max-w-[760px] text-balance font-display text-[clamp(3.6rem,8.2vw,7.5rem)] font-bold leading-[0.88] tracking-[-0.055em] text-[#faf7ff]"
          >
            Dating should end in{" "}
            <span className="v2-text-gradient italic">a date.</span>
          </motion.h1>

          <motion.p
            variants={reveal}
            transition={{ duration: 0.85, ease }}
            className="mt-8 max-w-xl font-sans text-base leading-relaxed text-white/64 sm:text-lg sm:leading-relaxed"
          >
            In Person is being built around one thoughtful introduction and one complete plan.
            No feed to manage. No opening line to perfect. Just a reason to show up.
          </motion.p>

          <motion.div
            variants={reveal}
            transition={{ duration: 0.85, ease }}
            className="mt-10 flex flex-col items-start gap-5 sm:flex-row sm:items-center"
          >
            <a
              href="#waitlist"
              className="group inline-flex items-center gap-3 rounded-full bg-[#f7f2ff] px-6 py-3.5 font-sans text-sm font-semibold text-[#211543] shadow-[0_16px_60px_rgba(184,145,255,0.24)] transition duration-300 hover:-translate-y-0.5 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f7f2ff] focus-visible:ring-offset-4 focus-visible:ring-offset-[#1a1340]"
            >
              Request early access
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
            </a>
            <a
              href="#how-it-works"
              className="font-sans text-sm font-medium text-white/70 underline decoration-white/20 underline-offset-8 transition hover:text-white hover:decoration-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            >
              See the experience
            </a>
          </motion.div>

          <motion.p
            variants={reveal}
            transition={{ duration: 0.8, ease }}
            className="mt-9 font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-white/38"
          >
            In development · 18+ · Built for real-world chemistry
          </motion.p>
        </motion.div>

        <motion.div
          initial={reduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.94, y: 28 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.15, delay: 0.35, ease }}
          className="relative mx-auto w-full max-w-[540px] lg:ml-auto"
        >
          <div className="absolute -inset-8 rounded-[3rem] bg-[#b48cff]/10 blur-3xl" aria-hidden="true" />

          <div className="v2-invitation relative overflow-hidden rounded-[2.25rem] border border-white/[0.14] p-3 shadow-[0_40px_120px_rgba(10,5,35,0.55)] sm:p-4">
            <div className="rounded-[1.7rem] border border-white/[0.1] bg-[rgba(23,16,47,0.78)] p-5 backdrop-blur-2xl sm:p-7">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl border border-white/10 bg-white/[0.07] p-2.5">
                    <img src="/brand-mark-192.png" alt="" className="h-7 w-7" />
                  </div>
                  <div>
                    <p className="font-sans text-[9px] font-bold uppercase tracking-[0.22em] text-white/38">In Person</p>
                    <p className="mt-1 font-display text-lg font-semibold text-white">Your invitation</p>
                  </div>
                </div>
                <span className="rounded-full border border-[#ef9bc5]/25 bg-[#ef9bc5]/10 px-3 py-1.5 font-sans text-[9px] font-bold uppercase tracking-[0.16em] text-[#f4b6d4]">
                  Product preview
                </span>
              </div>

              <div className="my-6 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

              <div className="rounded-[1.5rem] border border-white/[0.1] bg-gradient-to-br from-white/[0.1] to-white/[0.035] p-5 sm:p-6">
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <p className="font-sans text-[9px] font-semibold uppercase tracking-[0.2em] text-[#d6b8ff]">The plan</p>
                    <p className="mt-2 font-display text-2xl font-semibold leading-tight text-white sm:text-3xl">
                      Low lights.<br />Long conversation.
                    </p>
                  </div>
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.06]">
                    <Sparkles className="h-4 w-4 text-[#f5afd1]" aria-hidden="true" />
                  </div>
                </div>

                <div className="mt-7 grid gap-3 sm:grid-cols-2">
                  <div className="flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-black/10 px-4 py-3">
                    <CalendarDays className="h-4 w-4 text-[#cbb0ff]" aria-hidden="true" />
                    <div>
                      <p className="font-sans text-[8px] font-bold uppercase tracking-[0.16em] text-white/35">When</p>
                      <p className="mt-0.5 font-sans text-xs font-medium text-white/82">Thursday · 7:30 PM</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-black/10 px-4 py-3">
                    <MapPin className="h-4 w-4 text-[#f4aacd]" aria-hidden="true" />
                    <div>
                      <p className="font-sans text-[8px] font-bold uppercase tracking-[0.16em] text-white/35">Where</p>
                      <p className="mt-0.5 font-sans text-xs font-medium text-white/82">A neighborhood favorite</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between rounded-2xl border border-[#b48cff]/15 bg-[#b48cff]/[0.08] px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#ed85bd] to-[#7f70ec]">
                      <span className="font-sans text-xs font-bold text-white">?</span>
                      <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#2a1c4d] bg-[#87dfc1]" />
                    </div>
                    <div>
                      <p className="font-sans text-[8px] font-bold uppercase tracking-[0.16em] text-white/35">Your match</p>
                      <p className="mt-0.5 font-sans text-xs font-medium text-white/82">Chosen with intention</p>
                    </div>
                  </div>
                  <span className="font-sans text-[9px] font-bold uppercase tracking-[0.14em] text-[#cdb6ff]">Revealed soon</span>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between gap-4">
                <p className="max-w-[220px] font-sans text-[10px] leading-relaxed text-white/35">
                  The person and the place, held together in one clear invitation.
                </p>
                <div className="rounded-full bg-[#b48cff] px-5 py-2.5 font-sans text-[10px] font-bold uppercase tracking-[0.16em] text-white shadow-[0_10px_28px_rgba(180,140,255,0.28)]">
                  I&apos;m in
                </div>
              </div>
            </div>
          </div>

          <motion.div
            animate={reduceMotion ? undefined : { y: [0, -8, 0] }}
            transition={{ duration: 4.6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -left-5 top-[22%] hidden rounded-2xl border border-white/10 bg-[#211640]/85 px-4 py-3 shadow-2xl backdrop-blur-xl sm:block lg:-left-12"
          >
            <p className="font-sans text-[8px] font-bold uppercase tracking-[0.18em] text-white/35">Matching mode</p>
            <p className="mt-1 font-display text-sm font-semibold text-white">One, not endless</p>
          </motion.div>
        </motion.div>
      </div>

      <a
        href="#how-it-works"
        aria-label="Scroll to see how In Person works"
        className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-white/35 transition hover:text-white/70 lg:flex"
      >
        <span className="font-sans text-[8px] font-bold uppercase tracking-[0.24em]">The story</span>
        <ArrowDown className="h-4 w-4" aria-hidden="true" />
      </a>
    </section>
  );
}
