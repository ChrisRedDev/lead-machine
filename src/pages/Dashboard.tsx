import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Globe, FileText, MapPin, Building, Users, Loader2, Sparkles, Brain, Target, CheckCircle, Rocket } from "lucide-react";
import { toast } from "sonner";

type GenerationStep = "form" | "generating" | "done";

const statusMessages = [
  { icon: Globe, text: "Analyzing your business..." },
  { icon: Brain, text: "Identifying ideal customer profile..." },
  { icon: Target, text: "Scanning market for prospects..." },
  { icon: Sparkles, text: "Matching best prospects..." },
];

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<GenerationStep>("form");
  const [currentStatus, setCurrentStatus] = useState(0);
  const [form, setForm] = useState({
    companyUrl: "",
    description: "",
    targetLocation: "",
    targetIndustry: "",
    idealClient: "",
  });

  const handleGenerate = async () => {
    if (!form.companyUrl || !form.description) {
      toast.error("Please fill in your company URL and description.");
      return;
    }

    setStep("generating");
    setCurrentStatus(0);

    // Progress through statuses
    const statusInterval = setInterval(() => {
      setCurrentStatus((prev) => {
        if (prev >= statusMessages.length - 1) {
          clearInterval(statusInterval);
          return prev;
        }
        return prev + 1;
      });
    }, 3000);

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

      // Save export
      const leads = data?.leads || [];
      await supabase.from("lead_exports").insert({
        user_id: user!.id,
        name: `Leads for ${form.companyUrl}`,
        leads: leads,
        lead_count: leads.length,
      });

      // Update profile with form data
      await supabase.from("profiles").update({
        company_url: form.companyUrl,
        company_description: form.description,
        target_location: form.targetLocation,
        target_industry: form.targetIndustry,
        ideal_client_description: form.idealClient,
      }).eq("user_id", user!.id);

      setStep("done");
      toast.success(`Generated ${leads.length} leads!`);

      // Navigate to exports after brief delay
      setTimeout(() => navigate("/dashboard/exports"), 1500);
    } catch (err: any) {
      clearInterval(statusInterval);
      console.error("Generation error:", err);
      toast.error(err.message || "Failed to generate leads. Please try again.");
      setStep("form");
    }
  };

  return (
    <>
      <DashboardHeader title="Generate Leads" />
      <main className="p-4 lg:p-6 max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          {step === "form" && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-xl font-display font-bold tracking-tight mb-1">Generate Leads</h2>
                <p className="text-sm text-muted-foreground">Tell us about your business and we'll find your ideal prospects.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[13px] font-medium mb-1.5 block">Company Website *</label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="https://yourcompany.com"
                      value={form.companyUrl}
                      onChange={(e) => setForm({ ...form, companyUrl: e.target.value })}
                      className="pl-10 h-11 rounded-xl bg-secondary/30 border-border/50 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[13px] font-medium mb-1.5 block">What does your company do? *</label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Textarea
                      placeholder="We help SaaS companies increase their conversion rates through AI-powered A/B testing..."
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      className="pl-10 min-h-[80px] rounded-xl bg-secondary/30 border-border/50 text-sm resize-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[13px] font-medium mb-1.5 block">Target Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="e.g. United States, Europe"
                        value={form.targetLocation}
                        onChange={(e) => setForm({ ...form, targetLocation: e.target.value })}
                        className="pl-10 h-11 rounded-xl bg-secondary/30 border-border/50 text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[13px] font-medium mb-1.5 block">Target Industry</label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="e.g. SaaS, Healthcare"
                        value={form.targetIndustry}
                        onChange={(e) => setForm({ ...form, targetIndustry: e.target.value })}
                        className="pl-10 h-11 rounded-xl bg-secondary/30 border-border/50 text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[13px] font-medium mb-1.5 block">Ideal Client Description</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Textarea
                      placeholder="Mid-size B2B companies with 50-500 employees looking to improve their marketing..."
                      value={form.idealClient}
                      onChange={(e) => setForm({ ...form, idealClient: e.target.value })}
                      className="pl-10 min-h-[70px] rounded-xl bg-secondary/30 border-border/50 text-sm resize-none"
                    />
                  </div>
                </div>
              </div>

              <Button
                onClick={handleGenerate}
                disabled={!form.companyUrl || !form.description}
                className="w-full h-12 rounded-xl text-sm font-medium bg-foreground text-background hover:bg-foreground/90 transition-all"
              >
                Generate Leads
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </motion.div>
          )}

          {step === "generating" && (
            <motion.div
              key="generating"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <div className="relative mb-8">
                <div className="w-16 h-16 rounded-full border-2 border-primary/20 flex items-center justify-center">
                  <Loader2 className="w-7 h-7 text-primary animate-spin" />
                </div>
                <div className="absolute inset-0 rounded-full bg-primary/5 animate-ping" />
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStatus}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  {(() => {
                    const StatusIcon = statusMessages[currentStatus].icon;
                    return <StatusIcon className="w-4 h-4 text-primary" />;
                  })()}
                  <span>{statusMessages[currentStatus].text}</span>
                </motion.div>
              </AnimatePresence>

              {/* Progress dots */}
              <div className="flex gap-1.5 mt-6">
                {statusMessages.map((_, i) => (
                  <div
                    key={i}
                    className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                      i <= currentStatus ? "bg-primary" : "bg-secondary"
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {step === "done" && (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-5">
                <CheckCircle className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-lg font-display font-bold mb-1">Leads Generated!</h3>
              <p className="text-sm text-muted-foreground">Redirecting to your exports...</p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </>
  );
};

export default Dashboard;
