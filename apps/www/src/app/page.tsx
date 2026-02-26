import { ApiSection } from "@/components/landing/api-section";
import { DocsSection } from "@/components/landing/docs-section";
import { HeroSection } from "@/components/landing/hero-section";
import { PlaygroundSection } from "@/components/landing/playground-section";

export default function Home() {
  return (
    <div className="pb-16 md:pb-24">
      <HeroSection />
      <PlaygroundSection />
      <DocsSection />
      <ApiSection />
    </div>
  );
}
