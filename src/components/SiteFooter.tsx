export default function SiteFooter() {
  return (
    <footer className="border-t border-border/50 py-12">
      <div className="container-site flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2.5">
          <img src="/logo.png" alt="In Person" className="h-6 w-6" />
          <span className="font-display text-base font-bold text-foreground">
            In Person
          </span>
        </div>
        <div className="flex items-center gap-6 text-xs text-muted-foreground">
          <a href="/privacy" className="hover:text-lilac aura-transition">Privacy</a>
          <a href="/terms" className="hover:text-lilac aura-transition">Terms</a>
          <a href="#" className="hover:text-lilac aura-transition">Instagram</a>
        </div>
      </div>
      <p className="container-site text-center text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-8">
        Made for people who'd rather be on a date than on an app.
      </p>
      <p className="container-site text-center text-[10px] text-muted-foreground mt-3">
        In Person is owned and operated by Kinetic Social LLC, a Texas limited liability company.
      </p>
    </footer>
  );
}
