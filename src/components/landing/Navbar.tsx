import { useState } from "react";
import { Zap, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const Navbar = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border/40">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-[15px] tracking-tight">LeadMachine AI</span>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <a href="/#features" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors">{t("nav.features")}</a>
          <a href="/#pricing" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors">{t("nav.pricing")}</a>
          <button onClick={() => navigate("/contact")} className="text-[13px] text-muted-foreground hover:text-foreground transition-colors">{t("footer.contact")}</button>
        </div>

        <div className="flex items-center gap-1.5">
          <LanguageSwitcher />
          <Button variant="ghost" size="sm" className="hidden md:inline-flex text-[13px] h-9 rounded-xl" onClick={() => navigate("/login")}>
            {t("nav.login")}
          </Button>
          <Button size="sm" className="hidden md:inline-flex text-[13px] h-9 rounded-xl bg-foreground text-background hover:bg-foreground/90" onClick={() => navigate("/login")}>
            {t("nav.getStarted")}
          </Button>
          {/* Mobile hamburger */}
          <Button variant="ghost" size="sm" className="md:hidden h-9 w-9 p-0" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur-xl px-4 py-4 space-y-3">
          <a href="/#features" onClick={() => setMobileOpen(false)} className="block text-sm text-muted-foreground hover:text-foreground transition-colors py-2">{t("nav.features")}</a>
          <a href="/#pricing" onClick={() => setMobileOpen(false)} className="block text-sm text-muted-foreground hover:text-foreground transition-colors py-2">{t("nav.pricing")}</a>
          <button onClick={() => { navigate("/contact"); setMobileOpen(false); }} className="block text-sm text-muted-foreground hover:text-foreground transition-colors py-2 w-full text-left">{t("footer.contact")}</button>
          <div className="flex gap-2 pt-2">
            <Button variant="ghost" size="sm" className="flex-1 text-sm h-10 rounded-xl" onClick={() => { navigate("/login"); setMobileOpen(false); }}>
              {t("nav.login")}
            </Button>
            <Button size="sm" className="flex-1 text-sm h-10 rounded-xl bg-foreground text-background hover:bg-foreground/90" onClick={() => { navigate("/login"); setMobileOpen(false); }}>
              {t("nav.getStarted")}
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
