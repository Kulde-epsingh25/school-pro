import { DeskboardPreview } from "@/components/frontend/deshboard-preview";
import { HeroSection } from "@/components/frontend/hero-section";
import  { LogoCloud } from "@/components/frontend/logo-cloud";
import Image from "next/image";

export default function Home() {
  return (
   <main className="max-w-7xl mx-auto">
    <HeroSection />
    <LogoCloud />
    <DeskboardPreview />
   </main>
  );
}
