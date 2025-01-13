import HeroSection from "../components/HeroSection";
import Dashboard from "../components/Dash";
import FeatureSection from "../components/FeatureSection/FeatureSection";
import FaqSection from "../components/FaqSection";
import { HeroHighlight } from "../@/components/ui/hero";

export default async function Home() {
  return (
    <main className="">
      <HeroHighlight>
        <HeroSection />
      </HeroHighlight>
      <Dashboard />
      <div id="feature-section">
        <FeatureSection />
      </div>
      <div id="faq-section">
        <FaqSection />
      </div>
    </main>
  );
}
