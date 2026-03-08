import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
    TrendingUp, Users, FileSpreadsheet, Sparkles,
    Mail, ExternalLink, ArrowUpRight, Loader2, Zap, CheckCircle2, Circle,
    Brain, Globe, Target
} from "lucide-react";

interface Lead {
    company_name: string;
    contact_person: string;
    role: string;
    website: string;
    email: string;
    phone: string;
    industry: string;
    score?: number | string;
    fit_reason?: string;
}

interface ExportRow {
    id: string;
    name: string;
    leads: Lead[];
    lead_count: number;
    created_at: string;
}

const DashboardHome = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [totalLeads, setTotalLeads] = useState(0);
    const [totalExports, setTotalExports] = useState(0);
    const [credits, setCredits] = useState<{ balance: number; total_used: number } | null>(null);
    const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
    const [latestExportName, setLatestExportName] = useState("");
    const [profile, setProfile] = useState<any>(null);

    useEffect(() => {
        if (!user) return;
        const fetchData = async () => {
            const [exportsRes, creditsRes, profileRes] = await Promise.all([
                supabase.from("lead_exports").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
                supabase.from("credits").select("balance, total_used").eq("user_id", user.id).single(),
                supabase.from("profiles").select("company_url, company_name, brand_analysis, facebook_url, instagram_url, linkedin_url").eq("user_id", user.id).single(),
            ]);

            if (exportsRes.data) {
                const rows = (exportsRes.data as unknown) as ExportRow[];
                setTotalExports(rows.length);
                const sum = rows.reduce((acc, r) => acc + (r.lead_count || 0), 0);
                setTotalLeads(sum);
                if (rows[0]) {
                    setLatestExportName(rows[0].name);
                    const leads = (rows[0].leads as unknown as Lead[]) || [];
                    setRecentLeads(leads.slice(0, 6));
                }
            }
            if (creditsRes.data) setCredits(creditsRes.data);
            if (profileRes.data) setProfile(profileRes.data);
            setLoading(false);
        };
        fetchData();
    }, [user]);

    const getScoreColor = (score?: number | string) => {
        const n = parseInt(String(score || 0));
        if (n >= 90) return "text-success";
        if (n >= 80) return "text-primary";
        if (n >= 70) return "text-warning";
        return "text-muted-foreground";
    };

    const getScoreBg = (score?: number | string) => {
        const n = parseInt(String(score || 0));
        if (n >= 90) return "bg-success/10 border-success/30";
        if (n >= 80) return "bg-primary/10 border-primary/30";
        if (n >= 70) return "bg-warning/10 border-warning/30";
        return "bg-muted border-border";
    };

    const chartPoints = [0, 15, 10, 35, 25, 55, 45, 70, 60, Math.min(totalLeads, 130)];

    const stats = [
        { label: "Total Leads", value: totalLeads, icon: TrendingUp, color: "text-primary" },
        { label: "Total Exports", value: totalExports, icon: FileSpreadsheet, color: "text-success" },
        { label: "Credits Used", value: credits?.total_used ?? 0, icon: Zap, color: "text-warning" },
        { label: "Credits Left", value: credits?.balance ?? 0, icon: Sparkles, color: "text-accent" },
    ];

    // Onboarding checklist
    const onboardingSteps = [
        { label: "Account created", done: true, icon: CheckCircle2 },
        { label: "Website added", done: !!profile?.company_url, icon: Globe, action: "/dashboard/research" },
        { label: "AI brand analysis done", done: !!(profile as any)?.brand_analysis, icon: Brain, action: "/dashboard/research" },
        { label: "First leads generated", done: totalLeads > 0, icon: Target, action: "/dashboard/generate" },
    ];
    const allDone = onboardingSteps.every(s => s.done);
    const doneCount = onboardingSteps.filter(s => s.done).length;

    return (
        <>
            <DashboardHeader title="Lead Generation Overview" />
            <main className="p-4 lg:p-6 max-w-7xl mx-auto space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((stat, i) => (
                        <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                            <Card className="p-5 border-border hover-lift">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{stat.label}</p>
                                        {loading
                                            ? <div className="h-8 w-16 bg-secondary rounded-lg animate-pulse" />
                                            : <p className="text-3xl font-bold">{stat.value}</p>
                                        }
                                    </div>
                                    <div className="w-10 h-10 rounded-xl bg-gradient-primary/10 flex items-center justify-center">
                                        <stat.icon className={`w-5 h-5 ${stat.color}`} />
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* Onboarding checklist (hide when all done) */}
                {!loading && !allDone && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25 }}
                    >
                        <Card className="p-5 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="text-sm font-display font-semibold">Getting Started</h3>
                                    <p className="text-xs text-muted-foreground">{doneCount} of {onboardingSteps.length} steps complete</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-1.5 w-24 rounded-full bg-border overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(doneCount / onboardingSteps.length) * 100}%` }}
                                            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
                                            className="h-full rounded-full bg-gradient-primary"
                                        />
                                    </div>
                                    <span className="text-xs font-semibold text-primary">{Math.round((doneCount / onboardingSteps.length) * 100)}%</span>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                {onboardingSteps.map((step, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.3 + i * 0.07 }}
                                        onClick={() => step.action && !step.done && navigate(step.action)}
                                        className={`flex items-center gap-2 p-3 rounded-xl border transition-colors ${step.done ? "bg-success/8 border-success/20" : step.action ? "border-border hover:bg-secondary/80 cursor-pointer" : "border-border opacity-60"}`}
                                    >
                                        {step.done
                                            ? <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                                            : <Circle className="w-4 h-4 text-muted-foreground shrink-0" />
                                        }
                                        <span className={`text-[11px] font-medium ${step.done ? "text-success" : "text-muted-foreground"}`}>{step.label}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </Card>
                    </motion.div>
                )}

                {/* Chart + CTA */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-2 p-6 border-border">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-lg font-semibold mb-1">Leads Performance</h3>
                                <p className="text-sm text-muted-foreground">Cumulative leads over time</p>
                            </div>
                        </div>
                        <div className="h-48 relative">
                            <svg width="100%" height="100%" viewBox="0 0 600 180" preserveAspectRatio="none">
                                <defs>
                                    <linearGradient id="chartGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                                        <stop offset="0%" stopColor="hsl(234,89%,64%)" stopOpacity="0.25" />
                                        <stop offset="100%" stopColor="hsl(234,89%,64%)" stopOpacity="0" />
                                    </linearGradient>
                                </defs>
                                {[45, 90, 135].map(y => (
                                    <line key={y} x1="0" y1={y} x2="600" y2={y} stroke="currentColor" strokeWidth="0.5" className="text-border" opacity="0.4" />
                                ))}
                                <path
                                    d={`M 0,${180 - chartPoints[0] * 1.1} ${chartPoints.map((p, i) => `L ${i * 66},${Math.max(5, 180 - p * 1.1)}`).join(" ")} L ${(chartPoints.length - 1) * 66},180 L 0,180 Z`}
                                    fill="url(#chartGrad)"
                                />
                                <path
                                    d={`M 0,${180 - chartPoints[0] * 1.1} ${chartPoints.map((p, i) => `L ${i * 66},${Math.max(5, 180 - p * 1.1)}`).join(" ")}`}
                                    fill="none" stroke="hsl(234,89%,64%)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                                />
                                {chartPoints.map((p, i) => (
                                    <circle key={i} cx={i * 66} cy={Math.max(5, 180 - p * 1.1)} r="3.5" fill="hsl(234,89%,64%)" />
                                ))}
                            </svg>
                        </div>
                        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-border">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-primary">{totalLeads}</p>
                                <p className="text-xs text-muted-foreground mt-1">Total Leads</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-success">{totalExports}</p>
                                <p className="text-xs text-muted-foreground mt-1">Exports</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-warning">{credits?.balance ?? 0}</p>
                                <p className="text-xs text-muted-foreground mt-1">Credits Left</p>
                            </div>
                        </div>
                    </Card>

                    {/* Quick actions */}
                    <Card className="p-6 border-border flex flex-col justify-between">
                        <div>
                            <h3 className="text-lg font-semibold mb-1">Quick Actions</h3>
                            <p className="text-sm text-muted-foreground mb-6">Jump right in</p>
                            <div className="space-y-3">
                                <Button className="w-full h-11 rounded-xl bg-gradient-primary text-primary-foreground" onClick={() => navigate("/dashboard/generate")}>
                                    <Sparkles className="w-4 h-4 mr-2" /> Generate New Leads
                                </Button>
                                <Button variant="outline" className="w-full h-11 rounded-xl" onClick={() => navigate("/dashboard/exports")}>
                                    <FileSpreadsheet className="w-4 h-4 mr-2" /> View Exports
                                </Button>
                                <Button variant="outline" className="w-full h-11 rounded-xl" onClick={() => navigate("/dashboard/research")}>
                                    <Brain className="w-4 h-4 mr-2" /> Brand Intelligence
                                </Button>
                            </div>
                        </div>
                        {credits && (
                            <div className="mt-6 p-4 rounded-xl bg-secondary border border-border">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-medium text-muted-foreground">Credits</span>
                                    <span className="text-xs font-bold">{credits.balance} left</span>
                                </div>
                                <div className="h-1.5 rounded-full bg-border overflow-hidden">
                                    <div
                                        className="h-full rounded-full bg-gradient-primary transition-all duration-700"
                                        style={{ width: `${Math.min(100, (credits.balance / (credits.balance + credits.total_used || 1)) * 100)}%` }}
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground mt-1.5">{credits.total_used} used this period</p>
                            </div>
                        )}
                    </Card>
                </div>

                {/* Recent Leads */}
                <Card className="p-6 border-border">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-semibold mb-1">Recent Leads</h3>
                            <p className="text-sm text-muted-foreground">
                                {latestExportName ? `From: ${latestExportName}` : "Your latest AI-generated prospects"}
                            </p>
                        </div>
                        <Button size="sm" variant="outline" className="h-9 rounded-xl" onClick={() => navigate("/dashboard/exports")}>
                            View All <ArrowUpRight className="w-3.5 h-3.5 ml-1.5" />
                        </Button>
                    </div>

                    {loading ? (
                        <div className="space-y-3">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="h-14 rounded-xl bg-secondary animate-pulse" />
                            ))}
                        </div>
                    ) : recentLeads.length === 0 ? (
                        <div className="py-12 text-center">
                            <Users className="w-8 h-8 mx-auto text-muted-foreground/40 mb-3" />
                            <p className="text-sm text-muted-foreground">No leads yet. Generate your first batch!</p>
                            <Button className="mt-4 rounded-xl bg-gradient-primary text-primary-foreground" onClick={() => navigate("/dashboard/generate")}>
                                <Sparkles className="w-4 h-4 mr-2" /> Generate Leads
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <div className="grid grid-cols-12 gap-3 px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                <div className="col-span-4">Company / Contact</div>
                                <div className="col-span-3">Role</div>
                                <div className="col-span-2">Score</div>
                                <div className="col-span-3">Contact</div>
                            </div>
                            {recentLeads.map((lead, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -16 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="grid grid-cols-12 gap-3 px-4 py-3 rounded-xl hover:bg-secondary/40 transition-colors items-center border border-transparent hover:border-border"
                                >
                                    <div className="col-span-4 flex items-center gap-3 min-w-0">
                                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 ${getScoreBg(lead.score)} ${getScoreColor(lead.score)}`}>
                                            {(lead.company_name || "?")[0].toUpperCase()}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold truncate">{lead.company_name}</p>
                                            <p className="text-xs text-muted-foreground truncate">{lead.contact_person}</p>
                                        </div>
                                    </div>
                                    <div className="col-span-3">
                                        <p className="text-sm text-muted-foreground truncate">{lead.role}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <span className={`inline-flex items-center gap-1 text-sm font-bold ${getScoreColor(lead.score)}`}>
                                            <Sparkles className="w-3 h-3" />
                                            {lead.score || "—"}
                                        </span>
                                    </div>
                                    <div className="col-span-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                                        {lead.email && (
                                            <button
                                                title={lead.email}
                                                onClick={() => { navigator.clipboard.writeText(lead.email); }}
                                                className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-border transition-colors"
                                            >
                                                <Mail className="w-3.5 h-3.5" />
                                            </button>
                                        )}
                                        {lead.website && (
                                            <a
                                                href={lead.website.startsWith("http") ? lead.website : `https://${lead.website}`}
                                                target="_blank" rel="noopener noreferrer"
                                                className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-border transition-colors"
                                            >
                                                <ExternalLink className="w-3.5 h-3.5" />
                                            </a>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </Card>
            </main>
        </>
    );
};

export default DashboardHome;
