import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

const ease = [0.23, 1, 0.32, 1] as const;

export default function WaitlistSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || status === "sending") return;

    setStatus("sending");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="waitlist" ref={ref} className="py-32 md:py-48 px-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, ease }}
        className="mx-auto max-w-md text-center"
      >
        <h2 className="font-display text-4xl md:text-5xl font-light tracking-tight text-foreground mb-4">
          Your next date is already planned.
        </h2>

        <p className="text-muted-foreground text-sm mb-10">
          Join the waitlist and be first to experience dating the way it should be.
        </p>

        {status === "success" ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease }}
          >
            <p className="text-primary font-medium text-sm tracking-wide mb-2">
              You're in. First dates are being planned now.
            </p>
            <p className="text-muted-foreground text-xs">
              We'll reach out when it's your turn.
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              required
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === "sending"}
              className="flex-1 bg-secondary/50 border border-border rounded-full px-6 py-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary aura-transition disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={status === "sending"}
              className="bg-primary text-primary-foreground rounded-full px-8 py-4 text-sm font-medium tracking-widest uppercase aura-transition hover:opacity-90 whitespace-nowrap disabled:opacity-50"
            >
              {status === "sending" ? "..." : "Join"}
            </button>
            {status === "error" && (
              <p className="text-xs text-red-400 mt-2 sm:mt-0 sm:self-center">Something went wrong. Try again.</p>
            )}
          </form>
        )}
      </motion.div>
    </section>
  );
}
