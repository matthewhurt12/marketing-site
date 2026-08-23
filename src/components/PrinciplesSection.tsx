import { CheckCircle2, Eye, Focus, HeartHandshake, LogOut, SlidersHorizontal } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

const principles = [
  {
    icon: Focus,
    number: "01",
    title: "One at a time.",
    body: "A focused introduction makes room for a real point of view—not another profile in a pile.",
  },
  {
    icon: Eye,
    number: "02",
    title: "Clear before committed.",
    body: "See who, why, where, and when before you decide whether the invitation is right for you.",
  },
  {
    icon: HeartHandshake,
    number: "03",
    title: "Mutual by design.",
    body: "Nothing confirms until both people say yes. Interest is shared, never assumed.",
  },
  {
    icon: LogOut,
    number: "04",
    title: "Real-world first.",
    body: "Success is not more screen time. It is a plan you genuinely want to show up for.",
  },
];

const comparisons = [
  ["Browse hundreds", "Be understood"],
  ["Compete for attention", "Consider one introduction"],
  ["Negotiate the logistics", "Review one clear plan"],
  ["Stay in the app", "Go meet"],
];

export default function PrinciplesSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-[#120c29] px-5 py-24 sm:px-6 md:py-36">
      <div className="absolute inset-0 v2-principle-lines" aria-hidden="true" />
      <div className="relative mx-auto max-w-[76rem]">
        <div className="grid gap-10 lg:grid-cols-[1fr_0.72fr] lg:items-end">
          <div>
            <p className="font-sans text-[10px] font-bold uppercase tracking-[0.24em] text-[#f1a9cc]">The operating system</p>
            <h2 className="mt-5 max-w-4xl text-balance font-display text-[clamp(3.2rem,7vw,7rem)] font-bold leading-[0.9] tracking-[-0.055em] text-white">
              Designed to leave the app.
            </h2>
          </div>
          <p className="max-w-xl font-sans text-base leading-relaxed text-white/54 sm:text-lg">
            In Person is being shaped around a different incentive: less time managing dating, more confidence actually doing it.
          </p>
        </div>

        <div className="mt-16 grid gap-4 md:grid-cols-2">
          {principles.map((principle, index) => {
            const Icon = principle.icon;
            return (
              <motion.article
                key={principle.title}
                initial={reduceMotion ? false : { opacity: 0, y: 22 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.7, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="group rounded-[2rem] border border-white/[0.09] bg-white/[0.045] p-6 transition duration-500 hover:border-white/[0.15] hover:bg-white/[0.065] sm:p-8"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06]">
                    <Icon className="h-[18px] w-[18px] text-[#d6b8ff]" aria-hidden="true" />
                  </div>
                  <span className="font-sans text-[9px] font-bold tracking-[0.2em] text-white/22">{principle.number}</span>
                </div>
                <h3 className="mt-12 font-display text-3xl font-semibold text-white sm:text-4xl">{principle.title}</h3>
                <p className="mt-4 max-w-lg font-sans text-sm leading-relaxed text-white/48">{principle.body}</p>
              </motion.article>
            );
          })}
        </div>

        <div className="mt-24 grid overflow-hidden rounded-[2.25rem] border border-white/[0.1] bg-[rgba(26,18,52,0.76)] lg:grid-cols-[0.8fr_1.2fr]">
          <div className="border-b border-white/[0.08] p-7 sm:p-10 lg:border-b-0 lg:border-r">
            <SlidersHorizontal className="h-5 w-5 text-[#f1a9cc]" aria-hidden="true" />
            <p className="mt-8 font-sans text-[9px] font-bold uppercase tracking-[0.2em] text-[#f1a9cc]">The difference</p>
            <h3 className="mt-3 font-display text-4xl font-semibold leading-tight text-white">Not a marketplace of people.</h3>
            <p className="mt-5 font-sans text-sm leading-relaxed text-white/48">
              The matchmaker does the narrowing. You keep the judgment, attraction, and chemistry.
            </p>
          </div>

          <div className="p-5 sm:p-8">
            <div className="grid grid-cols-2 border-b border-white/[0.08] px-3 pb-4 font-sans text-[8px] font-bold uppercase tracking-[0.18em] text-white/30">
              <span>Typical app behavior</span>
              <span className="text-[#d6b8ff]">In Person direction</span>
            </div>
            {comparisons.map(([before, after]) => (
              <div key={before} className="grid grid-cols-2 items-center border-b border-white/[0.07] px-3 py-5 last:border-b-0">
                <span className="pr-4 font-sans text-xs text-white/36 line-through decoration-white/20 sm:text-sm">{before}</span>
                <span className="flex items-center gap-2 font-sans text-xs font-medium text-white/76 sm:text-sm">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-[#91d9c0]" aria-hidden="true" />
                  {after}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20 rounded-[2.25rem] border border-[#d6b8ff]/15 bg-gradient-to-br from-[#332052] to-[#1a1234] p-7 sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="font-sans text-[9px] font-bold uppercase tracking-[0.2em] text-[#d6b8ff]">Trust & agency</p>
              <h3 className="mt-3 font-display text-4xl font-semibold leading-tight text-white sm:text-5xl">Still your choice, every step.</h3>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                ["Your invitation", "Accept or pass without obligation."],
                ["Both people choose", "A plan confirms only after mutual interest."],
                ["The details are clear", "Review the person and the plan together."],
              ].map(([title, body]) => (
                <div key={title} className="rounded-2xl border border-white/[0.08] bg-black/10 p-4">
                  <p className="font-sans text-xs font-semibold text-white/76">{title}</p>
                  <p className="mt-2 font-sans text-[10px] leading-relaxed text-white/38">{body}</p>
                </div>
              ))}
            </div>
          </div>
          <p className="mt-8 border-t border-white/[0.08] pt-5 font-sans text-xs leading-relaxed text-white/48">
            In Person is still in development. Specific launch-market policies and safety features will be published before early access opens.
          </p>
        </div>
      </div>
    </section>
  );
}
