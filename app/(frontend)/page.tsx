import { DeskboardPreview } from "@/components/frontend/deshboard-preview";
import FeatureGrids from "@/components/frontend/features-grid";
import { HeroSection } from "@/components/frontend/hero-section";
import { LogoCloud } from "@/components/frontend/logo-cloud";
import PricingV1 from "@/components/frontend/pricing";
import SiteFooter from "@/components/frontend/site-footer";
import { TabbedFeatures } from "@/components/frontend/tabbed-features";

export default function Home() {
  return (
    <main className="max-w-7xl mx-auto">
      <HeroSection />
      <LogoCloud />
      <DeskboardPreview />
      {/* <FeatureGrids /> */}
      <TabbedFeatures />
      <PricingV1 />
    </main>
  );
}
