import { motion } from "framer-motion";
import { Globe, Brain, Target, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";

const FeaturesSection = () => {
  const { t } = useTranslation();

  const steps = [
    { icon: Globe, titleKey: "features.step1Title", descKey: "features.step1Desc", color: "from-[hsl(var(--neon-blue))] to-[hsl(var(--primary))]" },
    { icon: Brain, titleKey: "features.step2Title", descKey: "features.step2Desc", color: "from-[hsl(var(--primary))] to-[hsl(var(--neon-purple))]" },
    { icon: Target, titleKey: "features.step3Title", descKey: "features.step3Desc", color: "from-[hsl(var(--neon-purple))] to-[hsl(var(--neon-pink))]" },
    { icon: Sparkles, titleKey: "features.step4Title", descKey: "features.step4Desc", color: "from-[hsl(var(--neon-pink))] to-[hsl(var(--neon-blue))]" },
  ];

  return (
    <section id="features" className="py-28 px-4 relative">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-3 tracking-tight">{t("features.title")}</h2>
          <p className="text-muted-foreground text-sm md:text-base max-w-md mx-auto">{t("features.subtitle")}</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-5 relative">
          {/* Connector line (desktop) */}
          <div className="hidden md:block absolute left-1/2 top-8 bottom-8 w-px bg-gradient-to-b from-primary/20 via-accent/20 to-primary/20" />

          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative rounded-2xl border border-border/50 bg-card/40 p-6 hover:bg-card/70 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center shrink-0 shadow-lg shadow-primary/10 group-hover:shadow-primary/20 transition-shadow`}>
                  <step.icon className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Step {i + 1}</span>
                  <h3 className="text-[15px] font-semibold font-display mt-0.5 mb-1">{t(step.titleKey)}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t(step.descKey)}</p>
                </div>
              </div>
              {/* Glow effect on hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/0 to-accent/0 group-hover:from-primary/3 group-hover:to-accent/3 transition-all duration-300 pointer-events-none" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
