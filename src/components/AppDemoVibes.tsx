import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

const VIBES = [
  { key: "low-key", label: "Low-key", img: "/onboarding/low-key.png" },
  { key: "foodie", label: "Foodie", img: "/onboarding/foodie.png" },
  { key: "creative", label: "Creative", img: "/onboarding/art-gallery.png" },
  { key: "chill", label: "Chill drinks", img: "/onboarding/coffee.png" },
];

const CHIPS = ["Coffee", "Walk", "Dessert"];

export default function AppDemoVibes({ onComplete }: { onComplete: () => void }) {
  const [selectedVibe, setSelectedVibe] = useState<string | null>(null);
  const [showChips, setShowChips] = useState(false);
  const [selectedChip, setSelectedChip] = useState<string | null>(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(setTimeout(() => setSelectedVibe("low-key"), 650));
    timers.push(setTimeout(() => setShowChips(true), 1100));
    timers.push(setTimeout(() => setSelectedChip("Coffee"), 1750));
    timers.push(setTimeout(() => onCompleteRef.current(), 2550));
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="flex h-full flex-col px-5 pb-6 pt-1">
      <p className="mb-4 px-2 text-center font-display text-[19px] font-bold text-white">
        What kind of night sounds good?
      </p>

      <div className="grid grid-cols-2 gap-2.5">
        {VIBES.map((v) => {
          const sel = selectedVibe === v.key;
          return (
            <div
              key={v.key}
              className={`relative overflow-hidden rounded-2xl bg-white/5 transition-all duration-300 ${
                sel ? "border-2 border-[#b48cff]" : "border border-white/15"
              }`}
            >
              <div className="aspect-[16/10] w-full overflow-hidden">
                <img src={v.img} alt={v.label} className="h-full w-full object-cover" />
              </div>
              <div className="px-2.5 py-1.5">
                <span className="text-[11px] font-semibold text-white">{v.label}</span>
              </div>
              {sel && (
                <>
                  <div className="pointer-events-none absolute inset-0 bg-[#b48cff]/15" />
                  <span className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#b48cff]">
                    <Check className="h-3 w-3 stroke-[3] text-white" />
                  </span>
                </>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 min-h-[40px]">
        {showChips && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap justify-center gap-2"
          >
            {CHIPS.map((c) => {
              const sel = selectedChip === c;
              return (
                <span
                  key={c}
                  className={`rounded-full border px-3.5 py-1.5 text-[11px] font-medium transition-all duration-300 ${
                    sel
                      ? "border-[#b48cff] bg-[#b48cff]/20 text-white"
                      : "border-white/15 text-white/80"
                  }`}
                >
                  {c}
                </span>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
}
