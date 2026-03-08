import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe, Facebook, Instagram, Linkedin, Brain, RefreshCw, CheckCircle2,
  Building, MapPin, Users, Loader2, Sparkles, Target, TrendingUp,
  ChevronDown, ChevronUp, Zap, Shield, AlertTriangle, Check, X
} from "lucide-react";
import { toast } from "sonner";

interface BrandAnalysis {
  services: string[];
  positioning: string;
  target_audience: string[];
  value_proposition: string;
  market_summary: string;
  recommended_industries: string[];
  recommended_locations: string[];
  strengths: string[];
  icp_description: string;
}

const ProfileCompleteness = ({ profile, onNavigate }: { profile: any; onNavigate: (section: string) => void }) => {
  const fields = [
    { label: "Website URL", key: "company_url", hint: "Required for AI analysis", filled: !!profile?.company_url },
    { label: "Company Description", key: "company_description", hint: "Helps AI understand your business", filled: !!profile?.company_description },
    { label: "Facebook", key: "facebook_url", hint: "Improves brand voice analysis", filled: !!profile?.facebook_url },
    { label: "Instagram", key: "instagram_url", hint: "Improves brand voice analysis", filled: !!profile?.instagram_url },
    { label: "LinkedIn", key: "linkedin_url", hint: "Best signal for B2B targeting", filled: !!profile?.linkedin_url },
    { label: "Target Location", key: "target_location", hint: "Focuses lead geography", filled: !!profile?.target_location },
    { label: "Target Industry", key: "target_industry", hint: "Narrows industry matching", filled: !!profile?.target_industry },
    { label: "Ideal Client", key: "ideal_client_description", hint: "Sharpens ICP matching", filled: !!profile?.ideal_client_description },
    { label: "AI Analysis", key: "brand_analysis", hint: "Run analysis below to unlock", filled: !!profile?.brand_analysis },
  ];
  const filled = fields.filter(f => f.filled).length;
  const pct = Math.round((filled / fields.length) * 100);
  const color = pct >= 80 ? "hsl(var(--success))" : pct >= 50 ? "hsl(var(--primary))" : "hsl(var(--warning))";

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Profile Completeness</span>
        <span className="text-sm font-bold" style={{ color }}>{pct}%</span>
      </div>
      <div className="h-2 rounded-full bg-secondary overflow-hidden mb-4">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
      <div className="space-y-1.5">
        {fields.map((f, i) => (
          <div key={i} className="flex items-center gap-3 py-1">
            <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${f.filled ? "bg-success/20" : "bg-secondary border border-border"}`}>
              {f.filled && <Check className="w-2.5 h-2.5 text-success" />}
            </div>
            <div className="flex-1 min-w-0">
              <span className={`text-xs font-medium ${f.filled ? "text-foreground" : "text-muted-foreground"}`}>{f.label}</span>
              {!f.filled && <span className="text-[10px] text-muted-foreground/60 ml-1.5">{f.hint}</span>}
            </div>
            {!f.filled && (
              <button
                onClick={() => onNavigate(f.key)}
                className="text-[11px] text-primary hover:underline shrink-0"
              >
                Fill in →
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const BrandAnalysisCard = ({ analysis, analyzedAt, onReanalyze, analyzing }: {
  analysis: BrandAnalysis;
  analyzedAt?: string;
  onReanalyze: () => void;
  analyzing: boolean;
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="border border-primary/20 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-primary/10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center">
            <Brain className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-display font-semibold">AI Brand Intelligence</h3>
            {analyzedAt && (
              <p className="text-[10px] text-muted-foreground">Last analyzed {new Date(analyzedAt).toLocaleDateString()}</p>
            )}
          </div>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={onReanalyze}
          disabled={analyzing}
          className="h-8 rounded-lg text-xs border-primary/20 hover:bg-primary/10"
        >
          {analyzing ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <RefreshCw className="w-3 h-3 mr-1" />}
          Re-analyze
        </Button>
      </div>

      <div className="p-6 space-y-5">
        {/* Value Proposition */}
        <div className="p-4 rounded-xl bg-primary/8 border border-primary/10">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Zap className="w-3.5 h-3.5 text-primary" />
            <span className="text-[11px] font-semibold text-primary uppercase tracking-wider">Value Proposition</span>
          </div>
          <p className="text-sm font-medium leading-relaxed">{analysis.value_proposition}</p>
        </div>

        {/* Market Summary */}
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <TrendingUp className="w-3.5 h-3.5 text-success" />
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Market Summary</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{analysis.market_summary}</p>
        </div>

        {/* Services + Target Audience */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Building className="w-3.5 h-3.5 text-accent" />
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Core Services</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {analysis.services?.map((s, i) => (
                <span key={i} className="text-[11px] px-2 py-1 rounded-lg bg-accent/10 text-accent border border-accent/20 font-medium">{s}</span>
              ))}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Users className="w-3.5 h-3.5 text-primary" />
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Target Audience</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {analysis.target_audience?.map((a, i) => (
                <span key={i} className="text-[11px] px-2 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20 font-medium">{a}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Expandable more */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden space-y-4"
            >
              {/* Positioning */}
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <Target className="w-3.5 h-3.5 text-warning" />
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Positioning</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{analysis.positioning}</p>
              </div>

              {/* Strengths */}
              {analysis.strengths?.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <Shield className="w-3.5 h-3.5 text-success" />
                    <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Strengths</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.strengths.map((s, i) => (
                      <span key={i} className="text-[11px] px-2 py-1 rounded-lg bg-success/10 text-success border border-success/20 font-medium">{s}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommended Industries + Locations */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <Building className="w-3.5 h-3.5 text-warning" />
                    <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Recommended Industries</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.recommended_industries?.map((ind, i) => (
                      <span key={i} className="text-[11px] px-2 py-1 rounded-lg bg-warning/10 text-warning border border-warning/20 font-medium">{ind}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <MapPin className="w-3.5 h-3.5 text-destructive" />
                    <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Recommended Markets</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.recommended_locations?.map((loc, i) => (
                      <span key={i} className="text-[11px] px-2 py-1 rounded-lg bg-destructive/10 text-destructive border border-destructive/20 font-medium">{loc}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* ICP */}
              {analysis.icp_description && (
                <div className="p-3 rounded-xl bg-secondary border border-border">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Users className="w-3.5 h-3.5 text-primary" />
                    <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Ideal Customer Profile</span>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">{analysis.icp_description}</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setExpanded(e => !e)}
          className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
        >
          {expanded ? <><ChevronUp className="w-3 h-3" /> Show less</> : <><ChevronDown className="w-3 h-3" /> Show full analysis</>}
        </button>
      </div>
    </motion.div>
  );
};

const DashboardResearch = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const formRef = useRef<HTMLDivElement>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [confirmReanalyze, setConfirmReanalyze] = useState(false);
  const [form, setForm] = useState({
    company_url: "",
    company_name: "",
    company_description: "",
    facebook_url: "",
    instagram_url: "",
    linkedin_url: "",
    target_location: "",
    target_industry: "",
    ideal_client_description: "",
  });

  const fetchProfile = useCallback(async () => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user!.id)
      .single();
    if (data) {
      setProfile(data);
      setForm({
        company_url: data.company_url || "",
        company_name: data.company_name || "",
        company_description: data.company_description || "",
        facebook_url: (data as any).facebook_url || "",
        instagram_url: (data as any).instagram_url || "",
        linkedin_url: (data as any).linkedin_url || "",
        target_location: data.target_location || "",
        target_industry: data.target_industry || "",
        ideal_client_description: data.ideal_client_description || "",
      });
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (user) fetchProfile();
  }, [user, fetchProfile]);

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        company_url: form.company_url,
        company_name: form.company_name,
        company_description: form.company_description,
        facebook_url: form.facebook_url,
        instagram_url: form.instagram_url,
        linkedin_url: form.linkedin_url,
        target_location: form.target_location,
        target_industry: form.target_industry,
        ideal_client_description: form.ideal_client_description,
      } as any)
      .eq("user_id", user!.id);

    if (error) {
      toast.error("Failed to save profile");
    } else {
      toast.success("Profile saved!");
      await fetchProfile();
    }
    setSaving(false);
  };

  const handleAnalyze = async (confirmed = false) => {
    // If analysis already exists, require confirmation
    const currentAnalysis = (profile as any)?.brand_analysis;
    if (currentAnalysis && !confirmed) {
      setConfirmReanalyze(true);
      return;
    }
    setConfirmReanalyze(false);
    setAnalyzing(true);
    // Save first
    await supabase.from("profiles").update({
      company_url: form.company_url,
      company_name: form.company_name,
      company_description: form.company_description,
      facebook_url: form.facebook_url,
      instagram_url: form.instagram_url,
      linkedin_url: form.linkedin_url,
      target_location: form.target_location,
      target_industry: form.target_industry,
      ideal_client_description: form.ideal_client_description,
    } as any).eq("user_id", user!.id);

    const { data, error } = await supabase.functions.invoke("analyze-brand", {
      body: {
        company_url: form.company_url,
        company_name: form.company_name,
        description: form.company_description,
        facebook_url: form.facebook_url,
        instagram_url: form.instagram_url,
        linkedin_url: form.linkedin_url,
        target_location: form.target_location,
        target_industry: form.target_industry,
      },
    });

    if (error || data?.error) {
      toast.error(data?.error || "Failed to analyze. Please try again.");
    } else {
      toast.success("Brand analysis complete!");
      await fetchProfile();
    }
    setAnalyzing(false);
  };

  if (loading) return (
    <>
      <DashboardHeader title="AI Research" />
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    </>
  );

  const brandAnalysis = (profile as any)?.brand_analysis as BrandAnalysis | null;

  return (
    <>
      <DashboardHeader title="AI Research" />
      <main className="p-4 lg:p-6 max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-primary/20 flex items-center justify-center shrink-0">
            <Brain className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-display font-bold tracking-tight">Brand Intelligence</h2>
            <p className="text-sm text-muted-foreground">
              AI analyzes your website and social profiles to understand your business — then uses this intelligence to find the most relevant leads.
            </p>
          </div>
        </motion.div>

        {/* Profile Completeness */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <ProfileCompleteness profile={profile} onNavigate={(field) => {
            formRef.current?.scrollIntoView({ behavior: "smooth" });
          }} />
        </motion.div>

        {/* AI Brand Analysis Card */}
        {brandAnalysis ? (
          <BrandAnalysisCard
            analysis={brandAnalysis}
            analyzedAt={profile?.updated_at}
            onReanalyze={handleAnalyze}
            analyzing={analyzing}
          />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="border border-dashed border-primary/30 rounded-2xl p-8 text-center bg-primary/3"
          >
            <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-[15px] font-display font-semibold mb-1">No brand analysis yet</h3>
            <p className="text-sm text-muted-foreground mb-5">
              Fill in your business details below and click "Analyze" to generate an AI brand overview. This improves lead generation quality significantly.
            </p>
            <Button
              onClick={() => handleAnalyze(false)}
              disabled={analyzing || (!form.company_url && !form.company_description)}
              className="h-10 rounded-xl bg-gradient-primary text-primary-foreground hover:opacity-90"
            >
              {analyzing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Analyzing...</> : <><Brain className="w-4 h-4 mr-2" />Run AI Analysis</>}
            </Button>
          </motion.div>
        )}

        {/* Connection Status Grid */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: Globe, label: "Website", connected: !!profile?.company_url },
            { icon: Facebook, label: "Facebook", connected: !!(profile as any)?.facebook_url },
            { icon: Instagram, label: "Instagram", connected: !!(profile as any)?.instagram_url },
            { icon: Linkedin, label: "LinkedIn", connected: !!(profile as any)?.linkedin_url },
          ].map((item, i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-3">
              <div className="flex items-center gap-2 mb-1">
                <item.icon className={`w-4 h-4 ${item.connected ? "text-success" : "text-muted-foreground"}`} />
                <span className="text-[11px] font-medium text-muted-foreground">{item.label}</span>
              </div>
              <div className="flex items-center gap-1">
                {item.connected
                  ? <><CheckCircle2 className="w-3 h-3 text-success" /><span className="text-xs text-success">Connected</span></>
                  : <span className="text-xs text-muted-foreground/60">Not set</span>
                }
              </div>
            </div>
          ))}
        </motion.div>

        {/* Edit Form */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-4 border border-border rounded-2xl bg-card p-6">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-display font-semibold">Business Profile</h3>
            <Button size="sm" variant="ghost" onClick={handleSave} disabled={saving} className="h-8 text-xs rounded-lg">
              {saving ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : null}
              Save
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[13px] font-medium mb-1.5 flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-success" /> Website URL
              </label>
              <Input placeholder="https://yourcompany.com" value={form.company_url} onChange={e => setForm({ ...form, company_url: e.target.value })} className="h-10 rounded-xl bg-secondary border-border text-sm" />
            </div>
            <div>
              <label className="text-[13px] font-medium mb-1.5 flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-accent" /> Company Name
              </label>
              <Input placeholder="Your Company Inc" value={form.company_name} onChange={e => setForm({ ...form, company_name: e.target.value })} className="h-10 rounded-xl bg-secondary border-border text-sm" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { key: "facebook_url", label: "Facebook", icon: Facebook, color: "text-[hsl(210,80%,51%)]", placeholder: "facebook.com/company" },
              { key: "instagram_url", label: "Instagram", icon: Instagram, color: "text-accent", placeholder: "instagram.com/company" },
              { key: "linkedin_url", label: "LinkedIn", icon: Linkedin, color: "text-[hsl(210,80%,51%)]", placeholder: "linkedin.com/company/..." },
            ].map((item) => (
              <div key={item.key}>
                <label className="text-[13px] font-medium mb-1.5 flex items-center gap-1">
                  <item.icon className={`w-3.5 h-3.5 ${item.color}`} /> {item.label}
                </label>
                <Input
                  placeholder={item.placeholder}
                  value={(form as any)[item.key]}
                  onChange={e => setForm({ ...form, [item.key]: e.target.value })}
                  className="h-10 rounded-xl bg-secondary border-border text-sm"
                />
              </div>
            ))}
          </div>

          <div>
            <label className="text-[13px] font-medium mb-1.5 block">What does your company do?</label>
            <Textarea placeholder="We help companies..." value={form.company_description} onChange={e => setForm({ ...form, company_description: e.target.value })} className="min-h-[80px] rounded-xl bg-secondary border-border text-sm resize-none" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[13px] font-medium mb-1.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-destructive" /> Target Location
              </label>
              <Input placeholder="e.g. USA, Europe" value={form.target_location} onChange={e => setForm({ ...form, target_location: e.target.value })} className="h-10 rounded-xl bg-secondary border-border text-sm" />
            </div>
            <div>
              <label className="text-[13px] font-medium mb-1.5 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-warning" /> Target Industry
              </label>
              <Input placeholder="e.g. SaaS, FinTech" value={form.target_industry} onChange={e => setForm({ ...form, target_industry: e.target.value })} className="h-10 rounded-xl bg-secondary border-border text-sm" />
            </div>
          </div>

          <div>
            <label className="text-[13px] font-medium mb-1.5 block">Ideal Client Description</label>
            <Textarea placeholder="Mid-size B2B companies with 50-500 employees..." value={form.ideal_client_description} onChange={e => setForm({ ...form, ideal_client_description: e.target.value })} className="min-h-[70px] rounded-xl bg-secondary border-border text-sm resize-none" />
          </div>

          <div className="flex gap-3">
            <Button onClick={handleSave} disabled={saving} variant="outline" className="flex-1 h-11 rounded-xl text-sm">
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Save Changes
            </Button>
            <Button
              onClick={() => handleAnalyze(false)}
              disabled={analyzing || (!form.company_url && !form.company_description)}
              className="flex-1 h-11 rounded-xl text-sm font-medium bg-gradient-primary text-primary-foreground hover:opacity-90"
            >
              {analyzing ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Analyzing...</>
              ) : (
                <><Brain className="w-4 h-4 mr-2" />Save & Analyze</>
              )}
            </Button>
          </div>
        </motion.div>
      </main>
    </>
  );
};

export default DashboardResearch;
