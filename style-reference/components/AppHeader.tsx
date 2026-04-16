import { useNavigate } from "react-router-dom";
import { ChevronLeft, User } from "lucide-react";

interface AppHeaderProps {
  backTo?: string;
  showProfile?: boolean;
  completionPercent?: number;
}

const AppHeader = ({ backTo, showProfile = true, completionPercent }: AppHeaderProps) => {
  const navigate = useNavigate();

  // SVG ring params
  const ringSize = 44;
  const strokeWidth = 3;
  const radius = (ringSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const showRing = completionPercent != null && completionPercent < 100;
  const offset = showRing ? circumference - (circumference * (completionPercent ?? 0)) / 100 : 0;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between pt-14 pb-2 px-6">
      {backTo ? (
        <button
          onClick={() => navigate(backTo)}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-secondary/60 text-muted-foreground hover:text-primary aura-transition"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      ) : (
        <div className="w-10" />
      )}
      {showProfile ? (
        <button
          onClick={() => navigate("/profile")}
          className="relative flex items-center gap-1.5"
        >
          {showRing && (
            <span className="text-[11px] font-semibold text-muted-foreground tabular-nums">
              {completionPercent}%
            </span>
          )}
          <span className="relative w-11 h-11 flex items-center justify-center">
            {showRing && (
              <svg
                className="absolute inset-0"
                width={ringSize}
                height={ringSize}
                viewBox={`0 0 ${ringSize} ${ringSize}`}
              >
                <circle
                  cx={ringSize / 2}
                  cy={ringSize / 2}
                  r={radius}
                  fill="none"
                  stroke="hsl(var(--secondary))"
                  strokeWidth={strokeWidth}
                />
                <circle
                  cx={ringSize / 2}
                  cy={ringSize / 2}
                  r={radius}
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  transform={`rotate(-90 ${ringSize / 2} ${ringSize / 2})`}
                  className="transition-all duration-700 ease-out"
                />
              </svg>
            )}
            <span className="w-9 h-9 flex items-center justify-center rounded-full bg-secondary/60 text-muted-foreground">
              <User className="w-4 h-4" />
            </span>
          </span>
        </button>
      ) : (
        <div className="w-10" />
      )}
    </div>
  );
};

export default AppHeader;
