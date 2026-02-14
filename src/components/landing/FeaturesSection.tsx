import { motion } from "framer-motion";
import { Globe, Brain, Target, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import featuresImage from "@/assets/features-illustration.png";

const accentColors = [
  { border: "border-l-primary", dot: "bg-primary", icon: "text-primary", bg: "bg-primary/5" },
  { border: "border-l-accent", dot: "bg-accent", icon: "text-accent", bg: "bg-accent/5" },
  { border: "border-l-success", dot: "bg-success", icon: "text-success", bg: "bg-success/5" },
  { border: "border-l-warning", dot: "bg-warning", icon: "text-warning", bg: "bg-warning/5" },
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
    <section id="features" className="py-28 px-4 relative">
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

        <div className="grid md:grid-cols-2 gap-5 relative">
          {/* Connecting line (desktop) */}
          <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1px] h-[60%] border-l border-dashed border-border/50" />

          {steps.map((step, i) => {
            const color = accentColors[i];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`rounded-2xl border border-border ${color.border} border-l-[3px] bg-card p-6 hover-lift group`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl ${color.bg} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                    <div className={`w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center`}>
                      <span className="text-primary-foreground text-sm font-bold">{i + 1}</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${color.dot}`} />
                      <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Step {i + 1}</span>
                    </div>
                    <h3 className="text-[15px] font-semibold font-display mt-1 mb-1 flex items-center gap-2">
                      <step.icon className={`w-4 h-4 ${color.icon}`} />
                      {t(step.titleKey)}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{t(step.descKey)}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-12 flex justify-center"
        >
          <img src={featuresImage} alt="AI-powered features" className="w-48 h-48 object-contain opacity-40 animate-float" />
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
