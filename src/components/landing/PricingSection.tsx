import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const plans = [
  {
    name: "Basic",
    price: "$29",
    credits: "100 leads / month",
    features: ["Website analysis", "ICP detection", "CSV export", "Email support"],
    cta: "Start Basic",
    featured: false,
  },
  {
    name: "Pro",
    price: "$79",
    credits: "500 leads / month",
    features: ["Everything in Basic", "Priority processing", "Advanced filters", "API access"],
    cta: "Start Pro",
    featured: true,
  },
  {
    name: "Agency",
    price: "$199",
    credits: "2,000 leads / month",
    features: ["Everything in Pro", "Unlimited exports", "Team seats", "Dedicated support"],
    cta: "Start Agency",
    featured: false,
  },
];

const PricingSection = () => {
  const navigate = useNavigate();

  return (
    <section id="pricing" className="py-28 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-3 tracking-tight">Pricing</h2>
          <p className="text-muted-foreground text-sm md:text-base">Start free. Upgrade when you're ready.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-4">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className={`rounded-2xl p-6 flex flex-col ${
                plan.featured
                  ? "border-2 border-primary/30 bg-card/60"
                  : "border border-border/50 bg-card/30"
              }`}
            >
              {plan.featured && (
                <span className="self-start text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-primary/10 text-primary mb-3">
                  Popular
                </span>
              )}
              <h3 className="text-lg font-display font-bold">{plan.name}</h3>
              <div className="mt-3 mb-1">
                <span className="text-3xl font-bold font-display">{plan.price}</span>
                <span className="text-muted-foreground text-sm"> /mo</span>
              </div>
              <p className="text-xs text-muted-foreground mb-6">{plan.credits}</p>

              <ul className="space-y-2.5 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span className="text-muted-foreground">{f}</span>
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full rounded-xl h-11 text-sm font-medium ${
                  plan.featured
                    ? "bg-foreground text-background hover:bg-foreground/90"
                    : "bg-secondary hover:bg-secondary/80 text-foreground"
                }`}
                onClick={() => navigate("/dashboard")}
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
