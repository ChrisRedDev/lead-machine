import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import DemoPreview from "@/components/landing/DemoPreview";
import PricingSection from "@/components/landing/PricingSection";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-14">
        <HeroSection />
        <FeaturesSection />
        <DemoPreview />
        <PricingSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
