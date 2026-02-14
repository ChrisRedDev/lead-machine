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
import { ArrowRight, Globe, FileText, MapPin, Building, Users, Loader2, Sparkles, Brain, Target, Lock, TrendingUp, BarChart3, Briefcase, Facebook, Instagram, Linkedin, ChevronDown, ChevronUp, Copy, Mail, Download } from "lucide-react";
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
  const [expandedLead, setExpandedLead] = useState<number | null>(null);
  const [form, setForm] = useState({
    companyUrl: "",
    description: "",
    targetLocation: "",
    targetIndustry: "",
    idealClient: "",
    facebookUrl: "",
    instagramUrl: "",
    linkedinUrl: "",
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
          facebookUrl: form.facebookUrl,
          instagramUrl: form.instagramUrl,
          linkedinUrl: form.linkedinUrl,
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
        facebook_url: form.facebookUrl,
        instagram_url: form.instagramUrl,
        linkedin_url: form.linkedinUrl,
      } as any).eq("user_id", user!.id);

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
    const headers = ["Company Name", "Contact Person", "Role", "Website", "Email", "Phone", "Industry", "Score", "Fit Reason"];
    const rows = visibleLeads.map((l: any) =>
      [l.company_name, l.contact_person, l.role, l.website, l.email, l.phone, l.industry, l.score || "", l.fit_reason]
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

  const downloadJSON = () => {
    const visibleLeads = unlocked ? leads : leads.slice(0, FREE_LEADS);
    const blob = new Blob([JSON.stringify(visibleLeads, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "leads.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyAllEmails = () => {
    const visibleLeads = unlocked ? leads : leads.slice(0, FREE_LEADS);
    const emails = visibleLeads.map((l: any) => l.email).filter(Boolean).join(", ");
    navigator.clipboard.writeText(emails);
    toast.success(`${emails.split(",").length} emails copied!`);
  };

  const getScoreColor = (score: number | string) => {
    const n = typeof score === "string" ? parseInt(score) : score;
    if (n >= 90) return "text-success";
    if (n >= 80) return "text-primary";
    return "text-warning";
  };

  const getScoreBg = (score: number | string) => {
    const n = typeof score === "string" ? parseInt(score) : score;
    if (n >= 90) return "bg-success/10 border-success/20";
    if (n >= 80) return "bg-primary/10 border-primary/20";
    return "bg-warning/10 border-warning/20";
  };

  const getLeadScore = (lead: any) => parseInt(lead.score || lead.ai_match || "85") || 85;

  const avgScore = leads.length > 0
    ? Math.round(leads.reduce((sum: number, l: any) => sum + getLeadScore(l), 0) / leads.length)
    : 0;

  const topIndustry = leads.length > 0
    ? Object.entries(leads.reduce((acc: Record<string, number>, l: any) => { acc[l.industry || "Other"] = (acc[l.industry || "Other"] || 0) + 1; return acc; }, {})).sort(([, a], [, b]) => (b as number) - (a as number))[0]?.[0] || "N/A"
    : "N/A";

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
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-success" />
                    <Input placeholder={t("generate.companyUrlPlaceholder")} value={form.companyUrl} onChange={(e) => setForm({ ...form, companyUrl: e.target.value })} className="pl-10 h-11 rounded-xl bg-secondary border-border text-sm" />
                  </div>
                </div>

                {/* Social media links */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[13px] font-medium mb-1.5 flex items-center gap-1">
                      <Facebook className="w-3.5 h-3.5 text-[hsl(210,80%,51%)]" /> Facebook
                    </label>
                    <Input placeholder="facebook.com/company" value={form.facebookUrl} onChange={(e) => setForm({ ...form, facebookUrl: e.target.value })} className="h-10 rounded-xl bg-secondary border-border text-sm" />
                  </div>
                  <div>
                    <label className="text-[13px] font-medium mb-1.5 flex items-center gap-1">
                      <Instagram className="w-3.5 h-3.5 text-[hsl(340,75%,55%)]" /> Instagram
                    </label>
                    <Input placeholder="instagram.com/company" value={form.instagramUrl} onChange={(e) => setForm({ ...form, instagramUrl: e.target.value })} className="h-10 rounded-xl bg-secondary border-border text-sm" />
                  </div>
                  <div>
                    <label className="text-[13px] font-medium mb-1.5 flex items-center gap-1">
                      <Linkedin className="w-3.5 h-3.5 text-[hsl(210,80%,51%)]" /> LinkedIn
                    </label>
                    <Input placeholder="linkedin.com/company/..." value={form.linkedinUrl} onChange={(e) => setForm({ ...form, linkedinUrl: e.target.value })} className="h-10 rounded-xl bg-secondary border-border text-sm" />
                  </div>
                </div>

                <div>
                  <label className="text-[13px] font-medium mb-1.5 flex items-center gap-1">
                    {t("generate.description")} <span className="text-destructive text-xs">*</span>
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 w-4 h-4 text-primary" />
                    <Textarea placeholder={t("generate.descriptionPlaceholder")} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="pl-10 min-h-[80px] rounded-xl bg-secondary border-border text-sm resize-none" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[13px] font-medium mb-1.5 block">{t("generate.targetLocation")}</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-destructive" />
                      <Input placeholder={t("generate.targetLocationPlaceholder")} value={form.targetLocation} onChange={(e) => setForm({ ...form, targetLocation: e.target.value })} className="pl-10 h-11 rounded-xl bg-secondary border-border text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[13px] font-medium mb-1.5 block">{t("generate.targetIndustry")}</label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-accent" />
                      <Input placeholder={t("generate.targetIndustryPlaceholder")} value={form.targetIndustry} onChange={(e) => setForm({ ...form, targetIndustry: e.target.value })} className="pl-10 h-11 rounded-xl bg-secondary border-border text-sm" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[13px] font-medium mb-1.5 block">{t("generate.idealClient")}</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-3 w-4 h-4 text-warning" />
                    <Textarea placeholder={t("generate.idealClientPlaceholder")} value={form.idealClient} onChange={(e) => setForm({ ...form, idealClient: e.target.value })} className="pl-10 min-h-[70px] rounded-xl bg-secondary border-border text-sm resize-none" />
                  </div>
                </div>
              </div>

              <Button onClick={handleGenerate} disabled={!form.companyUrl || !form.description} className="w-full h-12 rounded-xl text-sm font-medium bg-gradient-primary text-primary-foreground hover:opacity-90 transition-all duration-300 hover:shadow-[0_8px_30px_-4px_hsl(234,89%,64%,0.4)]">
                {t("generate.cta")}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </motion.div>
          )}

          {step === "generating" && (
            <motion.div key="generating" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center">
              <div className="text-center max-w-sm w-full px-4">
                <div className="mb-10">
                  <div className="w-16 h-16 rounded-full border border-border flex items-center justify-center mx-auto relative">
                    <Loader2 className="w-7 h-7 text-primary animate-spin" />
                    <div className="absolute inset-0 rounded-full bg-primary/10 animate-pulse-soft" />
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
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-xl border border-border bg-card p-4 hover-lift">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    <span className="text-[11px] text-muted-foreground uppercase tracking-wider">Total Leads</span>
                  </div>
                  <p className="text-2xl font-bold font-display">{leads.length}</p>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-xl border border-border bg-card p-4 hover-lift">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="w-4 h-4 text-success" />
                    <span className="text-[11px] text-muted-foreground uppercase tracking-wider">Avg Score</span>
                  </div>
                  <p className={`text-2xl font-bold font-display ${getScoreColor(avgScore)}`}>{avgScore}%</p>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="rounded-xl border border-border bg-card p-4 hover-lift">
                  <div className="flex items-center gap-2 mb-2">
                    <Briefcase className="w-4 h-4 text-warning" />
                    <span className="text-[11px] text-muted-foreground uppercase tracking-wider">Top Industry</span>
                  </div>
                  <p className="text-sm font-semibold font-display truncate">{topIndustry}</p>
                </motion.div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-display font-bold tracking-tight">{t("results.leadsFound")}: {leads.length}</h2>
                  <p className="text-sm text-muted-foreground">
                    {unlocked ? `${leads.length} leads unlocked` : `${Math.min(FREE_LEADS, leads.length)} ${t("results.free")} · ${Math.max(0, leads.length - FREE_LEADS)} locked`}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="h-9 rounded-xl text-[13px]" onClick={copyAllEmails}>
                    <Mail className="w-3.5 h-3.5 mr-1" /> Emails
                  </Button>
                  <Button size="sm" variant="outline" className="h-9 rounded-xl text-[13px]" onClick={downloadJSON}>
                    JSON
                  </Button>
                  <Button size="sm" className="h-9 rounded-xl text-[13px]" onClick={downloadCSV}>
                    <Download className="w-3.5 h-3.5 mr-1" /> CSV
                  </Button>
                </div>
              </div>

              {/* Lead cards */}
              <div className="space-y-3">
                {leads.slice(0, unlocked ? leads.length : FREE_LEADS).map((lead: any, i: number) => {
                  const score = getLeadScore(lead);
                  const isExpanded = expandedLead === i;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="border border-border rounded-xl bg-card overflow-hidden hover-lift cursor-pointer"
                      onClick={() => setExpandedLead(isExpanded ? null : i)}
                    >
                      <div className="p-4 flex items-center gap-3">
                        {/* Company initial */}
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 ${getScoreBg(score)}`}>
                          <span className={getScoreColor(score)}>
                            {(lead.company_name || "?")[0].toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-semibold truncate">{lead.company_name}</h4>
                            {i < 3 && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-success/10 text-success animate-pulse-soft">New</span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground truncate">{lead.contact_person} · {lead.role}</p>
                        </div>
                        {/* Score badge */}
                        <div className={`px-2.5 py-1 rounded-lg border text-xs font-bold ${getScoreBg(score)} ${getScoreColor(score)}`}>
                          {score}%
                        </div>
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                      </div>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="px-4 pb-4 pt-0 border-t border-border/50 mt-0">
                              <div className="grid grid-cols-2 gap-3 mt-3 text-[13px]">
                                <div>
                                  <span className="text-muted-foreground text-xs">Email</span>
                                  <p className="font-medium flex items-center gap-1">
                                    {lead.email}
                                    <button onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(lead.email || ""); toast.success("Copied!"); }}>
                                      <Copy className="w-3 h-3 text-muted-foreground hover:text-foreground" />
                                    </button>
                                  </p>
                                </div>
                                <div>
                                  <span className="text-muted-foreground text-xs">Phone</span>
                                  <p className="font-medium">{lead.phone || "N/A"}</p>
                                </div>
                                <div>
                                  <span className="text-muted-foreground text-xs">Website</span>
                                  <p className="font-medium truncate">{lead.website || "N/A"}</p>
                                </div>
                                <div>
                                  <span className="text-muted-foreground text-xs">Industry</span>
                                  <p className="font-medium">{lead.industry}</p>
                                </div>
                              </div>
                              {lead.fit_reason && (
                                <div className="mt-3 p-3 rounded-lg bg-secondary/50">
                                  <span className="text-[11px] text-muted-foreground uppercase tracking-wider">Why they fit</span>
                                  <p className="text-sm text-foreground mt-1">{lead.fit_reason}</p>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}

                {/* Locked leads */}
                {!unlocked && leads.length > FREE_LEADS && (
                  <>
                    {leads.slice(FREE_LEADS, FREE_LEADS + 3).map((lead: any, i: number) => (
                      <div key={`locked-${i}`} className="border border-border rounded-xl bg-card p-4 flex items-center gap-3 blur-[4px] select-none opacity-50">
                        <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-sm font-bold text-muted-foreground">?</div>
                        <div className="flex-1">
                          <div className="h-3 bg-muted rounded w-32 mb-1.5" />
                          <div className="h-2.5 bg-muted/60 rounded w-48" />
                        </div>
                        <div className="px-2.5 py-1 rounded-lg bg-muted text-xs font-bold text-muted-foreground">??%</div>
                      </div>
                    ))}
                    <div className="relative mt-2">
                      <div className="border border-border rounded-2xl p-8 text-center bg-card">
                        <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4 animate-pulse-soft">
                          <Lock className="w-5 h-5 text-primary" />
                        </div>
                        <h3 className="text-[15px] font-display font-bold mb-1">
                          {t("results.unlockTitle", { count: leads.length - FREE_LEADS })}
                        </h3>
                        <p className="text-xs text-muted-foreground mb-1">{t("results.unlockSubtitle")}</p>
                        <p className="text-xs text-muted-foreground/70 mb-5 italic">{t("results.unlockOnlyVisible")}</p>
                        <Button
                          className="h-11 px-8 rounded-xl text-sm font-medium bg-gradient-primary text-primary-foreground hover:opacity-90 transition-all duration-300 hover:shadow-[0_8px_30px_-4px_hsl(234,89%,64%,0.4)]"
                          onClick={() => {
                            toast.info("Stripe checkout will be integrated soon. Unlocking for preview...");
                            setUnlocked(true);
                          }}
                        >
                          Unlock Full List — $79
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <Button variant="ghost" className="mt-4 text-[13px]" onClick={() => { setStep("form"); setLeads([]); setUnlocked(false); setExpandedLead(null); }}>
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
