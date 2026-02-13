import { motion } from "framer-motion";
import { Globe, Brain, Target, FileSpreadsheet } from "lucide-react";

const features = [
  {
    icon: Globe,
    title: "Website Analysis",
    description: "Drop your URL and our AI instantly scans your site to understand your services and positioning.",
  },
  {
    icon: Brain,
    title: "ICP Detection",
    description: "AI identifies your Ideal Customer Profile — industries, company sizes, and decision-maker roles.",
  },
  {
    icon: Target,
    title: "Smart Prospecting",
    description: "We search public databases and directories to find companies that match your ICP perfectly.",
  },
  {
    icon: FileSpreadsheet,
    title: "Instant Export",
    description: "Get a downloadable spreadsheet with company names, contacts, emails, and fit reasons.",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold font-display mb-4">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Four simple steps from your website URL to a list of qualified leads.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-2xl p-6 hover:glow-sm transition-shadow duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-neon-blue/20 flex items-center justify-center mb-4 group-hover:from-primary/30 group-hover:to-neon-blue/30 transition-colors">
                <feature.icon className="w-6 h-6 text-neon-blue" />
              </div>
              <div className="text-xs font-medium text-muted-foreground mb-2">Step {i + 1}</div>
              <h3 className="text-lg font-semibold font-display mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
