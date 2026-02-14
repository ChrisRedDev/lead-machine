import { useState } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { User, Bell, Key, AlertTriangle } from "lucide-react";

const DashboardSettings = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState({ email: true, leads: true, marketing: false });

  return (
    <>
      <DashboardHeader title={t("dashboard.settings")} />
      <main className="p-4 lg:p-6 max-w-2xl space-y-6">
        {/* Profile Section */}
        <div className="border border-border rounded-2xl bg-card overflow-hidden">
          <div className="flex items-center gap-2 px-6 py-4 border-b border-border bg-secondary/30">
            <User className="w-4 h-4 text-primary" />
            <h3 className="text-[15px] font-display font-semibold">Profile</h3>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="text-[13px] font-medium mb-1.5 block">Email</label>
              <Input value={user?.email || ""} disabled className="h-11 rounded-xl bg-secondary border-border text-sm" />
            </div>
            <div>
              <label className="text-[13px] font-medium mb-1.5 block">Display Name</label>
              <Input placeholder="Your name" className="h-11 rounded-xl bg-secondary border-border text-sm" />
            </div>
            <Button size="sm" className="rounded-xl text-[13px] bg-primary text-primary-foreground hover:bg-primary/90">Save Changes</Button>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="border border-border rounded-2xl bg-card overflow-hidden">
          <div className="flex items-center gap-2 px-6 py-4 border-b border-border bg-secondary/30">
            <Bell className="w-4 h-4 text-warning" />
            <h3 className="text-[15px] font-display font-semibold">Notifications</h3>
          </div>
          <div className="p-6 space-y-4">
            {[
              { key: "email" as const, label: "Email notifications", desc: "Receive updates about your account" },
              { key: "leads" as const, label: "Lead generation alerts", desc: "Get notified when leads are ready" },
              { key: "marketing" as const, label: "Marketing emails", desc: "Tips and product updates" },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between">
                <div>
                  <p className="text-[13px] font-medium">{item.label}</p>
                  <p className="text-[11px] text-muted-foreground">{item.desc}</p>
                </div>
                <Switch
                  checked={notifications[item.key]}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, [item.key]: checked })}
                />
              </div>
            ))}
          </div>
        </div>

        {/* API Key Section */}
        <div className="border border-border rounded-2xl bg-card overflow-hidden">
          <div className="flex items-center gap-2 px-6 py-4 border-b border-border bg-secondary/30">
            <Key className="w-4 h-4 text-accent" />
            <h3 className="text-[15px] font-display font-semibold">API Key</h3>
          </div>
          <div className="p-6">
            <p className="text-[13px] text-muted-foreground mb-3">Use your API key to integrate LeadMachine with other tools.</p>
            <div className="flex gap-2">
              <Input value="lm_sk_••••••••••••••••••••" disabled className="h-11 rounded-xl bg-secondary border-border text-sm font-mono flex-1" />
              <Button variant="outline" size="sm" className="rounded-xl text-[13px] h-11 px-4">Copy</Button>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="border border-destructive/30 rounded-2xl bg-card overflow-hidden">
          <div className="flex items-center gap-2 px-6 py-4 border-b border-destructive/20 bg-destructive/5">
            <AlertTriangle className="w-4 h-4 text-destructive" />
            <h3 className="text-[15px] font-display font-semibold text-destructive">Danger Zone</h3>
          </div>
          <div className="p-6 flex items-center justify-between">
            <div>
              <p className="text-[13px] font-medium">Delete Account</p>
              <p className="text-[11px] text-muted-foreground">Permanently delete your account and all data</p>
            </div>
            <Button variant="outline" size="sm" className="rounded-xl text-[13px] border-destructive/30 text-destructive hover:bg-destructive/10">
              Delete Account
            </Button>
          </div>
        </div>
      </main>
    </>
  );
};

export default DashboardSettings;
