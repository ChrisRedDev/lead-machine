import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { CreditCard } from "lucide-react";

const DashboardBilling = () => (
  <>
    <DashboardHeader title="Billing" />
    <main className="p-4 lg:p-8">
      <div className="glass rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <CreditCard className="w-6 h-6 text-muted-foreground" />
          <h3 className="font-display font-semibold text-lg">Billing & Plans</h3>
        </div>
        <p className="text-sm text-muted-foreground">Billing integration will be available soon.</p>
      </div>
    </main>
  </>
);

export default DashboardBilling;
