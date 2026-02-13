import { Menu, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import DashboardMobileNav from "./DashboardMobileNav";

interface DashboardHeaderProps {
  title: string;
}

const DashboardHeader = ({ title }: DashboardHeaderProps) => {
  return (
    <header className="h-16 flex items-center justify-between px-4 lg:px-8 border-b border-border/50 glass-strong sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64 bg-background border-border/50">
            <DashboardMobileNav />
          </SheetContent>
        </Sheet>
        <h1 className="text-lg font-display font-bold">{title}</h1>
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Coins className="w-4 h-4 text-neon-blue" />
        <span className="font-medium">50 credits</span>
      </div>
    </header>
  );
};

export default DashboardHeader;
