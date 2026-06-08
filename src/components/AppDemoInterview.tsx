import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";

const Q1 = "What do you love spending time on?";
const A1 = "Coffee shops, galleries, long walks.";
const Q2 = "What kind of night feels easy to say yes to?";
const A2 = "Low-key, good conversation.";

type Phase = "q1" | "a1" | "think" | "q2" | "a2" | "done";

/** Types out `text` one char at a time, then fires onDone once. */
function Typewriter({
  text,
  speed = 36,
  onDone,
}: {
  text: string;
  speed?: number;
  onDone?: () => void;
}) {
  const [n, setN] = useState(0);
  useEffect(() => {
    setN(0);
    let i = 0;
    let done = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const tick = () => {
      i += 1;
      setN(i);
      if (i < text.length) {
        timers.push(setTimeout(tick, speed));
      } else if (!done) {
        done = true;
        timers.push(setTimeout(() => onDone?.(), 280));
      }
    };
    timers.push(setTimeout(tick, speed));
    return () => timers.forEach(clearTimeout);
    // onDone intentionally excluded so a re-render doesn't restart typing
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, speed]);

  return (
    <>
      {text.slice(0, n)}
      <span className="ml-[1px] inline-block h-[0.9em] w-[2px] translate-y-[1px] bg-[#b48cff] align-middle animate-pulse" />
    </>
  );
}

export default function AppDemoInterview({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<Phase>("q1");
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (phase === "think") {
      const t = setTimeout(() => setPhase("q2"), 800);
      return () => clearTimeout(t);
    }
    if (phase === "done") {
      const t = setTimeout(() => onCompleteRef.current(), 750);
      return () => clearTimeout(t);
    }
  }, [phase]);

  const question = phase === "q2" || phase === "a2" ? Q2 : Q1;
  const typingQuestion = phase === "q1" || phase === "q2";
  const showComposer = phase === "a1" || phase === "a2";
  const answer = phase === "a2" ? A2 : A1;

  return (
    <div className="flex h-full flex-col px-5 pb-6">
      {/* Question / thinking / done line */}
      <div className="flex flex-1 items-center justify-center">
        <AnimatePresence mode="wait">
          {phase === "think" ? (
            <motion.div
              key="think"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2.5 rounded-full border border-white/15 bg-white/10 px-4 py-2.5"
            >
              <span className="text-[11px] text-white/80">Lining up your next question</span>
              <span className="flex gap-1">
                <i className="h-1.5 w-1.5 rounded-full bg-[#b48cff] animate-pulse" />
                <i className="h-1.5 w-1.5 rounded-full bg-[#b48cff] animate-pulse" style={{ animationDelay: "0.15s" }} />
                <i className="h-1.5 w-1.5 rounded-full bg-[#b48cff] animate-pulse" style={{ animationDelay: "0.3s" }} />
              </span>
            </motion.div>
          ) : phase === "done" ? (
            <motion.p
              key="done"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-4 text-center font-display text-xl font-bold text-white"
            >
              Nice — that's enough to start.
            </motion.p>
          ) : (
            <motion.p
              key={question}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-[280px] px-2 text-center font-display text-[22px] font-bold leading-snug text-white"
            >
              {typingQuestion ? (
                <Typewriter
                  text={question}
                  onDone={() => setPhase(phase === "q1" ? "a1" : "a2")}
                />
              ) : (
                question
              )}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Composer */}
      <div className="flex min-h-[58px] items-end">
        <AnimatePresence>
          {showComposer && (
            <motion.div
              key={phase}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="flex w-full items-center gap-2 rounded-[28px] bg-white px-4 py-2.5 shadow-lg"
            >
              <span className="flex-1 text-[13px] leading-snug text-[#2e2e2e]">
                <Typewriter
                  text={answer}
                  speed={32}
                  onDone={() => setPhase(phase === "a1" ? "think" : "done")}
                />
              </span>
              <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-[#5d48db] text-white">
                <ArrowUp className="h-4 w-4 stroke-[2.5]" />
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
