import { ArrowUpRight } from "lucide-react";

export default function SiteFooter() {
  return (
    <footer className="border-t border-white/[0.07] bg-[#0f0922] px-5 py-10 sm:px-6">
      <div className="mx-auto max-w-[76rem]">
        <div className="flex flex-col justify-between gap-10 border-b border-white/[0.07] pb-10 sm:flex-row sm:items-end">
          <div>
            <a href="/" className="flex w-fit items-center gap-3">
              <img src="/brand-mark-192.png" alt="" className="h-10 w-10" />
              <span className="font-display text-xl font-bold text-white">In Person</span>
            </a>
            <p className="mt-4 max-w-sm font-sans text-xs leading-relaxed text-white/36">
              A dating experience designed to turn one thoughtful introduction into one real plan.
            </p>
          </div>
          <a
            href="#waitlist"
            className="group inline-flex w-fit items-center gap-2 font-sans text-[10px] font-bold uppercase tracking-[0.18em] text-[#d6b8ff] transition hover:text-white"
          >
            Request early access
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
          </a>
        </div>

        <div className="flex flex-col justify-between gap-5 pt-7 font-sans text-xs text-white/48 sm:flex-row sm:items-center">
          <p>© 2026 Kinetic Social LLC. In Person is in development.</p>
          <div className="flex items-center gap-6">
            <a href="/privacy" className="transition hover:text-white/65">Privacy</a>
            <a href="/terms" className="transition hover:text-white/65">Terms</a>
            <span>18+</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
