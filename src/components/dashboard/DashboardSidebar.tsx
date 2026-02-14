import { Zap, Rocket, History, CreditCard, Coins, Settings, LogOut } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const DashboardSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAuth();
  const { t } = useTranslation();

  const navItems = [
    { icon: Rocket, label: t("dashboard.generateLeads"), path: "/dashboard" },
    { icon: History, label: t("dashboard.previousExports"), path: "/dashboard/exports" },
    { icon: Coins, label: t("dashboard.credits"), path: "/dashboard/credits" },
    { icon: CreditCard, label: t("dashboard.billing"), path: "/dashboard/billing" },
    { icon: Settings, label: t("dashboard.settings"), path: "/dashboard/settings" },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-60 h-screen fixed left-0 top-0 border-r border-border/40 bg-background z-40">
      <div className="p-5 flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
        <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
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
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-3 border-t border-border/40 space-y-1">
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
