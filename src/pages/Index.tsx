import { Helmet } from "react-helmet-async";
import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import StatsCounter from "@/components/landing/StatsCounter";
import FeaturesSection from "@/components/landing/FeaturesSection";
import DemoPreview from "@/components/landing/DemoPreview";
import SocialProof from "@/components/landing/SocialProof";
import PricingSection from "@/components/landing/PricingSection";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>LeadMachine AI — Get 100 Qualified Clients In 1 Click</title>
        <meta name="description" content="AI-powered B2B lead generation. Drop your company URL and get a targeted prospect list in minutes. 10 free leads, no credit card required." />
        <link rel="canonical" href="https://leadmachine.ai" />
      </Helmet>
      <Navbar />
      <main className="pt-14">
        <HeroSection />
        <StatsCounter />
        <FeaturesSection />
        <DemoPreview />
        <SocialProof />
        <PricingSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
