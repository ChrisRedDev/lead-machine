import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight, CreditCard, FileText, Sparkles, Loader2, ExternalLink, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const PLANS = [
  {
    name: "Basic",
    price: "Free",
    priceId: null,
    planKey: "basic",
    features: ["10 leads/month", "CSV export", "Email support"],
  },
  {
    name: "Growth",
    price: "$79/mo",
    priceId: "price_1T8oa1DRclGCGB67tKOdkMnL",
    planKey: "growth",
    features: ["500 leads/month", "Priority support", "API access", "Deep research"],
    featured: true,
  },
  {
    name: "Pro",
    price: "$299/mo",
    priceId: "price_1T8ofyDRclGCGB67jbLHGRrU",
    planKey: "pro",
    features: ["Unlimited leads", "Dedicated support", "Custom integrations", "White-label"],
  },
];

const DashboardBilling = () => {
  const { t } = useTranslation();
  const { subscription, checkSubscription } = useAuth();
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get("success") === "1") {
      toast.success("Payment successful! Checking your subscription...");
      setTimeout(checkSubscription, 2000);
    }
  }, [searchParams, checkSubscription]);

  const handleUpgrade = async (priceId: string, planName: string) => {
    setCheckoutLoading(priceId);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { price_id: priceId },
      });
      if (error) throw error;
      if (data?.url) window.location.href = data.url;
    } catch (err: any) {
      toast.error(err.message || "Failed to start checkout");
    } finally {
      setCheckoutLoading(null);
    }
  };

  const handleManagePortal = async () => {
    setPortalLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("customer-portal");
      if (error) throw error;
      if (data?.url) window.location.href = data.url;
    } catch (err: any) {
      toast.error(err.message || "Failed to open billing portal");
    } finally {
      setPortalLoading(false);
    }
  };

  const currentPlanKey = subscription.plan;

  return (
    <>
      <DashboardHeader title={t("dashboard.billing")} />
      <main className="p-4 lg:p-6 max-w-3xl space-y-6">
        {/* Current Plan */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="border border-border rounded-2xl bg-card p-6">
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <CreditCard className="w-4 h-4 text-primary" />
                <h3 className="text-[15px] font-display font-semibold">Current Plan</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                You are on the{" "}
                <span className="text-foreground font-medium capitalize">{currentPlanKey}</span> plan
                {subscription.subscription_end && (
                  <span className="ml-1 text-xs">
                    · renews {new Date(subscription.subscription_end).toLocaleDateString()}
                  </span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-success/10 text-success">
                Active
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={checkSubscription}
                title="Refresh status"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>

          {subscription.subscribed && (
            <Button
              variant="outline"
              size="sm"
              className="mt-3 rounded-xl text-[13px]"
              onClick={handleManagePortal}
              disabled={portalLoading}
            >
              {portalLoading ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <ExternalLink className="w-3.5 h-3.5 mr-1.5" />}
              Manage Subscription
            </Button>
          )}
        </motion.div>

        {/* Plan comparison */}
        <div className="grid md:grid-cols-3 gap-3">
          {PLANS.map((plan, i) => {
            const isCurrent = plan.planKey === currentPlanKey;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`rounded-2xl p-5 flex flex-col hover-lift relative overflow-hidden ${
                  plan.featured
                    ? "border-2 border-primary bg-card"
                    : isCurrent
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
                {isCurrent && !plan.featured && (
                  <div className="absolute top-0 right-0 px-3 py-1 bg-success/20 rounded-bl-xl">
                    <span className="text-[10px] font-semibold text-success uppercase">Your Plan</span>
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
                {isCurrent ? (
                  <Button variant="outline" size="sm" className="rounded-xl text-[13px] w-full" disabled>
                    Current Plan
                  </Button>
                ) : plan.priceId ? (
                  <Button
                    size="sm"
                    className="rounded-xl text-[13px] w-full bg-gradient-primary text-primary-foreground hover:opacity-90 transition-all duration-300"
                    onClick={() => handleUpgrade(plan.priceId!, plan.name)}
                    disabled={!!checkoutLoading}
                  >
                    {checkoutLoading === plan.priceId ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <>Upgrade <ArrowRight className="w-3.5 h-3.5 ml-1" /></>
                    )}
                  </Button>
                ) : null}
              </motion.div>
            );
          })}
        </div>

        {/* Invoice history */}
        <div className="border border-border rounded-2xl bg-card overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-secondary/30">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-muted-foreground" />
              <h3 className="text-[15px] font-display font-semibold">Invoice History</h3>
            </div>
            {subscription.subscribed && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs h-7 rounded-lg"
                onClick={handleManagePortal}
                disabled={portalLoading}
              >
                <ExternalLink className="w-3 h-3 mr-1" />
                View in Portal
              </Button>
            )}
          </div>
          <div className="p-8 text-center">
            {subscription.subscribed ? (
              <p className="text-sm text-muted-foreground">
                View and download your invoices in the{" "}
                <button onClick={handleManagePortal} className="text-primary underline-offset-2 hover:underline">
                  billing portal
                </button>
                .
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">No invoices yet</p>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default DashboardBilling;
