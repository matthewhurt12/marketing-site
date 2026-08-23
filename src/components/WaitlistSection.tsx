import { ArrowRight, Check, Mail } from "lucide-react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef, useState } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

export default function WaitlistSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-10%" });
  const reduceMotion = useReducedMotion();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim() || status === "sending") return;

    setStatus("sending");
    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setStatus(response.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="waitlist" ref={sectionRef} className="relative overflow-hidden bg-[#f3edf0] px-5 py-24 text-[#211543] sm:px-6 md:py-32">
      <div className="absolute -left-32 top-16 h-96 w-96 rounded-full bg-[#b48cff]/20 blur-3xl" aria-hidden="true" />
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 24 }}
        animate={inView || reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
        transition={{ duration: 0.8, ease }}
        className="relative mx-auto grid max-w-[76rem] gap-12 overflow-hidden rounded-[2.75rem] border border-[#211543]/10 bg-white/55 p-6 shadow-[0_35px_110px_rgba(43,26,77,0.1)] backdrop-blur-xl sm:p-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:p-14"
      >
        <div>
          <div className="flex items-center gap-3">
            <img src="/brand-mark-192.png" alt="" className="h-12 w-12" />
            <p className="font-sans text-[10px] font-bold uppercase tracking-[0.22em] text-[#7558be]">Be first</p>
          </div>
          <h2 className="mt-7 text-balance font-display text-[clamp(4rem,7vw,7rem)] font-bold leading-[0.86] tracking-[-0.06em]">
            Date differently.
          </h2>
          <p className="mt-6 max-w-md font-sans text-base leading-relaxed text-[#211543]/58 sm:text-lg">
            Join the early list. We&apos;ll tell you when In Person is ready near you.
          </p>
        </div>

        <div className="rounded-[2rem] bg-[#17102f] p-4 text-white shadow-[0_28px_80px_rgba(23,16,47,0.25)] sm:p-6">
          {status === "success" ? (
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease }}
              role="status"
              aria-live="polite"
              className="px-4 py-10 text-center"
            >
              <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#91d9c0] text-[#15382d]">
                <Check className="h-5 w-5 stroke-[3]" aria-hidden="true" />
              </span>
              <p className="mt-5 font-display text-3xl font-semibold">You&apos;re in early.</p>
              <p className="mt-2 font-sans text-sm text-white/48">We&apos;ll send the updates worth opening.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit}>
              <label htmlFor="waitlist-email" className="font-sans text-xs font-semibold text-white/64">Your email</label>
              <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                <div className="flex min-w-0 flex-1 items-center gap-3 rounded-full border border-white/[0.1] bg-white/[0.06] px-5">
                  <Mail className="h-4 w-4 shrink-0 text-white/32" aria-hidden="true" />
                  <input
                    id="waitlist-email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    disabled={status === "sending"}
                    className="min-w-0 flex-1 bg-transparent py-4 font-sans text-sm text-white outline-none placeholder:text-white/28 disabled:opacity-50"
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="group inline-flex items-center justify-center gap-3 rounded-full bg-[#f7f2ff] px-6 py-4 font-sans text-xs font-semibold text-[#211543] transition hover:bg-white disabled:cursor-wait disabled:opacity-60"
                >
                  {status === "sending" ? "Joining…" : "Get early access"}
                  {status !== "sending" ? <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" /> : null}
                </button>
              </div>

              <div aria-live="polite" className="min-h-6 pt-3">
                {status === "error" ? (
                  <p className="font-sans text-xs text-[#ffaaa0]">Something went wrong. Please try again.</p>
                ) : (
                  <p className="font-sans text-xs text-white/46">Free · 18+ · No payment required · Unsubscribe anytime</p>
                )}
              </div>
              <p className="mt-2 font-sans text-xs leading-relaxed text-white/40">
                By joining, you agree to our{" "}
                <a href="/terms" className="underline underline-offset-4 transition hover:text-white/70">Terms</a>
                {" "}and{" "}
                <a href="/privacy" className="underline underline-offset-4 transition hover:text-white/70">Privacy Policy</a>.
                Joining does not guarantee early access.
              </p>
            </form>
          )}
        </div>
      </motion.div>
    </section>
  );
}
