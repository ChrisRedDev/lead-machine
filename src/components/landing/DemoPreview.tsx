import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const sampleLeads = [
  { company: "Acme Corp", contact: "John Smith", role: "VP Sales", email: "john@acme.com", industry: "SaaS", score: 94 },
  { company: "TechFlow Inc", contact: "Sarah Chen", role: "CTO", email: "sarah@techflow.io", industry: "AI/ML", score: 91 },
  { company: "GrowthLabs", contact: "Mike Torres", role: "CEO", email: "mike@growthlabs.co", industry: "Marketing", score: 89 },
  { company: "DataBridge", contact: "Anna Weber", role: "Head of Ops", email: "anna@databridge.de", industry: "Analytics", score: 87 },
  { company: "CloudScale", contact: "James Park", role: "VP Eng", email: "james@cloudscale.com", industry: "Cloud", score: 86 },
  { company: "NovaPay", contact: "Lisa Müller", role: "CFO", email: "lisa@novapay.com", industry: "FinTech", score: 84 },
  { company: "SwiftHire", contact: "Tom Johnson", role: "CEO", email: "tom@swifthire.io", industry: "HR Tech", score: 83 },
  { company: "EcoVenture", contact: "Maria Garcia", role: "COO", email: "maria@ecoventure.com", industry: "CleanTech", score: 81 },
  { company: "PixelForge", contact: "David Kim", role: "CRO", email: "david@pixelforge.co", industry: "Design", score: 80 },
  { company: "MetricsPro", contact: "Emma Davis", role: "VP Growth", email: "emma@metricspro.io", industry: "Analytics", score: 79 },
];

const blurredLeads = Array.from({ length: 6 }, (_, i) => ({
  company: "████████ ███",
  contact: "████ ██████",
  role: "██ ████",
  email: "████@████.███",
  industry: "██████",
  score: 78 - i,
}));

const getScoreColor = (score: number) => {
  if (score >= 90) return "text-success font-semibold";
  if (score >= 85) return "text-primary font-medium";
  return "text-muted-foreground";
};

const getStatusDot = (score: number) => {
  if (score >= 90) return "bg-success";
  if (score >= 85) return "bg-primary";
  return "bg-warning";
};

const DemoPreview = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <section className="py-28 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-3 tracking-tight">{t("demo.title")}</h2>
          <p className="text-muted-foreground text-sm md:text-base max-w-md mx-auto">{t("demo.subtitle")}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="border border-border rounded-2xl overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-border bg-secondary/80">
                  <th className="text-left font-medium p-3 text-muted-foreground w-8">#</th>
                  <th className="text-left font-medium p-3 text-muted-foreground">Company</th>
                  <th className="text-left font-medium p-3 text-muted-foreground">Contact</th>
                  <th className="text-left font-medium p-3 text-muted-foreground">Role</th>
                  <th className="text-left font-medium p-3 text-muted-foreground">Email</th>
                  <th className="text-left font-medium p-3 text-muted-foreground">Industry</th>
                  <th className="text-left font-medium p-3 text-muted-foreground">AI Match</th>
                </tr>
              </thead>
              <tbody>
                {sampleLeads.map((lead, i) => (
                  <tr
                    key={i}
                    className={`border-b border-border hover:bg-secondary/50 transition-colors ${i % 2 === 0 ? "" : "bg-muted/20"}`}
                  >
                    <td className="p-3 text-muted-foreground/50 text-xs">{i + 1}</td>
                    <td className="p-3 font-medium">
                      <div className="flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${getStatusDot(lead.score)}`} />
                        {lead.company}
                      </div>
                    </td>
                    <td className="p-3 text-muted-foreground">{lead.contact}</td>
                    <td className="p-3 text-muted-foreground">{lead.role}</td>
                    <td className="p-3 text-muted-foreground">{lead.email}</td>
                    <td className="p-3 text-muted-foreground">{lead.industry}</td>
                    <td className="p-3">
                      <span className={getScoreColor(lead.score)}>{lead.score}%</span>
                    </td>
                  </tr>
                ))}
                {blurredLeads.map((lead, i) => (
                  <tr key={`blur-${i}`} className="border-b border-border">
                    <td className="p-3 text-muted-foreground/30 text-xs">{sampleLeads.length + i + 1}</td>
                    <td className="p-3 font-medium blur-[6px] select-none text-muted-foreground/60">{lead.company}</td>
                    <td className="p-3 blur-[6px] select-none text-muted-foreground/40">{lead.contact}</td>
                    <td className="p-3 blur-[6px] select-none text-muted-foreground/40">{lead.role}</td>
                    <td className="p-3 blur-[6px] select-none text-muted-foreground/40">{lead.email}</td>
                    <td className="p-3 blur-[6px] select-none text-muted-foreground/40">{lead.industry}</td>
                    <td className="p-3 blur-[6px] select-none text-muted-foreground/40">{lead.score}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Lock overlay */}
          <div className="relative">
            <div className="absolute -top-32 inset-x-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
            <div className="bg-background border-t border-border p-8 text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-secondary flex items-center justify-center mb-4">
                <Lock className="w-5 h-5 text-primary" />
              </div>
              <p className="text-sm font-medium mb-1">{t("demo.locked", { count: 90 })}</p>
              <p className="text-xs text-muted-foreground mb-5">"{t("results.unlockOnlyVisible")}"</p>
              <Button
                className="h-11 px-8 rounded-xl text-sm font-medium bg-gradient-primary text-primary-foreground hover:opacity-90 transition-opacity"
                onClick={() => navigate("/login")}
              >
                {t("demo.unlock")}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DemoPreview;
