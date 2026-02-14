import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import {
    Mail,
    Send,
    Plus,
    Eye,
    BarChart3,
    Clock,
    Users,
    Zap,
    Copy,
    Trash2,
    Edit,
    Play,
    Pause
} from "lucide-react";
import { toast } from "sonner";

const DashboardCampaigns = () => {
    const { user } = useAuth();
    const [view, setView] = useState<"list" | "create">("list");
    const [campaigns] = useState([
        {
            id: 1,
            name: "Product Launch Campaign",
            subject: "🚀 Introducing Our New Solution",
            status: "active",
            sent: 245,
            opened: 156,
            clicked: 89,
            replied: 23,
            createdAt: "2024-02-10"
        },
        {
            id: 2,
            name: "Follow-up Sequence",
            subject: "Quick Question About {{company_name}}",
            status: "paused",
            sent: 120,
            opened: 78,
            clicked: 34,
            replied: 12,
            createdAt: "2024-02-08"
        }
    ]);

    const [newCampaign, setNewCampaign] = useState({
        name: "",
        subject: "",
        body: ""
    });

    const templates = [
        {
            name: "Cold Outreach",
            subject: "Quick question for {{company_name}}",
            body: "Hi {{contact_name}},\n\nI noticed {{company_name}} is {{fit_reason}}.\n\nWe've helped similar companies in {{industry}} achieve [specific result].\n\nWould you be open to a quick 15-minute call to explore if we could help you too?\n\nBest regards,\n[Your Name]"
        },
        {
            name: "Product Demo",
            subject: "See how we can help {{company_name}}",
            body: "Hi {{contact_name}},\n\nI'd love to show you a quick demo of how [Product] can help {{company_name}} with [specific pain point].\n\nWe've worked with companies like [competitor] and helped them [result].\n\nAre you available for a 10-minute demo this week?\n\nThanks,\n[Your Name]"
        },
        {
            name: "Follow-up",
            subject: "Following up on my previous email",
            body: "Hi {{contact_name}},\n\nI wanted to follow up on my previous email about helping {{company_name}}.\n\nJust wanted to make sure it didn't get buried in your inbox.\n\nWould love to have a quick chat if you're interested.\n\nBest,\n[Your Name]"
        }
    ];

    const handleCreateCampaign = () => {
        if (!newCampaign.name || !newCampaign.subject || !newCampaign.body) {
            toast.error("Please fill in all fields");
            return;
        }
        toast.success("Campaign created successfully!");
        setView("list");
        setNewCampaign({ name: "", subject: "", body: "" });
    };

    const getOpenRate = (sent: number, opened: number) => {
        return sent > 0 ? Math.round((opened / sent) * 100) : 0;
    };

    const getClickRate = (sent: number, clicked: number) => {
        return sent > 0 ? Math.round((clicked / sent) * 100) : 0;
    };

    const getReplyRate = (sent: number, replied: number) => {
        return sent > 0 ? Math.round((replied / sent) * 100) : 0;
    };

    return (
        <>
            <DashboardHeader title="Email Campaigns" />
            <main className="p-4 lg:p-6 max-w-6xl mx-auto">
                {view === "list" ? (
                    <>
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-xl font-display font-bold tracking-tight">All Campaigns</h2>
                                <p className="text-sm text-muted-foreground">Create and manage your email outreach campaigns</p>
                            </div>
                            <Button onClick={() => setView("create")} className="h-10 rounded-xl bg-gradient-primary">
                                <Plus className="w-4 h-4 mr-2" />
                                New Campaign
                            </Button>
                        </div>

                        {/* Campaign Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                            <Card className="p-4 border-border">
                                <div className="flex items-center gap-2 mb-2">
                                    <Mail className="w-4 h-4 text-primary" />
                                    <span className="text-xs text-muted-foreground uppercase tracking-wider">Total Sent</span>
                                </div>
                                <p className="text-2xl font-bold">365</p>
                            </Card>
                            <Card className="p-4 border-border">
                                <div className="flex items-center gap-2 mb-2">
                                    <Eye className="w-4 h-4 text-success" />
                                    <span className="text-xs text-muted-foreground uppercase tracking-wider">Open Rate</span>
                                </div>
                                <p className="text-2xl font-bold text-success">64%</p>
                            </Card>
                            <Card className="p-4 border-border">
                                <div className="flex items-center gap-2 mb-2">
                                    <BarChart3 className="w-4 h-4 text-warning" />
                                    <span className="text-xs text-muted-foreground uppercase tracking-wider">Click Rate</span>
                                </div>
                                <p className="text-2xl font-bold text-warning">34%</p>
                            </Card>
                            <Card className="p-4 border-border">
                                <div className="flex items-center gap-2 mb-2">
                                    <Send className="w-4 h-4 text-accent" />
                                    <span className="text-xs text-muted-foreground uppercase tracking-wider">Reply Rate</span>
                                </div>
                                <p className="text-2xl font-bold text-accent">9.6%</p>
                            </Card>
                        </div>

                        {/* Campaign List */}
                        <div className="space-y-4">
                            {campaigns.map((campaign, i) => (
                                <motion.div
                                    key={campaign.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                >
                                    <Card className="p-5 border-border hover-lift">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="text-base font-semibold">{campaign.name}</h3>
                                                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${campaign.status === "active"
                                                        ? "bg-success/10 text-success"
                                                        : "bg-warning/10 text-warning"
                                                        }`}>
                                                        {campaign.status}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-muted-foreground">{campaign.subject}</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                                    {campaign.status === "active" ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                                                </Button>
                                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-destructive">
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-4 gap-4">
                                            <div className="p-3 rounded-lg bg-secondary/50">
                                                <p className="text-xs text-muted-foreground mb-1">Sent</p>
                                                <p className="text-lg font-bold">{campaign.sent}</p>
                                            </div>
                                            <div className="p-3 rounded-lg bg-secondary/50">
                                                <p className="text-xs text-muted-foreground mb-1">Opened</p>
                                                <p className="text-lg font-bold text-success">{getOpenRate(campaign.sent, campaign.opened)}%</p>
                                            </div>
                                            <div className="p-3 rounded-lg bg-secondary/50">
                                                <p className="text-xs text-muted-foreground mb-1">Clicked</p>
                                                <p className="text-lg font-bold text-warning">{getClickRate(campaign.sent, campaign.clicked)}%</p>
                                            </div>
                                            <div className="p-3 rounded-lg bg-secondary/50">
                                                <p className="text-xs text-muted-foreground mb-1">Replied</p>
                                                <p className="text-lg font-bold text-accent">{getReplyRate(campaign.sent, campaign.replied)}%</p>
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </>
                ) : (
                    <>
                        {/* Create Campaign */}
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-xl font-display font-bold tracking-tight">Create New Campaign</h2>
                                <p className="text-sm text-muted-foreground">Build your email outreach campaign</p>
                            </div>
                            <Button variant="ghost" onClick={() => setView("list")}>
                                Cancel
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Form */}
                            <div className="lg:col-span-2 space-y-4">
                                <Card className="p-6 border-border">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-sm font-medium mb-2 block">Campaign Name</label>
                                            <Input
                                                placeholder="e.g., Product Launch 2024"
                                                value={newCampaign.name}
                                                onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                                                className="h-10 rounded-xl bg-secondary border-border"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium mb-2 block">Email Subject</label>
                                            <Input
                                                placeholder="Use {{company_name}} and {{contact_name}} for personalization"
                                                value={newCampaign.subject}
                                                onChange={(e) => setNewCampaign({ ...newCampaign, subject: e.target.value })}
                                                className="h-10 rounded-xl bg-secondary border-border"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium mb-2 block">Email Body</label>
                                            <Textarea
                                                placeholder="Write your email here... Use personalization tokens like {{company_name}}, {{contact_name}}, {{industry}}, {{fit_reason}}"
                                                value={newCampaign.body}
                                                onChange={(e) => setNewCampaign({ ...newCampaign, body: e.target.value })}
                                                className="min-h-[250px] rounded-xl bg-secondary border-border resize-none"
                                            />
                                            <p className="text-xs text-muted-foreground mt-2">
                                                Available tokens: {`{{company_name}}, {{contact_name}}, {{role}}, {{industry}}, {{fit_reason}}`}
                                            </p>
                                        </div>

                                        <div className="flex gap-2 pt-2">
                                            <Button onClick={handleCreateCampaign} className="h-11 rounded-xl bg-gradient-primary flex-1">
                                                <Zap className="w-4 h-4 mr-2" />
                                                Create Campaign
                                            </Button>
                                            <Button variant="outline" className="h-11 rounded-xl">
                                                <Eye className="w-4 h-4 mr-2" />
                                                Preview
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            </div>

                            {/* Templates */}
                            <div>
                                <Card className="p-5 border-border">
                                    <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                                        <Copy className="w-4 h-4 text-primary" />
                                        Template Library
                                    </h3>
                                    <div className="space-y-3">
                                        {templates.map((template, i) => (
                                            <div
                                                key={i}
                                                onClick={() => {
                                                    setNewCampaign({
                                                        name: template.name,
                                                        subject: template.subject,
                                                        body: template.body
                                                    });
                                                    toast.success("Template loaded!");
                                                }}
                                                className="p-3 rounded-lg border border-border hover:bg-secondary/50 cursor-pointer transition-colors"
                                            >
                                                <p className="text-sm font-medium mb-1">{template.name}</p>
                                                <p className="text-xs text-muted-foreground line-clamp-2">{template.subject}</p>
                                            </div>
                                        ))}
                                    </div>
                                </Card>

                                <Card className="p-5 border-border mt-4">
                                    <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-warning" />
                                        Best Practices
                                    </h3>
                                    <ul className="space-y-2 text-xs text-muted-foreground">
                                        <li className="flex items-start gap-2">
                                            <span className="text-success">✓</span>
                                            <span>Personalize with contact and company info</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-success">✓</span>
                                            <span>Keep subject lines under 50 characters</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-success">✓</span>
                                            <span>Focus on value, not features</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-success">✓</span>
                                            <span>Include clear call-to-action</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-success">✓</span>
                                            <span>Send during business hours (9-5 PM)</span>
                                        </li>
                                    </ul>
                                </Card>
                            </div>
                        </div>
                    </>
                )}
            </main>
        </>
    );
};

export default DashboardCampaigns;
