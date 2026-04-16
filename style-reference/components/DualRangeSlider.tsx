import { useRef, useCallback } from "react";

interface DualRangeSliderProps {
  min: number;
  max: number;
  valueMin: number;
  valueMax: number;
  onChange: (min: number, max: number) => void;
}

const DualRangeSlider = ({ min, max, valueMin, valueMax, onChange }: DualRangeSliderProps) => {
  const trackRef = useRef<HTMLDivElement>(null);

  const getValueFromX = useCallback(
    (clientX: number) => {
      const track = trackRef.current;
      if (!track) return min;
      const rect = track.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      return Math.round(min + ratio * (max - min));
    },
    [min, max]
  );

  const startDrag = useCallback(
    (handle: "min" | "max") => (e: React.TouchEvent | React.MouseEvent) => {
      e.preventDefault();
      const getX = (ev: TouchEvent | MouseEvent) =>
        "touches" in ev ? ev.touches[0].clientX : (ev as MouseEvent).clientX;

      const initialX = "touches" in e ? e.touches[0].clientX : e.clientX;
      void initialX;

      const onMove = (ev: TouchEvent | MouseEvent) => {
        const val = getValueFromX(getX(ev));
        if (handle === "min") {
          onChange(Math.min(val, valueMax - 1), valueMax);
        } else {
          onChange(valueMin, Math.max(val, valueMin + 1));
        }
      };

      const onEnd = () => {
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup", onEnd);
        document.removeEventListener("touchmove", onMove);
        document.removeEventListener("touchend", onEnd);
      };

      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onEnd);
      document.addEventListener("touchmove", onMove, { passive: false });
      document.addEventListener("touchend", onEnd);
    },
    [getValueFromX, onChange, valueMin, valueMax]
  );

  const leftPercent = ((valueMin - min) / (max - min)) * 100;
  const rightPercent = ((valueMax - min) / (max - min)) * 100;

  return (
    <div className="relative w-full h-10 flex items-center touch-none select-none">
      {/* Track background */}
      <div
        ref={trackRef}
        className="absolute inset-x-0 h-[3px] rounded-full bg-muted"
      />
      {/* Active range */}
      <div
        className="absolute h-[3px] rounded-full bg-primary"
        style={{ left: `${leftPercent}%`, right: `${100 - rightPercent}%` }}
      />
      {/* Min handle */}
      <div
        className="absolute w-6 h-6 -translate-x-1/2 -translate-y-1/2 top-1/2 rounded-full bg-background border-2 border-primary shadow-md cursor-grab active:cursor-grabbing active:scale-110 transition-transform"
        style={{ left: `${leftPercent}%` }}
        onMouseDown={startDrag("min")}
        onTouchStart={startDrag("min")}
      />
      {/* Max handle */}
      <div
        className="absolute w-6 h-6 -translate-x-1/2 -translate-y-1/2 top-1/2 rounded-full bg-background border-2 border-primary shadow-md cursor-grab active:cursor-grabbing active:scale-110 transition-transform"
        style={{ left: `${rightPercent}%` }}
        onMouseDown={startDrag("max")}
        onTouchStart={startDrag("max")}
      />
    </div>
  );
};

export default DualRangeSlider;
