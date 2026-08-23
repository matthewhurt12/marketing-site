export default function SiteFooter() {
  return (
    <footer className="border-t border-white/[0.07] bg-[#0f0922] px-5 py-8 sm:px-6">
      <div className="mx-auto flex max-w-[76rem] flex-col justify-between gap-6 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <img src="/brand-mark-192.png" alt="" className="h-9 w-9" />
          <div>
            <p className="font-display text-lg font-bold text-white">In Person</p>
            <p className="font-sans text-[10px] text-white/42">AI matchmaking. Real dates.</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 font-sans text-xs text-white/48">
          <span>© 2026 Kinetic Social LLC</span>
          <a href="/privacy" className="transition hover:text-white">Privacy</a>
          <a href="/terms" className="transition hover:text-white">Terms</a>
          <span>In development · 18+</span>
        </div>
      </div>
    </footer>
  );
}
