import SiteNav from "@/components/SiteNav";
import GrainOverlay from "@/components/GrainOverlay";
import DarkPetals from "@/components/DarkPetals";
import HeroSection from "@/components/HeroSection";
import IndictmentScroll from "@/components/IndictmentScroll";
import AppDemo from "@/components/AppDemo";
import AntiPositioning from "@/components/AntiPositioning";
import WaitlistSection from "@/components/WaitlistSection";
import SiteFooter from "@/components/SiteFooter";

export default function App() {
  return (
    <div className="relative">
      <DarkPetals />
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
