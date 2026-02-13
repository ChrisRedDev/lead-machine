import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Settings } from "lucide-react";

const DashboardSettings = () => (
  <>
    <DashboardHeader title="Settings" />
    <main className="p-4 lg:p-8">
      <div className="glass rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <Settings className="w-6 h-6 text-muted-foreground" />
          <h3 className="font-display font-semibold text-lg">Account Settings</h3>
        </div>
        <p className="text-sm text-muted-foreground">Settings will be available after you connect your account.</p>
      </div>
    </main>
  </>
);

export default DashboardSettings;
