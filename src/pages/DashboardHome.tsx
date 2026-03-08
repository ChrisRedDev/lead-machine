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
    Brain, Globe, Target, Gift
} from "lucide-react";
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, BarChart, Bar
} from "recharts";

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

// Custom tooltip for recharts
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="rounded-xl border border-border bg-card px-3 py-2 shadow-lg text-xs">
                <p className="text-muted-foreground mb-1">{label}</p>
                <p className="font-bold text-primary">{payload[0].value} leads</p>
            </div>
        );
    }
    return null;
};

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
    const [chartData, setChartData] = useState<{ name: string; leads: number }[]>([]);

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

                // Build chart data from last 7 exports (or fill with placeholders)
                const last7 = [...rows].reverse().slice(-7);
                const data = last7.map((r, i) => ({
                    name: new Date(r.created_at).toLocaleDateString("en", { month: "short", day: "numeric" }),
                    leads: r.lead_count || 0,
                }));
                // If less than 7, pad with zeros at the start
                while (data.length < 7) {
                    data.unshift({ name: `—`, leads: 0 });
                }
                setChartData(data);
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

    const getScoreBadge = (score?: number | string) => {
        const n = parseInt(String(score || 0));
        if (n >= 90) return "bg-success/10 text-success border-success/25";
        if (n >= 80) return "bg-primary/10 text-primary border-primary/25";
        if (n >= 70) return "bg-warning/10 text-warning border-warning/25";
        return "bg-muted text-muted-foreground border-border";
    };

    const getScoreLabel = (score?: number | string) => {
        const n = parseInt(String(score || 0));
        if (n >= 90) return "High";
        if (n >= 80) return "Good";
        if (n >= 70) return "Medium";
        return "Low";
    };

    const stats = [
        { label: "Total Leads", value: totalLeads, icon: TrendingUp, color: "text-primary", trend: "+12%" },
        { label: "Total Exports", value: totalExports, icon: FileSpreadsheet, color: "text-success", trend: `${totalExports} runs` },
        { label: "Credits Used", value: credits?.total_used ?? 0, icon: Zap, color: "text-warning", trend: "this period" },
        { label: "Credits Left", value: credits?.balance ?? 0, icon: Sparkles, color: "text-accent", trend: "available" },
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
            <DashboardHeader title="Dashboard" />
            <main className="p-4 lg:p-6 max-w-7xl mx-auto space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {stats.map((stat, i) => (
                        <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                            <Card className="p-5 border-border hover:border-border/80 transition-all">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{stat.label}</p>
                                        {loading
                                            ? <div className="h-8 w-16 bg-secondary rounded-lg animate-pulse" />
                                            : <p className="text-3xl font-bold">{stat.value.toLocaleString()}</p>
                                        }
                                    </div>
                                    <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                                        <stat.icon className={`w-4 h-4 ${stat.color}`} />
                                    </div>
                                </div>
                                <p className="text-[11px] text-muted-foreground">{stat.trend}</p>
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

                {/* Recharts Area Chart + Quick Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                    <Card className="lg:col-span-2 p-6 border-border">
                        <div className="flex items-center justify-between mb-5">
                            <div>
                                <h3 className="text-[15px] font-semibold">Leads Per Export</h3>
                                <p className="text-xs text-muted-foreground">Last {chartData.length} generation runs</p>
                            </div>
                            <span className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-semibold">
                                {totalLeads} total
                            </span>
                        </div>
                        {loading ? (
                            <div className="h-48 bg-secondary animate-pulse rounded-xl" />
                        ) : (
                            <ResponsiveContainer width="100%" height={180}>
                                <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="leadGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="hsl(234,89%,64%)" stopOpacity={0.28} />
                                            <stop offset="95%" stopColor="hsl(234,89%,64%)" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.4} />
                                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} allowDecimals={false} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Area
                                        type="monotone"
                                        dataKey="leads"
                                        stroke="hsl(234,89%,64%)"
                                        strokeWidth={2.5}
                                        fill="url(#leadGrad)"
                                        dot={{ fill: "hsl(234,89%,64%)", strokeWidth: 0, r: 4 }}
                                        activeDot={{ r: 6, fill: "hsl(234,89%,64%)" }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        )}
                        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-border">
                            <div className="text-center">
                                <p className="text-xl font-bold text-primary">{totalLeads}</p>
                                <p className="text-[11px] text-muted-foreground mt-0.5">Total Leads</p>
                            </div>
                            <div className="text-center">
                                <p className="text-xl font-bold text-success">{totalExports}</p>
                                <p className="text-[11px] text-muted-foreground mt-0.5">Exports</p>
                            </div>
                            <div className="text-center">
                                <p className="text-xl font-bold text-warning">{credits?.balance ?? 0}</p>
                                <p className="text-[11px] text-muted-foreground mt-0.5">Credits Left</p>
                            </div>
                        </div>
                    </Card>

                    {/* Quick actions + credits */}
                    <div className="flex flex-col gap-4">
                        <Card className="p-5 border-border flex-1">
                            <h3 className="text-[14px] font-semibold mb-4">Quick Actions</h3>
                            <div className="space-y-2.5">
                                <Button className="w-full h-10 rounded-xl bg-gradient-primary text-primary-foreground text-sm" onClick={() => navigate("/dashboard/generate")}>
                                    <Sparkles className="w-4 h-4 mr-2" /> Generate New Leads
                                </Button>
                                <Button variant="outline" className="w-full h-10 rounded-xl text-sm" onClick={() => navigate("/dashboard/pipeline")}>
                                    <Target className="w-4 h-4 mr-2" /> Open Pipeline
                                </Button>
                                <Button variant="outline" className="w-full h-10 rounded-xl text-sm" onClick={() => navigate("/dashboard/campaigns")}>
                                    <Mail className="w-4 h-4 mr-2" /> Campaigns
                                </Button>
                                <Button variant="outline" className="w-full h-10 rounded-xl text-sm" onClick={() => navigate("/dashboard/exports")}>
                                    <FileSpreadsheet className="w-4 h-4 mr-2" /> View Exports
                                </Button>
                            </div>
                        </Card>

                        {credits && (
                            <Card className="p-5 border-border">
                                <div className="flex items-center justify-between mb-3">
                                    <p className="text-[13px] font-semibold">Credit Balance</p>
                                    <span className="text-xs text-muted-foreground">{credits.total_used} used</span>
                                </div>
                                <p className="text-3xl font-bold text-primary mb-2">{credits.balance}</p>
                                <div className="h-1.5 rounded-full bg-border overflow-hidden mb-3">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${Math.min(100, (credits.balance / Math.max(credits.balance + credits.total_used, 1)) * 100)}%` }}
                                        transition={{ duration: 0.8, delay: 0.3 }}
                                        className="h-full rounded-full bg-gradient-primary"
                                    />
                                </div>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="w-full h-8 text-xs rounded-lg"
                                    onClick={() => navigate("/dashboard/credits")}
                                >
                                    <Zap className="w-3 h-3 mr-1.5" /> Get More Credits
                                </Button>
                            </Card>
                        )}

                        {/* Referral mini-card */}
                        <Card
                            className="p-4 border-dashed border-primary/30 bg-primary/5 cursor-pointer hover:bg-primary/10 transition-colors"
                            onClick={() => navigate("/dashboard/referral")}
                        >
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
                                    <Gift className="w-4 h-4 text-primary" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-primary">Earn Free Credits</p>
                                    <p className="text-[11px] text-muted-foreground">Refer friends → +50 credits each</p>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Recent Leads with AI Score Badges */}
                <Card className="p-6 border-border">
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <h3 className="text-[15px] font-semibold">Recent Leads</h3>
                            <p className="text-xs text-muted-foreground">
                                {latestExportName ? `From: ${latestExportName}` : "Your latest AI-generated prospects"}
                            </p>
                        </div>
                        <Button size="sm" variant="outline" className="h-8 rounded-xl text-xs" onClick={() => navigate("/dashboard/exports")}>
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
                            {recentLeads.map((lead, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -16 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-secondary/40 transition-colors border border-transparent hover:border-border"
                                >
                                    <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center text-sm font-bold shrink-0 text-muted-foreground">
                                        {(lead.company_name || "?")[0].toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold truncate">{lead.company_name}</p>
                                        <p className="text-xs text-muted-foreground truncate">{lead.contact_person} · {lead.role}</p>
                                    </div>
                                    {/* AI Score Badge */}
                                    {lead.score && (
                                        <span className={`shrink-0 text-[11px] font-bold px-2 py-0.5 rounded-full border ${getScoreBadge(lead.score)}`}>
                                            {getScoreLabel(lead.score)} · {lead.score}
                                        </span>
                                    )}
                                    <div className="flex items-center gap-1 shrink-0">
                                        {lead.email && (
                                            <button
                                                title={lead.email}
                                                onClick={() => { navigator.clipboard.writeText(lead.email); }}
                                                className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-border transition-colors"
                                            >
                                                <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                                            </button>
                                        )}
                                        {lead.website && (
                                            <a
                                                href={lead.website.startsWith("http") ? lead.website : `https://${lead.website}`}
                                                target="_blank" rel="noopener noreferrer"
                                                className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-border transition-colors"
                                            >
                                                <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
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
