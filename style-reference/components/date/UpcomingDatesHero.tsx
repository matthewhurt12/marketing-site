import { useTheme } from "@/context/ThemeContext";

export default function UpcomingDatesHero() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const waveOpacities = [0.06, 0.08, 0.1, 0.07, 0.09, 0.05];

  return (
    <div className="relative w-full flex flex-col items-center pt-6 pb-8 overflow-hidden">
      {/* Wave background */}
      <div className="absolute inset-0 pointer-events-none">
        <svg
          viewBox="0 0 390 200"
          fill="none"
          preserveAspectRatio="xMidYMin slice"
          className="w-full h-full"
        >
          {waveOpacities.map((opacity, i) => (
            <path
              key={i}
              d={`M0 ${80 + i * 16} Q98 ${60 + i * 12} 195 ${80 + i * 16} T390 ${80 + i * 16}`}
              stroke={
                isDark
                  ? `rgba(130, 170, 220, ${opacity * 0.6})`
                  : `rgba(236, 172, 190, ${opacity})`
              }
              strokeWidth="1.5"
              fill="none"
            />
          ))}
          <defs>
            <radialGradient id="heroGlow" cx="50%" cy="40%" r="50%">
              {isDark ? (
                <>
                  <stop offset="0%" stopColor="rgba(130, 170, 220, 0.08)" />
                  <stop offset="60%" stopColor="rgba(130, 170, 220, 0.03)" />
                  <stop offset="100%" stopColor="rgba(130, 170, 220, 0)" />
                </>
              ) : (
                <>
                  <stop offset="0%" stopColor="rgba(244, 182, 200, 0.25)" />
                  <stop offset="60%" stopColor="rgba(244, 182, 200, 0.08)" />
                  <stop offset="100%" stopColor="rgba(244, 182, 200, 0)" />
                </>
              )}
            </radialGradient>
          </defs>
          <rect width="390" height="200" fill="url(#heroGlow)" />
        </svg>
      </div>

      {/* Orb / Moon */}
      {isDark ? (
        <div className="relative mb-5 z-10 flex items-center justify-center">
          {/* Pulsating glow rings — centered, 5s breathe */}
          <div
            className="absolute inset-[-14px] rounded-full"
            style={{ background: 'rgba(130, 170, 220, 0.15)', animation: 'aura-pulse 5s ease-in-out infinite' }}
          />
          <div
            className="absolute inset-[-14px] rounded-full"
            style={{ background: 'rgba(130, 170, 220, 0.1)', animation: 'aura-pulse 5s ease-in-out infinite', animationDelay: '2.5s' }}
          />
          <div className="absolute inset-[-6px] rounded-full border border-slate-300/10" />
          <div className="w-14 h-14 rounded-full bg-slate-300/80 flex items-center justify-center relative overflow-hidden">
            <div className="w-9 h-9 rounded-full bg-slate-200/50 flex items-center justify-center">
              <div className="w-5 h-5 rounded-full bg-white/30" />
            </div>
            <div
              className="absolute w-12 h-12 rounded-full"
              style={{ background: 'hsl(220, 15%, 10%)', top: '-4px', left: '-6px' }}
            />
          </div>
        </div>
      ) : (
        <div className="relative mb-5 z-10 flex items-center justify-center">
          {/* Pulsating glow rings — centered, 5s breathe */}
          <div
            className="absolute inset-[-14px] rounded-full"
            style={{ background: 'rgba(244, 182, 200, 0.2)', animation: 'aura-pulse 5s ease-in-out infinite' }}
          />
          <div
            className="absolute inset-[-14px] rounded-full"
            style={{ background: 'rgba(244, 182, 200, 0.15)', animation: 'aura-pulse 5s ease-in-out infinite', animationDelay: '2.5s' }}
          />
          <div className="w-14 h-14 rounded-full bg-pink-200/30 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-pink-300/50 flex items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-pink-400/80" />
            </div>
          </div>
          <div className="absolute inset-[-6px] rounded-full border border-pink-200/20" />
        </div>
      )}

      {/* Title */}
      <h2 className="text-2xl font-semibold text-foreground z-10">
        Upcoming dates
      </h2>
    </div>
  );
}
