import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const CTABanner = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto rounded-3xl bg-gradient-primary p-12 md:p-16 text-center relative overflow-hidden animate-gradient"
        style={{ backgroundSize: "200% 200%" }}
      >
        {/* Floating sparkle particles */}
        <div className="absolute top-6 left-[15%] w-1 h-1 rounded-full bg-white/30 animate-float" />
        <div className="absolute top-12 right-[25%] w-1.5 h-1.5 rounded-full bg-white/20 animate-float-delayed" />
        <div className="absolute bottom-10 left-[30%] w-1 h-1 rounded-full bg-white/25 animate-float" />
        <div className="absolute top-20 right-[10%] w-2 h-2 rounded-full bg-white/15 animate-float-delayed" />
        
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative z-10">
          <Sparkles className="w-8 h-8 text-white/60 mx-auto mb-6 animate-pulse-soft" />
          <h2 className="text-3xl md:text-4xl font-bold font-display text-white mb-4 tracking-tight">
            Ready to find your next 100 clients?
          </h2>
          <p className="text-white/70 text-sm md:text-base max-w-lg mx-auto mb-8">
            Join 500+ businesses already using AI to build their perfect prospect list. Start free, no credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              size="lg"
              className="h-12 px-8 text-[15px] font-medium rounded-xl bg-white text-primary hover:bg-white/90 transition-all duration-300 hover:shadow-[0_8px_30px_-4px_rgba(255,255,255,0.3)]"
              onClick={() => navigate("/login")}
            >
              Get Started Free
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button
              size="lg"
              variant="ghost"
              className="h-12 px-8 text-[15px] font-medium rounded-xl text-white/80 hover:text-white hover:bg-white/10"
              onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}
            >
              View Pricing
            </Button>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default CTABanner;
