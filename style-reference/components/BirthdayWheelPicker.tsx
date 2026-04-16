import { useState, useRef, useEffect, useCallback } from "react";
import { format } from "date-fns";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const ITEM_HEIGHT = 44;
const VISIBLE_ITEMS = 5;
const CONTAINER_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;

const currentYear = new Date().getFullYear();
const MIN_YEAR = currentYear - 100;
const MAX_YEAR = currentYear - 16;

const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);
const YEARS = Array.from({ length: MAX_YEAR - MIN_YEAR + 1 }, (_, i) => MAX_YEAR - i);

// Default to ~age 27
const DEFAULT_YEAR = currentYear - 27;
const DEFAULT_MONTH = 0;
const DEFAULT_DAY = 1;

interface WheelColumnProps {
  items: { label: string; value: number }[];
  selected: number;
  onSelect: (value: number) => void;
}

const WheelColumn = ({ items, selected, onSelect }: WheelColumnProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const selectedIndex = items.findIndex((it) => it.value === selected);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.scrollTop = selectedIndex * ITEM_HEIGHT;
  }, [selectedIndex]);

  const handleScroll = useCallback(() => {
    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    scrollTimeout.current = setTimeout(() => {
      const el = containerRef.current;
      if (!el) return;
      const index = Math.round(el.scrollTop / ITEM_HEIGHT);
      const clamped = Math.max(0, Math.min(items.length - 1, index));
      onSelect(items[clamped].value);
    }, 150);
  }, [items, onSelect]);

  useEffect(() => {
    return () => clearTimeout(scrollTimeout.current);
  }, []);

  const handleClick = (value: number) => {
    const index = items.findIndex((it) => it.value === value);
    containerRef.current?.scrollTo({ top: index * ITEM_HEIGHT, behavior: "smooth" });
  };

  return (
    <div className="relative" style={{ height: CONTAINER_HEIGHT }}>
      <div className="absolute inset-x-0 top-0 h-[88px] bg-gradient-to-b from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-[88px] bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />
      <div
        className="absolute inset-x-0 z-[5] pointer-events-none border-y border-primary/20"
        style={{ top: ITEM_HEIGHT * 2, height: ITEM_HEIGHT }}
      />
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="h-full overflow-y-auto scrollbar-hide"
        style={{
          scrollSnapType: "y mandatory",
          WebkitOverflowScrolling: "touch",
          overscrollBehavior: "contain",
          paddingTop: ITEM_HEIGHT * 2,
          paddingBottom: ITEM_HEIGHT * 2,
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
      >
        {items.map((item) => {
          const isSelected = item.value === selected;
          return (
            <div
              key={item.value}
              onClick={() => handleClick(item.value)}
              className={`flex items-center justify-center cursor-pointer transition-all duration-200 ${
                isSelected
                  ? "text-foreground font-medium scale-105"
                  : "text-muted-foreground/50 font-light"
              }`}
              style={{
                height: ITEM_HEIGHT,
                scrollSnapAlign: "start",
                fontSize: isSelected ? "18px" : "15px",
              }}
            >
              {item.label}
            </div>
          );
        })}
      </div>
    </div>
  );
};

interface BirthdayWheelPickerProps {
  onSelect: (date: Date) => void;
  onConfirm: (dateStr: string) => void;
}

const BirthdayWheelPicker = ({ onSelect, onConfirm }: BirthdayWheelPickerProps) => {
  const [day, setDay] = useState(DEFAULT_DAY);
  const [month, setMonth] = useState(DEFAULT_MONTH);
  const [year, setYear] = useState(DEFAULT_YEAR);

  const maxDay = new Date(year, month + 1, 0).getDate();
  const clampedDay = Math.min(day, maxDay);

  const selectedDate = new Date(year, month, clampedDay);

  useEffect(() => {
    if (clampedDay !== day) setDay(clampedDay);
  }, [clampedDay, day]);

  useEffect(() => {
    onSelect(selectedDate);
  }, [day, month, year, selectedDate, onSelect]);

  const dayItems = Array.from({ length: maxDay }, (_, i) => ({
    label: String(i + 1),
    value: i + 1,
  }));

  const monthItems = MONTHS.map((m, i) => ({ label: m, value: i }));
  const yearItems = YEARS.map((y) => ({ label: String(y), value: y }));

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-xs mx-auto">
      {/* Wheel columns */}
      <div className="flex w-full gap-1">
        <div className="flex-[0.8]">
          <WheelColumn items={dayItems} selected={clampedDay} onSelect={setDay} />
        </div>
        <div className="flex-[1.2]">
          <WheelColumn items={monthItems} selected={month} onSelect={setMonth} />
        </div>
        <div className="flex-1">
          <WheelColumn items={yearItems} selected={year} onSelect={setYear} />
        </div>
      </div>

      {/* Selected date display */}
      <p className="text-sm font-medium text-foreground">
        {format(selectedDate, "MMMM d, yyyy")}
      </p>

      {/* Continue button */}
      <button
        onClick={() => onConfirm(selectedDate.toISOString().split("T")[0])}
        className="px-8 py-3 rounded-full bg-primary text-primary-foreground text-sm font-medium aura-transition hover:bg-aura-charcoal"
      >
        Continue
      </button>
    </div>
  );
};

export default BirthdayWheelPicker;
