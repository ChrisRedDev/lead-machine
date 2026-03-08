import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail, Send, Plus, Eye, BarChart3, Clock, Users, Sparkles, Copy, Trash2,
  Edit, ArrowLeft, CheckCircle2, Circle, RefreshCw, Zap, Target, Check,
  ChevronDown, ChevronUp, Building, Download, X
} from "lucide-react";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Lead {
  company_name: string;
  contact_person: string;
  role: string;
  website: string;
  email: string;
  phone: string;
  industry: string;
  score?: number | string;
  fit_reason: string;
}

interface Export {
  id: string;
  name: string;
  leads: Lead[];
  lead_count: number;
  created_at: string;
}

interface Campaign {
  id: string;
  name: string;
  subject: string;
  body: string;
  status: string;
  export_id: string | null;
  created_at: string;
}

interface CampaignLead {
  id: string;
  campaign_id: string;
  lead_index: number;
  company_name: string | null;
  contact_name: string | null;
  role: string | null;
  email: string | null;
  industry: string | null;
  fit_reason: string | null;
  status: string;
  contacted_at: string | null;
}

type View = "list" | "create" | "detail";

// ─── AI Email Generator ───────────────────────────────────────────────────────
const AIEmailGenerator = ({
  lead,
  brandAnalysis,
  senderCompany,
  onApply,
}: {
  lead: Lead;
  brandAnalysis: any;
  senderCompany: string;
  onApply: (subject: string, body: string) => void;
}) => {
  const [loading, setLoading] = useState(false);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [body, setBody] = useState("");
  const [selectedSubject, setSelectedSubject] = useState(0);

  const generate = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("compose-email", {
        body: { lead, brandAnalysis, senderCompany },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setBody(data.email_body || "");
      setSubjects(data.subject_lines || []);
      setSelectedSubject(0);
    } catch (err: any) {
      toast.error(err.message || "Failed to generate email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          AI Email Preview — {lead.company_name}
        </p>
        <Button size="sm" variant="outline" className="h-7 text-xs rounded-lg" onClick={generate} disabled={loading}>
          {loading ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3 mr-1" />}
          {loading ? "Generating…" : subjects.length ? "Regenerate" : "Generate AI Email"}
        </Button>
      </div>

      {subjects.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-[11px] text-muted-foreground">Subject options:</p>
          {subjects.map((s, i) => (
            <button
              key={i}
              onClick={() => setSelectedSubject(i)}
              className={`w-full text-left px-3 py-2 rounded-lg text-[12px] border transition-all ${
                selectedSubject === i
                  ? "bg-primary/10 border-primary/30 text-primary font-medium"
                  : "bg-secondary border-border hover:border-primary/20"
              }`}
            >
              <span className="text-muted-foreground text-[11px] mr-1.5">#{i + 1}</span>{s}
            </button>
          ))}
        </div>
      )}

      {body && (
        <div className="rounded-lg bg-secondary border border-border p-3 text-xs leading-relaxed whitespace-pre-wrap">
          {body}
        </div>
      )}

      {body && (
        <Button
          size="sm"
          className="w-full h-8 text-xs rounded-lg bg-gradient-primary text-primary-foreground"
          onClick={() => onApply(subjects[selectedSubject] || "", body)}
        >
          <Check className="w-3 h-3 mr-1.5" />
          Use This Email as Template
        </Button>
      )}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const DashboardCampaigns = () => {
  const { user } = useAuth();
  const [view, setView] = useState<View>("list");
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [campaignLeads, setCampaignLeads] = useState<CampaignLead[]>([]);
  const [exports, setExports] = useState<Export[]>([]);
  const [activeCampaign, setActiveCampaign] = useState<Campaign | null>(null);
  const [brandAnalysis, setBrandAnalysis] = useState<any>(null);
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [aiPreviewLead, setAiPreviewLead] = useState<Lead | null>(null);
  const [expandedLead, setExpandedLead] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    subject: "",
    body: "",
    export_id: "",
    selectedLeadIndices: [] as number[],
  });

  // Load data
  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const [campaignRes, exportsRes, profileRes] = await Promise.all([
        supabase.from("campaigns" as any).select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
        supabase.from("lead_exports").select("id, name, leads, lead_count, created_at").eq("user_id", user.id).order("created_at", { ascending: false }),
        supabase.from("profiles").select("brand_analysis, company_name").eq("user_id", user.id).single(),
      ]);
      if (!campaignRes.error && campaignRes.data) setCampaigns(campaignRes.data as unknown as Campaign[]);
      if (!exportsRes.error && exportsRes.data) setExports(exportsRes.data as unknown as Export[]);
      if (!profileRes.error && profileRes.data) {
        setBrandAnalysis((profileRes.data as any).brand_analysis);
        setCompanyName((profileRes.data as any).company_name || "");
      }
      setLoading(false);
    };
    load();
  }, [user]);

  const loadCampaignLeads = async (campaignId: string) => {
    const { data } = await supabase
      .from("campaign_leads" as any)
      .select("*")
      .eq("campaign_id", campaignId)
      .order("created_at", { ascending: true });
    if (data) setCampaignLeads(data as unknown as CampaignLead[]);
  };

  const openCampaign = async (campaign: Campaign) => {
    setActiveCampaign(campaign);
    await loadCampaignLeads(campaign.id);
    setView("detail");
  };

  const getExportLeads = (exportId: string): Lead[] => {
    const exp = exports.find((e) => e.id === exportId);
    return (exp?.leads as Lead[]) || [];
  };

  const toggleLeadSelection = (index: number) => {
    setForm((f) => ({
      ...f,
      selectedLeadIndices: f.selectedLeadIndices.includes(index)
        ? f.selectedLeadIndices.filter((i) => i !== index)
        : [...f.selectedLeadIndices, index],
    }));
  };

  const selectAllLeads = () => {
    const leads = getExportLeads(form.export_id);
    setForm((f) => ({
      ...f,
      selectedLeadIndices: f.selectedLeadIndices.length === leads.length
        ? []
        : leads.map((_, i) => i),
    }));
  };

  const saveCampaign = async () => {
    if (!form.name.trim() || !form.subject.trim() || !form.body.trim()) {
      toast.error("Please fill in campaign name, subject and body.");
      return;
    }
    if (!form.export_id) {
      toast.error("Please select a lead export.");
      return;
    }
    if (form.selectedLeadIndices.length === 0) {
      toast.error("Please select at least one lead.");
      return;
    }
    setSaving(true);
    try {
      const { data: campaignData, error: campaignErr } = await supabase
        .from("campaigns" as any)
        .insert({
          user_id: user!.id,
          name: form.name,
          subject: form.subject,
          body: form.body,
          export_id: form.export_id,
          status: "active",
        })
        .select()
        .single();

      if (campaignErr) throw campaignErr;
      const campaign = campaignData as unknown as Campaign;

      const allLeads = getExportLeads(form.export_id);
      const campaignLeadsToInsert = form.selectedLeadIndices.map((idx) => {
        const lead = allLeads[idx];
        return {
          campaign_id: campaign.id,
          user_id: user!.id,
          lead_index: idx,
          company_name: lead.company_name,
          contact_name: lead.contact_person,
          role: lead.role,
          email: lead.email,
          industry: lead.industry,
          fit_reason: lead.fit_reason,
          status: "pending",
        };
      });

      await supabase.from("campaign_leads" as any).insert(campaignLeadsToInsert);

      setCampaigns((prev) => [campaign, ...prev]);
      setForm({ name: "", subject: "", body: "", export_id: "", selectedLeadIndices: [] });
      toast.success(`Campaign "${campaign.name}" created with ${form.selectedLeadIndices.length} leads!`);
      setView("list");
    } catch (err: any) {
      toast.error(err.message || "Failed to create campaign");
    } finally {
      setSaving(false);
    }
  };

  const deleteCampaign = async (id: string) => {
    await supabase.from("campaigns" as any).delete().eq("id", id);
    setCampaigns((prev) => prev.filter((c) => c.id !== id));
    toast.success("Campaign deleted");
  };

  const markLeadContacted = async (lead: CampaignLead) => {
    const newStatus = lead.status === "contacted" ? "pending" : "contacted";
    const { error } = await supabase
      .from("campaign_leads" as any)
      .update({ status: newStatus, contacted_at: newStatus === "contacted" ? new Date().toISOString() : null })
      .eq("id", lead.id);
    if (!error) {
      setCampaignLeads((prev) =>
        prev.map((l) => l.id === lead.id ? { ...l, status: newStatus, contacted_at: newStatus === "contacted" ? new Date().toISOString() : null } : l)
      );
    }
  };

  const contactedCount = campaignLeads.filter((l) => l.status === "contacted").length;
  const pendingCount = campaignLeads.filter((l) => l.status === "pending").length;

  // ── RENDER: Campaign Detail ─────────────────────────────────────────────────
  if (view === "detail" && activeCampaign) {
    return (
      <>
        <DashboardHeader title="Campaign Detail" />
        <main className="p-4 lg:p-6 max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Button variant="ghost" size="sm" onClick={() => setView("list")} className="h-8 text-xs">
              <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />Back
            </Button>
            <div className="flex-1">
              <h2 className="text-lg font-display font-bold tracking-tight">{activeCampaign.name}</h2>
              <p className="text-xs text-muted-foreground">
                {campaignLeads.length} leads · {contactedCount} contacted · {pendingCount} pending
              </p>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
              activeCampaign.status === "active" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
            }`}>
              {activeCampaign.status}
            </span>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <Card className="p-4 border-border">
              <p className="text-xs text-muted-foreground mb-1">Total Leads</p>
              <p className="text-2xl font-bold">{campaignLeads.length}</p>
            </Card>
            <Card className="p-4 border-border">
              <p className="text-xs text-muted-foreground mb-1">Contacted</p>
              <p className="text-2xl font-bold text-success">{contactedCount}</p>
            </Card>
            <Card className="p-4 border-border">
              <p className="text-xs text-muted-foreground mb-1">Pending</p>
              <p className="text-2xl font-bold text-warning">{pendingCount}</p>
            </Card>
          </div>

          {/* Email Template */}
          <Card className="p-5 border-border mb-5">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Email Template</p>
            <p className="text-sm font-medium mb-1">Subject: <span className="text-muted-foreground font-normal">{activeCampaign.subject}</span></p>
            <div className="mt-3 p-3 rounded-xl bg-secondary border border-border text-xs leading-relaxed whitespace-pre-wrap text-muted-foreground">
              {activeCampaign.body}
            </div>
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <Button
                size="sm"
                variant="outline"
                className="h-8 text-xs rounded-lg"
                onClick={() => {
                  navigator.clipboard.writeText(`Subject: ${activeCampaign.subject}\n\n${activeCampaign.body}`);
                  toast.success("Template copied!");
                }}
              >
                <Copy className="w-3 h-3 mr-1.5" />Copy Template
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-8 text-xs rounded-lg"
                onClick={() => {
                  const emails = campaignLeads.map((l) => l.email).filter(Boolean).join(",");
                  if (!emails) { toast.error("No emails in this campaign"); return; }
                  const subject = encodeURIComponent(activeCampaign.subject);
                  const body = encodeURIComponent(activeCampaign.body);
                  window.open(`mailto:?bcc=${emails}&subject=${subject}&body=${body}`, "_blank");
                }}
              >
                <Mail className="w-3 h-3 mr-1.5" />Send to All (BCC)
              </Button>
            </div>
          </Card>

          {/* Leads */}
          <div className="space-y-2">
            {campaignLeads.map((lead) => (
              <motion.div key={lead.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                <Card className={`p-4 border-border transition-colors ${lead.status === "contacted" ? "border-success/20 bg-success/5" : ""}`}>
                  <div className="flex items-center gap-3">
                    <button onClick={() => markLeadContacted(lead)} className="shrink-0">
                      {lead.status === "contacted"
                        ? <CheckCircle2 className="w-5 h-5 text-success" />
                        : <Circle className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
                      }
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={`text-sm font-medium ${lead.status === "contacted" ? "line-through text-muted-foreground" : ""}`}>
                          {lead.company_name}
                        </p>
                        {lead.status === "contacted" && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-success/10 text-success font-semibold">Contacted</span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{lead.contact_name} · {lead.role}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {lead.email && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 text-xs px-2 rounded-lg"
                          onClick={() => {
                            const subject = encodeURIComponent(
                              activeCampaign.subject
                                .replace(/\{\{company_name\}\}/g, lead.company_name || "")
                                .replace(/\{\{contact_name\}\}/g, lead.contact_name || "")
                            );
                            const body = encodeURIComponent(
                              activeCampaign.body
                                .replace(/\{\{company_name\}\}/g, lead.company_name || "")
                                .replace(/\{\{contact_name\}\}/g, lead.contact_name || "")
                                .replace(/\{\{role\}\}/g, lead.role || "")
                                .replace(/\{\{fit_reason\}\}/g, lead.fit_reason || "")
                            );
                            window.open(`mailto:${lead.email}?subject=${subject}&body=${body}`, "_blank");
                          }}
                        >
                          <Mail className="w-3 h-3 mr-1" />Send
                        </Button>
                      )}
                      <button
                        onClick={() => setExpandedLead(expandedLead === lead.id ? null : lead.id)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        {expandedLead === lead.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <AnimatePresence>
                    {expandedLead === lead.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-3 pt-3 border-t border-border grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                          <div><span className="font-medium text-foreground">Email:</span> {lead.email || "—"}</div>
                          <div><span className="font-medium text-foreground">Industry:</span> {lead.industry || "—"}</div>
                          <div className="col-span-2"><span className="font-medium text-foreground">Fit:</span> {lead.fit_reason || "—"}</div>
                          {lead.contacted_at && (
                            <div className="col-span-2 text-success">
                              ✓ Contacted: {new Date(lead.contacted_at).toLocaleString()}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            ))}
          </div>
        </main>
      </>
    );
  }

  // ── RENDER: Create Campaign ─────────────────────────────────────────────────
  if (view === "create") {
    const selectedExportLeads = form.export_id ? getExportLeads(form.export_id) : [];

    return (
      <>
        <DashboardHeader title="New Campaign" />
        <main className="p-4 lg:p-6 max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Button variant="ghost" size="sm" onClick={() => setView("list")} className="h-8 text-xs">
              <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />Back
            </Button>
            <div>
              <h2 className="text-lg font-display font-bold tracking-tight">Create Email Campaign</h2>
              <p className="text-xs text-muted-foreground">Select leads, write an AI-assisted email, and track outreach</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Left: Form */}
            <div className="lg:col-span-3 space-y-4">
              {/* Campaign basics */}
              <Card className="p-5 border-border">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Campaign Details</p>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium mb-1.5 block">Campaign Name</label>
                    <Input
                      placeholder="e.g., Q1 SaaS Outreach"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="h-9 rounded-xl bg-secondary border-border text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium mb-1.5 block">Email Subject</label>
                    <Input
                      placeholder="Quick question for {{company_name}}"
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className="h-9 rounded-xl bg-secondary border-border text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium mb-1.5 block">Email Body</label>
                    <Textarea
                      placeholder={`Hi {{contact_name}},\n\nI noticed {{company_name}} is {{fit_reason}}...\n\nAvailable tokens: {{company_name}}, {{contact_name}}, {{role}}, {{fit_reason}}`}
                      value={form.body}
                      onChange={(e) => setForm({ ...form, body: e.target.value })}
                      className="min-h-[180px] rounded-xl bg-secondary border-border text-sm resize-none"
                    />
                    <p className="text-[11px] text-muted-foreground mt-1">
                      Tokens: {`{{company_name}}, {{contact_name}}, {{role}}, {{fit_reason}}`}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Select export */}
              <Card className="p-5 border-border">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Select Lead Export</p>
                {exports.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No exports found. Generate leads first.</p>
                ) : (
                  <div className="space-y-2">
                    {exports.map((exp) => (
                      <button
                        key={exp.id}
                        onClick={() => setForm({ ...form, export_id: exp.id, selectedLeadIndices: [] })}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                          form.export_id === exp.id
                            ? "bg-primary/10 border-primary/30"
                            : "border-border hover:border-border/80 hover:bg-secondary/50"
                        }`}
                      >
                        <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                          <Building className="w-3.5 h-3.5 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{exp.name}</p>
                          <p className="text-xs text-muted-foreground">{exp.lead_count} leads · {new Date(exp.created_at).toLocaleDateString()}</p>
                        </div>
                        {form.export_id === exp.id && <Check className="w-4 h-4 text-primary shrink-0" />}
                      </button>
                    ))}
                  </div>
                )}
              </Card>

              {/* Select leads */}
              {form.export_id && selectedExportLeads.length > 0 && (
                <Card className="p-5 border-border">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Select Leads ({form.selectedLeadIndices.length}/{selectedExportLeads.length})
                    </p>
                    <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={selectAllLeads}>
                      {form.selectedLeadIndices.length === selectedExportLeads.length ? "Deselect All" : "Select All"}
                    </Button>
                  </div>
                  <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                    {selectedExportLeads.map((lead, idx) => {
                      const selected = form.selectedLeadIndices.includes(idx);
                      return (
                        <button
                          key={idx}
                          onClick={() => toggleLeadSelection(idx)}
                          className={`w-full flex items-center gap-3 p-2.5 rounded-lg border text-left transition-all ${
                            selected ? "bg-primary/5 border-primary/20" : "border-border hover:bg-secondary/50"
                          }`}
                        >
                          {selected
                            ? <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                            : <Circle className="w-4 h-4 text-muted-foreground shrink-0" />
                          }
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium truncate">{lead.company_name}</p>
                            <p className="text-[11px] text-muted-foreground truncate">{lead.contact_person} · {lead.role}</p>
                          </div>
                          {selected && lead.company_name && (
                            <button
                              onClick={(e) => { e.stopPropagation(); setAiPreviewLead(lead); }}
                              className="shrink-0 text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                            >
                              AI Preview
                            </button>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </Card>
              )}

              <Button
                onClick={saveCampaign}
                disabled={saving}
                className="w-full h-11 rounded-xl bg-gradient-primary text-primary-foreground text-sm font-semibold"
              >
                {saving ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Zap className="w-4 h-4 mr-2" />}
                {saving ? "Creating…" : `Create Campaign (${form.selectedLeadIndices.length} leads)`}
              </Button>
            </div>

            {/* Right: AI Preview */}
            <div className="lg:col-span-2">
              <Card className="p-5 border-border sticky top-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <p className="text-xs font-semibold">AI Email Preview</p>
                  {brandAnalysis && (
                    <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-semibold">
                      Brand AI
                    </span>
                  )}
                </div>

                {!aiPreviewLead && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <p className="text-xs">Click "AI Preview" on any selected lead to generate a personalized email sample</p>
                  </div>
                )}

                {aiPreviewLead && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] font-medium">{aiPreviewLead.company_name}</p>
                      <button onClick={() => setAiPreviewLead(null)} className="text-muted-foreground hover:text-foreground">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <AIEmailGenerator
                      lead={aiPreviewLead}
                      brandAnalysis={brandAnalysis}
                      senderCompany={companyName}
                      onApply={(subject, body) => {
                        setForm((f) => ({ ...f, subject, body }));
                        toast.success("Email template applied!");
                      }}
                    />
                  </div>
                )}

                {!brandAnalysis && (
                  <div className="mt-4 p-3 rounded-lg bg-warning/5 border border-warning/20">
                    <p className="text-[11px] text-warning font-medium mb-1">No Brand Analysis</p>
                    <p className="text-[11px] text-muted-foreground">Complete AI Research to get better personalized emails</p>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </main>
      </>
    );
  }

  // ── RENDER: Campaign List ───────────────────────────────────────────────────
  const totalContacted = campaigns.length; // placeholder — real stat from campaign_leads
  return (
    <>
      <DashboardHeader title="Email Campaigns" />
      <main className="p-4 lg:p-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-display font-bold tracking-tight">Campaigns</h2>
            <p className="text-sm text-muted-foreground">Create outreach campaigns and track who you've contacted</p>
          </div>
          <Button onClick={() => setView("create")} className="h-9 rounded-xl bg-gradient-primary text-sm">
            <Plus className="w-4 h-4 mr-1.5" />New Campaign
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <RefreshCw className="w-5 h-5 animate-spin text-muted-foreground" />
          </div>
        ) : campaigns.length === 0 ? (
          <div className="border border-border/40 rounded-2xl p-12 text-center">
            <Mail className="w-10 h-10 mx-auto text-muted-foreground/40 mb-3" />
            <h3 className="font-display font-semibold text-[15px] mb-1">No campaigns yet</h3>
            <p className="text-sm text-muted-foreground mb-4">Create your first campaign to start tracking outreach</p>
            <Button onClick={() => setView("create")} className="h-9 rounded-xl bg-gradient-primary text-sm">
              <Plus className="w-4 h-4 mr-1.5" />Create Campaign
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {campaigns.map((campaign, i) => (
              <motion.div
                key={campaign.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card
                  className="p-5 border-border hover:border-border/80 transition-colors cursor-pointer"
                  onClick={() => openCampaign(campaign)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-[15px] font-semibold">{campaign.name}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          campaign.status === "active" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
                        }`}>
                          {campaign.status}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate max-w-md">Subject: {campaign.subject}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Created {new Date(campaign.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => deleteCampaign(campaign.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </>
  );
};

export default DashboardCampaigns;
