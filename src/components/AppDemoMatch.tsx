import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Heart, X, Check, MapPin, CalendarDays, Coffee } from "lucide-react";

const ease = [0.23, 1, 0.32, 1] as const;
const PROFILE_IMAGE = "/alex-profile.webp";

export default function AppDemoMatch({ onComplete }: { onComplete: () => void }) {
  const [barWidth, setBarWidth] = useState(0);
  const [tapped, setTapped] = useState(false);
  const [showTapRing, setShowTapRing] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setBarWidth(87), 400);
    const t2 = setTimeout(() => setShowTapRing(true), 2800);
    const t3 = setTimeout(() => { setTapped(true); setShowTapRing(false); }, 3100);
    const t4 = setTimeout(onComplete, 4200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [onComplete]);

  return (
    <div className="flex flex-col h-full px-4 pt-3 overflow-y-auto">
      {/* Header label */}
      <div className="text-center mb-3 flex-none">
        <p className="text-[8px] uppercase tracking-[0.25em] text-primary mb-1">
          A plan for you
        </p>
        <h2 className="font-display text-base font-light text-foreground italic">
          We found a match
        </h2>
      </div>

      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease }}
        className="w-full bg-card rounded-2xl border border-border shadow-angelic overflow-hidden"
      >
        {/* Partner header with avatar ring + interests */}
        <div className="flex items-center gap-3 py-3.5 px-4 border-b border-border">
          <div className="relative flex-shrink-0">
            <div className="w-11 h-11 rounded-full ring-2 ring-offset-1 ring-offset-card ring-primary/20 bg-gradient-to-br from-primary/40 to-primary/10 overflow-hidden flex items-center justify-center">
              <img
                src={PROFILE_IMAGE}
                alt="Alex"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground">Alex, 27</p>
            <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
              <MapPin className="w-2.5 h-2.5" />Athens, GA
            </p>
            <div className="flex flex-wrap gap-1 mt-1.5">
              {["hiking", "coffee", "small groups"].map((tag) => (
                <span key={tag} className="text-[8px] bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Venue hero with gradient */}
        <div className="relative h-20 bg-gradient-to-br from-amber-600/80 via-orange-400/60 to-yellow-200/40 overflow-hidden">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
          <div className="absolute right-3 bottom-3 opacity-20">
            <Coffee className="w-10 h-10 text-white" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/50 to-transparent">
            <h3 className="text-sm font-semibold text-white drop-shadow-sm">1000 Faces Coffee</h3>
            <p className="text-[9px] text-white/80">Coffee · Athens, GA</p>
          </div>
        </div>

        {/* Venue details */}
        <div className="px-4 py-2.5 space-y-1.5 border-b border-border">
          <div className="flex items-center gap-2">
            <MapPin className="w-3 h-3 text-primary flex-shrink-0" />
            <span className="text-[10px] text-foreground">Athens, GA · 510 North Thomas St</span>
          </div>
          <div className="flex items-center gap-2">
            <CalendarDays className="w-3 h-3 text-primary flex-shrink-0" />
            <span className="text-[10px] text-foreground">Saturday, April 19 at 2:00 PM</span>
          </div>
        </div>

        {/* Compatibility section */}
        <div className="px-4 py-2.5">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
              <Heart className="w-3.5 h-3.5 text-primary" />
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground">87% compatible</p>
              <p className="text-[8px] text-muted-foreground uppercase tracking-wider">Match score</p>
            </div>
          </div>

          <p className="text-[8px] text-muted-foreground uppercase tracking-wider mb-1">Why you match</p>
          <div className="space-y-0.5 mb-2">
            {["You both enjoy hiking and coffee", "Great for a low-pressure first date"].map((reason) => (
              <div key={reason} className="flex items-start gap-1">
                <Check className="w-2.5 h-2.5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-[9px] text-foreground leading-tight">{reason}</span>
              </div>
            ))}
          </div>

          <p className="text-[8px] text-muted-foreground uppercase tracking-wider mb-1">You both like</p>
          <div className="flex flex-wrap gap-1">
            {["hiking", "coffee", "trying new food"].map((tag) => (
              <span key={tag} className="text-[8px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">{tag}</span>
            ))}
          </div>
        </div>

        {/* Pass / I'm in buttons */}
        <div className="px-4 py-3 border-t border-border flex gap-2.5">
          <div className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-border text-muted-foreground text-[11px]">
            <X className="w-3.5 h-3.5" />
            Pass
          </div>
          <div className="relative flex-1">
            {showTapRing && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0.5 }}
                animate={{ scale: 1.1, opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="absolute inset-0 rounded-xl border-2 border-primary"
              />
            )}
            <div
              className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-[11px] font-medium aura-transition ${
                tapped
                  ? "bg-green-500/90 text-white scale-[0.97]"
                  : "bg-primary text-primary-foreground shadow-angelic-sm"
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              {tapped ? "You're in!" : "I'm in"}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
