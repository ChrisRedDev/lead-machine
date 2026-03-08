import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, Users, Gift, Sparkles, Zap, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const CREDITS_PER_REFERRAL = 50;

const TIERS = [
  { count: 1, reward: "50 credits", label: "First Referral", icon: "🎯" },
  { count: 3, reward: "200 credits", label: "Power Referrer", icon: "⚡" },
  { count: 10, reward: "1000 credits", label: "Top Advocate", icon: "🏆" },
];

const DashboardReferral = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  // Generate a deterministic referral code from user ID
  const referralCode = user?.id ? `LM-${user.id.slice(0, 8).toUpperCase()}` : "LM-XXXXXXXX";
  const referralLink = `${window.location.origin}/login?ref=${referralCode}`;

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success("Referral link copied to clipboard!");
    setTimeout(() => setCopied(false), 2500);
  };

  const shareLink = () => {
    if (navigator.share) {
      navigator.share({
        title: "LeadMachine AI — Get 50 Free Credits",
        text: "I've been using LeadMachine AI to generate qualified B2B leads in minutes. Sign up with my link and we both get 50 free credits!",
        url: referralLink,
      }).catch(() => copyLink());
    } else {
      copyLink();
    }
  };

  const steps = [
    { step: "1", title: "Share your link", desc: "Send your unique referral link to colleagues or business connections." },
    { step: "2", title: "They sign up", desc: "Your friend creates an account using your referral link." },
    { step: "3", title: "You both get credits", desc: `You get ${CREDITS_PER_REFERRAL} credits. They get 10 free leads. Win-win!` },
  ];

  return (
    <>
      <DashboardHeader title="Referral Program" />
      <main className="p-4 lg:p-6 max-w-4xl mx-auto space-y-6">
        {/* Hero banner */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/10 via-accent/5 to-background p-8 text-center relative overflow-hidden"
        >
          <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-primary/10 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full bg-accent/10 blur-2xl pointer-events-none" />
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Gift className="w-7 h-7 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-display font-bold tracking-tight mb-2">
              Invite Friends, Earn Credits
            </h1>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              Share LeadMachine AI with your network. Get <span className="text-primary font-semibold">{CREDITS_PER_REFERRAL} free credits</span> for every person who signs up with your link.
            </p>
          </div>
        </motion.div>

        {/* Referral link card */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="p-6 border-border">
            <h2 className="text-[14px] font-semibold mb-1">Your Referral Link</h2>
            <p className="text-xs text-muted-foreground mb-4">Share this link and earn {CREDITS_PER_REFERRAL} credits per signup.</p>
            <div className="flex items-center gap-2">
              <Input
                value={referralLink}
                readOnly
                className="h-11 rounded-xl bg-secondary border-border text-sm font-mono text-muted-foreground"
              />
              <Button
                className="h-11 rounded-xl shrink-0 bg-gradient-primary text-primary-foreground px-5"
                onClick={copyLink}
              >
                <AnimatePresence mode="wait">
                  {copied ? (
                    <motion.span key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-1.5">
                      <Check className="w-4 h-4" /> Copied!
                    </motion.span>
                  ) : (
                    <motion.span key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-1.5">
                      <Copy className="w-4 h-4" /> Copy
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
              <Button variant="outline" className="h-11 rounded-xl shrink-0" onClick={shareLink}>
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-[11px] text-muted-foreground mt-2">
              Your code: <span className="font-mono font-semibold text-foreground">{referralCode}</span>
            </p>
          </Card>
        </motion.div>

        {/* How it works */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card className="p-6 border-border">
            <h2 className="text-[14px] font-semibold mb-5">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {steps.map((s) => (
                <div key={s.step} className="flex flex-col items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-primary-foreground shrink-0">
                    {s.step}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{s.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Reward Tiers */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="p-6 border-border">
            <h2 className="text-[14px] font-semibold mb-5">Reward Tiers</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {TIERS.map((tier) => (
                <div
                  key={tier.count}
                  className="flex items-center gap-3 p-4 rounded-xl border border-border bg-secondary/30 hover:bg-secondary/60 transition-colors"
                >
                  <span className="text-2xl">{tier.icon}</span>
                  <div>
                    <p className="text-xs font-semibold">{tier.label}</p>
                    <p className="text-[11px] text-muted-foreground">{tier.count} referral{tier.count > 1 ? "s" : ""}</p>
                    <p className="text-xs text-primary font-bold mt-0.5">+{tier.reward}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Stats placeholder */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Card className="p-6 border-border">
            <h2 className="text-[14px] font-semibold mb-4">Your Referral Stats</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-xl bg-secondary/50">
                <Users className="w-5 h-5 mx-auto mb-2 text-primary" />
                <p className="text-2xl font-bold">0</p>
                <p className="text-xs text-muted-foreground mt-1">Referrals</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-secondary/50">
                <Sparkles className="w-5 h-5 mx-auto mb-2 text-success" />
                <p className="text-2xl font-bold">0</p>
                <p className="text-xs text-muted-foreground mt-1">Credits Earned</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-secondary/50">
                <Zap className="w-5 h-5 mx-auto mb-2 text-warning" />
                <p className="text-2xl font-bold">0</p>
                <p className="text-xs text-muted-foreground mt-1">Pending</p>
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground text-center mt-4">
              Referral tracking coming soon — your stats will appear here once friends sign up.
            </p>
          </Card>
        </motion.div>
      </main>
    </>
  );
};

export default DashboardReferral;
