import {
  ArrowDown,
  ArrowUpRight,
  HeartHandshake,
  MapPin,
  MessageCircleMore,
  Sparkles,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

const reveal = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0 },
};

const flow = [
  { icon: MessageCircleMore, label: "You talk", detail: "AI gets your vibe" },
  { icon: HeartHandshake, label: "It matches", detail: "One person, not 100" },
  { icon: MapPin, label: "You meet", detail: "The date is planned" },
];

export default function HeroSection() {
  const reduceMotion = useReducedMotion();
  const initial = reduceMotion ? "visible" : "hidden";

  return (
    <section className="relative min-h-[100svh] overflow-hidden px-5 pb-14 pt-28 sm:px-6 lg:pt-32">
      <div className="v2-hero-grid" aria-hidden="true" />
      <div className="v2-hero-glow v2-hero-glow-one" aria-hidden="true" />
      <div className="v2-hero-glow v2-hero-glow-two" aria-hidden="true" />

      <div className="relative mx-auto grid min-h-[calc(100svh-9rem)] max-w-[76rem] items-center gap-14 lg:grid-cols-[1.04fr_0.96fr] lg:gap-10">
        <motion.div
          initial={initial}
          animate="visible"
          transition={{ staggerChildren: 0.1, delayChildren: 0.12 }}
          className="relative z-10"
        >
          <motion.div
            variants={reveal}
            transition={{ duration: 0.75, ease }}
            className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#f1a9cc]/20 bg-[#f1a9cc]/10 px-4 py-2 font-sans text-[10px] font-bold uppercase tracking-[0.22em] text-[#ffc5df] backdrop-blur-xl"
          >
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            Meet your AI matchmaker
          </motion.div>

          <motion.h1
            variants={reveal}
            transition={{ duration: 0.9, ease }}
            className="max-w-[760px] text-balance font-display text-[clamp(4rem,8.8vw,8rem)] font-bold leading-[0.84] tracking-[-0.058em] text-[#faf7ff]"
          >
            Less swiping.
            <span className="mt-2 block v2-text-gradient italic">More actual dates.</span>
          </motion.h1>

          <motion.p
            variants={reveal}
            transition={{ duration: 0.8, ease }}
            className="mt-8 max-w-xl font-sans text-base leading-relaxed text-white/68 sm:text-xl sm:leading-relaxed"
          >
            In Person learns your type, finds one person worth meeting, and plans the date.
            You just decide if you&apos;re in.
          </motion.p>

          <motion.div
            variants={reveal}
            transition={{ duration: 0.8, ease }}
            className="mt-10 flex flex-col items-start gap-5 sm:flex-row sm:items-center"
          >
            <a
              href="#waitlist"
              className="group inline-flex items-center gap-3 rounded-full bg-[#f7f2ff] px-7 py-4 font-sans text-sm font-semibold text-[#211543] shadow-[0_18px_70px_rgba(184,145,255,0.28)] transition duration-300 hover:-translate-y-0.5 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Get early access
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
            </a>
            <a
              href="#how-it-works"
              className="font-sans text-sm font-medium text-white/68 underline decoration-white/20 underline-offset-8 transition hover:text-white hover:decoration-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            >
              See how it works
            </a>
          </motion.div>

          <motion.p
            variants={reveal}
            transition={{ duration: 0.75, ease }}
            className="mt-9 font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-white/42"
          >
            AI matchmaking · One at a time · 18+
          </motion.p>
        </motion.div>

        <motion.div
          initial={reduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.95, y: 28 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.05, delay: 0.25, ease }}
          className="relative mx-auto w-full max-w-[540px] lg:ml-auto"
        >
          <div className="absolute -inset-10 rounded-[4rem] bg-[#b48cff]/15 blur-3xl" aria-hidden="true" />
          <div className="v2-invitation relative overflow-hidden rounded-[2.35rem] border border-white/[0.14] p-3 shadow-[0_45px_130px_rgba(8,3,25,0.58)] sm:p-4">
            <div className="rounded-[1.8rem] border border-white/[0.09] bg-[rgba(20,13,43,0.82)] p-5 backdrop-blur-2xl sm:p-7">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img src="/brand-mark-192.png" alt="" className="h-10 w-10" />
                  <div>
                    <p className="font-display text-lg font-semibold text-white">Your AI matchmaker</p>
                    <p className="mt-0.5 font-sans text-[9px] font-medium text-[#91d9c0]">Getting your vibe</p>
                  </div>
                </div>
                <span className="rounded-full border border-white/10 px-3 py-1.5 font-sans text-[8px] font-bold uppercase tracking-[0.15em] text-white/45">
                  Product preview
                </span>
              </div>

              <div className="mt-6 space-y-3">
                <div className="max-w-[86%] rounded-[1.35rem] rounded-bl-md border border-white/[0.07] bg-white/[0.07] px-4 py-3.5 font-sans text-sm leading-relaxed text-white/78">
                  What kind of person makes you lose track of time?
                </div>
                <div className="ml-auto max-w-[82%] rounded-[1.35rem] rounded-br-md bg-gradient-to-br from-[#b48cff] to-[#8e6ce8] px-4 py-3.5 font-sans text-sm leading-relaxed text-white shadow-[0_14px_36px_rgba(180,140,255,0.2)]">
                  Curious. Funny without trying. Down for something low-key.
                </div>
              </div>

              <div className="my-6 h-px bg-gradient-to-r from-transparent via-white/12 to-transparent" />

              <div className="grid grid-cols-3 gap-2.5">
                {flow.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="relative rounded-2xl border border-white/[0.08] bg-white/[0.045] p-3 sm:p-3.5">
                      <div className="flex items-center justify-between">
                        <Icon className="h-4 w-4 text-[#d6b8ff]" aria-hidden="true" />
                        <span className="font-sans text-[8px] font-bold text-white/24">0{index + 1}</span>
                      </div>
                      <p className="mt-4 font-display text-sm font-semibold text-white sm:mt-5 sm:text-base">{item.label}</p>
                      <p className="mt-1 hidden font-sans text-[9px] leading-relaxed text-white/42 sm:block">{item.detail}</p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 flex items-center justify-between gap-4 rounded-2xl border border-[#f1a9cc]/15 bg-[#f1a9cc]/[0.07] px-4 py-3.5">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f1a9cc]/15">
                    <MapPin className="h-4 w-4 text-[#ffc0dd]" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="font-sans text-[8px] font-bold uppercase tracking-[0.16em] text-white/32">The goal</p>
                    <p className="mt-0.5 font-sans text-xs font-semibold text-white/82">A real plan with a real person</p>
                  </div>
                </div>
                <span className="font-sans text-[9px] font-bold uppercase tracking-[0.14em] text-[#f5b6d4]">IRL</span>
              </div>
            </div>
          </div>

          <motion.div
            animate={reduceMotion ? undefined : { y: [0, -8, 0], rotate: [0, -1, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -left-4 top-[18%] hidden rounded-2xl border border-white/10 bg-[#211640]/90 px-4 py-3 shadow-2xl backdrop-blur-xl sm:block lg:-left-10"
          >
            <p className="font-sans text-[8px] font-bold uppercase tracking-[0.18em] text-white/38">Current status</p>
            <p className="mt-1 font-display text-sm font-semibold text-white">No more endless deck</p>
          </motion.div>
        </motion.div>
      </div>

      <a
        href="#how-it-works"
        aria-label="See how In Person works"
        className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-white/35 transition hover:text-white/70 lg:flex"
      >
        <span className="font-sans text-[8px] font-bold uppercase tracking-[0.24em]">How it works</span>
        <ArrowDown className="h-4 w-4" aria-hidden="true" />
      </a>
    </section>
  );
}
