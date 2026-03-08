import { motion, useInView, useSpring, useTransform, useMotionValue } from "framer-motion";
import { useRef, useEffect } from "react";
import { TrendingUp, Building2, Target, Zap } from "lucide-react";
import { useTranslation } from "react-i18next";

const AnimatedNumber = ({ value, suffix = "", prefix = "" }: { value: number; suffix?: string; prefix?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { duration: 2200, bounce: 0 });
  const display = useTransform(spring, (v) => `${prefix}${Math.round(v).toLocaleString()}${suffix}`);

  useEffect(() => {
    if (isInView) motionValue.set(value);
  }, [isInView, value, motionValue]);

  return <motion.span ref={ref}>{display}</motion.span>;
};

const StatsCounter = () => {
  const { t } = useTranslation();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  const stats = [
    {
      value: 12000,
      suffix: "+",
      labelKey: "stats.leadsGenerated",
      icon: TrendingUp,
      color: "text-primary",
      bg: "bg-primary/10",
      glow: "group-hover:shadow-[0_0_24px_-4px_hsl(var(--primary)/0.35)]",
    },
    {
      value: 500,
      suffix: "+",
      labelKey: "stats.businesses",
      icon: Building2,
      color: "text-success",
      bg: "bg-success/10",
      glow: "group-hover:shadow-[0_0_24px_-4px_hsl(var(--success)/0.35)]",
    },
    {
      value: 94,
      suffix: "%",
      labelKey: "stats.accuracy",
      icon: Target,
      color: "text-warning",
      bg: "bg-warning/10",
      glow: "group-hover:shadow-[0_0_24px_-4px_hsl(var(--warning)/0.35)]",
    },
    {
      value: 3,
      suffix: "min",
      prefix: "<",
      labelKey: "stats.timeToLeads",
      icon: Zap,
      color: "text-accent",
      bg: "bg-accent/10",
      glow: "group-hover:shadow-[0_0_24px_-4px_hsl(var(--accent)/0.35)]",
    },
  ];

  return (
    <section ref={sectionRef} className="py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-8"
        >
          Trusted by hundreds of B2B companies
        </motion.p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.5, ease: "easeOut" }}
              className={`group text-center rounded-2xl border border-border/50 bg-card p-6 transition-all duration-300 hover:border-border ${stat.glow}`}
            >
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mx-auto mb-4`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div className="text-3xl md:text-4xl font-bold font-display text-foreground mb-1.5">
                <AnimatedNumber value={stat.value} suffix={stat.suffix} prefix={stat.prefix || ""} />
              </div>
              <p className="text-xs md:text-sm text-muted-foreground">{t(stat.labelKey)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsCounter;
