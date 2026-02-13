import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Loader2 } from "lucide-react";
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

  return (
    <>
      <DashboardHeader title={t("dashboard.credits")} />
      <main className="p-4 lg:p-6 max-w-lg">
        <div className="border border-border/40 rounded-2xl p-6">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">{credits?.plan || "Basic"} {t("common.plan")}</div>
          <div className="text-4xl font-bold font-display tracking-tight mb-1">{credits?.balance ?? 0}</div>
          <p className="text-sm text-muted-foreground mb-5">{t("common.creditsRemaining")}</p>
          <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
            <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${Math.min(100, ((credits?.balance ?? 0) / 100) * 100)}%` }} />
          </div>
          <p className="text-xs text-muted-foreground mt-2">{credits?.total_used ?? 0} {t("common.totalUsed")}</p>
        </div>
      </main>
    </>
  );
};

export default DashboardCredits;
