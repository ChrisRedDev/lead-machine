import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { User, Bell, Key, AlertTriangle, Building, ExternalLink, Loader2, CheckCircle, Sun, Moon, Monitor, Palette } from "lucide-react";
import { toast } from "sonner";

const DashboardSettings = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState({ email: true, leads: true, marketing: false });
  const [displayName, setDisplayName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("company_name").eq("user_id", user.id).single().then(({ data }) => {
      if (data) {
        setCompanyName(data.company_name || "");
        setDisplayName(data.company_name || "");
      }
      setLoadingProfile(false);
    });
  }, [user]);

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ company_name: displayName } as any)
      .eq("user_id", user.id);

    if (error) {
      toast.error("Failed to save changes");
    } else {
      setCompanyName(displayName);
      setSaved(true);
      toast.success("Profile updated!");
      setTimeout(() => setSaved(false), 2000);
    }
    setSaving(false);
  };

  const themeOptions: { value: "light" | "dark" | "system"; icon: React.ReactNode; label: string }[] = [
    { value: "light", icon: <Sun className="w-3.5 h-3.5" />, label: "Light" },
    { value: "dark", icon: <Moon className="w-3.5 h-3.5" />, label: "Dark" },
    { value: "system", icon: <Monitor className="w-3.5 h-3.5" />, label: "System" },
  ];

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
              <Input value={user?.email || ""} disabled className="h-11 rounded-xl bg-secondary border-border text-sm opacity-60" />
              <p className="text-[11px] text-muted-foreground mt-1.5">Email is managed through your sign-in method and cannot be changed here.</p>
            </div>
            <div>
              <label className="text-[13px] font-medium mb-1.5 block">Display Name / Company</label>
              {loadingProfile ? (
                <div className="h-11 rounded-xl bg-secondary animate-pulse" />
              ) : (
                <Input
                  placeholder="Your name or company"
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  className="h-11 rounded-xl bg-secondary border-border text-sm"
                />
              )}
            </div>
            <Button
              size="sm"
              onClick={handleSaveProfile}
              disabled={saving || loadingProfile || displayName === companyName}
              className="rounded-xl text-[13px] bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {saving ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : saved ? <CheckCircle className="w-3.5 h-3.5 mr-1.5" /> : null}
              {saved ? "Saved!" : "Save Changes"}
            </Button>
          </div>
        </div>

        {/* Appearance */}
        <div className="border border-border rounded-2xl bg-card overflow-hidden">
          <div className="flex items-center gap-2 px-6 py-4 border-b border-border bg-secondary/30">
            <Palette className="w-4 h-4 text-accent" />
            <h3 className="text-[15px] font-display font-semibold">Appearance</h3>
          </div>
          <div className="p-6">
            <label className="text-[13px] font-medium mb-3 block">Theme</label>
            <div className="flex gap-2">
              {themeOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setTheme(opt.value)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] border transition-all ${
                    theme === opt.value
                      ? "bg-primary/10 border-primary text-primary font-medium"
                      : "border-border bg-secondary hover:border-primary/40 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {opt.icon}
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Company Profile Link */}
        <div className="border border-border rounded-2xl bg-card overflow-hidden">
          <div className="flex items-center gap-2 px-6 py-4 border-b border-border bg-secondary/30">
            <Building className="w-4 h-4 text-accent" />
            <h3 className="text-[15px] font-display font-semibold">Company Profile</h3>
          </div>
          <div className="p-6">
            <p className="text-[13px] text-muted-foreground mb-4">
              Manage your company's website, social links, target market, and AI brand analysis from the Brand Intelligence page.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl text-[13px]"
              onClick={() => navigate("/dashboard/research")}
            >
              <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
              Go to Brand Intelligence
            </Button>
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
            <p className="text-[13px] text-muted-foreground mb-3">Use your API key to integrate LeadGlow with other tools.</p>
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
