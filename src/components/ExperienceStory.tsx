import { Clock3, HeartHandshake, MapPin, MessageCircleMore, Sparkles } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

const steps = [
  {
    number: "01",
    eyebrow: "Talk",
    title: "Tell it what you’re into.",
    body: "A quick conversation helps your AI matchmaker understand your type, your pace, and your kind of night.",
  },
  {
    number: "02",
    eyebrow: "Match",
    title: "Get one person worth meeting.",
    body: "No endless deck. One thoughtful introduction, plus the reason it could actually work.",
  },
  {
    number: "03",
    eyebrow: "Meet",
    title: "Both say yes. Go on the date.",
    body: "The person, place, and time arrive together. You choose. They choose. Then you meet.",
  },
];

function TalkPreview() {
  return (
    <div className="flex h-full flex-col rounded-[1.7rem] border border-white/[0.08] bg-[#17102f] p-5 text-white">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#b48cff]/15">
          <MessageCircleMore className="h-4 w-4 text-[#d6b8ff]" aria-hidden="true" />
        </span>
        <div>
          <p className="font-display text-base font-semibold">Your AI matchmaker</p>
          <p className="font-sans text-[9px] text-[#91d9c0]">Learning your vibe</p>
        </div>
      </div>
      <div className="flex flex-1 flex-col justify-center gap-3 py-7">
        <div className="max-w-[88%] rounded-[1.2rem] rounded-bl-md bg-white/[0.07] px-4 py-3 font-sans text-xs leading-relaxed text-white/72">
          Perfect first date energy?
        </div>
        <div className="ml-auto max-w-[82%] rounded-[1.2rem] rounded-br-md bg-[#b48cff] px-4 py-3 font-sans text-xs leading-relaxed text-white">
          Low-key. Good food. Somewhere we can actually talk.
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {["Low-key", "Foodie", "Conversation > chaos"].map((tag) => (
          <span key={tag} className="rounded-full border border-white/[0.08] bg-white/[0.045] px-3 py-2 font-sans text-[8px] font-medium text-white/46">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

function MatchPreview() {
  return (
    <div className="relative h-full overflow-hidden rounded-[1.7rem] bg-[#211640] text-white">
      <img src="/alex-profile.webp" alt="Illustrative match preview" loading="lazy" decoding="async" className="h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#120c29] via-[#120c29]/45 to-transparent" />
      <div className="absolute inset-x-5 bottom-5">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/20 px-3 py-1.5 font-sans text-[8px] font-bold uppercase tracking-[0.14em] text-white/72 backdrop-blur-lg">
          <Sparkles className="h-3 w-3 text-[#f1a9cc]" aria-hidden="true" />
          Why it could work
        </span>
        <p className="mt-4 font-display text-3xl font-semibold leading-tight">Same pace.<br />Different stories.</p>
        <p className="mt-3 max-w-xs font-sans text-xs leading-relaxed text-white/58">One introduction. Enough context to feel curious. Zero pressure to say yes.</p>
      </div>
    </div>
  );
}

function MeetPreview() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-[1.7rem] bg-[#211640] text-white">
      <div className="relative min-h-0 flex-1 overflow-hidden">
        <img src="/onboarding/low-key.png" alt="Illustrative low-key date setting" loading="lazy" decoding="async" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#17102f] via-transparent to-transparent" />
        <span className="absolute left-5 top-5 rounded-full border border-white/15 bg-[#120c29]/45 px-3 py-1.5 font-sans text-[8px] font-bold uppercase tracking-[0.15em] text-white/72 backdrop-blur-lg">
          Your date
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2.5 p-4">
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.045] p-3">
          <Clock3 className="h-4 w-4 text-[#d6b8ff]" aria-hidden="true" />
          <p className="mt-3 font-sans text-[8px] uppercase tracking-[0.15em] text-white/32">When</p>
          <p className="mt-1 font-sans text-xs font-medium text-white/74">Thursday · 7:30</p>
        </div>
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.045] p-3">
          <MapPin className="h-4 w-4 text-[#f1a9cc]" aria-hidden="true" />
          <p className="mt-3 font-sans text-[8px] uppercase tracking-[0.15em] text-white/32">Where</p>
          <p className="mt-1 font-sans text-xs font-medium text-white/74">Somewhere low-key</p>
        </div>
      </div>
    </div>
  );
}

const previews = [TalkPreview, MatchPreview, MeetPreview];

export default function ExperienceStory() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="how-it-works" className="relative overflow-hidden bg-[#f3edf0] px-5 py-24 text-[#211543] sm:px-6 md:py-32">
      <div className="absolute -right-40 top-12 h-96 w-96 rounded-full bg-[#e9a7c9]/25 blur-3xl" aria-hidden="true" />
      <div className="relative mx-auto max-w-[76rem]">
        <div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
          <div>
            <p className="font-sans text-[10px] font-bold uppercase tracking-[0.24em] text-[#7558be]">Three moves. That’s it.</p>
            <h2 className="mt-5 font-display text-[clamp(3.8rem,8vw,8rem)] font-bold leading-[0.84] tracking-[-0.06em]">
              Talk. Match. Meet.
            </h2>
          </div>
          <p className="max-w-md font-sans text-base leading-relaxed text-[#211543]/58 sm:text-lg">
            The AI does the narrowing and the planning. You keep the choice.
          </p>
        </div>

        <div className="mt-14 grid gap-4 lg:grid-cols-3">
          {steps.map((step, index) => {
            const Preview = previews[index];
            return (
              <motion.article
                key={step.number}
                initial={reduceMotion ? false : { opacity: 0, y: 24 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.7, delay: index * 0.08, ease }}
                className="rounded-[2.25rem] border border-[#211543]/10 bg-white/45 p-3 shadow-[0_24px_80px_rgba(43,26,77,0.08)]"
              >
                <div className="h-[300px] sm:h-[360px] lg:h-[390px]">
                  <Preview />
                </div>
                <div className="px-3 pb-4 pt-6">
                  <div className="flex items-center justify-between">
                    <p className="font-sans text-[9px] font-bold uppercase tracking-[0.2em] text-[#7558be]">{step.eyebrow}</p>
                    <span className="font-sans text-[9px] font-bold text-[#211543]/24">{step.number}</span>
                  </div>
                  <h3 className="mt-3 font-display text-3xl font-semibold leading-[1.02]">{step.title}</h3>
                  <p className="mt-4 font-sans text-sm leading-relaxed text-[#211543]/52">{step.body}</p>
                </div>
              </motion.article>
            );
          })}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-2 font-sans text-[9px] font-semibold uppercase tracking-[0.15em] text-[#211543]/46">
          {["One at a time", "Both people choose", "Pass anytime"].map((item) => (
            <span key={item} className="inline-flex items-center gap-2 rounded-full border border-[#211543]/10 bg-white/40 px-4 py-2.5">
              <HeartHandshake className="h-3.5 w-3.5 text-[#7558be]" aria-hidden="true" />
              {item}
            </span>
          ))}
          <span className="font-sans text-[9px] font-semibold normal-case tracking-normal text-[#211543]/34">Product previews are illustrative.</span>
        </div>
      </div>
    </section>
  );
}
