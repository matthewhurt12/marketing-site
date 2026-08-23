import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

const moments = [
  {
    src: "/onboarding/coffee.png",
    alt: "A warm cup of coffee on a wooden table",
    label: "Easy first conversation",
    className: "md:col-span-5 md:row-span-5",
  },
  {
    src: "/onboarding/art-gallery.png",
    alt: "A quiet contemporary art gallery",
    label: "Something to talk about",
    className: "md:col-span-7 md:row-span-3",
  },
  {
    src: "/onboarding/foodie.png",
    alt: "A colorful dinner made for sharing",
    label: "A table worth sharing",
    className: "md:col-span-4 md:row-span-3",
  },
  {
    src: "/onboarding/low-key.png",
    alt: "Tea and dessert in a calm setting",
    label: "A slower kind of night",
    className: "md:col-span-3 md:row-span-3",
  },
];

export default function DateLifeSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-[#f3edf0] px-5 py-24 text-[#211543] sm:px-6 md:py-36">
      <div className="absolute -right-32 -top-28 h-80 w-80 rounded-full bg-[#e9a7c9]/25 blur-3xl" aria-hidden="true" />
      <div className="mx-auto max-w-[76rem]">
        <div className="grid items-end gap-10 lg:grid-cols-[1fr_0.72fr]">
          <div>
            <p className="font-sans text-[10px] font-bold uppercase tracking-[0.24em] text-[#7558be]">The app ends here</p>
            <h2 className="mt-5 max-w-4xl text-balance font-display text-[clamp(3.4rem,7.4vw,7.4rem)] font-bold leading-[0.88] tracking-[-0.055em]">
              The date is part of the match.
            </h2>
          </div>
          <div className="lg:pb-2">
            <p className="font-sans text-base leading-relaxed text-[#211543]/64 sm:text-lg">
              A person can feel different in a quiet café than across a crowded bar. The plan is not an afterthought—it is part of giving chemistry a fair chance.
            </p>
            <div className="mt-6 flex items-center gap-2 font-sans text-[10px] font-bold uppercase tracking-[0.18em] text-[#7558be]">
              Person · Place · Pace
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </div>
          </div>
        </div>

        <div className="mt-16 grid gap-4 md:h-[760px] md:grid-cols-12 md:grid-rows-6">
          {moments.map((moment, index) => (
            <motion.figure
              key={moment.src}
              initial={reduceMotion ? false : { opacity: 0, y: 30 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.75, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className={"group relative min-h-[280px] overflow-hidden rounded-[2rem] bg-[#d8ccd4] " + moment.className}
            >
              <img
                src={moment.src}
                alt={moment.alt}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.035]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a1028]/75 via-transparent to-transparent" />
              <figcaption className="absolute bottom-5 left-5 rounded-full border border-white/20 bg-[#160f25]/45 px-4 py-2 font-sans text-[9px] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-lg">
                {moment.label}
              </figcaption>
            </motion.figure>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-6 border-t border-[#211543]/10 pt-8 sm:flex-row sm:items-end">
          <div>
            <p className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-[#7558be]">Our measure of success</p>
            <p className="mt-3 max-w-3xl font-display text-3xl font-semibold leading-tight sm:text-4xl">
              A good dating product gets out of the way.
            </p>
          </div>
          <p className="max-w-xs font-sans text-xs leading-relaxed text-[#211543]/48">
            Illustrative date settings shown to communicate the product direction. Launch experiences may vary.
          </p>
        </div>
      </div>
    </section>
  );
}
