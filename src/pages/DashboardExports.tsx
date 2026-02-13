import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, Download, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

interface Lead {
  company_name: string;
  contact_person: string;
  role: string;
  website: string;
  email: string;
  phone: string;
  industry: string;
  fit_reason: string;
}

interface Export {
  id: string;
  name: string;
  leads: Lead[];
  lead_count: number;
  created_at: string;
}

const DashboardExports = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [exports, setExports] = useState<Export[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedExport, setSelectedExport] = useState<Export | null>(null);

  useEffect(() => {
    if (user) fetchExports();
  }, [user]);

  const fetchExports = async () => {
    const { data, error } = await supabase.from("lead_exports").select("*").eq("user_id", user!.id).order("created_at", { ascending: false });
    if (!error && data) setExports(data as unknown as Export[]);
    setLoading(false);
  };

  const downloadCSV = (exp: Export) => {
    const leads = exp.leads as Lead[];
    if (!leads.length) return;
    const headers = ["Company Name", "Contact Person", "Role", "Website", "Email", "Phone", "Industry", "Fit Reason"];
    const rows = leads.map((l) => [l.company_name, l.contact_person, l.role, l.website, l.email, l.phone, l.industry, l.fit_reason].map((v) => `"${(v || "").replace(/"/g, '""')}"`).join(","));
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${exp.name.replace(/\s+/g, "_")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const deleteExport = async (id: string) => {
    const { error } = await supabase.from("lead_exports").delete().eq("id", id);
    if (!error) {
      setExports((prev) => prev.filter((e) => e.id !== id));
      if (selectedExport?.id === id) setSelectedExport(null);
      toast.success("Export deleted");
    }
  };

  if (loading) return (<><DashboardHeader title={t("dashboard.previousExports")} /><div className="flex items-center justify-center py-20"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div></>);

  return (
    <>
      <DashboardHeader title={t("dashboard.previousExports")} />
      <main className="p-4 lg:p-6">
        {exports.length === 0 ? (
          <div className="border border-border/40 rounded-2xl p-12 text-center">
            <FileSpreadsheet className="w-10 h-10 mx-auto text-muted-foreground/50 mb-3" />
            <h3 className="font-display font-semibold text-[15px] mb-1">{t("results.noExports")}</h3>
            <p className="text-sm text-muted-foreground">{t("results.noExportsDesc")}</p>
          </div>
        ) : selectedExport ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <Button variant="ghost" size="sm" className="text-[13px] mb-1" onClick={() => setSelectedExport(null)}>← {t("common.back")}</Button>
                <h3 className="text-[15px] font-display font-semibold">{selectedExport.name}</h3>
                <p className="text-xs text-muted-foreground">{selectedExport.lead_count} leads · {new Date(selectedExport.created_at).toLocaleDateString()}</p>
              </div>
              <Button size="sm" className="h-9 rounded-xl text-[13px]" onClick={() => downloadCSV(selectedExport)}>
                <Download className="w-3.5 h-3.5 mr-1.5" />{t("results.downloadCsv")}
              </Button>
            </div>
            <div className="border border-border/40 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-[13px]">
                  <thead><tr className="border-b border-border/40 bg-secondary/30">
                    <th className="text-left font-medium p-3">{t("results.company")}</th>
                    <th className="text-left font-medium p-3">{t("results.contact")}</th>
                    <th className="text-left font-medium p-3">{t("results.role")}</th>
                    <th className="text-left font-medium p-3">{t("results.email")}</th>
                    <th className="text-left font-medium p-3">{t("results.industry")}</th>
                    <th className="text-left font-medium p-3">{t("results.fitReason")}</th>
                  </tr></thead>
                  <tbody>
                    {(selectedExport.leads as Lead[]).map((lead, i) => (
                      <tr key={i} className="border-b border-border/30 hover:bg-secondary/20 transition-colors">
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
            </div>
          </motion.div>
        ) : (
          <div className="space-y-2">
            {exports.map((exp) => (
              <div key={exp.id} className="flex items-center justify-between border border-border/40 rounded-xl p-4 hover:bg-secondary/20 transition-colors cursor-pointer" onClick={() => setSelectedExport(exp)}>
                <div>
                  <h4 className="text-[13px] font-medium">{exp.name}</h4>
                  <p className="text-xs text-muted-foreground">{exp.lead_count} leads · {new Date(exp.created_at).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); downloadCSV(exp); }}><Download className="w-3.5 h-3.5" /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={(e) => { e.stopPropagation(); deleteExport(exp.id); }}><Trash2 className="w-3.5 h-3.5" /></Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
};

export default DashboardExports;
