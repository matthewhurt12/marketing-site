import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, ArrowUp } from "lucide-react";

function ProgressRing({ percent }: { percent: number }) {
  const size = 36;
  const stroke = 2.5;
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (circumference * percent) / 100;

  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="hsl(var(--muted))" strokeWidth={stroke} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke="hsl(var(--primary))" strokeWidth={stroke}
        strokeDasharray={circumference} strokeDashoffset={offset}
        strokeLinecap="round" className="transition-all duration-700 ease-out"
      />
    </svg>
  );
}

function useTypewriter(text: string, startAt: number, charDelay = 45) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    const now = Date.now();
    const wait = Math.max(0, startAt - now);
    const timers: ReturnType<typeof setTimeout>[] = [];

    timers.push(setTimeout(() => {
      for (let i = 0; i <= text.length; i++) {
        timers.push(setTimeout(() => {
          setDisplayed(text.slice(0, i));
          if (i === text.length) setDone(true);
        }, i * charDelay));
      }
    }, wait));

    return () => timers.forEach(clearTimeout);
  }, [text, startAt, charDelay]);

  return { displayed, done };
}

const USER_ANSWER = "Coffee and a long walk, maybe trying a new spot";
const AI_Q1 = "So what does a good weekend look like for you?";
const AI_Q2 = "I like that — low-key but intentional. Are you usually the one picking the spot?";
const OPTIONS = ["Always", "I go with the flow", "Depends who I'm with"];

export default function AppDemoChat({ onComplete }: { onComplete: () => void }) {
  const mountTime = useRef(Date.now());
  const [progress, setProgress] = useState(12);

  // Phase milestones (ms from mount)
  const Q1_FADE_IN = 600;
  const USER_TYPE_START = 2800;
  const USER_SEND = USER_TYPE_START + USER_ANSWER.length * 45 + 200;
  const AI_THINKING_START = USER_SEND + 400;
  const AI_THINKING_END = AI_THINKING_START + 1400;
  const Q2_SHOW = AI_THINKING_END + 100;
  const OPTS_SHOW = Q2_SHOW + 800;
  const TAP_RING = OPTS_SHOW + 1600;
  const TAP_SELECT = TAP_RING + 300;
  const DONE = TAP_SELECT + 800;

  // State
  const [showQ1, setShowQ1] = useState(false);
  const [showUserBubble, setShowUserBubble] = useState(false);
  const [showAiThinking, setShowAiThinking] = useState(false);
  const [showQ2, setShowQ2] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showTapRing, setShowTapRing] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [composerActive, setComposerActive] = useState(false);
  const [sendFlash, setSendFlash] = useState(false);

  const typewriter = useTypewriter(USER_ANSWER, mountTime.current + USER_TYPE_START);

  useEffect(() => {
    const t = mountTime.current;
    const timers: ReturnType<typeof setTimeout>[] = [];

    timers.push(setTimeout(() => setShowQ1(true), Q1_FADE_IN));
    timers.push(setTimeout(() => setComposerActive(true), USER_TYPE_START));
    timers.push(setTimeout(() => {
      setSendFlash(true);
      setTimeout(() => setSendFlash(false), 200);
      setComposerActive(false);
      setShowUserBubble(true);
      setProgress(18);
    }, USER_SEND));
    timers.push(setTimeout(() => setShowAiThinking(true), AI_THINKING_START));
    timers.push(setTimeout(() => {
      setShowAiThinking(false);
      setShowQ2(true);
    }, AI_THINKING_END));
    timers.push(setTimeout(() => setShowOptions(true), OPTS_SHOW));
    timers.push(setTimeout(() => setShowTapRing(true), TAP_RING));
    timers.push(setTimeout(() => {
      setShowTapRing(false);
      setSelectedOption("Depends who I'm with");
      setProgress(28);
    }, TAP_SELECT));
    timers.push(setTimeout(onComplete, DONE));

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  const isTyping = composerActive && !typewriter.done;
  const composerText = composerActive ? typewriter.displayed : "";

  return (
    <div className="flex flex-col h-full">
      {/* Progress ring header */}
      <div className="flex-none flex items-center justify-center gap-2.5 px-4 pt-2 pb-3">
        <ProgressRing percent={progress} />
        <span className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground">
          Getting to know you
        </span>
      </div>

      {/* Chat messages */}
      <div className="flex-1 min-h-0 overflow-hidden flex flex-col gap-4 px-5 pb-2">
        {/* AI question 1 */}
        <AnimatePresence>
          {showQ1 && (
            <motion.div
              key="q1"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
              className="text-left"
            >
              <p className="text-sm font-normal leading-relaxed text-foreground">
                {AI_Q1}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* User message bubble (appears after typing finishes) */}
        <AnimatePresence>
          {showUserBubble && (
            <motion.div
              key="user1"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="text-right"
            >
              <p className="inline-block rounded-2xl rounded-br-sm bg-secondary px-4 py-2.5 text-[12px] text-secondary-foreground leading-relaxed">
                {USER_ANSWER}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* AI thinking dots */}
        <AnimatePresence>
          {showAiThinking && (
            <motion.div
              key="thinking"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 py-1"
            >
              <div className="flex gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" style={{ animationDelay: "0.2s" }} />
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" style={{ animationDelay: "0.4s" }} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* AI question 2 */}
        <AnimatePresence>
          {showQ2 && (
            <motion.div
              key="q2"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
              className="text-left"
            >
              <p className="text-sm font-normal leading-relaxed text-foreground">
                {AI_Q2}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Multiple choice options */}
        <AnimatePresence>
          {showOptions && (
            <motion.div
              key="opts"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="flex flex-wrap gap-2 pt-1"
            >
              {OPTIONS.map((opt, j) => (
                <motion.span
                  key={opt}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: j * 0.06, duration: 0.25 }}
                  className="relative"
                >
                  {showTapRing && opt === "Depends who I'm with" && (
                    <motion.span
                      initial={{ scale: 0.5, opacity: 0.6 }}
                      animate={{ scale: 1.3, opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      className="absolute inset-0 rounded-full border-2 border-primary"
                    />
                  )}
                  <span
                    className={`block rounded-full border px-4 py-2 text-[11px] font-medium aura-transition ${
                      selectedOption === opt
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-secondary/50 text-foreground"
                    }`}
                  >
                    {opt}
                  </span>
                </motion.span>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Composer bar — shows live typing */}
      <div className="flex-none border-t border-border/40 bg-background/95 px-4 py-4">
        <div className="relative">
          <div className={`w-full border-b py-3.5 pr-20 text-sm min-h-[1.75em] transition-colors duration-300 ${
            composerActive ? "border-primary text-foreground" : "border-primary/30 text-muted-foreground/40"
          }`}>
            {composerText || (composerActive ? "" : "Type your answer…")}
            {isTyping && (
              <span className="inline-block w-[1.5px] h-[15px] bg-primary ml-[1px] align-middle animate-pulse" />
            )}
          </div>
          <div className="absolute right-0 bottom-3.5 flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground">
              <Mic className="h-4 w-4" />
            </div>
            <div className={`flex h-7 w-7 items-center justify-center rounded-full transition-all duration-200 ${
              sendFlash || (composerActive && typewriter.done)
                ? "bg-primary text-primary-foreground scale-100"
                : "bg-muted text-muted-foreground/40 scale-95"
            }`}>
              <ArrowUp className="h-3.5 w-3.5 stroke-[2.5]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
