import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { PlanCards } from "@/components/home/PlanCards";
import { PlanTable } from "@/components/home/PlanTable";
import { ContactSection } from "@/components/home/ContactSection";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-bg-page">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <div className="lg:hidden">
        <PlanCards />
      </div>
      <PlanTable />
      <ContactSection />
      <Footer />
    </main>
  );
}
