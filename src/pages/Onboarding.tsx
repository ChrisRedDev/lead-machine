import { useState, useEffect, useRef } from "react";
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
  Brain, Loader2, Target, HelpCircle, Check, AlertCircle
} from "lucide-react";
import { toast } from "sonner";

const TOTAL_STEPS = 3;

const SESSION_KEY = "onboarding_form";

const normalizeUrl = (url: string): string => {
  if (!url) return url;
  const trimmed = url.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;
  return `https://${trimmed}`;
};

const isValidUrl = (url: string): boolean => {
  if (!url) return false;
  try {
    const normalized = normalizeUrl(url);
    new URL(normalized);
    return normalized.includes(".");
  } catch {
    return false;
  }
};

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

const AI_STEPS = [
  { icon: Globe, text: "Reading your website…", color: "text-success" },
  { icon: Brain, text: "Analyzing your brand voice…", color: "text-primary" },
  { icon: Target, text: "Building your ICP profile…", color: "text-warning" },
  { icon: Sparkles, text: "Generating brand intelligence…", color: "text-accent" },
  { icon: Check, text: "Brand analysis complete!", color: "text-success" },
];

const AnalyzingScreen = ({ currentStep }: { currentStep: number }) => (
  <motion.div key="analyzing" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
    <div>
      <h2 className="text-xl font-display font-bold tracking-tight mb-1">AI is analyzing your business</h2>
      <p className="text-sm text-muted-foreground">Hang tight — this takes about 15–30 seconds.</p>
    </div>

    {/* Progress ring */}
    <div className="flex items-center justify-center py-4">
      <div className="relative w-20 h-20">
        <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="34" fill="none" stroke="hsl(var(--border))" strokeWidth="4" />
          <motion.circle
            cx="40" cy="40" r="34" fill="none"
            stroke="hsl(var(--primary))" strokeWidth="4"
            strokeDasharray={2 * Math.PI * 34}
            strokeDashoffset={2 * Math.PI * 34 * (1 - Math.min((currentStep + 1) / AI_STEPS.length, 1))}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.6s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          >
            <Sparkles className="w-6 h-6 text-primary" />
          </motion.div>
        </div>
      </div>
    </div>

    <div className="space-y-2">
      {AI_STEPS.map((s, i) => {
        const isDone = i < currentStep;
        const isActive = i === currentStep;
        const isPending = i > currentStep;
        const Icon = s.icon;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: isPending ? 0.3 : 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
            className={`flex items-center gap-3 p-2.5 rounded-xl transition-colors ${isActive ? "bg-primary/10 border border-primary/20" : "border border-transparent"}`}
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${isDone ? "bg-success/20" : isActive ? "bg-primary/20" : "bg-secondary"}`}>
              {isDone
                ? <Check className="w-3 h-3 text-success" />
                : <Icon className={`w-3 h-3 ${isActive ? s.color : "text-muted-foreground"}`} />
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
  </motion.div>
);

const Onboarding = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [analyzing, setAnalyzing] = useState(false);
  const [aiStep, setAiStep] = useState(0);
  const [urlTouched, setUrlTouched] = useState(false);
  const [showSocialTooltip, setShowSocialTooltip] = useState(false);
  const aiIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const savedForm = (() => {
    try { return JSON.parse(sessionStorage.getItem(SESSION_KEY) || "{}"); } catch { return {}; }
  })();

  const [form, setForm] = useState({
    company_name: savedForm.company_name || "",
    company_url: savedForm.company_url || "",
    company_description: savedForm.company_description || "",
    facebook_url: savedForm.facebook_url || "",
    instagram_url: savedForm.instagram_url || "",
    linkedin_url: savedForm.linkedin_url || "",
    target_location: savedForm.target_location || "",
    target_industry: savedForm.target_industry || "",
    ideal_client_description: savedForm.ideal_client_description || "",
  });

  // Persist form to sessionStorage on every change
  useEffect(() => {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(form));
  }, [form]);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("company_url").eq("user_id", user.id).single().then(({ data }) => {
      if (data?.company_url) navigate("/dashboard", { replace: true });
    });
  }, [user, navigate]);

  const update = (field: string, value: string) => setForm(f => ({ ...f, [field]: value }));

  const urlValid = isValidUrl(form.company_url);
  const urlError = urlTouched && form.company_url && !urlValid;

  const handleUrlBlur = () => {
    setUrlTouched(true);
    if (form.company_url && !form.company_url.startsWith("http")) {
      update("company_url", normalizeUrl(form.company_url));
    }
  };

  const handleFinish = async () => {
    setAnalyzing(true);
    setAiStep(0);

    // Start AI step ticker (advance every 6s, stops at step 3 waiting for response)
    let stepCount = 0;
    aiIntervalRef.current = setInterval(() => {
      stepCount += 1;
      if (stepCount < AI_STEPS.length - 1) {
        setAiStep(stepCount);
      } else {
        clearInterval(aiIntervalRef.current!);
      }
    }, 6000);

    try {
      const normalizedUrl = normalizeUrl(form.company_url);

      // Save profile data
      await supabase.from("profiles").update({
        company_name: form.company_name,
        company_url: normalizedUrl,
        company_description: form.company_description,
        facebook_url: form.facebook_url,
        instagram_url: form.instagram_url,
        linkedin_url: form.linkedin_url,
        target_location: form.target_location,
        target_industry: form.target_industry,
        ideal_client_description: form.ideal_client_description,
      } as any).eq("user_id", user!.id);

      // Trigger AI brand analysis and wait for it
      const { error } = await supabase.functions.invoke("analyze-brand", {
        body: {
          company_url: normalizedUrl,
          company_name: form.company_name,
          description: form.company_description,
          facebook_url: form.facebook_url,
          instagram_url: form.instagram_url,
          linkedin_url: form.linkedin_url,
          target_location: form.target_location,
          target_industry: form.target_industry,
        },
      });

      clearInterval(aiIntervalRef.current!);

      if (error) {
        console.error("Brand analysis error:", error);
        // Still allow continue, just without analysis
      }

      // Show completion step briefly
      setAiStep(AI_STEPS.length - 1);
      sessionStorage.removeItem(SESSION_KEY);

      await new Promise(r => setTimeout(r, 1200));
      toast.success("Brand profile created! AI analysis ready.");
      navigate("/dashboard/research", { replace: true });
    } catch (err: any) {
      clearInterval(aiIntervalRef.current!);
      console.error("Onboarding error:", err);
      toast.error("Something went wrong. Please try again.");
      setAnalyzing(false);
    }
  };

  const canProceed = () => {
    if (step === 0) return form.company_name.trim().length > 0 && form.company_url.trim().length > 0 && isValidUrl(form.company_url);
    if (step === 1) return true;
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
          {!analyzing && <StepIndicator current={step} total={TOTAL_STEPS} />}

          <AnimatePresence mode="wait">
            {/* AI Analyzing Screen */}
            {analyzing && <AnalyzingScreen currentStep={aiStep} />}

            {/* Step 0: Company Basics */}
            {!analyzing && step === 0 && (
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
                  <div className="relative">
                    <Input
                      placeholder="yourcompany.com"
                      value={form.company_url}
                      onChange={e => { update("company_url", e.target.value); if (urlTouched) setUrlTouched(false); }}
                      onBlur={handleUrlBlur}
                      className={`h-11 rounded-xl bg-secondary text-sm pr-10 ${urlError ? "border-destructive focus-visible:ring-destructive" : urlValid && form.company_url ? "border-success" : "border-border"}`}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {urlValid && form.company_url
                        ? <CheckCircle className="w-4 h-4 text-success" />
                        : urlError
                          ? <AlertCircle className="w-4 h-4 text-destructive" />
                          : null
                      }
                    </div>
                  </div>
                  {urlError && (
                    <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> Please enter a valid website URL (e.g. yourcompany.com)
                    </p>
                  )}
                  {urlValid && form.company_url && (
                    <p className="text-xs text-success mt-1 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Website URL looks good
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-[13px] font-medium mb-1.5 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-primary" /> What does your company do?
                  </label>
                  <Textarea
                    placeholder="We help companies automate their sales outreach using AI…"
                    value={form.company_description}
                    onChange={e => update("company_description", e.target.value)}
                    className="min-h-[90px] rounded-xl bg-secondary border-border text-sm resize-none"
                  />
                </div>
              </motion.div>
            )}

            {/* Step 1: Social Media */}
            {!analyzing && step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-xl font-display font-bold tracking-tight">Connect your social profiles</h2>
                    <button
                      onMouseEnter={() => setShowSocialTooltip(true)}
                      onMouseLeave={() => setShowSocialTooltip(false)}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <HelpCircle className="w-4 h-4" />
                    </button>
                  </div>
                  <AnimatePresence>
                    {showSocialTooltip && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="mb-2 p-3 rounded-xl bg-popover border border-border text-xs text-muted-foreground shadow-md"
                      >
                        AI reads your social posts and brand voice to better understand who you are, what tone you use, and what your audience looks like — resulting in much more accurate lead targeting.
                      </motion.div>
                    )}
                  </AnimatePresence>
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
            {!analyzing && step === 2 && (
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
                    placeholder="Mid-size B2B companies with 50-500 employees, decision-makers in marketing or sales…"
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
                  <p className="text-xs text-muted-foreground">After you finish, AI will research your business and create a complete brand profile. This takes about 15–30 seconds and significantly improves lead generation accuracy.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          {!analyzing && (
            <div className="flex items-center justify-between mt-8 gap-3">
              {step > 0 ? (
                <Button
                  variant="outline"
                  onClick={() => setStep(s => s - 1)}
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
                  disabled={!form.target_location && !form.target_industry}
                  className="h-11 px-6 rounded-xl bg-gradient-primary text-primary-foreground hover:opacity-90 flex-1 sm:flex-none"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Complete Setup & Analyze
                </Button>
              )}
            </div>
          )}

          {/* Skip option on step 1 */}
          {!analyzing && step === 1 && (
            <button
              onClick={() => setStep(2)}
              className="w-full text-center text-xs text-muted-foreground hover:text-foreground mt-4 transition-colors"
            >
              Skip for now →
            </button>
          )}
        </div>

        {/* Already have account? */}
        {!analyzing && (
          <p className="text-center text-xs text-muted-foreground mt-6">
            Already set up?{" "}
            <button onClick={() => navigate("/dashboard")} className="text-primary hover:underline">
              Go to dashboard
            </button>
          </p>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
