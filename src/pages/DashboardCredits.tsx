import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Loader2, Coins, TrendingUp, Calendar, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";

const DashboardCredits = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [credits, setCredits] = useState<{ balance: number; total_used: number; plan: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      supabase.from("credits").select("balance, total_used, plan").eq("user_id", user.id).single()
        .then(({ data }) => { setCredits(data); setLoading(false); });
    }
  }, [user]);

  if (loading) return (<><DashboardHeader title={t("dashboard.credits")} /><div className="flex items-center justify-center py-20"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div></>);

  const balance = credits?.balance ?? 0;
  const percentage = Math.min(100, (balance / 100) * 100);
  const barColor = percentage > 60 ? "bg-success" : percentage > 30 ? "bg-warning" : "bg-destructive";

  return (
    <>
      <DashboardHeader title={t("dashboard.credits")} />
      <main className="p-4 lg:p-6 max-w-2xl">
        {/* Main balance card */}
        <div className="border border-border rounded-2xl p-6 bg-card mb-4">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-primary/10 text-primary">
              {credits?.plan || "Basic"} {t("common.plan")}
            </span>
          </div>
          <div className="text-4xl font-bold font-display tracking-tight mb-1">{balance}</div>
          <p className="text-sm text-muted-foreground mb-5">{t("common.creditsRemaining")}</p>
          <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${barColor} transition-all`} style={{ width: `${percentage}%` }} />
          </div>
          <p className="text-xs text-muted-foreground mt-2">{credits?.total_used ?? 0} {t("common.totalUsed")}</p>
        </div>

        {/* Usage summary cards */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="rounded-xl border border-border bg-card p-4">
            <Coins className="w-4 h-4 text-primary mb-2" />
            <p className="text-lg font-bold font-display">{Math.min(credits?.total_used ?? 0, 5)}</p>
            <p className="text-[11px] text-muted-foreground">Used today</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <TrendingUp className="w-4 h-4 text-success mb-2" />
            <p className="text-lg font-bold font-display">{Math.min(credits?.total_used ?? 0, 20)}</p>
            <p className="text-[11px] text-muted-foreground">This week</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <Calendar className="w-4 h-4 text-warning mb-2" />
            <p className="text-lg font-bold font-display">{credits?.total_used ?? 0}</p>
            <p className="text-[11px] text-muted-foreground">This month</p>
          </div>
        </div>

        {/* Buy more button */}
        <Button className="w-full h-12 rounded-xl text-sm font-medium bg-gradient-primary text-primary-foreground hover:opacity-90">
          Buy More Credits
          <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </main>
    </>
  );
};

export default DashboardCredits;
