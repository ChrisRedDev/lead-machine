import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
    TrendingUp,
    TrendingDown,
    BarChart3,
    PieChart,
    Calendar,
    Download,
    DollarSign,
    Users,
    Target,
    Zap,
    Loader2
} from "lucide-react";
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart as RechartsPie,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts";

const COLORS = ['hsl(234, 89%, 64%)', 'hsl(142, 71%, 45%)', 'hsl(45, 93%, 47%)', 'hsl(0, 84%, 60%)', 'hsl(280, 67%, 57%)'];

const DashboardAnalytics = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [exports, setExports] = useState<any[]>([]);
    const [dateRange, setDateRange] = useState("30");

    useEffect(() => {
        if (user) fetchAnalytics();
    }, [user, dateRange]);

    const fetchAnalytics = async () => {
        setLoading(true);
        const daysAgo = new Date();
        daysAgo.setDate(daysAgo.getDate() - parseInt(dateRange));

        const { data } = await supabase
            .from("lead_exports")
            .select("*")
            .eq("user_id", user!.id)
            .gte("created_at", daysAgo.toISOString())
            .order("created_at", { ascending: true });

        setExports(data || []);
        setLoading(false);
    };

    // Calculate metrics
    const totalLeads = exports.reduce((sum, exp) => sum + (exp.lead_count || 0), 0);
    const avgLeadsPerExport = exports.length > 0 ? Math.round(totalLeads / exports.length) : 0;

    // Calculate average score
    const allLeads = exports.flatMap(exp => exp.leads || []);
    const avgScore = allLeads.length > 0
        ? Math.round(allLeads.reduce((sum: number, lead: any) => sum + (parseInt(lead.score || lead.ai_match || "85")), 0) / allLeads.length)
        : 0;

    // Industry breakdown
    const industryMap: Record<string, number> = {};
    allLeads.forEach((lead: any) => {
        const industry = lead.industry || "Other";
        industryMap[industry] = (industryMap[industry] || 0) + 1;
    });
    const industryData = Object.entries(industryMap)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);

    // Leads over time
    const timelineData = exports.map(exp => ({
        date: new Date(exp.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        leads: exp.lead_count || 0,
        score: Math.round((exp.leads || []).reduce((sum: number, l: any) => sum + parseInt(l.score || "85"), 0) / (exp.leads?.length || 1))
    }));

    // Score distribution
    const scoreRanges = { "90-100": 0, "80-89": 0, "70-79": 0, "60-69": 0, "Below 60": 0 };
    allLeads.forEach((lead: any) => {
        const score = parseInt(lead.score || lead.ai_match || "85");
        if (score >= 90) scoreRanges["90-100"]++;
        else if (score >= 80) scoreRanges["80-89"]++;
        else if (score >= 70) scoreRanges["70-79"]++;
        else if (score >= 60) scoreRanges["60-69"]++;
        else scoreRanges["Below 60"]++;
    });
    const scoreDistribution = Object.entries(scoreRanges).map(([name, value]) => ({ name, value }));

    // ROI estimates
    const costPerLead = 0.79; // $79 / 100 leads
    const estimatedValue = totalLeads * 50; // Assume $50 value per lead
    const totalCost = totalLeads * costPerLead;
    const roi = totalCost > 0 ? Math.round(((estimatedValue - totalCost) / totalCost) * 100) : 0;

    if (loading) {
        return (
            <>
                <DashboardHeader title="Analytics" />
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
            </>
        );
    }

    return (
        <>
            <DashboardHeader title="Analytics & Insights" />
            <main className="p-4 lg:p-6 max-w-7xl mx-auto">
                {/* Controls */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex gap-2">
                        {["7", "30", "90", "365"].map(days => (
                            <Button
                                key={days}
                                size="sm"
                                variant={dateRange === days ? "default" : "outline"}
                                onClick={() => setDateRange(days)}
                                className="h-9 rounded-xl"
                            >
                                {days === "365" ? "1 Year" : `${days} Days`}
                            </Button>
                        ))}
                    </div>
                    <Button size="sm" variant="outline" className="h-9 rounded-xl">
                        <Download className="w-4 h-4 mr-2" />
                        Export Report
                    </Button>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <Card className="p-5 border-border hover-lift">
                            <div className="flex items-center justify-between mb-3">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                    <Users className="w-5 h-5 text-primary" />
                                </div>
                                <TrendingUp className="w-4 h-4 text-success" />
                            </div>
                            <p className="text-2xl font-bold font-display mb-1">{totalLeads.toLocaleString()}</p>
                            <p className="text-sm text-muted-foreground">Total Leads Generated</p>
                        </Card>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                        <Card className="p-5 border-border hover-lift">
                            <div className="flex items-center justify-between mb-3">
                                <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                                    <Target className="w-5 h-5 text-success" />
                                </div>
                                <span className="text-xs text-success font-semibold">Excellent</span>
                            </div>
                            <p className="text-2xl font-bold font-display mb-1">{avgScore}%</p>
                            <p className="text-sm text-muted-foreground">Average Lead Score</p>
                        </Card>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                        <Card className="p-5 border-border hover-lift">
                            <div className="flex items-center justify-between mb-3">
                                <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
                                    <BarChart3 className="w-5 h-5 text-warning" />
                                </div>
                                <span className="text-xs text-muted-foreground">{exports.length} exports</span>
                            </div>
                            <p className="text-2xl font-bold font-display mb-1">{avgLeadsPerExport}</p>
                            <p className="text-sm text-muted-foreground">Avg Leads per Export</p>
                        </Card>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                        <Card className="p-5 border-border hover-lift">
                            <div className="flex items-center justify-between mb-3">
                                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                                    <DollarSign className="w-5 h-5 text-accent" />
                                </div>
                                <TrendingUp className="w-4 h-4 text-success" />
                            </div>
                            <p className="text-2xl font-bold font-display mb-1">{roi}%</p>
                            <p className="text-sm text-muted-foreground">Estimated ROI</p>
                        </Card>
                    </motion.div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Leads Over Time */}
                    <Card className="p-6 border-border">
                        <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-primary" />
                            Lead Generation Trend
                        </h3>
                        <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={timelineData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" style={{ fontSize: '12px' }} />
                                <YAxis stroke="hsl(var(--muted-foreground))" style={{ fontSize: '12px' }} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'hsl(var(--card))',
                                        border: '1px solid hsl(var(--border))',
                                        borderRadius: '8px'
                                    }}
                                />
                                <Legend />
                                <Line type="monotone" dataKey="leads" stroke="hsl(234, 89%, 64%)" strokeWidth={2} name="Leads Generated" />
                            </LineChart>
                        </ResponsiveContainer>
                    </Card>

                    {/* Industry Distribution */}
                    <Card className="p-6 border-border">
                        <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                            <PieChart className="w-4 h-4 text-success" />
                            Top Industries
                        </h3>
                        <ResponsiveContainer width="100%" height={250}>
                            <RechartsPie>
                                <Pie
                                    data={industryData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {industryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </RechartsPie>
                        </ResponsiveContainer>
                    </Card>
                </div>

                {/* Score Distribution */}
                <Card className="p-6 border-border mb-6">
                    <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-warning" />
                        Lead Score Distribution
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={scoreDistribution}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" style={{ fontSize: '12px' }} />
                            <YAxis stroke="hsl(var(--muted-foreground))" style={{ fontSize: '12px' }} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'hsl(var(--card))',
                                    border: '1px solid hsl(var(--border))',
                                    borderRadius: '8px'
                                }}
                            />
                            <Bar dataKey="value" fill="hsl(234, 89%, 64%)" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>

                {/* ROI Breakdown */}
                <Card className="p-6 border-border">
                    <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                        <Zap className="w-4 h-4 text-accent" />
                        ROI Calculator
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="p-4 rounded-xl bg-secondary/50">
                            <p className="text-xs text-muted-foreground mb-1">Total Cost</p>
                            <p className="text-xl font-bold">${totalCost.toFixed(2)}</p>
                        </div>
                        <div className="p-4 rounded-xl bg-secondary/50">
                            <p className="text-xs text-muted-foreground mb-1">Estimated Value</p>
                            <p className="text-xl font-bold text-success">${estimatedValue.toLocaleString()}</p>
                        </div>
                        <div className="p-4 rounded-xl bg-secondary/50">
                            <p className="text-xs text-muted-foreground mb-1">Potential Profit</p>
                            <p className="text-xl font-bold text-primary">${(estimatedValue - totalCost).toLocaleString()}</p>
                        </div>
                        <div className="p-4 rounded-xl bg-gradient-primary">
                            <p className="text-xs text-primary-foreground/80 mb-1">ROI</p>
                            <p className="text-xl font-bold text-primary-foreground">{roi}%</p>
                        </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-4 italic">
                        *Estimates based on $50 average value per lead and ${costPerLead.toFixed(2)} cost per lead
                    </p>
                </Card>
            </main>
        </>
    );
};

export default DashboardAnalytics;
