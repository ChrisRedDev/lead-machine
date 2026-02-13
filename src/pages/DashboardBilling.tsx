import DashboardHeader from "@/components/dashboard/DashboardHeader";

const DashboardBilling = () => (
  <>
    <DashboardHeader title="Billing" />
    <main className="p-4 lg:p-6 max-w-lg">
      <div className="border border-border/40 rounded-2xl p-6">
        <h3 className="text-[15px] font-display font-semibold mb-2">Billing & Plans</h3>
        <p className="text-sm text-muted-foreground">Billing integration will be available soon.</p>
      </div>
    </main>
  </>
);

export default DashboardBilling;
