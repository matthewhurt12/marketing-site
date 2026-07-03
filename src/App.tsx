import SiteNav from "@/components/SiteNav";
import GrainOverlay from "@/components/GrainOverlay";
import DreamBackground from "@/components/DreamBackground";
import HeroSection from "@/components/HeroSection";
import IndictmentScroll from "@/components/IndictmentScroll";
import AppDemo from "@/components/AppDemo";
import AntiPositioning from "@/components/AntiPositioning";
import WaitlistSection from "@/components/WaitlistSection";
import SiteFooter from "@/components/SiteFooter";
import TermsPage from "@/pages/TermsPage";
import PrivacyPage from "@/pages/PrivacyPage";

export default function App() {
  const path = window.location.pathname.replace(/\/+$/, "") || "/";
  if (path === "/terms") return <TermsPage />;
  if (path === "/privacy") return <PrivacyPage />;

  return (
    <div className="relative">
      <DreamBackground />
      <GrainOverlay />
      <SiteNav />
      <main>
        <HeroSection />
        <IndictmentScroll />
        <AppDemo />
        <AntiPositioning />
        <WaitlistSection />
      </main>
      <SiteFooter />
    </div>
  );
}
