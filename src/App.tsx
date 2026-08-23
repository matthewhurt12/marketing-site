import SiteNav from "@/components/SiteNav";
import GrainOverlay from "@/components/GrainOverlay";
import DreamBackground from "@/components/DreamBackground";
import HeroSection from "@/components/HeroSection";
import ProblemReset from "@/components/ProblemReset";
import ExperienceStory from "@/components/ExperienceStory";
import DateLifeSection from "@/components/DateLifeSection";
import PrinciplesSection from "@/components/PrinciplesSection";
import FAQSection from "@/components/FAQSection";
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
        <ProblemReset />
        <ExperienceStory />
        <DateLifeSection />
        <PrinciplesSection />
        <FAQSection />
        <WaitlistSection />
      </main>
      <SiteFooter />
    </div>
  );
}
