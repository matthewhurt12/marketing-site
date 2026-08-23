import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Check,
  Clock3,
  HeartHandshake,
  MapPinned,
  MessageCircleMore,
  Sparkles,
  UserRoundSearch,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";

type ExperienceStep = {
  eyebrow: string;
  title: string;
  body: string;
  icon: LucideIcon;
};

const steps: ExperienceStep[] = [
  {
    eyebrow: "01 · Conversation",
    title: "Start by being understood.",
    body: "Tell the matchmaker what feels like you, what you value, and the kind of night you would actually enjoy.",
    icon: MessageCircleMore,
  },
  {
    eyebrow: "02 · Introduction",
    title: "Receive one thoughtful match.",
    body: "No deck to clear. When there is someone worth considering, you get one focused introduction and the thinking behind it.",
    icon: UserRoundSearch,
  },
  {
    eyebrow: "03 · Invitation",
    title: "See the person and the plan.",
    body: "Who, why, where, and when—held together in one invitation so you can make a real decision.",
    icon: MapPinned,
  },
  {
    eyebrow: "04 · Mutual yes",
    title: "The date confirms together.",
    body: "An introduction is never an obligation. The plan becomes a date only after both people choose it.",
    icon: HeartHandshake,
  },
];

function ConversationStage() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-5">
        <div className="flex items-center gap-3">
          <img src="/brand-mark-192.png" alt="" className="h-8 w-8" />
          <div>
            <p className="font-display text-base font-semibold text-white">Your matchmaker</p>
            <p className="font-sans text-[9px] text-[#91d9c0]">Learning what matters</p>
          </div>
        </div>
        <span className="rounded-full border border-white/10 px-3 py-1 font-sans text-[8px] uppercase tracking-[0.16em] text-white/48">Product preview</span>
      </div>
      <div className="flex flex-1 flex-col justify-center gap-4 py-7">
        <div className="max-w-[88%] self-start rounded-[1.25rem] rounded-bl-md bg-white/[0.08] px-4 py-3 font-sans text-sm leading-relaxed text-white/76">
          What kind of evening makes you forget to check the time?
        </div>
        <div className="max-w-[82%] self-end rounded-[1.25rem] rounded-br-md bg-[#b48cff] px-4 py-3 font-sans text-sm leading-relaxed text-white shadow-[0_12px_32px_rgba(180,140,255,0.2)]">
          Somewhere relaxed. Good food, low music, and room for a real conversation.
        </div>
        <div className="flex flex-wrap gap-2 pt-2">
          {["Low-key", "Food worth sharing", "Conversation-first"].map((label) => (
            <span key={label} className="rounded-full border border-[#d6b8ff]/15 bg-[#d6b8ff]/[0.07] px-3 py-2 font-sans text-[9px] font-medium text-[#dac7ff]">
              {label}
            </span>
          ))}
        </div>
      </div>
      <p className="font-sans text-[9px] leading-relaxed text-white/32">The conversation is designed to feel human—not like a 40-question form.</p>
    </div>
  );
}

function MatchStage() {
  return (
    <div className="grid h-full gap-5 sm:grid-cols-[0.82fr_1.18fr]">
      <div className="relative min-h-[250px] overflow-hidden rounded-[1.5rem]">
        <img src="/alex-profile.webp" alt="Illustrative profile preview" loading="lazy" decoding="async" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#160e2d] via-transparent to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <p className="font-sans text-[8px] font-bold uppercase tracking-[0.18em] text-white/48">One introduction</p>
          <p className="mt-1 font-display text-2xl font-semibold text-white">Someone worth considering.</p>
        </div>
      </div>
      <div className="flex flex-col justify-center">
        <p className="font-sans text-[9px] font-bold uppercase tracking-[0.18em] text-[#d6b8ff]">Why this might work</p>
        <div className="mt-5 space-y-3">
          {[
            "You both prefer depth over performance.",
            "Your ideal nights share the same pace.",
            "There is enough overlap—and enough difference.",
          ].map((reason) => (
            <div key={reason} className="flex gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.045] p-3.5">
              <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#f1a9cc]" aria-hidden="true" />
              <p className="font-sans text-xs leading-relaxed text-white/64">{reason}</p>
            </div>
          ))}
        </div>
        <p className="mt-5 font-sans text-[9px] leading-relaxed text-white/30">Illustrative matching explanation. You always decide whether to continue.</p>
      </div>
    </div>
  );
}

