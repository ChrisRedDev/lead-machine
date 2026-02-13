import { Rocket, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { motion } from "framer-motion";

const Dashboard = () => {
  return (
    <>
      <DashboardHeader title="Generate Leads" />
      <main className="p-4 lg:p-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-8 md:p-12 text-center"
        >
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary/20 to-neon-blue/20 flex items-center justify-center mb-6">
            <Rocket className="w-8 h-8 text-neon-blue" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold font-display mb-3">
            Ready to find your next clients?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Enter your company details and let our AI find the perfect prospects for your business.
          </p>
          <Button
            size="lg"
            className="px-8 py-6 text-lg glow-md bg-gradient-to-r from-primary to-neon-purple hover:opacity-90 transition-opacity"
          >
            Start Generating
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </motion.div>
      </main>
    </>
  );
};

export default Dashboard;
