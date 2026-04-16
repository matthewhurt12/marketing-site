import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import AppDemoChat from "./AppDemoChat";
import AppDemoMatch from "./AppDemoMatch";
import AppDemoDate from "./AppDemoDate";

type Phase = "chat" | "search" | "match" | "date" | "closing";

const captions: Record<Phase, string> = {
  chat: "A real conversation. Not a questionnaire.",
  search: "AI that actually understands you.",
  match: "One match. Chosen with intention.",
  date: "Everything planned. Just show up.",
  closing: "",
};

const SEARCH_DURATION = 3000;
const CLOSING_DURATION = 7000;

export default function AppDemo() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: false, margin: "-20%" });
  const [phase, setPhase] = useState<Phase>("chat");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (isInView && !started) {
      setStarted(true);
      setPhase("chat");
    }
  }, [isInView, started]);

  useEffect(() => {
    if (!isInView && started) {
      setStarted(false);
      setPhase("chat");
    }
  }, [isInView, started]);

  const advanceFrom = useCallback((from: Phase) => {
    const next: Record<Phase, Phase> = {
      chat: "search",
      search: "match",
      match: "date",
      date: "closing",
      closing: "chat",
    };
    setPhase(next[from]);
  }, []);

  useEffect(() => {
    if (phase === "search") {
      const t = setTimeout(() => advanceFrom("search"), SEARCH_DURATION);
      return () => clearTimeout(t);
    }
    if (phase === "closing") {
      const t = setTimeout(() => advanceFrom("closing"), CLOSING_DURATION);
      return () => clearTimeout(t);
    }
  }, [phase, advanceFrom]);

  const handleComplete = useCallback(() => {
    advanceFrom(phase);
  }, [phase, advanceFrom]);

  return (
    <section ref={sectionRef} className="py-24 md:py-40 px-6">
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground text-center mb-12"
      >
        See how it works
      </motion.p>

      <div className="mx-auto flex flex-col items-center gap-8 max-w-lg">
        {/* Phone frame */}
        <div className="relative w-full max-w-[380px] md:max-w-[420px] aspect-[9/17] rounded-[2.5rem] border-2 border-border/40 bg-card overflow-hidden">
          {/* Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-background rounded-b-2xl z-20" />

          <div className="absolute inset-0 pt-8">
            <AnimatePresence mode="wait">
              {phase === "chat" && started && (
                <motion.div
                  key="chat"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="h-full"
                >
                  <AppDemoChat onComplete={handleComplete} />
                </motion.div>
              )}

              {phase === "search" && (
                <motion.div
                  key="search"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="h-full flex flex-col"
                >
                  {/* Mini app header */}
                  <div className="flex-none flex items-center justify-between px-5 pt-3 pb-2">
                    <div className="w-8 h-8 rounded-full bg-secondary/60" />
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-semibold text-muted-foreground tabular-nums">72%</span>
                      <div className="w-8 h-8 rounded-full bg-secondary/60 flex items-center justify-center">
                        <svg className="w-3.5 h-3.5 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                      </div>
                    </div>
                  </div>
                  {/* Searching state */}
                  <div className="flex-1 flex flex-col items-center justify-center gap-4">
                    <div className="relative w-20 h-20 mb-4">
                      <div className="absolute inset-0 rounded-full bg-primary/10 animate-aura-pulse" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-primary/15 animate-aura-pulse" style={{ animationDelay: "0.7s" }} />
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-3.5 h-3.5 rounded-full bg-primary/40" />
                      </div>
                    </div>
                    <div className="text-center px-6">
                      <p className="text-[8px] uppercase tracking-[0.25em] text-primary mb-3">
                        State of Grace
                      </p>
                      <h2 className="font-display text-lg font-light text-foreground mb-2 italic leading-snug">
                        Finding someone you'll{"\n"}enjoy meeting…
                      </h2>
                      <p className="text-[10px] text-muted-foreground">
                        We're working on it — you'll see a match here soon.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {phase === "match" && (
                <motion.div
                  key="match"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="h-full"
                >
                  <AppDemoMatch onComplete={handleComplete} />
                </motion.div>
              )}

              {phase === "date" && (
                <motion.div
                  key="date"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="h-full"
                >
                  <AppDemoDate onComplete={handleComplete} />
                </motion.div>
              )}

              {phase === "closing" && (
                <motion.div
                  key="closing"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
                  className="h-full flex flex-col items-center justify-center px-8 gap-6"
                >
                  <p className="font-display text-3xl text-foreground text-center leading-snug">
                    Then you meet —<br />in person.
                  </p>
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                    className="flex flex-col items-center gap-4"
                  >
                    <a
                      href="#waitlist"
                      className="bg-primary text-primary-foreground px-8 py-3.5 rounded-full text-sm font-medium tracking-widest uppercase aura-transition hover:opacity-90 shadow-angelic-sm"
                    >
                      Join the Waitlist
                    </a>
                    <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                      Your turn.
                    </p>
                  </motion.div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>

        {/* Caption */}
        <div className="h-8 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {captions[phase] && (
              <motion.p
                key={phase}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                className="text-sm text-muted-foreground text-center"
              >
                {captions[phase]}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