function InvitationStage() {
  return (
    <div className="flex h-full flex-col">
      <div className="relative min-h-[190px] flex-1 overflow-hidden rounded-[1.5rem]">
        <img src="/onboarding/low-key.png" alt="A quiet tea date setting" loading="lazy" decoding="async" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#160e2d] via-[#160e2d]/20 to-transparent" />
        <div className="absolute bottom-5 left-5">
          <p className="font-sans text-[8px] font-bold uppercase tracking-[0.18em] text-white/52">The atmosphere</p>
          <p className="mt-1 font-display text-2xl font-semibold text-white">Quiet enough to stay awhile.</p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.045] p-4">
          <Clock3 className="h-4 w-4 text-[#d6b8ff]" aria-hidden="true" />
          <p className="mt-3 font-sans text-[8px] uppercase tracking-[0.16em] text-white/32">When</p>
          <p className="mt-1 font-sans text-xs font-medium text-white/72">Thursday · 7:30 PM</p>
        </div>
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.045] p-4">
          <MapPinned className="h-4 w-4 text-[#f1a9cc]" aria-hidden="true" />
          <p className="mt-3 font-sans text-[8px] uppercase tracking-[0.16em] text-white/32">Where</p>
          <p className="mt-1 font-sans text-xs font-medium text-white/72">A neighborhood favorite</p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-full border border-white/[0.12] px-5 py-3 text-center font-sans text-[9px] font-bold uppercase tracking-[0.16em] text-white/48">Pass</div>
        <div className="rounded-full bg-[#b48cff] px-5 py-3 text-center font-sans text-[9px] font-bold uppercase tracking-[0.16em] text-white">I&apos;m interested</div>
      </div>
    </div>
  );
}

function ConfirmedStage() {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center">
      <div className="relative flex h-32 w-32 items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-[#b48cff]/15 blur-2xl" />
        <img src="/brand-mark-192.png" alt="" className="relative h-24 w-24" />
        <span className="absolute bottom-3 right-2 flex h-8 w-8 items-center justify-center rounded-full border-4 border-[#1a1234] bg-[#8adcc1] text-[#163a30]">
          <Check className="h-4 w-4 stroke-[3]" aria-hidden="true" />
        </span>
      </div>
      <p className="mt-7 font-sans text-[9px] font-bold uppercase tracking-[0.22em] text-[#d6b8ff]">Mutual by design</p>
      <p className="mt-3 max-w-sm font-display text-4xl font-semibold leading-tight text-white">Both said yes.</p>
      <p className="mt-4 max-w-sm font-sans text-sm leading-relaxed text-white/52">
        The details are clear. The plan is shared. Now the best thing the product can do is get out of the way.
      </p>
      <div className="mt-7 rounded-full border border-white/[0.09] bg-white/[0.05] px-4 py-2 font-sans text-[9px] font-semibold uppercase tracking-[0.16em] text-white/45">
        Date confirmed
      </div>
    </div>
  );
}

const stages = [ConversationStage, MatchStage, InvitationStage, ConfirmedStage];

