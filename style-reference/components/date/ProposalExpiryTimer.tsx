import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

interface ProposalExpiryTimerProps {
  createdAt: string; // ISO timestamp
  expiryHours?: number;
}

export default function ProposalExpiryTimer({ createdAt, expiryHours = 24 }: ProposalExpiryTimerProps) {
  const [remaining, setRemaining] = useState("");
  const [isUrgent, setIsUrgent] = useState(false);

  useEffect(() => {
    const update = () => {
      const created = new Date(createdAt).getTime();
      const expiresAt = created + expiryHours * 60 * 60 * 1000;
      const now = Date.now();
      const diff = expiresAt - now;

      if (diff <= 0) {
        setRemaining("Expired");
        setIsUrgent(true);
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      if (hours > 0) {
        setRemaining(`Expires in ${hours}h ${minutes}m`);
      } else {
        setRemaining(`Expires in ${minutes}m`);
      }

      setIsUrgent(hours < 3);
    };

    update();
    const interval = setInterval(update, 60_000);
    return () => clearInterval(interval);
  }, [createdAt, expiryHours]);

  return (
    <span className={`inline-flex items-center justify-center gap-1.5 text-sm ${isUrgent ? "text-primary font-medium" : "text-muted-foreground"}`}>
      <Clock className="w-3.5 h-3.5" />
      {remaining}
    </span>
  );
}
