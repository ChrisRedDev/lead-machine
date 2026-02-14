import { motion } from "framer-motion";
import { Globe, Brain, Target, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";

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
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-3 tracking-tight">{t("features.title")}</h2>
          <p className="text-muted-foreground text-sm md:text-base max-w-md mx-auto">{t("features.subtitle")}</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-5">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-2xl border border-border bg-card p-6 hover:bg-secondary/50 transition-colors duration-200"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                  <step.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Step {i + 1}</span>
                  <h3 className="text-[15px] font-semibold font-display mt-0.5 mb-1">{t(step.titleKey)}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t(step.descKey)}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
