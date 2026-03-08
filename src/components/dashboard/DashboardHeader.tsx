import { Menu, Bell, Sun, Moon, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import DashboardMobileNav from "./DashboardMobileNav";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";

interface DashboardHeaderProps {
  title: string;
}

const DashboardHeader = ({ title }: DashboardHeaderProps) => {
  const { user } = useAuth();
  const { theme, resolvedTheme, setTheme } = useTheme();
  const initials = user?.email ? user.email.slice(0, 2).toUpperCase() : "??";

  const ThemeIcon = resolvedTheme === "dark" ? Moon : Sun;

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
        {/* Theme toggle */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
              <ThemeIcon className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36">
            <DropdownMenuItem onClick={() => setTheme("light")} className={`text-xs gap-2 ${theme === "light" ? "text-primary font-medium" : ""}`}>
              <Sun className="w-3.5 h-3.5" />Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")} className={`text-xs gap-2 ${theme === "dark" ? "text-primary font-medium" : ""}`}>
              <Moon className="w-3.5 h-3.5" />Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")} className={`text-xs gap-2 ${theme === "system" ? "text-primary font-medium" : ""}`}>
              <Monitor className="w-3.5 h-3.5" />System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

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
