import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { TechnologySection } from "@/components/technology-section"
import { CommunitySection } from "@/components/community-section"
import { Navigation } from "@/components/navigation"
import { Starfield } from "@/components/starfield"

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <Starfield />
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <TechnologySection />
      <CommunitySection />
    </main>
  )
}
