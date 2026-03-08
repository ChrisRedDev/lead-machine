import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, Globe, FileText, MapPin, Building, Users, Sparkles, Brain, Target,
  Lock, TrendingUp, BarChart3, Briefcase, Facebook, Instagram, Linkedin,
  ChevronDown, ChevronUp, Copy, Mail, Download, CheckCircle, ExternalLink, Phone,
  Check, Pen, RefreshCw, ChevronRight, X, Plus, Kanban, Lightbulb
} from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

type GenerationStep = "form" | "generating" | "results";
const FREE_LEADS = 10;

// Radial SVG score ring
const ScoreRing = ({ score, size = 48 }: { score: number; size?: number }) => {
  const r = (size - 6) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score >= 90 ? "hsl(var(--success))" : score >= 80 ? "hsl(var(--primary))" : "hsl(var(--warning))";
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0 -rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="hsl(var(--border))" strokeWidth="3" />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth="3"
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.8s ease" }}
      />
      <text
        x={size / 2} y={size / 2}
        textAnchor="middle" dominantBaseline="central"
        fontSize={size * 0.26} fontWeight="700"
        fill={color}
        style={{ transform: `rotate(90deg)`, transformOrigin: `${size / 2}px ${size / 2}px` }}
      >
        {score}
      </text>
    </svg>
  );
};

