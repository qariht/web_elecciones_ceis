import { HeroSection } from "@/components/home/hero-section";
import { ActivePhaseBanner } from "@/components/home/active-phase";
import { FeaturesGrid } from "@/components/home/features-grid";
import { GuaranteesSection } from "@/components/home/guarantees";

export default function Home() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      <HeroSection />
      <section className="container mx-auto max-w-6xl px-4 sm:px-6 py-12 space-y-10">
        <ActivePhaseBanner />
        <FeaturesGrid />
        <GuaranteesSection />
      </section>
    </div>
  );
}