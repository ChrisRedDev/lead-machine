import { motion, useInView, useSpring, useTransform, useMotionValue } from "framer-motion";
import { useRef, useEffect } from "react";
import { TrendingUp, Building2, Target } from "lucide-react";
import { useTranslation } from "react-i18next";

const AnimatedNumber = ({ value, suffix = "" }: { value: number; suffix?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { duration: 2000, bounce: 0 });
  const display = useTransform(spring, (v) => `${Math.round(v).toLocaleString()}${suffix}`);

  useEffect(() => {
    if (isInView) motionValue.set(value);
  }, [isInView, value, motionValue]);

  return <motion.span ref={ref}>{display}</motion.span>;
};

const StatsCounter = () => {
  const { t } = useTranslation();

  const stats = [
    { value: 12000, suffix: "+", labelKey: "stats.leadsGenerated", icon: TrendingUp, color: "text-primary" },
    { value: 500, suffix: "+", labelKey: "stats.businesses", icon: Building2, color: "text-success" },
    { value: 94, suffix: "%", labelKey: "stats.accuracy", icon: Target, color: "text-warning" },
  ];

  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-3 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center rounded-2xl border border-border/50 bg-card p-6"
            >
              <stat.icon className={`w-5 h-5 ${stat.color} mx-auto mb-3`} />
              <div className="text-3xl md:text-4xl font-bold font-display text-foreground mb-1">
                <AnimatedNumber value={stat.value} suffix={stat.suffix} />
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
