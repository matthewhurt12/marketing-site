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
    <section id="waitlist" ref={sectionRef} className="relative overflow-hidden bg-[#120c29] px-5 py-24 sm:px-6 md:py-36">
      <div className="v2-waitlist-glow" aria-hidden="true" />
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
        transition={{ duration: 0.9, ease }}
        className="relative mx-auto max-w-[76rem] overflow-hidden rounded-[2.75rem] border border-white/[0.1] bg-gradient-to-br from-white/[0.085] to-white/[0.025] px-6 py-16 text-center shadow-[0_50px_140px_rgba(8,3,25,0.5)] backdrop-blur-xl sm:px-10 md:py-24"
      >
        <div className="absolute inset-0 v2-card-grid" aria-hidden="true" />
        <div className="relative mx-auto max-w-4xl">
          <motion.div
            animate={reduceMotion ? undefined : { y: [0, -7, 0], rotate: [0, -1.5, 0, 1.5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="mx-auto mb-8 w-fit"
          >
            <img src="/brand-mark-192.png" alt="" className="h-20 w-20 drop-shadow-[0_18px_34px_rgba(180,140,255,0.24)] sm:h-24 sm:w-24" />
          </motion.div>

          <p className="font-sans text-[10px] font-bold uppercase tracking-[0.24em] text-[#d6b8ff]">The first invitation</p>
          <h2 className="mt-5 text-balance font-display text-[clamp(3.2rem,7vw,7rem)] font-bold leading-[0.9] tracking-[-0.055em] text-white">
            Ready for dating to feel like a plan?
          </h2>
          <p className="mx-auto mt-7 max-w-2xl font-sans text-base leading-relaxed text-white/52 sm:text-lg">
            Join the waitlist for early access, launch updates, and the chance to help shape In Person before it opens.
          </p>

          <div className="mx-auto mt-10 max-w-2xl">
            {status === "success" ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.55, ease }}
                role="status"
                aria-live="polite"
                className="rounded-[1.5rem] border border-[#91d9c0]/20 bg-[#91d9c0]/10 px-6 py-6"
              >
                <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#91d9c0] text-[#15382d]">
                  <Check className="h-5 w-5 stroke-[3]" aria-hidden="true" />
                </span>
                <p className="mt-4 font-display text-2xl font-semibold text-white">You&apos;re on the list.</p>
                <p className="mt-2 font-sans text-xs text-white/46">We&apos;ll send launch and early-access updates when there is something worth opening.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-3 rounded-[1.6rem] border border-white/[0.11] bg-[#100a25]/55 p-2 sm:flex-row sm:rounded-full">
                  <label htmlFor="waitlist-email" className="sr-only">Email address</label>
                  <div className="flex min-w-0 flex-1 items-center gap-3 px-4">
                    <Mail className="h-4 w-4 shrink-0 text-white/28" aria-hidden="true" />
                    <input
                      id="waitlist-email"
                      type="email"
                      autoComplete="email"
                      required
                      placeholder="you@example.com"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      disabled={status === "sending"}
                      className="min-w-0 flex-1 bg-transparent py-3 font-sans text-sm text-white outline-none placeholder:text-white/26 disabled:opacity-50"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="group inline-flex items-center justify-center gap-3 rounded-full bg-[#f7f2ff] px-6 py-4 font-sans text-xs font-semibold text-[#211543] transition duration-300 hover:bg-white disabled:cursor-wait disabled:opacity-60"
                  >
                    {status === "sending" ? "Joining…" : "Join the waitlist"}
                    {status !== "sending" ? <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" /> : null}
                  </button>
                </div>
                <div aria-live="polite" className="min-h-6 pt-3">
                  {status === "error" ? (
                    <p className="font-sans text-xs text-[#ffaaa0]">Something went wrong. Please try again.</p>
                  ) : (
                    <p className="font-sans text-xs text-white/52">
                      Free to join. No payment required. Unsubscribe anytime.
                    </p>
                  )}
                </div>
                <p className="mt-2 font-sans text-xs text-white/48">
                  By joining, you agree to our{" "}
                  <a href="/terms" className="underline underline-offset-4 transition hover:text-white/60">Terms</a>
                  {" "}and{" "}
                  <a href="/privacy" className="underline underline-offset-4 transition hover:text-white/60">Privacy Policy</a>.
                </p>
              </form>
            )}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
