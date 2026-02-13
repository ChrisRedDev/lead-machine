import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Basic",
    price: "$29",
    credits: "100 leads/mo",
    features: ["Website analysis", "ICP detection", "CSV export", "Email support"],
    popular: false,
  },
  {
    name: "Pro",
    price: "$79",
    credits: "500 leads/mo",
    features: ["Everything in Basic", "Priority processing", "Advanced filters", "API access", "Priority support"],
    popular: true,
  },
  {
    name: "Agency",
    price: "$199",
    credits: "2,000 leads/mo",
    features: ["Everything in Pro", "Unlimited exports", "Team seats", "Custom integrations", "Dedicated support"],
    popular: false,
  },
];

const PricingSection = () => {
  return (
    <section id="pricing" className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold font-display mb-4">
            Simple <span className="gradient-text">Pricing</span>
          </h2>
          <p className="text-muted-foreground text-lg">Start free. Scale as you grow.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`rounded-2xl p-8 flex flex-col ${
                plan.popular
                  ? "glass gradient-border glow-md"
                  : "glass"
              }`}
            >
              {plan.popular && (
                <span className="self-start text-xs font-medium px-3 py-1 rounded-full bg-primary/20 text-primary mb-4">
                  Most Popular
                </span>
              )}
              <h3 className="text-xl font-bold font-display">{plan.name}</h3>
              <div className="mt-4 mb-1">
                <span className="text-4xl font-bold font-display">{plan.price}</span>
                <span className="text-muted-foreground">/mo</span>
              </div>
              <p className="text-sm text-muted-foreground mb-6">{plan.credits}</p>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-neon-blue shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <Button
                className={
                  plan.popular
                    ? "w-full bg-gradient-to-r from-primary to-neon-purple hover:opacity-90"
                    : "w-full"
                }
                variant={plan.popular ? "default" : "outline"}
              >
                Get Started
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
