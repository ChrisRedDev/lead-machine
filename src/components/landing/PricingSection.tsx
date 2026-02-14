import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const PricingSection = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [annual, setAnnual] = useState(false);

  const plans = [
    {
      name: t("pricing.starter"),
      price: t("pricing.starterPrice"),
      per: "",
      credits: t("pricing.starterCredits"),
      features: [t("pricing.starterF1"), t("pricing.starterF2"), t("pricing.starterF3"), t("pricing.starterF4")],
      cta: t("pricing.starterCta"),
      featured: false,
      badge: "No credit card required",
    },
    {
      name: t("pricing.growth"),
      price: annual ? "$103" : t("pricing.growthPrice"),
      per: t("pricing.growthPer"),
      credits: t("pricing.growthCredits"),
      features: [t("pricing.growthF1"), t("pricing.growthF2"), t("pricing.growthF3"), t("pricing.growthF4")],
      cta: t("pricing.growthCta"),
      featured: true,
      badge: null,
    },
    {
      name: t("pricing.pro"),
      price: annual ? "$399" : t("pricing.proPrice"),
      per: t("pricing.proPer"),
      credits: t("pricing.proCredits"),
      features: [t("pricing.proF1"), t("pricing.proF2"), t("pricing.proF3"), t("pricing.proF4")],
      cta: t("pricing.proCta"),
      featured: false,
      badge: null,
    },
  ];

  return (
    <section id="pricing" className="py-28 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-3 tracking-tight">{t("pricing.title")}</h2>
          <p className="text-muted-foreground text-sm md:text-base">{t("pricing.subtitle")}</p>
        </motion.div>

        {/* Annual/Monthly toggle */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <span className={`text-sm ${!annual ? "text-foreground" : "text-muted-foreground"}`}>{t("pricing.monthly")}</span>
          <button
            onClick={() => setAnnual(!annual)}
            className={`relative w-12 h-6 rounded-full transition-colors ${annual ? "bg-primary" : "bg-secondary"}`}
          >
            <div className={`absolute top-1 w-4 h-4 rounded-full bg-foreground transition-transform ${annual ? "translate-x-7" : "translate-x-1"}`} />
          </button>
          <span className={`text-sm ${annual ? "text-foreground" : "text-muted-foreground"}`}>
            {t("pricing.annual")}
            <span className="ml-1.5 text-[11px] font-semibold text-success">{t("pricing.save20")}</span>
          </span>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className={`rounded-2xl p-6 flex flex-col transition-colors duration-200 ${
                plan.featured
                  ? "border-2 border-primary bg-card hover:border-accent"
                  : "border border-border bg-card hover:border-primary/40"
              }`}
            >
              {plan.featured && (
                <div className="bg-gradient-primary rounded-xl p-3 -mx-1 -mt-1 mb-3">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-primary-foreground" />
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-primary-foreground">
                      {t("pricing.popular")}
                    </span>
                  </div>
                </div>
              )}
              <h3 className="text-lg font-display font-bold">{plan.name}</h3>
              <div className="mt-3 mb-1">
                <span className="text-3xl font-bold font-display">{plan.price}</span>
                {plan.per && <span className="text-muted-foreground text-sm"> {plan.per}</span>}
              </div>
              <p className="text-xs text-muted-foreground mb-6">{plan.credits}</p>
              <ul className="space-y-2.5 mb-8 flex-1">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-2 text-sm">
                    <Check className="w-3.5 h-3.5 text-success shrink-0" />
                    <span className="text-muted-foreground">{f}</span>
                  </li>
                ))}
              </ul>
              {plan.badge && (
                <p className="text-[11px] text-center text-success font-medium mb-3">{plan.badge}</p>
              )}
              <Button
                className={`w-full rounded-xl h-11 text-sm font-medium ${
                  plan.featured ? "bg-gradient-primary text-primary-foreground hover:opacity-90" : "bg-secondary hover:bg-secondary/80 text-foreground"
                }`}
                onClick={() => navigate("/login")}
              >
                {plan.cta}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
