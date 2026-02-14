import { motion } from "framer-motion";
import { Globe, Brain, Target, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";

const accentColors = [
  { border: "border-l-primary", dot: "bg-primary", icon: "text-primary" },
  { border: "border-l-accent", dot: "bg-accent", icon: "text-accent" },
  { border: "border-l-success", dot: "bg-success", icon: "text-success" },
  { border: "border-l-warning", dot: "bg-warning", icon: "text-warning" },
];

const FeaturesSection = () => {
  const { t } = useTranslation();

  const steps = [
    { icon: Globe, titleKey: "features.step1Title", descKey: "features.step1Desc" },
    { icon: Brain, titleKey: "features.step2Title", descKey: "features.step2Desc" },
    { icon: Target, titleKey: "features.step3Title", descKey: "features.step3Desc" },
    { icon: Sparkles, titleKey: "features.step4Title", descKey: "features.step4Desc" },
  ];

  return (
    <section id="features" className="py-28 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-4"
        >
          <span className="text-[11px] uppercase tracking-widest text-primary font-semibold">How it works</span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-3 tracking-tight">{t("features.title")}</h2>
          <p className="text-muted-foreground text-sm md:text-base max-w-md mx-auto">{t("features.subtitle")}</p>
          <div className="w-12 h-[2px] bg-gradient-primary mx-auto mt-6 rounded-full" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-5">
          {steps.map((step, i) => {
            const color = accentColors[i];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className={`rounded-2xl border border-border ${color.border} border-l-[3px] bg-card p-6 hover:-translate-y-1 transition-transform duration-200`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                    <step.icon className={`w-5 h-5 ${color.icon}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${color.dot}`} />
                      <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Step {i + 1}</span>
                    </div>
                    <h3 className="text-[15px] font-semibold font-display mt-1 mb-1">{t(step.titleKey)}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{t(step.descKey)}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
