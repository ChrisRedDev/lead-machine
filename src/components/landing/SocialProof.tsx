import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { useTranslation } from "react-i18next";

const avatarColors = [
  "bg-primary/20 text-primary",
  "bg-success/20 text-success",
  "bg-warning/20 text-warning",
];

const testimonials = [
  { nameKey: "socialProof.t1Name", roleKey: "socialProof.t1Role", quoteKey: "socialProof.t1Quote", avatar: "JM", stars: 5 },
  { nameKey: "socialProof.t2Name", roleKey: "socialProof.t2Role", quoteKey: "socialProof.t2Quote", avatar: "SK", stars: 5 },
  { nameKey: "socialProof.t3Name", roleKey: "socialProof.t3Role", quoteKey: "socialProof.t3Quote", avatar: "AT", stars: 5 },
];

const SocialProof = () => {
  const { t } = useTranslation();

  return (
    <section className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-3 tracking-tight">{t("socialProof.title")}</h2>
          <p className="text-muted-foreground text-sm md:text-base max-w-md mx-auto">{t("socialProof.subtitle")}</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5">
          {testimonials.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl border border-border bg-card p-6 relative hover-lift group"
            >
              <Quote className="absolute top-4 right-4 w-8 h-8 text-primary/10 group-hover:text-primary/20 transition-colors" />
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: item.stars }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-warning text-warning" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5 italic">"{t(item.quoteKey)}"</p>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold ${avatarColors[i]}`}>
                  {item.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold">{t(item.nameKey)}</p>
                  <p className="text-xs text-muted-foreground">{t(item.roleKey)}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
