import { useState, useEffect } from "react";
import { Zap, Menu, X, Sun, Moon, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/contexts/ThemeContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const ThemeIcon = resolvedTheme === "dark" ? Moon : Sun;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-background/90 backdrop-blur-xl border-b border-border shadow-lg shadow-background/20" : "bg-transparent border-b border-transparent"}`}>
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
          <div className="w-7 h-7 rounded-lg bg-gradient-primary flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-[15px] tracking-tight">LeadMachine AI</span>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <a href="/#features" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors relative group">
            {t("nav.features")}
            <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-primary group-hover:w-full transition-all duration-300" />
          </a>
          <a href="/#pricing" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors relative group">
            {t("nav.pricing")}
            <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-primary group-hover:w-full transition-all duration-300" />
          </a>
          <button onClick={() => navigate("/contact")} className="text-[13px] text-muted-foreground hover:text-foreground transition-colors relative group">
            {t("footer.contact")}
            <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-primary group-hover:w-full transition-all duration-300" />
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <LanguageSwitcher />

          {/* Theme toggle dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-muted-foreground hover:text-foreground">
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

          <Button variant="ghost" size="sm" className="hidden md:inline-flex text-[13px] h-9 rounded-xl" onClick={() => navigate("/login")}>
            {t("nav.login")}
          </Button>
          <Button size="sm" className="hidden md:inline-flex text-[13px] h-9 rounded-xl bg-gradient-primary text-primary-foreground hover:opacity-90 transition-all duration-300 hover:shadow-[0_4px_20px_-4px_hsl(234,89%,64%,0.4)]" onClick={() => navigate("/login")}>
            {t("nav.getStarted")}
          </Button>
          <Button variant="ghost" size="sm" className="md:hidden h-9 w-9 p-0" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl px-4 py-4 space-y-3">
          <a href="/#features" onClick={() => setMobileOpen(false)} className="block text-sm text-muted-foreground hover:text-foreground transition-colors py-2">{t("nav.features")}</a>
          <a href="/#pricing" onClick={() => setMobileOpen(false)} className="block text-sm text-muted-foreground hover:text-foreground transition-colors py-2">{t("nav.pricing")}</a>
          <button onClick={() => { navigate("/contact"); setMobileOpen(false); }} className="block text-sm text-muted-foreground hover:text-foreground transition-colors py-2 w-full text-left">{t("footer.contact")}</button>

          {/* Mobile theme toggle */}
          <div className="flex items-center gap-2 py-2">
            <span className="text-sm text-muted-foreground">Theme:</span>
            {(["light", "dark", "system"] as const).map((t_) => (
              <button
                key={t_}
                onClick={() => setTheme(t_)}
                className={`text-xs px-2.5 py-1 rounded-lg border transition-colors capitalize ${theme === t_ ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:text-foreground"}`}
              >
                {t_}
              </button>
            ))}
          </div>

          <div className="flex gap-2 pt-2">
            <Button variant="ghost" size="sm" className="flex-1 text-sm h-10 rounded-xl" onClick={() => { navigate("/login"); setMobileOpen(false); }}>
              {t("nav.login")}
            </Button>
            <Button size="sm" className="flex-1 text-sm h-10 rounded-xl bg-gradient-primary text-primary-foreground hover:opacity-90" onClick={() => { navigate("/login"); setMobileOpen(false); }}>
              {t("nav.getStarted")}
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
