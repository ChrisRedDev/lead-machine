import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight, CreditCard, FileText, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const DashboardBilling = () => {
  const { t } = useTranslation();

  const plans = [
    { name: "Basic", price: "Free", features: ["10 leads/month", "CSV export", "Email support"], current: true },
    { name: "Growth", price: "$79/mo", features: ["500 leads/month", "Priority support", "API access", "Deep research"], current: false, featured: true },
    { name: "Pro", price: "$299/mo", features: ["Unlimited leads", "Dedicated support", "Custom integrations", "White-label"], current: false },
  ];

  return (
    <>
      <DashboardHeader title={t("dashboard.billing")} />
      <main className="p-4 lg:p-6 max-w-3xl space-y-6">
        {/* Current Plan */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="border border-border rounded-2xl bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <CreditCard className="w-4 h-4 text-primary" />
                <h3 className="text-[15px] font-display font-semibold">Current Plan</h3>
              </div>
              <p className="text-sm text-muted-foreground">You are currently on the <span className="text-foreground font-medium">Basic</span> plan</p>
            </div>
            <span className="px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-success/10 text-success">
              Active
            </span>
          </div>
        </motion.div>

        {/* Plan comparison */}
        <div className="grid md:grid-cols-3 gap-3">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`rounded-2xl p-5 flex flex-col hover-lift ${
                plan.featured
                  ? "border-2 border-primary bg-card relative overflow-hidden"
                  : plan.current
                  ? "border-2 border-primary/50 bg-card"
                  : "border border-border bg-card hover:border-primary/40 transition-colors"
              }`}
            >
              {plan.featured && (
                <div className="absolute top-0 right-0 px-3 py-1 bg-gradient-primary rounded-bl-xl">
                  <span className="text-[10px] font-semibold text-primary-foreground uppercase flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Best Value
                  </span>
                </div>
              )}
              <h4 className="text-sm font-display font-bold">{plan.name}</h4>
              <p className="text-2xl font-bold font-display mt-2 mb-4">{plan.price}</p>
              <ul className="space-y-2 mb-6 flex-1">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-2 text-[13px]">
                    <Check className="w-3.5 h-3.5 text-success shrink-0" />
                    <span className="text-muted-foreground">{f}</span>
                  </li>
                ))}
              </ul>
              {plan.current ? (
                <Button variant="outline" size="sm" className="rounded-xl text-[13px] w-full" disabled>Current Plan</Button>
              ) : (
                <Button size="sm" className="rounded-xl text-[13px] w-full bg-gradient-primary text-primary-foreground hover:opacity-90 transition-all duration-300">
                  Upgrade <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              )}
            </motion.div>
          ))}
        </div>

        {/* Invoice history */}
        <div className="border border-border rounded-2xl bg-card overflow-hidden">
          <div className="flex items-center gap-2 px-6 py-4 border-b border-border bg-secondary/30">
            <FileText className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-[15px] font-display font-semibold">Invoice History</h3>
          </div>
          <div className="p-8 text-center">
            <p className="text-sm text-muted-foreground">No invoices yet</p>
          </div>
        </div>
      </main>
    </>
  );
};

export default DashboardBilling;
