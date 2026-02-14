import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import {
    TrendingUp,
    Users,
    CheckCircle,
    Calendar,
    Star,
    Building,
    Mail,
    Phone,
    ExternalLink,
    Filter,
    Download,
    Sparkles,
    ArrowUpRight,
    ArrowDownRight
} from "lucide-react";
import { toast } from "sonner";

const DashboardHome = () => {
    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState("");

    // Mock data - replace with real data from your backend
    const stats = [
        {
            label: "Total Leads",
            value: 128,
            change: "+5.5%",
            trend: "up",
            subValue: "+41",
            icon: TrendingUp,
            color: "text-primary"
        },
        {
            label: "Leads Contacted",
            value: 98,
            change: "+5.5%",
            trend: "up",
            subValue: "+41",
            icon: Users,
            color: "text-success"
        },
        {
            label: "Qualified Leads",
            value: 47,
            change: "+47",
            trend: "up",
            subValue: "+41",
            icon: CheckCircle,
            color: "text-warning"
        },
        {
            label: "Appointments Set",
            value: 16,
            change: "+12",
            trend: "up",
            subValue: "+7",
            icon: Calendar,
            color: "text-accent"
        }
    ];

    const mockLeads = [
        {
            id: 1,
            name: "Henrik Vlaas",
            company: "FlexiTech",
            role: "CTO",
            email: "henrik@flexitech.com",
            phone: "+1 535 041 6820",
            score: 90,
            status: "Highly Interested",
            statusColor: "bg-purple-500/10 text-purple-500",
            avatar: "HV",
            companyLogo: "🏢"
        },
        {
            id: 2,
            name: "Bryan Steen",
            company: "Alignware",
            role: "CEO",
            email: "bryan@alignware.com",
            phone: "+1 535 391 5272",
            score: 89,
            status: "Interested",
            statusColor: "bg-blue-500/10 text-blue-500",
            avatar: "BS",
            companyLogo: "⚡"
        },
        {
            id: 3,
            name: "Pieter Merten",
            company: "Cloudnetics",
            role: "VP Sales",
            email: "pieter@cloudnetics.com",
            phone: "+1 535 892 1475",
            score: 82,
            status: "Interested",
            statusColor: "bg-blue-500/10 text-blue-500",
            avatar: "PM",
            companyLogo: "☁️"
        },
        {
            id: 4,
            name: "Milena Fox",
            company: "Nitrolytics",
            role: "Marketing Director",
            email: "milena@nitrolytics.com",
            phone: "+1 535 225 6616",
            score: 79,
            status: "Interested",
            statusColor: "bg-blue-500/10 text-blue-500",
            avatar: "MF",
            companyLogo: "🚀"
        },
        {
            id: 5,
            name: "Sarah Chen",
            company: "DataFlow",
            role: "Head of Operations",
            email: "sarah@dataflow.com",
            phone: "+1 535 734 9921",
            score: 85,
            status: "Highly Interested",
            statusColor: "bg-purple-500/10 text-purple-500",
            avatar: "SC",
            companyLogo: "💧"
        },
        {
            id: 6,
            name: "James Wilson",
            company: "TechForward",
            role: "Product Manager",
            email: "james@techforward.com",
            phone: "+1 535 442 8831",
            score: 76,
            status: "Contacted",
            statusColor: "bg-green-500/10 text-green-500",
            avatar: "JW",
            companyLogo: "🎯"
        }
    ];

    // Chart data - simple visualization
    const chartPoints = [0, 45, 40, 85, 70, 95, 85, 110, 95, 130];

    const filteredLeads = mockLeads.filter(lead =>
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.company.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getScoreColor = (score: number) => {
        if (score >= 85) return "text-success";
        if (score >= 70) return "text-warning";
        return "text-muted-foreground";
    };

    return (
        <>
            <DashboardHeader title="Lead Generation Overview" />
            <main className="p-4 lg:p-6 max-w-7xl mx-auto space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Card className="p-5 border-border hover-lift">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{stat.label}</p>
                                        <p className="text-3xl font-bold">{stat.value}</p>
                                    </div>
                                    <div className={`w-10 h-10 rounded-xl bg-gradient-primary/10 flex items-center justify-center`}>
                                        <stat.icon className={`w-5 h-5 ${stat.color}`} />
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`text-sm font-medium ${stat.trend === 'up' ? 'text-success' : 'text-destructive'} flex items-center gap-1`}>
                                        {stat.trend === 'up' ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                                        {stat.change}
                                    </span>
                                    <span className="text-xs text-muted-foreground">{stat.subValue} this month</span>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* Performance Chart + Top Lead */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Chart */}
                    <Card className="lg:col-span-2 p-6 border-border">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-lg font-semibold mb-1">Leads Performance</h3>
                                <p className="text-sm text-muted-foreground">Last 30 Days</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button size="sm" variant="outline" className="h-8 rounded-lg text-xs">
                                    Average
                                </Button>
                                <Button size="sm" variant="ghost" className="h-8 rounded-lg text-xs">
                                    Total
                                </Button>
                            </div>
                        </div>

                        {/* Simple SVG Chart */}
                        <div className="h-64 relative">
                            <svg width="100%" height="100%" viewBox="0 0 600 200" preserveAspectRatio="none">
                                {/* Grid lines */}
                                <line x1="0" y1="50" x2="600" y2="50" stroke="currentColor" strokeWidth="0.5" className="text-border" opacity="0.3" />
                                <line x1="0" y1="100" x2="600" y2="100" stroke="currentColor" strokeWidth="0.5" className="text-border" opacity="0.3" />
                                <line x1="0" y1="150" x2="600" y2="150" stroke="currentColor" strokeWidth="0.5" className="text-border" opacity="0.3" />

                                {/* Gradient */}
                                <defs>
                                    <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                        <stop offset="0%" stopColor="rgb(139, 92, 246)" stopOpacity="0.3" />
                                        <stop offset="100%" stopColor="rgb(139, 92, 246)" stopOpacity="0.0" />
                                    </linearGradient>
                                </defs>

                                {/* Area */}
                                <path
                                    d={`M 0,${200 - chartPoints[0] * 1.3} ${chartPoints.map((point, i) => `L ${i * 66},${200 - point * 1.3}`).join(' ')} L ${chartPoints.length * 66},200 L 0,200 Z`}
                                    fill="url(#chartGradient)"
                                />

                                {/* Line */}
                                <path
                                    d={`M 0,${200 - chartPoints[0] * 1.3} ${chartPoints.map((point, i) => `L ${i * 66},${200 - point * 1.3}`).join(' ')}`}
                                    fill="none"
                                    stroke="rgb(139, 92, 246)"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />

                                {/* Points */}
                                {chartPoints.map((point, i) => (
                                    <circle
                                        key={i}
                                        cx={i * 66}
                                        cy={200 - point * 1.3}
                                        r="4"
                                        fill="rgb(139, 92, 246)"
                                        className="hover:r-6 transition-all cursor-pointer"
                                    />
                                ))}
                            </svg>
                        </div>

                        {/* Stats below chart */}
                        <div className="grid grid-cols-4 gap-4 mt-6 pt-4 border-t border-border">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-primary">80</p>
                                <p className="text-xs text-muted-foreground mt-1">Avg AI Score</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-success">84</p>
                                <p className="text-xs text-muted-foreground mt-1">Conversion Rate</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-warning">38</p>
                                <p className="text-xs text-muted-foreground mt-1">Qualified</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-accent">12</p>
                                <p className="text-xs text-muted-foreground mt-1">Appointments</p>
                            </div>
                        </div>
                    </Card>

                    {/* Top Lead Highlight */}
                    <Card className="p-6 border-border relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-primary/5 rounded-full -mr-16 -mt-16" />

                        <div className="flex items-center gap-2 mb-4">
                            <Star className="w-4 h-4 text-warning fill-warning" />
                            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Top Lead</span>
                        </div>

                        <div className="relative">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center text-xl font-bold text-primary-foreground mb-4">
                                HV
                            </div>

                            <h3 className="text-xl font-bold mb-1">Hailey Thompson</h3>
                            <p className="text-sm text-muted-foreground mb-1">InspireTech</p>
                            <p className="text-xs text-muted-foreground mb-4">www.appointmentmachines.tech</p>

                            <div className="flex items-center gap-2 mb-6">
                                <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-success/10">
                                    <div className="w-2 h-2 rounded-full bg-success" />
                                    <span className="text-xs font-medium text-success">Highly Interested</span>
                                </div>
                                <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-warning/10">
                                    <Sparkles className="w-3 h-3 text-warning" />
                                    <span className="text-xl font-bold text-warning">92</span>
                                </div>
                            </div>

                            <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Building className="w-4 h-4" />
                                    <span>Marketing Manager</span>
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Mail className="w-4 h-4" />
                                    <span className="text-xs">hailey@inspiretech.io</span>
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Phone className="w-4 h-4" />
                                    <span className="text-xs">+1 555 923 6821</span>
                                </div>
                            </div>

                            <Button className="w-full mt-6 h-10 rounded-xl bg-gradient-primary">
                                View Full Profile
                            </Button>
                        </div>
                    </Card>
                </div>

                {/* Recent Leads Table */}
                <Card className="p-6 border-border">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-semibold mb-1">Recent Leads</h3>
                            <p className="text-sm text-muted-foreground">Your latest qualified prospects</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Input
                                placeholder="Search leads..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-64 h-9 rounded-xl bg-secondary border-border"
                            />
                            <Button size="sm" variant="outline" className="h-9 rounded-xl">
                                <Filter className="w-4 h-4 mr-2" />
                                Filter
                            </Button>
                            <Button size="sm" variant="outline" className="h-9 rounded-xl">
                                <Download className="w-4 h-4 mr-2" />
                                Export
                            </Button>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="space-y-2">
                        {/* Header */}
                        <div className="grid grid-cols-12 gap-4 px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            <div className="col-span-3">Name</div>
                            <div className="col-span-2">Company</div>
                            <div className="col-span-2">Score</div>
                            <div className="col-span-2">Status</div>
                            <div className="col-span-3">Contact</div>
                        </div>

                        {/* Rows */}
                        {filteredLeads.map((lead, i) => (
                            <motion.div
                                key={lead.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="grid grid-cols-12 gap-4 px-4 py-3 rounded-xl hover:bg-secondary/50 transition-colors items-center border border-transparent hover:border-border"
                            >
                                {/* Name */}
                                <div className="col-span-3 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center text-sm font-bold text-primary-foreground">
                                        {lead.avatar}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold">{lead.name}</p>
                                        <p className="text-xs text-muted-foreground">{lead.role}</p>
                                    </div>
                                </div>

                                {/* Company */}
                                <div className="col-span-2 flex items-center gap-2">
                                    <span className="text-xl">{lead.companyLogo}</span>
                                    <span className="text-sm font-medium">{lead.company}</span>
                                </div>

                                {/* Score */}
                                <div className="col-span-2">
                                    <div className="flex items-center gap-2">
                                        <Sparkles className={`w-4 h-4 ${getScoreColor(lead.score)}`} />
                                        <span className={`text-2xl font-bold ${getScoreColor(lead.score)}`}>{lead.score}</span>
                                    </div>
                                </div>

                                {/* Status */}
                                <div className="col-span-2">
                                    <span className={`px-3 py-1.5 rounded-lg text-xs font-medium ${lead.statusColor}`}>
                                        {lead.status}
                                    </span>
                                </div>

                                {/* Contact */}
                                <div className="col-span-3 flex items-center gap-2 text-xs text-muted-foreground">
                                    <span>{lead.phone}</span>
                                    <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                                        <ExternalLink className="w-3.5 h-3.5" />
                                    </Button>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* View All */}
                    <div className="mt-6 text-center">
                        <Button variant="outline" className="h-10 rounded-xl">
                            View All Leads
                            <ArrowUpRight className="w-4 h-4 ml-2" />
                        </Button>
                    </div>
                </Card>
            </main>
        </>
    );
};

export default DashboardHome;
