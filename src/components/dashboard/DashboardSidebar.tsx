import { Zap, Rocket, History, CreditCard, Coins, Settings, LogOut } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Rocket, label: "Generate Leads", path: "/dashboard" },
  { icon: History, label: "Previous Exports", path: "/dashboard/exports" },
  { icon: Coins, label: "Usage Credits", path: "/dashboard/credits" },
  { icon: CreditCard, label: "Billing", path: "/dashboard/billing" },
  { icon: Settings, label: "Settings", path: "/dashboard/settings" },
];

const DashboardSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen fixed left-0 top-0 glass-strong border-r border-border/50 z-40">
      <div className="p-6 flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-neon-blue flex items-center justify-center">
          <Zap className="w-4 h-4 text-primary-foreground" />
        </div>
        <span className="font-display font-bold">LeadMachine AI</span>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                active
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-3 border-t border-border/50">
        <div className="glass rounded-xl p-4 mb-3">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-muted-foreground">Credits</span>
            <span className="font-semibold text-neon-blue">50</span>
          </div>
          <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
            <div className="h-full w-1/2 rounded-full bg-gradient-to-r from-primary to-neon-blue" />
          </div>
        </div>
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors">
          <LogOut className="w-4 h-4" />
          Log Out
        </button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
