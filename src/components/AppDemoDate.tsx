import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, CalendarDays, Coffee, Heart, Check, Lock } from "lucide-react";

const ease = [0.23, 1, 0.32, 1] as const;

const ALEX_IMG = "/alex-profile.webp";
const JORDAN_IMG = "/jordan-profile.webp";
const SAM_IMG = "/sam-profile.webp";

type Stage = "list" | "alex-arrives" | "tap" | "expanded";

const existingDates = [
  { name: "Jordan", time: "Thu, Apr 17 · 7:00 PM", img: JORDAN_IMG, color: "ring-primary/20", badge: "bg-primary/10 text-primary", status: "Confirmed" },
  { name: "Sam", time: "Fri, Apr 25 · 6:30 PM", img: SAM_IMG, color: "ring-emerald-500/20", badge: "bg-emerald-500/10 text-emerald-400", status: "Pending" },
];

export default function AppDemoDate({ onComplete }: { onComplete: () => void }) {
  const [stage, setStage] = useState<Stage>("list");

  useEffect(() => {
    const t1 = setTimeout(() => setStage("alex-arrives"), 800);
    const t2 = setTimeout(() => setStage("tap"), 2400);
    const t3 = setTimeout(() => setStage("expanded"), 2900);
    const t4 = setTimeout(onComplete, 5000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [onComplete]);

  const showAlex = stage !== "list";
  const showTapRing = stage === "tap";
  const isExpanded = stage === "expanded";

  return (
    <div className="flex flex-col h-full">
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

      <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 pb-4">
        {/* Upcoming dates hero */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
          className="relative w-full flex flex-col items-center pt-2 pb-3 mb-2 overflow-hidden"
        >
          <div className="absolute inset-0 pointer-events-none">
            <svg viewBox="0 0 390 200" fill="none" preserveAspectRatio="xMidYMin slice" className="w-full h-full">
              {[0.06, 0.08, 0.1, 0.07, 0.09, 0.05].map((opacity, i) => (
                <path key={i} d={`M0 ${80 + i * 16} Q98 ${60 + i * 12} 195 ${80 + i * 16} T390 ${80 + i * 16}`} stroke={`rgba(130, 170, 220, ${opacity * 0.6})`} strokeWidth="1.5" fill="none" />
              ))}
              <defs>
                <radialGradient id="heroGlow2" cx="50%" cy="40%" r="50%">
                  <stop offset="0%" stopColor="rgba(130, 170, 220, 0.08)" />
                  <stop offset="60%" stopColor="rgba(130, 170, 220, 0.03)" />
                  <stop offset="100%" stopColor="rgba(130, 170, 220, 0)" />
                </radialGradient>
              </defs>
              <rect width="390" height="200" fill="url(#heroGlow2)" />
            </svg>
          </div>
          <div className="relative mb-2 z-10 flex items-center justify-center">
            <div className="absolute inset-[-8px] rounded-full" style={{ background: "rgba(130, 170, 220, 0.15)", animation: "aura-pulse 5s ease-in-out infinite" }} />
            <div className="absolute inset-[-8px] rounded-full" style={{ background: "rgba(130, 170, 220, 0.1)", animation: "aura-pulse 5s ease-in-out infinite", animationDelay: "2.5s" }} />
            <div className="absolute inset-[-3px] rounded-full border border-slate-300/10" />
            <div className="w-8 h-8 rounded-full bg-slate-300/80 flex items-center justify-center relative overflow-hidden">
              <div className="w-5 h-5 rounded-full bg-slate-200/50 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-white/30" />
              </div>
              <div className="absolute w-7 h-7 rounded-full" style={{ background: "hsl(220, 15%, 10%)", top: "-2px", left: "-3px" }} />
            </div>
          </div>
          <h2 className="text-sm font-semibold text-foreground z-10">Upcoming dates</h2>
        </motion.div>

        {/* Date list */}
        <div className="flex flex-col gap-2.5">
          {/* Existing dates with real photos */}
          {existingDates.map((d, i) => (
            <motion.div
              key={d.name}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1, duration: 0.4, ease }}
              className="flex items-center gap-3 bg-card rounded-2xl border border-border px-4 py-3 shadow-angelic-sm"
            >
              <div className={`w-9 h-9 rounded-full flex-shrink-0 overflow-hidden ring-1 ring-offset-1 ring-offset-card ${d.color}`}>
                <img src={d.img} alt={d.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-semibold text-foreground">{d.name}</p>
                <p className="text-[9px] text-muted-foreground">{d.time}</p>
              </div>
              <div className={`text-[9px] font-medium px-2 py-0.5 rounded-full ${d.badge}`}>
                {d.status}
              </div>
            </motion.div>
          ))}

          {/* Alex card — single element that expands in place */}
          {showAlex && (
            <motion.div
              layout
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease, layout: { duration: 0.4, ease } }}
              className={`relative w-full bg-card rounded-2xl border shadow-angelic overflow-hidden ${isExpanded ? "border-pink-500/30" : "border-pink-500/30"}`}
            >
              {/* Tap ripple */}
              {showTapRing && (
                <motion.div
                  initial={{ scale: 0.95, opacity: 0.5 }}
                  animate={{ scale: 1.02, opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0 rounded-2xl border-2 border-pink-500 z-10"
                />
              )}

              {/* Collapsed row — always visible as the header */}
              <div className="flex items-center gap-3 px-4 py-3">
                <div className="w-9 h-9 rounded-full ring-1 ring-offset-1 ring-offset-card ring-pink-500/20 bg-gradient-to-br from-pink-400/40 to-pink-300/10 flex-shrink-0 overflow-hidden">
                  <img src={ALEX_IMG} alt="Alex" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-semibold text-foreground">Alex, 27 · Saturday 2pm</p>
                  <p className="text-[9px] text-muted-foreground">1000 Faces Coffee · Athens</p>
                </div>
                {!isExpanded && (
                  <div className="text-[9px] font-medium px-2 py-0.5 rounded-full bg-pink-500/10 text-pink-500 flex-shrink-0">
                    New
                  </div>
                )}
                {isExpanded && (
                  <div className="flex flex-col items-end flex-shrink-0">
                    <span className="text-[11px] font-semibold text-pink-500">87%</span>
                    <span className="text-[8px] text-pink-500/60">match</span>
                  </div>
                )}
              </div>

              {/* Expanded details — slides open below the header */}
              <motion.div
                initial={false}
                animate={{
                  height: isExpanded ? "auto" : 0,
                  opacity: isExpanded ? 1 : 0,
                }}
                transition={{ duration: 0.4, ease }}
                className="overflow-hidden"
              >
                {/* Venue hero */}
                <div className="relative h-16 bg-gradient-to-br from-rose-400/80 via-pink-300/60 to-amber-200/40 overflow-hidden">
                  <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
                  <div className="absolute right-2 bottom-2 opacity-20"><Coffee className="w-8 h-8 text-white" /></div>
                  <div className="absolute bottom-0 left-0 right-0 p-2.5 bg-gradient-to-t from-black/50 to-transparent">
                    <h3 className="text-[11px] font-semibold text-white drop-shadow-sm">1000 Faces Coffee</h3>
                    <p className="text-[8px] text-white/80">Coffee · Athens, GA</p>
                  </div>
                </div>

                {/* Details */}
                <div className="px-3.5 py-2 space-y-1 border-b border-border">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-2.5 h-2.5 text-pink-500 flex-shrink-0" />
                    <span className="text-[9px] text-foreground">510 North Thomas St</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarDays className="w-2.5 h-2.5 text-pink-500 flex-shrink-0" />
                    <span className="text-[9px] text-foreground">Saturday, April 19 at 2:00 PM</span>
                  </div>
                </div>

                {/* Compatibility */}
                <div className="px-3.5 py-2">
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-6 h-6 rounded-lg bg-pink-500/10 flex items-center justify-center">
                      <Heart className="w-3 h-3 text-pink-500" />
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-foreground">87% compatible</p>
                      <p className="text-[7px] text-muted-foreground uppercase tracking-wider">Match score</p>
                    </div>
                  </div>
                  <div className="space-y-0.5 mb-1.5">
                    {["You both enjoy hiking and coffee", "Great for a low-pressure first date"].map((r) => (
                      <div key={r} className="flex items-start gap-1">
                        <Check className="w-2 h-2 text-pink-500 flex-shrink-0 mt-0.5" />
                        <span className="text-[8px] text-foreground leading-tight">{r}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-border/40 px-3.5 py-2 flex justify-center">
                  <span className="text-[9px] text-muted-foreground flex items-center gap-1">
                    <Lock className="w-2.5 h-2.5" /> Plan locked in
                  </span>
                </div>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
