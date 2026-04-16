export default function SiteFooter() {
  return (
    <footer className="border-t border-border/50 py-12 px-6">
      <div className="mx-auto max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2.5">
          <img src="/logo.png" alt="In Person" className="h-6 w-6" />
          <span className="font-display text-base font-light text-foreground">
            In Person
          </span>
        </div>
        <div className="flex items-center gap-6 text-xs text-muted-foreground">
          <a href="#" className="hover:text-foreground aura-transition">Privacy</a>
          <a href="#" className="hover:text-foreground aura-transition">Terms</a>
          <a href="#" className="hover:text-foreground aura-transition">Instagram</a>
        </div>
      </div>
      <p className="text-center text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-8">
        Made for people who'd rather be on a date than on an app.
      </p>
    </footer>
  );
}
