import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { Globe, Facebook, Instagram, Linkedin, Brain, RefreshCw, CheckCircle2, Building, MapPin, Users, Loader2 } from "lucide-react";
import { toast } from "sonner";
import aiResearchImage from "@/assets/ai-research-illustration.png";

const DashboardResearch = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
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

  useEffect(() => {
    if (user) fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
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
  };

  const handleSave = async () => {
    setAnalyzing(true);
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
      toast.success("Business profile saved & analyzed!");
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

  const hasProfile = profile?.company_url || profile?.company_description;

  return (
    <>
      <DashboardHeader title="AI Research" />
      <main className="p-4 lg:p-6 max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex items-start gap-4">
          <img src={aiResearchImage} alt="AI Research" className="w-16 h-16 rounded-2xl object-cover opacity-80" />
          <div>
            <h2 className="text-xl font-display font-bold tracking-tight">Business Intelligence</h2>
            <p className="text-sm text-muted-foreground">
              Tell AI about your business with links to your website and social media. The AI will deeply understand your business to find the best matching clients.
            </p>
          </div>
        </motion.div>

        {/* Status cards */}
        {hasProfile && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { icon: Globe, label: "Website", value: profile?.company_url ? "Connected" : "Not set", connected: !!profile?.company_url },
              { icon: Facebook, label: "Facebook", value: (profile as any)?.facebook_url ? "Connected" : "Not set", connected: !!(profile as any)?.facebook_url },
              { icon: Instagram, label: "Instagram", value: (profile as any)?.instagram_url ? "Connected" : "Not set", connected: !!(profile as any)?.instagram_url },
              { icon: Linkedin, label: "LinkedIn", value: (profile as any)?.linkedin_url ? "Connected" : "Not set", connected: !!(profile as any)?.linkedin_url },
            ].map((item, i) => (
              <div key={i} className="rounded-xl border border-border bg-card p-3">
                <div className="flex items-center gap-2 mb-1">
                  <item.icon className={`w-4 h-4 ${item.connected ? "text-success" : "text-muted-foreground"}`} />
                  <span className="text-[11px] font-medium text-muted-foreground">{item.label}</span>
                </div>
                <div className="flex items-center gap-1">
                  {item.connected && <CheckCircle2 className="w-3 h-3 text-success" />}
                  <span className={`text-xs ${item.connected ? "text-success" : "text-muted-foreground/60"}`}>{item.value}</span>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Form */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-4 border border-border rounded-2xl bg-card p-6">
          <h3 className="text-sm font-display font-semibold mb-3">Business Links & Details</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[13px] font-medium mb-1.5 flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-success" /> Website URL
              </label>
              <Input placeholder="https://yourcompany.com" value={form.company_url} onChange={(e) => setForm({ ...form, company_url: e.target.value })} className="h-10 rounded-xl bg-secondary border-border text-sm" />
            </div>
            <div>
              <label className="text-[13px] font-medium mb-1.5 flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-accent" /> Company Name
              </label>
              <Input placeholder="Your Company Inc" value={form.company_name} onChange={(e) => setForm({ ...form, company_name: e.target.value })} className="h-10 rounded-xl bg-secondary border-border text-sm" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-[13px] font-medium mb-1.5 flex items-center gap-1">
                <Facebook className="w-3.5 h-3.5 text-[hsl(210,80%,51%)]" /> Facebook
              </label>
              <Input placeholder="facebook.com/company" value={form.facebook_url} onChange={(e) => setForm({ ...form, facebook_url: e.target.value })} className="h-10 rounded-xl bg-secondary border-border text-sm" />
            </div>
            <div>
              <label className="text-[13px] font-medium mb-1.5 flex items-center gap-1">
                <Instagram className="w-3.5 h-3.5 text-[hsl(340,75%,55%)]" /> Instagram
              </label>
              <Input placeholder="instagram.com/company" value={form.instagram_url} onChange={(e) => setForm({ ...form, instagram_url: e.target.value })} className="h-10 rounded-xl bg-secondary border-border text-sm" />
            </div>
            <div>
              <label className="text-[13px] font-medium mb-1.5 flex items-center gap-1">
                <Linkedin className="w-3.5 h-3.5 text-[hsl(210,80%,51%)]" /> LinkedIn
              </label>
              <Input placeholder="linkedin.com/company/..." value={form.linkedin_url} onChange={(e) => setForm({ ...form, linkedin_url: e.target.value })} className="h-10 rounded-xl bg-secondary border-border text-sm" />
            </div>
          </div>

          <div>
            <label className="text-[13px] font-medium mb-1.5 block">What does your company do?</label>
            <Textarea placeholder="We help companies..." value={form.company_description} onChange={(e) => setForm({ ...form, company_description: e.target.value })} className="min-h-[80px] rounded-xl bg-secondary border-border text-sm resize-none" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[13px] font-medium mb-1.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-destructive" /> Target Location
              </label>
              <Input placeholder="e.g. USA, Europe" value={form.target_location} onChange={(e) => setForm({ ...form, target_location: e.target.value })} className="h-10 rounded-xl bg-secondary border-border text-sm" />
            </div>
            <div>
              <label className="text-[13px] font-medium mb-1.5 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-warning" /> Target Industry
              </label>
              <Input placeholder="e.g. SaaS, FinTech" value={form.target_industry} onChange={(e) => setForm({ ...form, target_industry: e.target.value })} className="h-10 rounded-xl bg-secondary border-border text-sm" />
            </div>
          </div>

          <div>
            <label className="text-[13px] font-medium mb-1.5 block">Ideal Client Description</label>
            <Textarea placeholder="Mid-size B2B companies with 50-500 employees..." value={form.ideal_client_description} onChange={(e) => setForm({ ...form, ideal_client_description: e.target.value })} className="min-h-[70px] rounded-xl bg-secondary border-border text-sm resize-none" />
          </div>

          <Button
            onClick={handleSave}
            disabled={analyzing}
            className="w-full h-11 rounded-xl text-sm font-medium bg-gradient-primary text-primary-foreground hover:opacity-90"
          >
            {analyzing ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Brain className="w-4 h-4 mr-2" />
                Save & Analyze Business
              </>
            )}
          </Button>
        </motion.div>
      </main>
    </>
  );
};

export default DashboardResearch;
