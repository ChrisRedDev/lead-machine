import { motion } from "framer-motion";
import { Globe, Brain, Target, FileSpreadsheet } from "lucide-react";

const steps = [
  {
    icon: Globe,
    title: "Paste Your URL",
    description: "Enter your company website and a short description of what you do.",
  },
  {
    icon: Brain,
    title: "AI Analyzes",
    description: "Our AI scans your site to identify services, positioning, and ideal customer profile.",
  },
  {
    icon: Target,
    title: "Find Prospects",
    description: "We search public databases to find companies that are the perfect fit for your offering.",
  },
  {
    icon: FileSpreadsheet,
    title: "Export Leads",
    description: "Download a structured spreadsheet with company info, contacts, and fit reasons.",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-28 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-3 tracking-tight">
            How It Works
          </h2>
          <p className="text-muted-foreground text-sm md:text-base max-w-md mx-auto">
            From your URL to a qualified lead list in minutes.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-4">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="group rounded-2xl border border-border/50 bg-card/40 p-6 hover:bg-card/70 transition-colors duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center shrink-0 group-hover:bg-primary/12 transition-colors">
                  <step.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Step {i + 1}</span>
                  <h3 className="text-[15px] font-semibold font-display mt-0.5 mb-1">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
