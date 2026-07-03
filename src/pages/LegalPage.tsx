import { ReactNode } from "react";
import SiteNav from "@/components/SiteNav";
import GrainOverlay from "@/components/GrainOverlay";
import DreamBackground from "@/components/DreamBackground";
import SiteFooter from "@/components/SiteFooter";

export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-3">
        {title}
      </h2>
      <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
        {children}
      </div>
    </section>
  );
}

export default function LegalPage({
  title,
  effectiveDate,
  children,
}: {
  title: string;
  effectiveDate: string;
  children: ReactNode;
}) {
  return (
    <div className="relative">
      <DreamBackground />
      <GrainOverlay />
      <SiteNav />
      <main className="relative pt-32 pb-24">
        <div className="container-site max-w-3xl">
          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-normal text-foreground mb-3">
            {title}
          </h1>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-12">
            Effective {effectiveDate}
          </p>
          {children}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
