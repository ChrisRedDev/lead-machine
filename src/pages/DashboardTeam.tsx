import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import {
    Users,
    UserPlus,
    Mail,
    Crown,
    Shield,
    Eye,
    Trash2,
    MoreVertical,
    TrendingUp,
    Target,
    CheckCircle2
} from "lucide-react";
import { toast } from "sonner";

const DashboardTeam = () => {
    const { user } = useAuth();
    const [inviteEmail, setInviteEmail] = useState("");
    const [teamMembers] = useState([
        {
            id: 1,
            name: "John Doe",
            email: "john@company.com",
            role: "Admin",
            avatar: "JD",
            leadsGenerated: 1250,
            avgScore: 87,
            status: "active",
            joinedAt: "2024-01-15"
        },
        {
            id: 2,
            name: "Sarah Smith",
            email: "sarah@company.com",
            role: "Manager",
            avatar: "SS",
            leadsGenerated: 890,
            avgScore: 92,
            status: "active",
            joinedAt: "2024-01-20"
        },
        {
            id: 3,
            name: "Mike Johnson",
            email: "mike@company.com",
            role: "Member",
            avatar: "MJ",
            leadsGenerated: 450,
            avgScore: 85,
            status: "active",
            joinedAt: "2024-02-01"
        },
        {
            id: 4,
            name: "Lisa Brown",
            email: "lisa@company.com",
            role: "Viewer",
            avatar: "LB",
            leadsGenerated: 0,
            avgScore: 0,
            status: "pending",
            joinedAt: "2024-02-10"
        }
    ]);

    const handleInvite = () => {
        if (!inviteEmail) {
            toast.error("Please enter an email address");
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inviteEmail)) {
            toast.error("Please enter a valid email");
            return;
        }
        toast.success(`Invitation sent to ${inviteEmail}!`);
        setInviteEmail("");
    };

    const getRoleIcon = (role: string) => {
        switch (role) {
            case "Admin": return <Crown className="w-4 h-4 text-warning" />;
            case "Manager": return <Shield className="w-4 h-4 text-primary" />;
            case "Member": return <Users className="w-4 h-4 text-success" />;
            default: return <Eye className="w-4 h-4 text-muted-foreground" />;
        }
    };

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case "Admin": return "bg-warning/10 text-warning border-warning/20";
            case "Manager": return "bg-primary/10 text-primary border-primary/20";
            case "Member": return "bg-success/10 text-success border-success/20";
            default: return "bg-muted text-muted-foreground border-border";
        }
    };

    const totalLeads = teamMembers.reduce((sum, member) => sum + member.leadsGenerated, 0);
    const activeMembers = teamMembers.filter(m => m.status === "active").length;
    const avgTeamScore = teamMembers.length > 0
        ? Math.round(teamMembers.reduce((sum, m) => sum + m.avgScore, 0) / teamMembers.length)
        : 0;

    return (
        <>
            <DashboardHeader title="Team" />
            <main className="p-4 lg:p-6 max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h2 className="text-xl font-display font-bold tracking-tight mb-1">Team Workspace</h2>
                    <p className="text-sm text-muted-foreground">Collaborate with your team on lead generation</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <Card className="p-4 border-border hover-lift">
                        <div className="flex items-center gap-2 mb-2">
                            <Users className="w-4 h-4 text-primary" />
                            <span className="text-xs text-muted-foreground uppercase tracking-wider">Team Size</span>
                        </div>
                        <p className="text-2xl font-bold">{activeMembers}</p>
                        <p className="text-xs text-muted-foreground mt-1">{teamMembers.length - activeMembers} pending</p>
                    </Card>

                    <Card className="p-4 border-border hover-lift">
                        <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="w-4 h-4 text-success" />
                            <span className="text-xs text-muted-foreground uppercase tracking-wider">Total Leads</span>
                        </div>
                        <p className="text-2xl font-bold text-success">{totalLeads.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground mt-1">All time</p>
                    </Card>

                    <Card className="p-4 border-border hover-lift">
                        <div className="flex items-center gap-2 mb-2">
                            <Target className="w-4 h-4 text-warning" />
                            <span className="text-xs text-muted-foreground uppercase tracking-wider">Avg Score</span>
                        </div>
                        <p className="text-2xl font-bold text-warning">{avgTeamScore}%</p>
                        <p className="text-xs text-muted-foreground mt-1">Team average</p>
                    </Card>

                    <Card className="p-4 border-border hover-lift">
                        <div className="flex items-center gap-2 mb-2">
                            <CheckCircle2 className="w-4 h-4 text-accent" />
                            <span className="text-xs text-muted-foreground uppercase tracking-wider">Active</span>
                        </div>
                        <p className="text-2xl font-bold text-accent">{activeMembers}</p>
                        <p className="text-xs text-muted-foreground mt-1">Members online</p>
                    </Card>
                </div>

                {/* Invite Section */}
                <Card className="p-5 border-border mb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                            <UserPlus className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-sm font-semibold mb-1">Invite Team Member</h3>
                            <p className="text-xs text-muted-foreground">Send an invitation to collaborate on lead generation</p>
                        </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                        <div className="relative flex-1">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                type="email"
                                placeholder="colleague@company.com"
                                value={inviteEmail}
                                onChange={(e) => setInviteEmail(e.target.value)}
                                className="h-10 pl-10 rounded-xl bg-secondary border-border"
                            />
                        </div>
                        <Button onClick={handleInvite} className="h-10 rounded-xl bg-gradient-primary">
                            Send Invite
                        </Button>
                    </div>
                </Card>

                {/* Team Members */}
                <div>
                    <h3 className="text-sm font-semibold mb-4">Team Members ({teamMembers.length})</h3>
                    <div className="space-y-3">
                        {teamMembers.map((member, i) => (
                            <motion.div
                                key={member.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                            >
                                <Card className="p-4 border-border hover-lift">
                                    <div className="flex items-center gap-4">
                                        {/* Avatar */}
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 ${member.status === "active"
                                                ? "bg-gradient-primary text-primary-foreground"
                                                : "bg-muted text-muted-foreground"
                                            }`}>
                                            {member.avatar}
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="text-sm font-semibold">{member.name}</h4>
                                                {member.status === "pending" && (
                                                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-warning/10 text-warning">
                                                        Pending
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-muted-foreground">{member.email}</p>
                                        </div>

                                        {/* Role Badge */}
                                        <div className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 ${getRoleBadgeColor(member.role)}`}>
                                            {getRoleIcon(member.role)}
                                            {member.role}
                                        </div>

                                        {/* Stats */}
                                        {member.status === "active" && (
                                            <div className="hidden md:flex gap-6">
                                                <div className="text-center">
                                                    <p className="text-xs text-muted-foreground mb-0.5">Leads</p>
                                                    <p className="text-sm font-bold">{member.leadsGenerated.toLocaleString()}</p>
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-xs text-muted-foreground mb-0.5">Score</p>
                                                    <p className="text-sm font-bold text-success">{member.avgScore}%</p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Actions */}
                                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                            <MoreVertical className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Permissions Info */}
                <Card className="p-5 border-border mt-6">
                    <h3 className="text-sm font-semibold mb-3">Role Permissions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                        <div>
                            <div className="flex items-center gap-1.5 mb-2 font-medium">
                                <Crown className="w-3.5 h-3.5 text-warning" />
                                Admin
                            </div>
                            <ul className="space-y-1 text-muted-foreground">
                                <li>✓ Full access</li>
                                <li>✓ Manage team</li>
                                <li>✓ Billing access</li>
                                <li>✓ All features</li>
                            </ul>
                        </div>
                        <div>
                            <div className="flex items-center gap-1.5 mb-2 font-medium">
                                <Shield className="w-3.5 h-3.5 text-primary" />
                                Manager
                            </div>
                            <ul className="space-y-1 text-muted-foreground">
                                <li>✓ Generate leads</li>
                                <li>✓ Create campaigns</li>
                                <li>✓ Export data</li>
                                <li>✓ View analytics</li>
                            </ul>
                        </div>
                        <div>
                            <div className="flex items-center gap-1.5 mb-2 font-medium">
                                <Users className="w-3.5 h-3.5 text-success" />
                                Member
                            </div>
                            <ul className="space-y-1 text-muted-foreground">
                                <li>✓ Generate leads</li>
                                <li>✓ Export data</li>
                                <li>✓ View own analytics</li>
                                <li>— Create campaigns</li>
                            </ul>
                        </div>
                        <div>
                            <div className="flex items-center gap-1.5 mb-2 font-medium">
                                <Eye className="w-3.5 h-3.5 text-muted-foreground" />
                                Viewer
                            </div>
                            <ul className="space-y-1 text-muted-foreground">
                                <li>✓ View leads</li>
                                <li>✓ View analytics</li>
                                <li>— Generate leads</li>
                                <li>— Export data</li>
                            </ul>
                        </div>
                    </div>
                </Card>
            </main>
        </>
    );
};

export default DashboardTeam;
