import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Sparkles, Zap, Users, TrendingUp, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useRef } from "react";

const TICKER_ITEMS = [
  "SaaS · 94 match",
  "FinTech · 91 match",
  "E-commerce · 88 match",
  "HealthTech · 96 match",
  "AgriTech · 83 match",
  "EdTech · 90 match",
  "PropTech · 87 match",
  "CleanTech · 93 match",
];

const STATS = [
  { icon: Users, value: "12,400+", label: "Leads generated" },
  { icon: TrendingUp, value: "94%", label: "Match accuracy" },
  { icon: Zap, value: "28s", label: "Avg. generation" },
];

const FloatingCard = ({
  delay,
  className,
  children,
}: {
  delay: number;
  className: string;
  children: React.ReactNode;
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.88, y: 16 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

const HeroSection = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100vh] flex items-center justify-center px-4 overflow-hidden"
    >
      {/* ── Background ─────────────────────────────────── */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 pointer-events-none">
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        {/* Glow blobs */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] rounded-full bg-gradient-primary opacity-[0.07] blur-[140px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-accent opacity-[0.05] blur-[120px] animate-pulse-soft" />
        <div className="absolute top-1/4 left-1/5 w-[350px] h-[350px] rounded-full bg-success opacity-[0.04] blur-[100px] animate-float-delayed" />
      </motion.div>

      {/* ── Main content ───────────────────────────────── */}
      <div className="relative z-10 w-full max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* LEFT — copy */}
          <div>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 backdrop-blur-sm mb-7"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse-soft" />
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-medium text-muted-foreground">{t("hero.badge")}</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display tracking-tight leading-[1.06] mb-5"
            >
              Find your next{" "}
              <span className="relative">
                <span className="text-gradient">100 clients</span>
                <motion.svg
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ delay: 0.7, duration: 0.6 }}
                  className="absolute -bottom-1 left-0 w-full"
                  viewBox="0 0 200 8"
                  fill="none"
                >
                  <path
                    d="M2 6 Q50 2 100 5 Q150 8 198 4"
                    stroke="hsl(var(--primary))"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    fill="none"
                    opacity="0.5"
                  />
                </motion.svg>
              </span>
              {" "}in one click.
            </motion.h1>

            {/* Sub */}
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.16 }}
              className="text-base md:text-lg text-muted-foreground max-w-lg mb-8 leading-relaxed"
            >
              Drop your company URL — our AI analyzes your brand, researches the market and delivers a scored prospect list in under 30 seconds.
            </motion.p>

            {/* Feature bullets */}
            <motion.ul
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.22 }}
              className="flex flex-col gap-2 mb-9"
            >
              {[
                "AI brand analysis from your website",
                "Prospect scores with fit reasons",
                "Export CSV, add to pipeline instantly",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-[14px] text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-success shrink-0" />
                  {item}
                </li>
              ))}
            </motion.ul>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.28 }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <Button
                size="lg"
                className="h-12 px-8 text-[15px] font-semibold rounded-xl bg-gradient-primary text-primary-foreground hover:opacity-90 transition-all duration-300 hover:shadow-[0_8px_30px_-4px_hsl(234,89%,64%,0.45)] group"
                onClick={() => navigate("/login")}
              >
                Start free — 10 leads
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-7 text-[15px] font-medium rounded-xl border-border hover:border-primary/40"
                onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
              >
                See how it works
              </Button>
            </motion.div>

            {/* Social proof line */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55 }}
              className="mt-5 text-xs text-muted-foreground/60 flex items-center gap-1.5"
            >
              <span className="flex -space-x-1.5">
                {["A", "B", "C", "D"].map((l) => (
                  <span
                    key={l}
                    className="w-6 h-6 rounded-full bg-gradient-primary flex items-center justify-center text-[9px] font-bold text-primary-foreground border border-background"
                  >
                    {l}
                  </span>
                ))}
              </span>
              <span>12,400+ leads generated by 500+ companies</span>
            </motion.p>
          </div>

          {/* RIGHT — interactive mockup */}
          <div className="relative hidden lg:block">
            {/* Main card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.65, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="relative rounded-2xl border border-border/60 bg-card overflow-hidden shadow-2xl"
            >
              {/* Card header bar */}
              <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border/50 bg-secondary/40">
                <span className="w-2.5 h-2.5 rounded-full bg-destructive/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-warning/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-success/60" />
                <span className="ml-3 text-[11px] text-muted-foreground font-mono">leadmachine.ai / generate</span>
              </div>

              {/* Mock content */}
              <div className="p-5 space-y-4">
                {/* Input row */}
                <div className="flex items-center gap-2 rounded-xl border border-border bg-secondary/50 px-4 py-3">
                  <div className="w-2 h-2 rounded-full bg-success animate-pulse-soft" />
                  <span className="text-[13px] text-muted-foreground font-mono flex-1">yourcompany.com</span>
                  <span className="text-[11px] px-2 py-0.5 rounded-lg bg-primary/10 text-primary font-medium">Analyzing…</span>
                </div>

                {/* Progress steps */}
                <div className="space-y-2">
                  {[
                    { label: "Reading your website", done: true },
                    { label: "Building brand profile", done: true },
                    { label: "Researching prospects", done: false, active: true },
                  ].map((step, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + i * 0.15 }}
                      className="flex items-center gap-3 text-[12px]"
                    >
                      {step.done ? (
                        <CheckCircle className="w-3.5 h-3.5 text-success shrink-0" />
                      ) : (
                        <div className={`w-3.5 h-3.5 rounded-full border-2 shrink-0 ${step.active ? "border-primary animate-pulse-soft" : "border-border"}`} />
                      )}
                      <span className={step.done ? "text-foreground" : step.active ? "text-primary font-medium" : "text-muted-foreground"}>
                        {step.label}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* Lead cards */}
                <div className="space-y-2 pt-1">
                  {[
                    { company: "Stripe", role: "Head of Growth", score: 97, industry: "FinTech" },
                    { company: "Vercel", role: "VP Engineering", score: 94, industry: "DevTools" },
                    { company: "Linear", role: "CEO", score: 91, industry: "SaaS" },
                  ].map((lead, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.75 + i * 0.12 }}
                      className="flex items-center justify-between rounded-xl border border-border/50 bg-secondary/30 px-3 py-2.5"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-gradient-primary flex items-center justify-center text-[10px] font-bold text-primary-foreground">
                          {lead.company[0]}
                        </div>
                        <div>
                          <p className="text-[12px] font-semibold">{lead.company}</p>
                          <p className="text-[10px] text-muted-foreground">{lead.role}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-muted-foreground">{lead.industry}</span>
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-lg ${
                          lead.score >= 95 ? "bg-success/15 text-success" : "bg-primary/10 text-primary"
                        }`}>
                          {lead.score}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Floating stat cards */}
            <FloatingCard
              delay={0.6}
              className="absolute -top-5 -left-8 rounded-2xl border border-border/60 bg-card/90 backdrop-blur-md px-4 py-3 shadow-xl"
            >
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Generated today</p>
              <p className="text-2xl font-bold font-display text-success">+247</p>
              <p className="text-[10px] text-muted-foreground">qualified leads</p>
            </FloatingCard>

            <FloatingCard
              delay={0.75}
              className="absolute -bottom-5 -right-6 rounded-2xl border border-border/60 bg-card/90 backdrop-blur-md px-4 py-3 shadow-xl"
            >
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Avg. match score</p>
              <div className="flex items-end gap-1">
                <p className="text-2xl font-bold font-display text-primary">94%</p>
              </div>
              <div className="mt-1.5 flex gap-1">
                {[78, 85, 91, 94, 97, 94].map((v, i) => (
                  <div
                    key={i}
                    className="w-2 rounded-sm bg-primary/50"
                    style={{ height: `${(v / 100) * 20}px` }}
                  />
                ))}
              </div>
            </FloatingCard>
          </div>
        </div>

        {/* ── Live ticker ────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-16 overflow-hidden"
        >
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground/40 text-center mb-4">
            Live prospects matched right now
          </p>
          <div className="flex gap-3 animate-[ticker_20s_linear_infinite]" style={{ width: "max-content" }}>
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
              <span
                key={i}
                className="shrink-0 px-4 py-1.5 rounded-full border border-border/50 bg-secondary/30 text-[12px] text-muted-foreground font-medium"
              >
                {item}
              </span>
            ))}
          </div>
        </motion.div>

        {/* ── Stats bar ──────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-10 grid grid-cols-3 gap-4 border border-border/40 rounded-2xl bg-card/40 backdrop-blur-sm p-5"
        >
          {STATS.map(({ icon: Icon, value, label }, i) => (
            <div key={i} className={`flex items-center gap-3 ${i > 0 ? "border-l border-border/40 pl-4" : ""}`}>
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-xl font-bold font-display">{value}</p>
                <p className="text-[11px] text-muted-foreground">{label}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      <style>{`
        @keyframes ticker {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
