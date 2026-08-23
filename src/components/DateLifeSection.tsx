import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

const moments = [
  {
    src: "/onboarding/coffee.png",
    alt: "A warm cup of coffee on a wooden table",
    label: "Coffee that turns into dinner",
    className: "col-span-2 md:col-span-7 md:row-span-2",
  },
  {
    src: "/onboarding/art-gallery.png",
    alt: "A quiet contemporary art gallery",
    label: "Something to talk about",
    className: "col-span-1 md:col-span-5",
  },
  {
    src: "/onboarding/foodie.png",
    alt: "A colorful dinner made for sharing",
    label: "A table worth sharing",
    className: "col-span-1 md:col-span-5",
  },
];

export default function DateLifeSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-[#120c29] px-5 py-24 text-white sm:px-6 md:py-32">
      <div className="v2-principle-lines absolute inset-0" aria-hidden="true" />
      <div className="relative mx-auto max-w-[76rem]">
        <div className="grid gap-9 lg:grid-cols-[1fr_0.62fr] lg:items-end">
          <div>
            <p className="font-sans text-[10px] font-bold uppercase tracking-[0.24em] text-[#f1a9cc]">The whole point</p>
            <h2 className="mt-5 max-w-5xl text-balance font-display text-[clamp(4rem,8.8vw,8.5rem)] font-bold leading-[0.84] tracking-[-0.06em]">
              Get off the app.<br />Go on the date.
            </h2>
          </div>
          <div className="lg:pb-2">
            <p className="font-sans text-lg leading-relaxed text-white/58">
              Not another pen pal. Not more screen time. A real plan with someone you&apos;re excited to meet.
            </p>
            <a href="#waitlist" className="mt-6 inline-flex items-center gap-2 font-sans text-[10px] font-bold uppercase tracking-[0.18em] text-[#d6b8ff] transition hover:text-white">
              I want in
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-4 md:h-[620px] md:grid-cols-12 md:grid-rows-2">
          {moments.map((moment, index) => (
            <motion.figure
              key={moment.src}
              initial={reduceMotion ? false : { opacity: 0, y: 24 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.75, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className={"group relative min-h-[220px] overflow-hidden rounded-[2rem] border border-white/[0.08] bg-[#211640] md:min-h-[280px] " + moment.className}
            >
              <img
                src={moment.src}
                alt={moment.alt}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.035]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#120c29]/75 via-transparent to-transparent" />
              <figcaption className="absolute bottom-5 left-5 rounded-full border border-white/20 bg-[#120c29]/45 px-4 py-2 font-sans text-[9px] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-lg">
                {moment.label}
              </figcaption>
            </motion.figure>
          ))}
        </div>

        <p className="mt-5 text-right font-sans text-[9px] text-white/30">Illustrative date settings. Launch experiences may vary.</p>
      </div>
    </section>
  );
}
