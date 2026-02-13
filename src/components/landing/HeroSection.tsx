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
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden px-4">
      {/* Animated background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/6 rounded-full blur-[150px] animate-float-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent/4 rounded-full blur-[120px] animate-float-slow" style={{ animationDelay: "3s" }} />
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
        {/* Floating particles */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-primary/20 animate-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${6 + Math.random() * 6}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border/60 bg-secondary/40 mb-8"
        >
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-medium text-muted-foreground">{t("hero.badge")}</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.08 }}
          className="text-4xl sm:text-5xl md:text-7xl font-bold font-display tracking-tight leading-[1.08] mb-6"
        >
          {t("hero.headline").split(" ").slice(0, -3).join(" ")}{" "}
          <span className="gradient-text">{t("hero.headline").split(" ").slice(-3).join(" ")}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.16 }}
          className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed"
        >
          {t("hero.subheadline")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.24 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <Button
            size="lg"
            className="h-13 px-8 text-[15px] font-medium rounded-2xl bg-foreground text-background hover:bg-foreground/90 transition-all glow-sm hover:glow-md"
            onClick={() => navigate("/login")}
          >
            {t("hero.cta")}
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
          <Button
            size="lg"
            variant="ghost"
            className="h-13 px-8 text-[15px] font-medium rounded-2xl text-muted-foreground hover:text-foreground"
            onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
          >
            {t("hero.ctaSecondary")}
          </Button>
        </motion.div>

        {/* Hero dashboard image */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 relative"
        >
          <div className="absolute -inset-4 bg-gradient-to-b from-primary/10 via-transparent to-transparent rounded-3xl blur-2xl pointer-events-none" />
          <div className="relative rounded-2xl overflow-hidden border border-border/30 shadow-2xl shadow-primary/5">
            <img
              src={heroImage}
              alt="LeadMachine AI Dashboard - B2B Lead Generation Platform"
              className="w-full h-auto"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          </div>
        </motion.div>

        {/* Trusted by logos placeholder */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 flex items-center justify-center gap-8 flex-wrap"
        >
          <span className="text-xs text-muted-foreground/50 uppercase tracking-wider">{t("hero.trustedBy")}</span>
          {["TechCorp", "SalesFlow", "GrowthIO", "DataSync", "CloudBase"].map((name) => (
            <span key={name} className="text-sm font-display font-semibold text-muted-foreground/25 tracking-tight">
              {name}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