// ── Email Composer Modal ─────────────────────────────────────────────────────
const EmailComposerModal = ({
  lead,
  brandAnalysis,
  senderCompany,
  open,
  onClose,
}: {
  lead: any;
  brandAnalysis: any;
  senderCompany: string;
  open: boolean;
  onClose: () => void;
}) => {
  const [loading, setLoading] = useState(false);
  const [emailBody, setEmailBody] = useState("");
  const [subjectLines, setSubjectLines] = useState<string[]>([]);
  const [selectedSubject, setSelectedSubject] = useState(0);
  const [copied, setCopied] = useState<"body" | "subject" | null>(null);
  const generated = useRef(false);

  const generate = async () => {
    setLoading(true);
    setEmailBody("");
    setSubjectLines([]);
    generated.current = true;
    try {
      const { data, error } = await supabase.functions.invoke("compose-email", {
        body: { lead, brandAnalysis, senderCompany },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setEmailBody(data.email_body || "");
      setSubjectLines(data.subject_lines || []);
      setSelectedSubject(0);
    } catch (err: any) {
      toast.error(err.message || "Failed to generate email.");
    } finally {
      setLoading(false);
    }
  };

  // Auto-generate when modal opens
  useEffect(() => {
    if (open && !generated.current) generate();
    if (!open) { generated.current = false; setEmailBody(""); setSubjectLines([]); }
  }, [open]);

  const copyText = (text: string, kind: "body" | "subject") => {
    navigator.clipboard.writeText(text);
    setCopied(kind);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(null), 2000);
  };

  const firstName = (lead?.contact_person || "").split(" ")[0] || lead?.company_name || "there";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl w-full rounded-2xl gap-0 p-0 overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-border bg-card flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Pen className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <DialogTitle className="text-[15px] font-display font-semibold leading-tight">
              Cold Email for {lead?.company_name}
            </DialogTitle>
            <p className="text-xs text-muted-foreground mt-0.5 truncate">
              {lead?.contact_person} · {lead?.role}
            </p>
          </div>
          {brandAnalysis && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-semibold shrink-0">
              Brand AI
            </span>
          )}
        </div>

        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Loading skeleton */}
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
              <div className="text-center py-6">
                <motion.div
                  className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 1.2 }}
                >
                  <Sparkles className="w-5 h-5 text-primary" />
                </motion.div>
                <p className="text-sm font-medium">Crafting your personalized email…</p>
                <p className="text-xs text-muted-foreground mt-1">Using brand context + lead fit data</p>
              </div>
              {[80, 60, 70, 50, 65].map((w, i) => (
                <div key={i} className={`h-3 bg-muted rounded-full animate-pulse`} style={{ width: `${w}%` }} />
              ))}
            </motion.div>
          )}

          {/* Generated content */}
          {!loading && emailBody && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              {/* Subject line picker */}
              {subjectLines.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">Subject Line</label>
                    <button
                      onClick={() => copyText(subjectLines[selectedSubject], "subject")}
                      className="flex items-center gap-1 text-[11px] text-primary hover:text-primary/80 transition-colors font-medium"
                    >
                      {copied === "subject" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      {copied === "subject" ? "Copied!" : "Copy"}
                    </button>
                  </div>
                  <div className="space-y-1.5">
                    {subjectLines.map((s, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedSubject(i)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-[13px] border transition-all ${
                          selectedSubject === i
                            ? "bg-primary/10 border-primary/30 text-primary font-medium"
                            : "bg-secondary border-border text-foreground hover:border-primary/20"
                        }`}
                      >
                        <span className="text-muted-foreground text-[11px] mr-1.5">Option {i + 1}</span>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Email body */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">Email Body</label>
                  <button
                    onClick={() => copyText(emailBody, "body")}
                    className="flex items-center gap-1 text-[11px] text-primary hover:text-primary/80 transition-colors font-medium"
                  >
                    {copied === "body" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {copied === "body" ? "Copied!" : "Copy"}
                  </button>
                </div>
                <div className="relative">
                  <textarea
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                    className="w-full min-h-[200px] rounded-xl border border-border bg-secondary px-4 py-3 text-sm leading-relaxed resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                </div>
                <p className="text-[11px] text-muted-foreground">You can edit the email above before copying.</p>
              </div>

              {/* Fit reason context */}
              {lead?.fit_reason && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-success/5 border border-success/15">
                  <Target className="w-3.5 h-3.5 text-success shrink-0 mt-0.5" />
                  <p className="text-[12px] text-muted-foreground leading-relaxed">
                    <span className="text-success font-semibold">Why this lead fits: </span>
                    {lead.fit_reason}
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* Footer actions */}
        {!loading && emailBody && (
          <div className="px-5 py-4 border-t border-border bg-card/50 flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl text-[13px] h-9"
              onClick={generate}
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
              Regenerate
            </Button>
            <div className="flex-1" />
            {lead?.email && (
              <Button
                size="sm"
                variant="outline"
                className="rounded-xl text-[13px] h-9"
                onClick={() => {
                  const subject = encodeURIComponent(subjectLines[selectedSubject] || "");
                  const body = encodeURIComponent(emailBody);
                  window.open(`mailto:${lead.email}?subject=${subject}&body=${body}`, "_blank");
                }}
              >
                <Mail className="w-3.5 h-3.5 mr-1.5" />
                Open in Mail
              </Button>
            )}
            <Button
              size="sm"
              className="rounded-xl text-[13px] h-9 bg-gradient-primary text-primary-foreground hover:opacity-90"
              onClick={() => {
                const full = `Subject: ${subjectLines[selectedSubject] || ""}\n\n${emailBody}`;
                copyText(full, "body");
              }}
            >
              <Copy className="w-3.5 h-3.5 mr-1.5" />
              Copy All
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

// ─────────────────────────────────────────────────────────────────────────────

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [step, setStep] = useState<GenerationStep>("form");
  const [currentStatus, setCurrentStatus] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [unlocked, setUnlocked] = useState(false);
  const [expandedLead, setExpandedLead] = useState<number | null>(null);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [brandAnalysis, setBrandAnalysis] = useState<any>(null);
  const [emailComposeLead, setEmailComposeLead] = useState<any>(null);
  const [brandBannerExpanded, setBrandBannerExpanded] = useState(false);
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

  // Auto-fill form from saved profile + load brand analysis
  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("*").eq("user_id", user.id).single().then(({ data }) => {
      if (data) {
        setForm({
          companyUrl: data.company_url || "",
          description: data.company_description || "",
          targetLocation: data.target_location || "",
          targetIndustry: data.target_industry || "",
          idealClient: data.ideal_client_description || "",
          facebookUrl: (data as any).facebook_url || "",
          instagramUrl: (data as any).instagram_url || "",
          linkedinUrl: (data as any).linkedin_url || "",
        });
        if (data.company_url || data.company_description) setProfileLoaded(true);
        if ((data as any).brand_analysis) setBrandAnalysis((data as any).brand_analysis);
      }
    });
  }, [user]);

  const generationApiDone = useRef(false);

  const handleGenerate = async () => {
    if (!form.companyUrl || !form.description) {
      toast.error("Please fill in required fields.");
      return;
    }

    setStep("generating");
    setCurrentStatus(0);
    setCompletedSteps([]);
    generationApiDone.current = false;

    // Advance steps 0–3 on timer, hold at step 3 until API responds
    let timerStep = 0;
    const MAX_TIMER_STEP = statusMessages.length - 2; // hold 1 step back
    const statusInterval = setInterval(() => {
      if (generationApiDone.current) {
        clearInterval(statusInterval);
        return;
      }
      if (timerStep < MAX_TIMER_STEP) {
        const next = timerStep + 1;
        setCompletedSteps(c => c.includes(timerStep) ? c : [...c, timerStep]);
        setCurrentStatus(next);
        timerStep = next;
      }
    }, 6000);

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
          brandAnalysis: brandAnalysis || undefined,
        },
      });

      generationApiDone.current = true;
      clearInterval(statusInterval);

      if (error) throw error;
      if (data?.error) {
        toast.error(data.error);
        setStep("form");
        return;
      }

      // Flash remaining steps quickly then show results
      for (let i = timerStep; i < statusMessages.length; i++) {
        setCompletedSteps(c => c.includes(i) ? c : [...c, i]);
        setCurrentStatus(i);
        await new Promise(r => setTimeout(r, 300));
      }

      const generatedLeads = data?.leads || [];
      setLeads(generatedLeads);

      await supabase.from("lead_exports").insert({
        user_id: user!.id,
        name: `Leads for ${form.companyUrl}`,
        leads: generatedLeads,
        lead_count: generatedLeads.length,
      });

      // Save profile silently
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
      generationApiDone.current = true;
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
    a.href = url; a.download = "leads.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const downloadJSON = () => {
    const visibleLeads = unlocked ? leads : leads.slice(0, FREE_LEADS);
    const blob = new Blob([JSON.stringify(visibleLeads, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "leads.json"; a.click();
    URL.revokeObjectURL(url);
  };

  const copyAllEmails = () => {
    const visibleLeads = unlocked ? leads : leads.slice(0, FREE_LEADS);
    const emails = visibleLeads.map((l: any) => l.email).filter(Boolean).join(", ");
    navigator.clipboard.writeText(emails);
    toast.success(`${visibleLeads.filter((l: any) => l.email).length} emails copied!`);
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
    ? Object.entries(leads.reduce((acc: Record<string, number>, l: any) => {
        acc[l.industry || "Other"] = (acc[l.industry || "Other"] || 0) + 1;
        return acc;
      }, {})).sort(([, a], [, b]) => (b as number) - (a as number))[0]?.[0] || "N/A"
    : "N/A";

  return (
    <>
      <DashboardHeader title={t("generate.title")} />
      <main className="p-4 lg:p-6 max-w-4xl mx-auto">
        <AnimatePresence mode="wait">

          {/* ── FORM ── */}
          {step === "form" && (
            <motion.div key="form" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} className="space-y-5">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-display font-bold tracking-tight mb-1">{t("generate.title")}</h2>
                  <p className="text-sm text-muted-foreground">{t("generate.subtitle")}</p>
                </div>
                {profileLoaded && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-success/10 border border-success/20 text-success text-xs font-medium shrink-0"
                  >
                    <CheckCircle className="w-3 h-3" />
                    Profile auto-filled
                  </motion.div>
                )}
              </div>

              {/* Brand analysis context banner */}
              {brandAnalysis && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-3 p-3.5 rounded-xl bg-primary/8 border border-primary/15"
                >
                  <Brain className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-primary mb-0.5">Using your brand profile</p>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                      {brandAnalysis.value_proposition || `AI will use your saved brand analysis (${brandAnalysis.services?.slice(0,2).join(", ")}) to find better-matched leads.`}
                    </p>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-success/10 text-success border border-success/20 font-semibold shrink-0">Active</span>
                </motion.div>
              )}

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
                    <label className="text-[13px] font-medium mb-1.5 flex items-center gap-1.5">
                      <Facebook className="w-3.5 h-3.5 text-info" /> Facebook
                    </label>
                    <Input placeholder="facebook.com/company" value={form.facebookUrl} onChange={(e) => setForm({ ...form, facebookUrl: e.target.value })} className="h-10 rounded-xl bg-secondary border-border text-sm" />
                  </div>
                  <div>
                    <label className="text-[13px] font-medium mb-1.5 flex items-center gap-1.5">
                      <Instagram className="w-3.5 h-3.5 text-accent" /> Instagram
                    </label>
                    <Input placeholder="instagram.com/company" value={form.instagramUrl} onChange={(e) => setForm({ ...form, instagramUrl: e.target.value })} className="h-10 rounded-xl bg-secondary border-border text-sm" />
                  </div>
                  <div>
                    <label className="text-[13px] font-medium mb-1.5 flex items-center gap-1.5">
                      <Linkedin className="w-3.5 h-3.5 text-info" /> LinkedIn
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

          {/* ── GENERATING (inline, no fullscreen takeover) ── */}
          {step === "generating" && (
            <motion.div key="generating" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
              <div className="border border-border rounded-2xl bg-card p-8 max-w-md mx-auto mt-8">
                {/* Animated ring */}
                <div className="flex items-center justify-center mb-8">
                  <div className="relative w-24 h-24">
                    <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
                      <circle cx="48" cy="48" r="42" fill="none" stroke="hsl(var(--border))" strokeWidth="4" />
                      <circle
                        cx="48" cy="48" r="42" fill="none"
                        stroke="hsl(var(--primary))" strokeWidth="4"
                        strokeDasharray={2 * Math.PI * 42}
                        strokeDashoffset={2 * Math.PI * 42 * (1 - (currentStatus + 1) / statusMessages.length)}
                        strokeLinecap="round"
                        style={{ transition: "stroke-dashoffset 0.6s ease" }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold font-display text-primary">
                        {Math.round(((currentStatus + 1) / statusMessages.length) * 100)}%
                      </span>
                    </div>
                  </div>
                </div>

                <h3 className="text-center text-[15px] font-display font-semibold mb-6">AI is researching your leads…</h3>

                {/* Step list */}
                <div className="space-y-3">
                  {statusMessages.map((s, i) => {
                    const isDone = completedSteps.includes(i) && i !== currentStatus;
                    const isActive = i === currentStatus;
                    const isPending = i > currentStatus;
                    const Icon = s.icon;
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: isPending ? 0.35 : 1, x: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${isActive ? "bg-primary/10 border border-primary/20" : "border border-transparent"}`}
                      >
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${isDone ? "bg-success/20" : isActive ? "bg-primary/20" : "bg-secondary"}`}>
                          {isDone
                            ? <Check className="w-3.5 h-3.5 text-success" />
                            : <Icon className={`w-3.5 h-3.5 ${isActive ? s.color : "text-muted-foreground"}`} />
                          }
                        </div>
                        <span className={`text-sm ${isActive ? "font-medium text-foreground" : isDone ? "text-muted-foreground line-through" : "text-muted-foreground"}`}>
                          {s.text}
                        </span>
                        {isActive && (
                          <motion.div
                            className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"
                            animate={{ opacity: [1, 0.3, 1] }}
                            transition={{ repeat: Infinity, duration: 1 }}
                          />
                        )}
                      </motion.div>
                    );
                  })}
                </div>

                <p className="text-center text-xs text-muted-foreground mt-6">This usually takes 20–40 seconds</p>
              </div>
            </motion.div>
          )}

          {/* ── RESULTS ── */}
          {step === "results" && (
            <motion.div key="results" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              {/* Summary cards */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                  { icon: TrendingUp, label: "Total Leads", value: leads.length, color: "text-primary", extra: null },
                  { icon: BarChart3, label: "Avg Score", value: `${avgScore}%`, color: getScoreColor(avgScore), extra: null },
                  { icon: Briefcase, label: "Top Industry", value: topIndustry, color: "text-warning", extra: null },
                ].map((s, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="rounded-xl border border-border bg-card p-4 hover-lift">
                    <div className="flex items-center gap-2 mb-2">
                      <s.icon className={`w-4 h-4 ${s.color}`} />
                      <span className="text-[11px] text-muted-foreground uppercase tracking-wider">{s.label}</span>
                    </div>
                    <p className={`text-2xl font-bold font-display truncate ${s.color}`}>{s.value}</p>
                  </motion.div>
                ))}
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
                      transition={{ delay: i * 0.04 }}
                      className="border border-border rounded-xl bg-card overflow-hidden hover-lift cursor-pointer"
                      onClick={() => setExpandedLead(isExpanded ? null : i)}
                    >
                      <div className="p-4 flex items-center gap-3">
                        {/* Score ring */}
                        <ScoreRing score={score} size={52} />

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-sm font-semibold">{lead.company_name}</h4>
                            {i < 3 && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-success/10 text-success animate-pulse-soft">New</span>
                            )}
                            {lead.industry && (
                              <span className="px-1.5 py-0.5 rounded-md text-[10px] font-medium bg-accent/10 text-accent border border-accent/20">{lead.industry}</span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground truncate mt-0.5">{lead.contact_person} · {lead.role}</p>
                        </div>

                        {/* Quick actions */}
                        <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                          {/* Write cold email button */}
                          <button
                            className="flex items-center gap-1 px-2.5 h-8 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors text-primary"
                            title="Write cold email with AI"
                            onClick={() => setEmailComposeLead(lead)}
                          >
                            <Pen className="w-3 h-3" />
                            <span className="text-[11px] font-medium hidden sm:inline">Write</span>
                          </button>
                          {lead.email && (
                            <button
                              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-secondary transition-colors"
                              title={lead.email}
                              onClick={() => { navigator.clipboard.writeText(lead.email); toast.success("Email copied!"); }}
                            >
                              <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                            </button>
                          )}
                          {lead.website && (
                            <a
                              href={lead.website.startsWith("http") ? lead.website : `https://${lead.website}`}
                              target="_blank" rel="noopener noreferrer"
                              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-secondary transition-colors"
                            >
                              <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
                            </a>
                          )}
                        </div>

                        {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />}
                      </div>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="px-4 pb-4 border-t border-border/50">
                              <div className="grid grid-cols-2 gap-3 mt-3 text-[13px]">
                                <div>
                                  <span className="text-muted-foreground text-xs">Email</span>
                                  <p className="font-medium flex items-center gap-1.5 mt-0.5">
                                    <span className="truncate">{lead.email || "—"}</span>
                                    {lead.email && (
                                      <button onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(lead.email); toast.success("Copied!"); }}>
                                        <Copy className="w-3 h-3 text-muted-foreground hover:text-foreground shrink-0" />
                                      </button>
                                    )}
                                  </p>
                                </div>
                                <div>
                                  <span className="text-muted-foreground text-xs">Phone</span>
                                  <p className="font-medium mt-0.5 flex items-center gap-1.5">
                                    {lead.phone || "—"}
                                    {lead.phone && <Phone className="w-3 h-3 text-muted-foreground" />}
                                  </p>
                                </div>
                                <div>
                                  <span className="text-muted-foreground text-xs">Website</span>
                                  <p className="font-medium mt-0.5">
                                    {lead.website ? (
                                      <a
                                        href={lead.website.startsWith("http") ? lead.website : `https://${lead.website}`}
                                        target="_blank" rel="noopener noreferrer"
                                        className="text-primary hover:underline truncate block"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        {lead.website}
                                      </a>
                                    ) : "—"}
                                  </p>
                                </div>
                                <div>
                                  <span className="text-muted-foreground text-xs">Industry</span>
                                  <p className="font-medium mt-0.5">{lead.industry || "—"}</p>
                                </div>
                              </div>
                              {lead.fit_reason && (
                                <div className="mt-3 p-3 rounded-lg bg-primary/5 border border-primary/10">
                                  <span className="text-[11px] text-primary/70 uppercase tracking-wider font-semibold">Why they fit</span>
                                  <p className="text-sm text-foreground mt-1 leading-relaxed">{lead.fit_reason}</p>
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
                    {leads.slice(FREE_LEADS, FREE_LEADS + 3).map((_: any, i: number) => (
                      <div key={`locked-${i}`} className="border border-border rounded-xl bg-card p-4 flex items-center gap-3 blur-[4px] select-none opacity-50">
                        <div className="w-[52px] h-[52px] rounded-full bg-muted flex items-center justify-center text-sm font-bold text-muted-foreground shrink-0">?</div>
                        <div className="flex-1">
                          <div className="h-3 bg-muted rounded w-32 mb-1.5" />
                          <div className="h-2.5 bg-muted/60 rounded w-48" />
                        </div>
                        <div className="px-2.5 py-1 rounded-lg bg-muted text-xs font-bold text-muted-foreground">??%</div>
                      </div>
                    ))}
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

      {/* Cold Email Composer Modal */}
      <EmailComposerModal
        lead={emailComposeLead}
        brandAnalysis={brandAnalysis}
        senderCompany={form.companyUrl}
        open={!!emailComposeLead}
        onClose={() => setEmailComposeLead(null)}
      />
    </>
  );
};

export default Dashboard;
