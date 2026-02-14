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
    <section className="relative min-h-[88vh] flex items-center justify-center px-4">
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-secondary mb-8"
        >
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
          <span className="text-primary">{t("hero.headline").split(" ").slice(-3).join(" ")}</span>
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
            className="h-12 px-8 text-[15px] font-medium rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
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

        {/* Hero dashboard image */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-16 relative rounded-2xl overflow-hidden border border-border shadow-2xl shadow-black/20"
        >
          <img
            src={heroImage}
            alt="LeadMachine AI Dashboard - B2B Lead Generation Platform"
            className="w-full h-auto"
            loading="eager"
          />
        </motion.div>

        {/* Trusted by */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-12 text-xs text-muted-foreground/60"
        >
          {t("hero.trustedBy")} 500+ companies worldwide
        </motion.p>
      </div>
    </section>
  );
};

export default HeroSection;