export default function ExperienceStory() {
  const [active, setActive] = useState(0);
  const reduceMotion = useReducedMotion();
  const ActiveStage = stages[active];

  return (
    <section id="how-it-works" className="relative bg-[#1a1234] px-5 py-24 sm:px-6 md:py-36">
      <div className="mx-auto max-w-[76rem]">
        <div className="max-w-3xl">
          <p className="font-sans text-[10px] font-bold uppercase tracking-[0.24em] text-[#f1a9cc]">What we&apos;re building</p>
          <h2 className="mt-5 text-balance font-display text-[clamp(3rem,6.4vw,6.2rem)] font-bold leading-[0.92] tracking-[-0.05em] text-white">
            One person. One plan. One decision.
          </h2>
          <p className="mt-6 max-w-2xl font-sans text-base leading-relaxed text-white/54 sm:text-lg">
            Every part of the experience points toward the same outcome: a date you can understand before you choose it.
          </p>
        </div>

        <div className="mt-16 flex gap-2 overflow-x-auto pb-3 lg:hidden">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <button
                key={step.eyebrow}
                type="button"
                onClick={() => setActive(index)}
                className={"flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 font-sans text-[9px] font-semibold transition " + (active === index ? "border-[#d6b8ff]/40 bg-[#d6b8ff]/15 text-white" : "border-white/10 text-white/40")}
                aria-pressed={active === index}
              >
                <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                {step.eyebrow.split(" · ")[1]}
              </button>
            );
          })}
        </div>

        <div className="mt-8 grid gap-12 lg:mt-20 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div className="hidden lg:block">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.article
                  key={step.eyebrow}
                  onViewportEnter={() => setActive(index)}
                  viewport={{ amount: 0.55 }}
                  className="flex min-h-[58vh] items-center border-l border-white/[0.08] pl-8"
                >
                  <div className={"transition duration-500 " + (active === index ? "opacity-100" : "opacity-35")}>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.05]">
                      <Icon className="h-4 w-4 text-[#d6b8ff]" aria-hidden="true" />
                    </div>
                    <p className="mt-6 font-sans text-[9px] font-bold uppercase tracking-[0.2em] text-[#d6b8ff]">{step.eyebrow}</p>
                    <h3 className="mt-3 max-w-md font-display text-4xl font-semibold leading-[1.02] text-white">{step.title}</h3>
                    <p className="mt-5 max-w-md font-sans text-sm leading-relaxed text-white/54">{step.body}</p>
                  </div>
                </motion.article>
              );
            })}
          </div>

          <div className="lg:sticky lg:top-28 lg:h-[calc(100vh-9rem)]">
            <div className="v2-product-shell relative min-h-[590px] overflow-hidden rounded-[2.5rem] border border-white/[0.11] p-3 shadow-[0_50px_120px_rgba(7,3,22,0.48)] sm:p-5 lg:h-full lg:min-h-0">
              <div className="flex h-full min-h-[564px] flex-col rounded-[1.9rem] border border-white/[0.08] bg-[rgba(23,16,47,0.82)] p-5 backdrop-blur-2xl sm:p-7 lg:min-h-0">
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex gap-1.5">
                    {steps.map((step, index) => (
                      <span key={step.eyebrow} className={"h-1.5 rounded-full transition-all duration-500 " + (index === active ? "w-8 bg-[#d6b8ff]" : "w-2 bg-white/15")} />
                    ))}
                  </div>
                  <p className="font-sans text-[8px] font-bold uppercase tracking-[0.18em] text-white/28">In Person · Preview</p>
                </div>
                <div className="min-h-0 flex-1">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={active}
                      initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reduceMotion ? undefined : { opacity: 0, y: -10 }}
                      transition={reduceMotion ? { duration: 0 } : { duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                      className="h-full"
                    >
                      <ActiveStage />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>

            <div className="mt-6 lg:hidden">
              <p className="font-sans text-[9px] font-bold uppercase tracking-[0.18em] text-[#d6b8ff]">{steps[active].eyebrow}</p>
              <h3 className="mt-3 font-display text-3xl font-semibold text-white">{steps[active].title}</h3>
              <p className="mt-3 font-sans text-sm leading-relaxed text-white/52">{steps[active].body}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
