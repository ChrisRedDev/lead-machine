import DashboardHeader from "@/components/dashboard/DashboardHeader";

const DashboardSettings = () => (
  <>
    <DashboardHeader title="Settings" />
    <main className="p-4 lg:p-6 max-w-lg">
      <div className="border border-border/40 rounded-2xl p-6">
        <h3 className="text-[15px] font-display font-semibold mb-2">Account Settings</h3>
        <p className="text-sm text-muted-foreground">Settings and preferences will be available soon.</p>
      </div>
    </main>
  </>
);

export default DashboardSettings;
