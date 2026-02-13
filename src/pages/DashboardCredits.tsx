import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Coins } from "lucide-react";

const DashboardCredits = () => (
  <>
    <DashboardHeader title="Usage Credits" />
    <main className="p-4 lg:p-8">
      <div className="glass rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <Coins className="w-6 h-6 text-neon-blue" />
          <h3 className="font-display font-semibold text-lg">Your Credits</h3>
        </div>
        <div className="text-5xl font-bold font-display gradient-text mb-2">50</div>
        <p className="text-sm text-muted-foreground">credits remaining this month</p>
        <div className="w-full h-2 bg-secondary rounded-full overflow-hidden mt-6">
          <div className="h-full w-1/2 rounded-full bg-gradient-to-r from-primary to-neon-blue" />
        </div>
      </div>
    </main>
  </>
);

export default DashboardCredits;
