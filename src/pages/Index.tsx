
import { ModernHero } from "@/components/ModernHero";
import { FlightPathDemo } from "@/components/FlightPathDemo";
import { AvailabilityShowcase } from "@/components/AvailabilityShowcase";
import { AirlineSupport } from "@/components/AirlineSupport";
import { ModernFeatures } from "@/components/ModernFeatures";
import { ModernPricing } from "@/components/ModernPricing";
import { HowItWorks } from "@/components/HowItWorks";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <ModernHero />
      <FlightPathDemo />
      <AvailabilityShowcase />
      <AirlineSupport />
      <ModernFeatures />
      <HowItWorks />
      <ModernPricing />
      <Footer />
    </div>
  );
};

export default Index;
