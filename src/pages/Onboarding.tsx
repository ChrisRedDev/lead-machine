import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe, Building, FileText, Facebook, Instagram, Linkedin,
  MapPin, Users, Sparkles, ArrowRight, ArrowLeft, CheckCircle,
  Brain, Loader2, Target
} from "lucide-react";
import { toast } from "sonner";

const TOTAL_STEPS = 3;

const StepIndicator = ({ current, total }: { current: number; total: number }) => (
  <div className="flex items-center gap-2 mb-8">
    {Array.from({ length: total }).map((_, i) => (
      <div key={i} className="flex items-center gap-2">
        <motion.div
          animate={{
            width: i === current ? 32 : 8,
            backgroundColor: i < current ? "hsl(var(--success))" : i === current ? "hsl(var(--primary))" : "hsl(var(--border))",
          }}
          transition={{ duration: 0.3 }}
          className="h-2 rounded-full"
        />
      </div>
    ))}
    <span className="text-xs text-muted-foreground ml-2">Step {current + 1} of {total}</span>
  </div>
);

const Onboarding = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [analyzing, setAnalyzing] = useState(false);
  const [form, setForm] = useState({
    company_name: "",
    company_url: "",
    company_description: "",
    facebook_url: "",
    instagram_url: "",
    linkedin_url: "",
    target_location: "",
    target_industry: "",
    ideal_client_description: "",
  });

  useEffect(() => {
    if (!user) return;
    // Check if user already completed onboarding
    supabase.from("profiles").select("company_url").eq("user_id", user.id).single().then(({ data }) => {
      if (data?.company_url) navigate("/dashboard", { replace: true });
    });
  }, [user, navigate]);

  const update = (field: string, value: string) => setForm(f => ({ ...f, [field]: value }));

  const handleFinish = async () => {
    setAnalyzing(true);
    try {
      // Save profile data
      await supabase.from("profiles").update({
        company_name: form.company_name,
        company_url: form.company_url,
        company_description: form.company_description,
        facebook_url: form.facebook_url,
        instagram_url: form.instagram_url,
        linkedin_url: form.linkedin_url,
        target_location: form.target_location,
        target_industry: form.target_industry,
        ideal_client_description: form.ideal_client_description,
      } as any).eq("user_id", user!.id);

      // Trigger AI brand analysis
      const { error } = await supabase.functions.invoke("analyze-brand", {
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

      if (error) console.error("Brand analysis error (non-blocking):", error);

      toast.success("Profile created! AI is analyzing your business...");
      navigate("/dashboard", { replace: true });
    } catch (err: any) {
      console.error("Onboarding error:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  const canProceed = () => {
    if (step === 0) return form.company_name.trim().length > 0 && form.company_url.trim().length > 0;
    if (step === 1) return true; // Social links optional
    if (step === 2) return form.target_location.trim().length > 0 || form.target_industry.trim().length > 0;
    return false;
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Logo / Brand */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-primary flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-xl font-display font-bold tracking-tight">LeadGlow</span>
          </div>
          <p className="text-sm text-muted-foreground">Let's set up your business profile</p>
        </motion.div>

        <div className="border border-border rounded-2xl bg-card p-8 shadow-[0_8px_40px_-12px_hsl(var(--primary)/0.15)]">
          <StepIndicator current={step} total={TOTAL_STEPS} />

          <AnimatePresence mode="wait">
            {/* Step 0: Company Basics */}
            {step === 0 && (
              <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                <div>
                  <h2 className="text-xl font-display font-bold tracking-tight mb-1">Tell us about your business</h2>
                  <p className="text-sm text-muted-foreground">This helps AI find the most relevant leads for you.</p>
                </div>

                <div>
                  <label className="text-[13px] font-medium mb-1.5 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-accent" /> Company Name <span className="text-destructive text-xs">*</span>
                  </label>
                  <Input
                    placeholder="Acme Corp"
                    value={form.company_name}
                    onChange={e => update("company_name", e.target.value)}
                    className="h-11 rounded-xl bg-secondary border-border text-sm"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="text-[13px] font-medium mb-1.5 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-success" /> Website URL <span className="text-destructive text-xs">*</span>
                  </label>
                  <Input
                    placeholder="https://yourcompany.com"
                    value={form.company_url}
                    onChange={e => update("company_url", e.target.value)}
                    className="h-11 rounded-xl bg-secondary border-border text-sm"
                  />
                </div>

                <div>
                  <label className="text-[13px] font-medium mb-1.5 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-primary" /> What does your company do?
                  </label>
                  <Textarea
                    placeholder="We help companies automate their sales outreach using AI..."
                    value={form.company_description}
                    onChange={e => update("company_description", e.target.value)}
                    className="min-h-[90px] rounded-xl bg-secondary border-border text-sm resize-none"
                  />
                </div>
              </motion.div>
            )}

            {/* Step 1: Social Media */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                <div>
                  <h2 className="text-xl font-display font-bold tracking-tight mb-1">Connect your social profiles</h2>
                  <p className="text-sm text-muted-foreground">AI will analyze your social presence to better understand your brand. All optional.</p>
                </div>

                <div className="p-3 rounded-xl bg-primary/5 border border-primary/15 flex items-center gap-2.5">
                  <Brain className="w-4 h-4 text-primary shrink-0" />
                  <p className="text-xs text-muted-foreground">The more profiles you connect, the more accurate your AI brand analysis will be.</p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-[13px] font-medium mb-1.5 flex items-center gap-1.5">
                      <Facebook className="w-3.5 h-3.5 text-[hsl(210,80%,51%)]" /> Facebook Page
                    </label>
                    <Input
                      placeholder="facebook.com/yourcompany"
                      value={form.facebook_url}
                      onChange={e => update("facebook_url", e.target.value)}
                      className="h-11 rounded-xl bg-secondary border-border text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-[13px] font-medium mb-1.5 flex items-center gap-1.5">
                      <Instagram className="w-3.5 h-3.5 text-accent" /> Instagram Profile
                    </label>
                    <Input
                      placeholder="instagram.com/yourcompany"
                      value={form.instagram_url}
                      onChange={e => update("instagram_url", e.target.value)}
                      className="h-11 rounded-xl bg-secondary border-border text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-[13px] font-medium mb-1.5 flex items-center gap-1.5">
                      <Linkedin className="w-3.5 h-3.5 text-[hsl(210,80%,51%)]" /> LinkedIn Company Page
                    </label>
                    <Input
                      placeholder="linkedin.com/company/yourcompany"
                      value={form.linkedin_url}
                      onChange={e => update("linkedin_url", e.target.value)}
                      className="h-11 rounded-xl bg-secondary border-border text-sm"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Target Market */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                <div>
                  <h2 className="text-xl font-display font-bold tracking-tight mb-1">Who are your ideal clients?</h2>
                  <p className="text-sm text-muted-foreground">Help AI target the right prospects for your business.</p>
                </div>

                <div>
                  <label className="text-[13px] font-medium mb-1.5 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-destructive" /> Target Location
                  </label>
                  <Input
                    placeholder="e.g. Poland, Europe, USA"
                    value={form.target_location}
                    onChange={e => update("target_location", e.target.value)}
                    className="h-11 rounded-xl bg-secondary border-border text-sm"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="text-[13px] font-medium mb-1.5 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-warning" /> Target Industry
                  </label>
                  <Input
                    placeholder="e.g. SaaS, E-commerce, Manufacturing"
                    value={form.target_industry}
                    onChange={e => update("target_industry", e.target.value)}
                    className="h-11 rounded-xl bg-secondary border-border text-sm"
                  />
                </div>

                <div>
                  <label className="text-[13px] font-medium mb-1.5 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-primary" /> Ideal Client Description
                  </label>
                  <Textarea
                    placeholder="Mid-size B2B companies with 50-500 employees, decision-makers in marketing or sales..."
                    value={form.ideal_client_description}
                    onChange={e => update("ideal_client_description", e.target.value)}
                    className="min-h-[80px] rounded-xl bg-secondary border-border text-sm resize-none"
                  />
                </div>

                <div className="p-4 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/15">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-primary" />
                    <span className="text-[13px] font-semibold">AI Brand Analysis</span>
                  </div>
                  <p className="text-xs text-muted-foreground">After you finish, AI will research your business and create a complete brand profile. This takes about 15 seconds and makes your lead generation much more accurate.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 gap-3">
            {step > 0 ? (
              <Button
                variant="outline"
                onClick={() => setStep(s => s - 1)}
                disabled={analyzing}
                className="h-11 rounded-xl"
              >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
              </Button>
            ) : (
              <div />
            )}

            {step < TOTAL_STEPS - 1 ? (
              <Button
                onClick={() => setStep(s => s + 1)}
                disabled={!canProceed()}
                className="h-11 px-6 rounded-xl bg-gradient-primary text-primary-foreground hover:opacity-90 flex-1 sm:flex-none"
              >
                Continue <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleFinish}
                disabled={analyzing || (!form.target_location && !form.target_industry)}
                className="h-11 px-6 rounded-xl bg-gradient-primary text-primary-foreground hover:opacity-90 flex-1 sm:flex-none"
              >
                {analyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing your brand...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Complete Setup
                  </>
                )}
              </Button>
            )}
          </div>

          {/* Skip option */}
          {step === 1 && (
            <button
              onClick={() => setStep(2)}
              className="w-full text-center text-xs text-muted-foreground hover:text-foreground mt-4 transition-colors"
            >
              Skip for now →
            </button>
          )}
        </div>

        {/* Already have account? */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          Already set up?{" "}
          <button onClick={() => navigate("/dashboard")} className="text-primary hover:underline">
            Go to dashboard
          </button>
        </p>
      </div>
    </div>
  );
};

export default Onboarding;
