import { ArrowRight, Layers3 } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

const faces = [
  { src: "/alex-profile.webp", position: "-rotate-6 -translate-x-4 translate-y-4" },
  { src: "/jordan-profile.webp", position: "rotate-3 translate-x-2 -translate-y-3" },
  { src: "/sam-profile.webp", position: "-rotate-2 translate-x-5 translate-y-6" },
];

export default function ProblemReset() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="why-in-person" className="relative overflow-hidden border-y border-white/[0.07] bg-[rgba(18,12,41,0.82)] px-5 py-24 sm:px-6 md:py-36">
      <div className="absolute inset-0 v2-dot-field" aria-hidden="true" />
      <div className="relative mx-auto grid max-w-[76rem] items-center gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="font-sans text-[10px] font-bold uppercase tracking-[0.24em] text-[#d6b8ff]">The part dating apps forgot</p>
          <h2 className="mt-5 max-w-2xl text-balance font-display text-[clamp(2.9rem,6vw,5.8rem)] font-bold leading-[0.94] tracking-[-0.045em] text-white">
            Matching was never the finish line.
          </h2>
          <p className="mt-7 max-w-xl font-sans text-base leading-relaxed text-white/58 sm:text-lg">
            The feed. The opening line. The stalled chat. The “what should we do?” In Person is
            being built to remove the work between wanting to meet and actually meeting.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.08] sm:max-w-lg">
            {["Less browsing.", "Less coordinating.", "Less wondering.", "More meeting."].map((line, index) => (
              <div key={line} className={"bg-[#17102f]/90 px-4 py-4 font-sans text-sm " + (index === 3 ? "text-[#f2a8cb]" : "text-white/62")}>
                {line}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, x: 30 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex flex-col gap-5 sm:min-h-[470px] sm:block"
        >
          <div className="relative flex w-full items-center justify-center sm:absolute sm:left-0 sm:top-8 sm:w-[58%]">
            <div className="relative h-[270px] w-[220px] sm:h-[330px] sm:w-[250px]">
              {faces.map((face, index) => (
                <motion.div
                  key={face.src}
                  animate={reduceMotion ? undefined : { y: [0, index % 2 ? 7 : -7, 0] }}
                  transition={{ duration: 5 + index, repeat: Infinity, ease: "easeInOut" }}
                  className={"absolute left-[18%] top-[8%] h-52 w-36 overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#211640] shadow-2xl sm:h-64 sm:w-44 sm:rounded-[1.75rem] " + face.position}
                  style={{ zIndex: faces.length - index }}
                >
                  <img src={face.src} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover saturate-[0.8]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#120c29]/90 via-transparent to-white/[0.05]" />
                  <div className="absolute bottom-4 left-4 right-4 space-y-2">
                    <div className="h-2 w-16 rounded-full bg-white/55" />
                    <div className="h-1.5 w-24 rounded-full bg-white/20" />
                  </div>
                </motion.div>
              ))}
              <div className="absolute -left-3 bottom-2 z-20 rounded-full border border-white/10 bg-[#211640]/90 px-3 py-2 backdrop-blur-xl">
                <span className="flex items-center gap-2 font-sans text-[8px] font-bold uppercase tracking-[0.16em] text-white/48">
                  <Layers3 className="h-3.5 w-3.5" aria-hidden="true" />
                  Endless options
                </span>
              </div>
            </div>
          </div>

          <div className="relative z-30 mx-auto w-fit rotate-90 rounded-full border border-white/10 bg-white/[0.07] p-3 text-white/42 backdrop-blur-xl sm:absolute sm:left-[48%] sm:top-1/2 sm:mx-0 sm:-translate-y-1/2 sm:rotate-0">
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </div>

          <div className="relative flex w-full items-center sm:absolute sm:bottom-5 sm:right-0 sm:top-0 sm:w-[48%]">
            <div className="w-full rounded-[2rem] border border-[#d6b8ff]/20 bg-gradient-to-br from-[#302054] to-[#1a1234] p-4 shadow-[0_30px_90px_rgba(8,3,25,0.55)] sm:p-5">
              <div className="rounded-[1.45rem] border border-white/10 bg-white/[0.055] p-5">
                <div className="flex items-center justify-between">
                  <img src="/brand-mark-192.png" alt="" className="h-8 w-8" />
                  <span className="rounded-full bg-[#b48cff]/15 px-2.5 py-1 font-sans text-[8px] font-bold uppercase tracking-[0.14em] text-[#d6b8ff]">One invitation</span>
                </div>
                <p className="mt-10 font-sans text-[8px] font-bold uppercase tracking-[0.18em] text-white/35">Instead of a feed</p>
                <p className="mt-2 font-display text-xl font-semibold leading-tight text-white sm:text-2xl">One person worth considering.</p>
                <div className="my-5 h-px bg-white/10" />
                <div className="space-y-3">
                  <div className="rounded-xl border border-white/[0.08] bg-black/10 p-3">
                    <p className="font-sans text-[8px] uppercase tracking-[0.16em] text-white/32">Why</p>
                    <p className="mt-1 font-sans text-xs text-white/68">A thoughtful reason, not a percentage.</p>
                  </div>
                  <div className="rounded-xl border border-white/[0.08] bg-black/10 p-3">
                    <p className="font-sans text-[8px] uppercase tracking-[0.16em] text-white/32">What next</p>
                    <p className="mt-1 font-sans text-xs text-white/68">A complete plan you can accept or pass.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <p className="relative mt-1 text-right font-sans text-[9px] font-semibold uppercase tracking-[0.18em] text-white/42 sm:absolute sm:-bottom-7 sm:right-0 sm:mt-0">
            Illustrative product experience
          </p>
        </motion.div>
      </div>
    </section>
  );
}
