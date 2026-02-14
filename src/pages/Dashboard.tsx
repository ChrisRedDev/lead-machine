import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Globe, FileText, MapPin, Building, Users, Loader2, Sparkles, Brain, Target, Lock, TrendingUp, BarChart3, Briefcase } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

type GenerationStep = "form" | "generating" | "results";

const FREE_LEADS = 10;

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [step, setStep] = useState<GenerationStep>("form");
  const [currentStatus, setCurrentStatus] = useState(0);
  const [leads, setLeads] = useState<any[]>([]);
  const [unlocked, setUnlocked] = useState(false);
  const [form, setForm] = useState({
    companyUrl: "",
    description: "",
    targetLocation: "",
    targetIndustry: "",
    idealClient: "",
  });

  const statusMessages = [
    { icon: Globe, text: t("generating.step1"), color: "text-success" },
    { icon: Brain, text: t("generating.step2"), color: "text-primary" },
    { icon: Target, text: t("generating.step3"), color: "text-warning" },
    { icon: Sparkles, text: t("generating.step4"), color: "text-accent" },
    { icon: Sparkles, text: t("generating.step5"), color: "text-success" },
  ];

  const handleGenerate = async () => {
    if (!form.companyUrl || !form.description) {
      toast.error("Please fill in required fields.");
      return;
    }

    setStep("generating");
    setCurrentStatus(0);

    const statusInterval = setInterval(() => {
      setCurrentStatus((prev) => {
        if (prev >= statusMessages.length - 1) {
          clearInterval(statusInterval);
          return prev;
        }
        return prev + 1;
      });
    }, 2500);

    try {
      const { data, error } = await supabase.functions.invoke("generate-leads", {
        body: {
          companyUrl: form.companyUrl,
          description: form.description,
          targetLocation: form.targetLocation,
          targetIndustry: form.targetIndustry,
          idealClient: form.idealClient,
        },
      });

      clearInterval(statusInterval);

      if (error) throw error;
      if (data?.error) {
        toast.error(data.error);
        setStep("form");
        return;
      }

      const generatedLeads = data?.leads || [];
      setLeads(generatedLeads);

      await supabase.from("lead_exports").insert({
        user_id: user!.id,
        name: `Leads for ${form.companyUrl}`,
        leads: generatedLeads,
        lead_count: generatedLeads.length,
      });

      await supabase.from("profiles").update({
        company_url: form.companyUrl,
        company_description: form.description,
        target_location: form.targetLocation,
        target_industry: form.targetIndustry,
        ideal_client_description: form.idealClient,
      }).eq("user_id", user!.id);

      setStep("results");
      toast.success(`Found ${generatedLeads.length} leads!`);
    } catch (err: any) {
      clearInterval(statusInterval);
      console.error("Generation error:", err);
      toast.error(err.message || "Failed to generate leads.");
      setStep("form");
    }
  };

  const downloadCSV = () => {
    const visibleLeads = unlocked ? leads : leads.slice(0, FREE_LEADS);
    if (!visibleLeads.length) return;
    const headers = ["Company Name", "Contact Person", "Role", "Website", "Email", "Phone", "Industry", "Fit Reason"];
    const rows = visibleLeads.map((l: any) =>
      [l.company_name, l.contact_person, l.role, l.website, l.email, l.phone, l.industry, l.fit_reason]
        .map((v) => `"${(v || "").replace(/"/g, '""')}"`)
        .join(",")
    );
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "leads.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const getScoreColor = (score: number | string) => {
    const n = typeof score === "string" ? parseInt(score) : score;
    if (n >= 90) return "text-success font-semibold";
    if (n >= 80) return "text-primary font-medium";
    return "text-warning";
  };

  const avgScore = leads.length > 0
    ? Math.round(leads.reduce((sum: number, l: any) => sum + (parseInt(l.score || l.ai_match || "85") || 85), 0) / leads.length)
    : 0;

  const topIndustry = leads.length > 0
    ? Object.entries(leads.reduce((acc: Record<string, number>, l: any) => { acc[l.industry || "Other"] = (acc[l.industry || "Other"] || 0) + 1; return acc; }, {})).sort(([, a], [, b]) => (b as number) - (a as number))[0]?.[0] || "N/A"
    : "N/A";

  const fieldIcons = [
    { icon: Globe, color: "text-success" },
    { icon: FileText, color: "text-primary" },
    { icon: MapPin, color: "text-destructive" },
    { icon: Building, color: "text-accent" },
    { icon: Users, color: "text-warning" },
  ];

  return (
    <>
      <DashboardHeader title={t("generate.title")} />
      <main className="p-4 lg:p-6 max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          {step === "form" && (
            <motion.div key="form" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} className="space-y-5">
              <div>
                <h2 className="text-xl font-display font-bold tracking-tight mb-1">{t("generate.title")}</h2>
                <p className="text-sm text-muted-foreground">{t("generate.subtitle")}</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[13px] font-medium mb-1.5 flex items-center gap-1">
                    {t("generate.companyUrl")} <span className="text-destructive text-xs">*</span>
                  </label>
                  <div className="relative">
                    <Globe className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${fieldIcons[0].color}`} />
                    <Input placeholder={t("generate.companyUrlPlaceholder")} value={form.companyUrl} onChange={(e) => setForm({ ...form, companyUrl: e.target.value })} className="pl-10 h-11 rounded-xl bg-secondary border-border text-sm" />
                  </div>
                </div>

                <div>
                  <label className="text-[13px] font-medium mb-1.5 flex items-center gap-1">
                    {t("generate.description")} <span className="text-destructive text-xs">*</span>
                  </label>
                  <div className="relative">
                    <FileText className={`absolute left-3 top-3 w-4 h-4 ${fieldIcons[1].color}`} />
                    <Textarea placeholder={t("generate.descriptionPlaceholder")} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="pl-10 min-h-[80px] rounded-xl bg-secondary border-border text-sm resize-none" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[13px] font-medium mb-1.5 block">{t("generate.targetLocation")}</label>
                    <div className="relative">
                      <MapPin className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${fieldIcons[2].color}`} />
                      <Input placeholder={t("generate.targetLocationPlaceholder")} value={form.targetLocation} onChange={(e) => setForm({ ...form, targetLocation: e.target.value })} className="pl-10 h-11 rounded-xl bg-secondary border-border text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[13px] font-medium mb-1.5 block">{t("generate.targetIndustry")}</label>
                    <div className="relative">
                      <Building className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${fieldIcons[3].color}`} />
                      <Input placeholder={t("generate.targetIndustryPlaceholder")} value={form.targetIndustry} onChange={(e) => setForm({ ...form, targetIndustry: e.target.value })} className="pl-10 h-11 rounded-xl bg-secondary border-border text-sm" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[13px] font-medium mb-1.5 block">{t("generate.idealClient")}</label>
                  <div className="relative">
                    <Users className={`absolute left-3 top-3 w-4 h-4 ${fieldIcons[4].color}`} />
                    <Textarea placeholder={t("generate.idealClientPlaceholder")} value={form.idealClient} onChange={(e) => setForm({ ...form, idealClient: e.target.value })} className="pl-10 min-h-[70px] rounded-xl bg-secondary border-border text-sm resize-none" />
                  </div>
                </div>
              </div>

              <Button onClick={handleGenerate} disabled={!form.companyUrl || !form.description} className="w-full h-12 rounded-xl text-sm font-medium bg-gradient-primary text-primary-foreground hover:opacity-90">
                {t("generate.cta")}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </motion.div>
          )}

          {step === "generating" && (
            <motion.div key="generating" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center">
              <div className="text-center max-w-sm w-full px-4">
                <div className="mb-10">
                  <div className="w-16 h-16 rounded-full border border-border flex items-center justify-center mx-auto">
                    <Loader2 className="w-7 h-7 text-primary animate-spin" />
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStatus}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-2.5 text-sm text-muted-foreground justify-center mb-6"
                  >
                    {(() => {
                      const Icon = statusMessages[currentStatus].icon;
                      return <Icon className={`w-4 h-4 ${statusMessages[currentStatus].color}`} />;
                    })()}
                    <span>{statusMessages[currentStatus].text}</span>
                  </motion.div>
                </AnimatePresence>

                {/* Progress bar */}
                <Progress value={((currentStatus + 1) / statusMessages.length) * 100} className="h-2 bg-secondary" />
                <p className="text-xs text-muted-foreground mt-2">
                  {Math.round(((currentStatus + 1) / statusMessages.length) * 100)}%
                </p>
              </div>
            </motion.div>
          )}

          {step === "results" && (
            <motion.div key="results" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              {/* Summary cards */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="rounded-xl border border-border bg-card p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    <span className="text-[11px] text-muted-foreground uppercase tracking-wider">Total Leads</span>
                  </div>
                  <p className="text-2xl font-bold font-display">{leads.length}</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="w-4 h-4 text-success" />
                    <span className="text-[11px] text-muted-foreground uppercase tracking-wider">Avg Score</span>
                  </div>
                  <p className="text-2xl font-bold font-display">{avgScore}%</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Briefcase className="w-4 h-4 text-warning" />
                    <span className="text-[11px] text-muted-foreground uppercase tracking-wider">Top Industry</span>
                  </div>
                  <p className="text-sm font-semibold font-display truncate">{topIndustry}</p>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-display font-bold tracking-tight">{t("results.leadsFound")}: {leads.length}</h2>
                  <p className="text-sm text-muted-foreground">
                    {unlocked ? `${leads.length} leads unlocked` : `${Math.min(FREE_LEADS, leads.length)} ${t("results.free")} · ${Math.max(0, leads.length - FREE_LEADS)} locked`}
                  </p>
                </div>
                <Button size="sm" className="h-9 rounded-xl text-[13px]" onClick={downloadCSV}>
                  {t("results.downloadCsv")}
                </Button>
              </div>

              <div className="border border-border rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-[13px]">
                    <thead>
                      <tr className="border-b border-border bg-secondary/80">
                        <th className="text-left font-medium p-3">{t("results.company")}</th>
                        <th className="text-left font-medium p-3">{t("results.contact")}</th>
                        <th className="text-left font-medium p-3">{t("results.role")}</th>
                        <th className="text-left font-medium p-3">{t("results.email")}</th>
                        <th className="text-left font-medium p-3">{t("results.industry")}</th>
                        <th className="text-left font-medium p-3">{t("results.fitReason")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leads.slice(0, FREE_LEADS).map((lead: any, i: number) => (
                        <tr key={i} className="border-b border-border hover:bg-secondary/50 transition-colors">
                          <td className="p-3 font-medium">
                            <div className="flex items-center gap-2">
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-success/10 text-success">New</span>
                              {lead.company_name}
                            </div>
                          </td>
                          <td className="p-3 text-muted-foreground">{lead.contact_person}</td>
                          <td className="p-3 text-muted-foreground">{lead.role}</td>
                          <td className="p-3 text-muted-foreground">{lead.email}</td>
                          <td className="p-3 text-muted-foreground">{lead.industry}</td>
                          <td className="p-3 text-muted-foreground max-w-[200px] truncate">{lead.fit_reason}</td>
                        </tr>
                      ))}
                      {!unlocked && leads.length > FREE_LEADS && leads.slice(FREE_LEADS).map((lead: any, i: number) => (
                        <tr key={`locked-${i}`} className="border-b border-border">
                          <td className="p-3 blur-[6px] select-none text-muted-foreground/60">{lead.company_name || "████████"}</td>
                          <td className="p-3 blur-[6px] select-none text-muted-foreground/40">{lead.contact_person || "████ ████"}</td>
                          <td className="p-3 blur-[6px] select-none text-muted-foreground/40">{lead.role || "██ ████"}</td>
                          <td className="p-3 blur-[6px] select-none text-muted-foreground/40">{lead.email || "████@████"}</td>
                          <td className="p-3 blur-[6px] select-none text-muted-foreground/40">{lead.industry || "██████"}</td>
                          <td className="p-3 blur-[6px] select-none text-muted-foreground/40">{lead.fit_reason || "████████"}</td>
                        </tr>
                      ))}
                      {unlocked && leads.slice(FREE_LEADS).map((lead: any, i: number) => (
                        <tr key={`unlocked-${i}`} className="border-b border-border hover:bg-secondary/50 transition-colors">
                          <td className="p-3 font-medium">{lead.company_name}</td>
                          <td className="p-3 text-muted-foreground">{lead.contact_person}</td>
                          <td className="p-3 text-muted-foreground">{lead.role}</td>
                          <td className="p-3 text-muted-foreground">{lead.email}</td>
                          <td className="p-3 text-muted-foreground">{lead.industry}</td>
                          <td className="p-3 text-muted-foreground max-w-[200px] truncate">{lead.fit_reason}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {!unlocked && leads.length > FREE_LEADS && (
                  <div className="relative">
                    <div className="absolute -top-24 inset-x-0 h-24 bg-gradient-to-t from-background to-transparent pointer-events-none" />
                    <div className="bg-background border-t border-border p-8 text-center">
                      <div className="w-12 h-12 mx-auto rounded-full bg-secondary flex items-center justify-center mb-4">
                        <Lock className="w-5 h-5 text-primary" />
                      </div>
                      <h3 className="text-[15px] font-display font-bold mb-1">
                        {t("results.unlockTitle", { count: leads.length - FREE_LEADS })}
                      </h3>
                      <p className="text-xs text-muted-foreground mb-1">{t("results.unlockSubtitle")}</p>
                      <p className="text-xs text-muted-foreground/70 mb-5 italic">{t("results.unlockOnlyVisible")}</p>
                      <Button
                        className="h-11 px-8 rounded-xl text-sm font-medium bg-gradient-primary text-primary-foreground hover:opacity-90"
                        onClick={() => {
                          toast.info("Stripe checkout will be integrated soon. Unlocking for preview...");
                          setUnlocked(true);
                        }}
                      >
                        {t("results.unlockCta")}
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <Button variant="ghost" className="mt-4 text-[13px]" onClick={() => { setStep("form"); setLeads([]); setUnlocked(false); }}>
                ← {t("generate.title")}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </>
  );
};

export default Dashboard;
