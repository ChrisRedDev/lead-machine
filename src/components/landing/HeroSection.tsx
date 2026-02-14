import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import heroImage from "@/assets/hero-dashboard.jpg";

const HeroSection = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center px-4 overflow-hidden">
      {/* Animated gradient mesh background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-primary opacity-[0.06] blur-[120px] animate-pulse-soft" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-[hsl(260,70%,60%)] opacity-[0.04] blur-[100px] animate-float" />
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] rounded-full bg-[hsl(152,60%,48%)] opacity-[0.03] blur-[80px] animate-float-delayed" />
      </div>

      {/* Floating shapes */}
      <div className="absolute top-20 right-[15%] w-3 h-3 rounded-full bg-primary/30 animate-float" />
      <div className="absolute top-40 left-[10%] w-2 h-2 rounded-full bg-success/30 animate-float-delayed" />
      <div className="absolute bottom-40 right-[20%] w-4 h-4 rounded-full bg-accent/20 animate-float" />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 backdrop-blur-sm mb-8"
        >
          <div className="flex gap-1">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse-soft" />
            <span className="w-2 h-2 rounded-full bg-accent" />
            <span className="w-2 h-2 rounded-full bg-success" />
          </div>
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-medium text-muted-foreground">{t("hero.badge")}</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.06 }}
          className="text-4xl sm:text-5xl md:text-7xl font-bold font-display tracking-tight leading-[1.08] mb-6"
        >
          {t("hero.headline").split(" ").slice(0, -3).join(" ")}{" "}
          <span className="text-gradient">{t("hero.headline").split(" ").slice(-3).join(" ")}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.12 }}
          className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed"
        >
          {t("hero.subheadline")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.18 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <Button
            size="lg"
            className="h-12 px-8 text-[15px] font-medium rounded-xl bg-gradient-primary text-primary-foreground hover:opacity-90 transition-all duration-300 hover:shadow-[0_8px_30px_-4px_hsl(234,89%,64%,0.4)]"
            onClick={() => navigate("/login")}
          >
            {t("hero.cta")}
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
          <Button
            size="lg"
            variant="ghost"
            className="h-12 px-8 text-[15px] font-medium rounded-xl text-muted-foreground hover:text-foreground"
            onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
          >
            {t("hero.ctaSecondary")}
          </Button>
        </motion.div>

        {/* Hero dashboard image with animated gradient border */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-16 relative group"
        >
          <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-b from-primary/40 via-accent/30 to-success/20 opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative rounded-2xl overflow-hidden bg-card">
            <img
              src={heroImage}
              alt="LeadMachine AI Dashboard - B2B Lead Generation Platform"
              className="w-full h-auto"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
          </div>
        </motion.div>

        {/* Trusted by logos - animated sliding */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-14"
        >
          <p className="text-[11px] uppercase tracking-widest text-muted-foreground/50 mb-5">
            {t("hero.trustedBy")} 500+ companies worldwide
          </p>
          <div className="flex items-center justify-center gap-8 flex-wrap opacity-30">
            {["Acme Corp", "TechFlow", "DataBridge", "CloudScale", "NovaPay"].map((name, i) => (
              <motion.span
                key={name}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + i * 0.1 }}
                className="font-display font-bold text-sm text-muted-foreground tracking-tight hover:text-foreground/50 transition-colors cursor-default"
              >
                {name}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
