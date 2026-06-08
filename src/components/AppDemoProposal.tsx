import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MapPin, Check, ChevronRight, ArrowRight } from "lucide-react";
import Confetti from "./Confetti";

const PARTNER_IMG = "/sam-profile.webp";
const VENUE_IMG = "/onboarding/coffee.png";
const NAME = "Daniel";

const REASONS = ["Loves coffee shops", "Values real conversation", "Both into live music"];

const ease = [0.23, 1, 0.32, 1] as const;

// Frosted-glass surfaces on the dark dreamy base.
const GLASS = {
  background: "rgba(255,255,255,0.08)",
  borderColor: "rgba(255,255,255,0.14)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
} as const;

const TEXT = "#eeedf5";
const MUTED = "rgba(255,255,255,0.62)";

export default function AppDemoProposal({
  onComplete,
  reduced,
}: {
  onComplete: () => void;
  reduced: boolean;
}) {
  const [slid, setSlid] = useState(false);
  const [showMoment, setShowMoment] = useState(false);
  const [going, setGoing] = useState(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (reduced) return; // hold the invitation statically
    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(setTimeout(() => setSlid(true), 2200));
    timers.push(setTimeout(() => setShowMoment(true), 3300));
    timers.push(setTimeout(() => setGoing(true), 4200));
    timers.push(setTimeout(() => onCompleteRef.current(), 4800));
    return () => timers.forEach(clearTimeout);
  }, [reduced]);

  return (
    <div className="relative h-full overflow-hidden">
      {/* Partner photo hero (extends behind the sheet, fades into indigo) */}
      <img src={PARTNER_IMG} alt="" className="absolute inset-x-0 top-0 h-[55%] w-full object-cover" />
      <div className="absolute inset-x-0 top-0 h-[55%] bg-gradient-to-b from-transparent via-transparent to-[#1a1340]" />

      {/* Invitation sheet — frosted indigo, content-height, anchored to the bottom */}
      <motion.div
        initial={reduced ? false : { y: "100%" }}
        animate={{ y: 0 }}
        transition={{ duration: 0.7, ease }}
        className="absolute inset-x-0 bottom-0 flex flex-col rounded-t-[40px] border-t border-white/10 px-4 pb-4 pt-2.5 backdrop-blur-xl"
        style={{ background: "rgba(26,19,64,0.85)" }}
      >
        <div className="mx-auto mb-2 h-1 w-10 flex-none rounded-full bg-white/20" />

        <span
          className="w-fit rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#b48cff]"
          style={{ background: "rgba(180,140,255,0.14)" }}
        >
          Your invitation
        </span>
        <p className="mt-1 text-[12px] font-semibold" style={{ color: MUTED }}>
          {NAME}, 28 · Oakland
        </p>
        <p className="mt-1 font-display text-[19px] font-bold leading-tight text-white">
          A date we think is worth considering
        </p>
        <p className="mt-1 text-[11px] leading-snug" style={{ color: MUTED }}>
          The plan is clear. The person stays lightly held until you decide.
        </p>

        {/* Plan receipt (frosted) */}
        <div className="mt-2.5 overflow-hidden rounded-[18px] border" style={GLASS}>
          <div className="relative h-14 w-full overflow-hidden">
            <img src={VENUE_IMG} alt="" className="h-full w-full object-cover" />
            <span
              className="absolute right-2 top-2 rounded-full px-2 py-0.5 text-[9px] font-bold backdrop-blur-sm"
              style={{ background: "rgba(255,255,255,0.34)", border: "1px solid rgba(255,255,255,0.58)", color: "#1b1430" }}
            >
              Map
            </span>
          </div>
          <div className="space-y-1 px-3 py-2">
            <p className="flex items-center gap-1.5 text-[10px]" style={{ color: TEXT }}>
              <Calendar className="h-3 w-3 flex-none text-[#b48cff]" />
              Thursday, June 12 at 6:30 PM
            </p>
            <p className="flex items-start gap-1.5 text-[10px]" style={{ color: TEXT }}>
              <MapPin className="mt-px h-3 w-3 flex-none text-[#b48cff]" />
              <span>
                <span className="font-bold text-white">Blue Bottle Coffee</span> · 300 Webster St, Oakland
              </span>
            </p>
          </div>
        </div>

        {/* Why this match (frosted) */}
        <div className="mt-2 rounded-[16px] border px-3 py-2" style={GLASS}>
          <div className="mb-1 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-[2px] bg-[#b48cff]" />
            <span className="text-[8px] font-bold uppercase tracking-[0.12em]" style={{ color: MUTED }}>
              Why this match
            </span>
          </div>
          {REASONS.map((r, i) => (
            <div key={r} className="flex items-center gap-1.5 py-0.5">
              <span className="text-[10px] font-bold text-[#b48cff]">{i + 1}</span>
              <span className="text-[10px]" style={{ color: TEXT }}>
                {r}
              </span>
            </div>
          ))}
        </div>

        {/* Slide to confirm — right below the card, no void */}
        <div className="mt-4">
          <div
            className="relative h-12 overflow-hidden rounded-full border"
            style={{ background: "rgba(255,255,255,0.06)", borderColor: "rgba(180,140,255,0.30)" }}
          >
            <div
              className="absolute inset-y-0 left-0 rounded-full transition-[width] duration-700 ease-out"
              style={{ width: slid ? "100%" : "48px", background: "#b48cff" }}
            />
            <span
              className="absolute inset-0 flex items-center justify-center text-[12px] font-semibold"
              style={{ color: slid ? "#1a1340" : "rgba(255,255,255,0.85)" }}
            >
              {slid ? "Confirmed" : "Confirm date"}
            </span>
            <div
              className="absolute top-1 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow transition-[left] duration-700 ease-out"
              style={{ left: slid ? "calc(100% - 44px)" : "4px" }}
            >
              {slid ? (
                <Check className="h-4 w-4 stroke-[3] text-[#5d48db]" />
              ) : (
                <ChevronRight className="h-4 w-4 text-[#5d48db]" />
              )}
            </div>
          </div>
          <p className="mt-1.5 text-center text-[10px]" style={{ color: "rgba(255,255,255,0.5)" }}>
            Pass on invitation
          </p>
        </div>
      </motion.div>

      {/* Confirm moment — frosted card over a see-through scrim (proposal still visible behind) */}
      <AnimatePresence>
        {showMoment && (
          <motion.div
            key="moment"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 flex items-center justify-center px-4"
            style={{ background: "rgba(0,0,0,0.34)" }}
          >
            <Confetti count={16} />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease }}
              className="relative z-50 w-full rounded-[24px] border p-4 text-center"
              style={{
                background: "rgba(255,255,255,0.10)",
                borderColor: "rgba(255,255,255,0.16)",
                backdropFilter: "blur(22px)",
                WebkitBackdropFilter: "blur(22px)",
              }}
            >
              <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-[#5d48db]">
                <Check className="h-6 w-6 stroke-[3] text-white" />
              </div>
              <p className="font-display text-lg font-bold text-white">You just confirmed.</p>
              <p className="mt-0.5 text-[11px]" style={{ color: MUTED }}>
                One more clear look before we lock it in.
              </p>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="relative h-16 overflow-hidden rounded-xl">
                  <img src={PARTNER_IMG} alt="" className="h-full w-full object-cover" />
                  <span className="absolute bottom-1 left-1 rounded bg-black/45 px-1.5 py-0.5 text-[9px] font-semibold text-white">
                    {NAME}
                  </span>
                </div>
                <div className="relative h-16 overflow-hidden rounded-xl">
                  <img src={VENUE_IMG} alt="" className="h-full w-full object-cover" />
                  <span className="absolute bottom-1 left-1 rounded bg-black/45 px-1.5 py-0.5 text-[9px] font-semibold text-white">
                    Blue Bottle
                  </span>
                </div>
              </div>

              <div className="mt-2 rounded-xl px-3 py-2 text-left" style={{ background: "rgba(180,140,255,0.14)" }}>
                <p className="flex items-center gap-1.5 text-[10px] text-white">
                  <Calendar className="h-3 w-3 flex-none text-[#b48cff]" />
                  Thursday, 6:30 PM · With {NAME}
                </p>
                <p className="mt-0.5 flex items-center gap-1.5 text-[10px] text-white">
                  <MapPin className="h-3 w-3 flex-none text-[#b48cff]" />
                  Blue Bottle Coffee · Oakland
                </p>
              </div>

              <div className="mt-3 flex gap-2">
                <div
                  className="flex-1 rounded-full border py-2 text-[12px] font-semibold text-white"
                  style={{ borderColor: "rgba(255,255,255,0.30)" }}
                >
                  Review
                </div>
                <div
                  className={`flex flex-1 items-center justify-center gap-1 rounded-full py-2 text-[12px] font-bold text-white transition-all duration-200 ${
                    going ? "scale-[0.97] bg-[#4a39c0]" : "bg-[#5d48db]"
                  }`}
                >
                  Yes, I'm going
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
