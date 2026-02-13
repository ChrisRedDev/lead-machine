import { motion } from "framer-motion";
import { ArrowRight, Zap, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden px-4">
      {/* Minimal background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/6 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border/60 bg-secondary/40 mb-8"
        >
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-medium text-muted-foreground">AI-Powered Lead Generation</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-5xl md:text-7xl font-bold font-display tracking-tight leading-[1.08] mb-6"
        >
          One Click.
          <br />
          <span className="gradient-text">Infinite Opportunities.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.16, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed"
        >
          Drop your company URL — our AI analyzes your business, finds your ideal customers, and delivers a ready-to-use prospect list.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.24, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <Button
            size="lg"
            className="h-13 px-8 text-[15px] font-medium rounded-2xl bg-foreground text-background hover:bg-foreground/90 transition-all"
            onClick={() => navigate("/dashboard")}
          >
            Get Started Free
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
          <Button
            size="lg"
            variant="ghost"
            className="h-13 px-8 text-[15px] font-medium rounded-2xl text-muted-foreground hover:text-foreground"
            onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
          >
            How It Works
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
