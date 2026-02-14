import { Menu, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import DashboardMobileNav from "./DashboardMobileNav";
import { useAuth } from "@/contexts/AuthContext";

interface DashboardHeaderProps {
  title: string;
}

const DashboardHeader = ({ title }: DashboardHeaderProps) => {
  const { user } = useAuth();
  const initials = user?.email ? user.email.slice(0, 2).toUpperCase() : "??";

  return (
    <header className="h-14 flex items-center justify-between px-4 lg:px-6 border-b border-border/40 bg-background sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden h-8 w-8">
              <Menu className="w-4 h-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-60 bg-background border-border/40">
            <DashboardMobileNav />
          </SheetContent>
        </Sheet>
        <h1 className="text-[15px] font-display font-semibold tracking-tight">{title}</h1>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
          <Bell className="w-4 h-4" />
        </Button>
        <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-[11px] font-bold text-accent">
          {initials}
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
