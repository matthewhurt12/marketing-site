import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";
import AppDemoInterview from "./AppDemoInterview";
import AppDemoVibes from "./AppDemoVibes";
import AppDemoProposal from "./AppDemoProposal";
import Confetti from "./Confetti";

type Scene = "interview" | "vibes" | "matching" | "proposal" | "confirmed";

const captions: Record<Scene, string> = {
  interview: "A real conversation. Not a questionnaire.",
  vibes: "You pick the kind of night.",
  matching: "One match, chosen with intention.",
  proposal: "A person — and a plan.",
  confirmed: "Then you just show up.",
};

const progressFor: Record<Scene, number> = {
  interview: 0.5,
  vibes: 0.78,
  matching: 0.92,
  proposal: 1,
  confirmed: 1,
};

const MATCHING_MS = 1500;
const CONFIRMED_MS = 2900;

function TopBar({ progress }: { progress: number }) {
  return (
    <div className="flex flex-none flex-col items-center gap-2 pb-3">
      <div className="flex items-center gap-1.5">
        <img src="/logo.png" alt="" className="h-5 w-5" />
        <span className="font-display text-[12px] font-bold text-white">In Person</span>
      </div>
      <div className="h-1 w-[68%] overflow-hidden rounded-full bg-white/15">
        <motion.div
          className="h-full rounded-full bg-[#b48cff]"
          initial={false}
          animate={{ width: `${Math.round(progress * 100)}%` }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        />
      </div>
    </div>
  );
}

function Matching() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-5 px-8 text-center">
      <div className="relative h-16 w-16">
        <span className="absolute inset-0 rounded-full bg-[#b48cff]/15 animate-aura-pulse" />
        <span
          className="absolute inset-0 rounded-full bg-[#b48cff]/15 animate-aura-pulse"
          style={{ animationDelay: "1.2s" }}
        />
        <span className="absolute inset-[38%] rounded-full bg-[#b48cff]" />
      </div>
      <p className="max-w-[230px] font-display text-lg font-bold leading-snug text-white">
        Finding someone you'll enjoy meeting…
      </p>
    </div>
  );
}

function Confirmed() {
  return (
    <div className="relative flex h-full flex-col items-center justify-center gap-3 px-8 text-center">
      <Confetti count={22} />
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 14 }}
        className="flex h-16 w-16 items-center justify-center rounded-full bg-[#b48cff]/20"
      >
        <Check className="h-8 w-8 stroke-[2.5] text-[#b48cff]" />
      </motion.div>
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#b48cff]">Plan set</p>
      <p className="font-display text-2xl font-bold text-white">Your date is confirmed</p>
      <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] text-white/80">
        Confirmed · Chat opens 10 min before
      </span>
    </div>
  );
}

export default function AppDemo() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: false, margin: "-20%" });
  const reduced = useReducedMotion();
  const [scene, setScene] = useState<Scene>("interview");
  const [started, setStarted] = useState(false);

  // Reduced motion: hold the proposal (the payoff frame) statically.
  useEffect(() => {
    if (reduced) {
      setStarted(true);
      setScene("proposal");
    }
  }, [reduced]);

  // Start the loop when scrolled into view; reset when it leaves.
  useEffect(() => {
    if (reduced) return;
    if (isInView && !started) {
      setStarted(true);
      setScene("interview");
    }
  }, [isInView, started, reduced]);

  useEffect(() => {
    if (reduced) return;
    if (!isInView && started) {
      setStarted(false);
      setScene("interview");
    }
  }, [isInView, started, reduced]);

  const go = useCallback((next: Scene) => setScene(next), []);

  // Timed bridges (scenes without an onComplete child).
  useEffect(() => {
    if (!started || reduced) return;
    if (scene === "matching") {
      const t = setTimeout(() => go("proposal"), MATCHING_MS);
      return () => clearTimeout(t);
    }
    if (scene === "confirmed") {
      const t = setTimeout(() => go("interview"), CONFIRMED_MS);
      return () => clearTimeout(t);
    }
  }, [scene, started, reduced, go]);

  const showTopBar = scene === "interview" || scene === "vibes";

  return (
    <section ref={sectionRef} className="py-24 md:py-36 px-6">
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        className="mb-12 text-center text-[11px] uppercase tracking-[0.3em] text-muted-foreground"
      >
        See how it works
      </motion.p>

      <div className="mx-auto flex max-w-lg flex-col items-center gap-8">
        {/* Phone */}
        <div className="relative aspect-[9/18] w-full max-w-[340px] overflow-hidden rounded-[2.75rem] border-2 border-white/15 bg-[#1a1340] shadow-angelic md:max-w-[370px]">
          {/* Drifting dreamy interior (behind content) */}
          <div className="phone-dream-bg" />

          {/* Notch */}
          <div className="absolute left-1/2 top-0 z-30 h-6 w-24 -translate-x-1/2 rounded-b-2xl bg-[#130d30]" />

          <div className="absolute inset-0 z-10 flex flex-col pt-8">
            {showTopBar && <TopBar progress={progressFor[scene]} />}

            <div className="relative min-h-0 flex-1">
              <AnimatePresence mode="wait">
                {started && scene === "interview" && (
                  <motion.div
                    key="interview"
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <AppDemoInterview onComplete={() => go("vibes")} />
                  </motion.div>
                )}

                {scene === "vibes" && (
                  <motion.div
                    key="vibes"
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <AppDemoVibes onComplete={() => go("matching")} />
                  </motion.div>
                )}

                {scene === "matching" && (
                  <motion.div
                    key="matching"
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Matching />
                  </motion.div>
                )}

                {scene === "proposal" && (
                  <motion.div
                    key="proposal"
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <AppDemoProposal onComplete={() => go("confirmed")} reduced={!!reduced} />
                  </motion.div>
                )}

                {scene === "confirmed" && (
                  <motion.div
                    key="confirmed"
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Confirmed />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Caption */}
        <div className="flex h-8 items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={scene}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              className="text-center text-sm text-muted-foreground"
            >
              {captions[scene]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
