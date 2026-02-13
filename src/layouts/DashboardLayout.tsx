import { Outlet } from "react-router-dom";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      <div className="lg:ml-64">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
