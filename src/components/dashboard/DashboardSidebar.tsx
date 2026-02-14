import { useEffect, useState } from "react";
import { Zap, Rocket, History, CreditCard, Coins, Settings, LogOut, Brain, BarChart3, Mail, Users, Plug } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { supabase } from "@/integrations/supabase/client";

const DashboardSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut, user } = useAuth();
  const { t } = useTranslation();
  const [credits, setCredits] = useState<number | null>(null);

  useEffect(() => {
    if (user) {
      supabase.from("credits").select("balance").eq("user_id", user.id).single()
        .then(({ data }) => { if (data) setCredits(data.balance); });
    }
  }, [user]);

  const navItems = [
    { icon: BarChart3, label: "Overview", path: "/dashboard" },
    { icon: Rocket, label: t("dashboard.generateLeads"), path: "/dashboard/generate" },
    { icon: Brain, label: "AI Research", path: "/dashboard/research" },
    { icon: BarChart3, label: "Analytics", path: "/dashboard/analytics" },
    { icon: Mail, label: "Campaigns", path: "/dashboard/campaigns" },
    { icon: Users, label: "Team", path: "/dashboard/team" },
    { icon: Plug, label: "Integrations", path: "/dashboard/integrations" },
    { icon: History, label: t("dashboard.previousExports"), path: "/dashboard/exports" },
    { icon: Coins, label: t("dashboard.credits"), path: "/dashboard/credits" },
    { icon: CreditCard, label: t("dashboard.billing"), path: "/dashboard/billing" },
    { icon: Settings, label: t("dashboard.settings"), path: "/dashboard/settings" },
  ];

  const initials = user?.email ? user.email.slice(0, 2).toUpperCase() : "??";

  return (
    <aside className="hidden lg:flex flex-col w-60 h-screen fixed left-0 top-0 border-r border-border/40 bg-background z-40">
      <div className="p-5 flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
        <div className="w-8 h-8 rounded-xl bg-gradient-primary flex items-center justify-center">
          <Zap className="w-4 h-4 text-primary-foreground" />
        </div>
        <span className="font-display font-bold text-[15px] tracking-tight">LeadMachine AI</span>
      </div>

      <nav className="flex-1 px-3 mt-2 space-y-0.5">
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] font-medium transition-all duration-200",
                active ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              )}
            >
              <div className="relative">
                <item.icon className="w-4 h-4" />
                {active && <span className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-primary" />}
              </div>
              <span className="flex-1 text-left">{item.label}</span>
              {item.path === "/dashboard/credits" && credits !== null && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-primary/10 text-primary">
                  {credits}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-3 border-t border-border/40 space-y-2">
        <div className="flex items-center gap-2.5 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-[11px] font-bold text-primary-foreground">
            {initials}
          </div>
          <p className="text-[11px] text-muted-foreground truncate flex-1">{user?.email}</p>
        </div>
        <div className="px-3 py-1"><LanguageSwitcher /></div>
        <button onClick={signOut} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors">
          <LogOut className="w-4 h-4" />
          {t("nav.logout")}
        </button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
