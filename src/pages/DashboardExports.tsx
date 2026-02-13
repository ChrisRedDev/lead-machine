import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { FileSpreadsheet } from "lucide-react";

const DashboardExports = () => (
  <>
    <DashboardHeader title="Previous Exports" />
    <main className="p-4 lg:p-8">
      <div className="glass rounded-2xl p-12 text-center">
        <FileSpreadsheet className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="font-display font-semibold text-lg mb-2">No exports yet</h3>
        <p className="text-sm text-muted-foreground">Your generated lead lists will appear here.</p>
      </div>
    </main>
  </>
);

export default DashboardExports;
