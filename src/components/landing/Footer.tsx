import { useState } from "react";
import { Zap, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const Footer = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast.success("Thanks for subscribing!");
      setEmail("");
    }
  };

  return (
    <footer className="relative border-t border-border">
      {/* Top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      
      <div className="py-14 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-lg bg-primary flex items-center justify-center">
                  <Zap className="w-3 h-3 text-primary-foreground" />
                </div>
                <span className="font-display font-bold text-sm tracking-tight">LeadMachine AI</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed mb-4">{t("footer.description")}</p>
              <LanguageSwitcher />
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-3">{t("footer.product")}</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="text-xs text-muted-foreground hover:text-foreground transition-colors">{t("nav.features")}</a></li>
                <li><a href="#pricing" className="text-xs text-muted-foreground hover:text-foreground transition-colors">{t("nav.pricing")}</a></li>
                <li><Link to="/login" className="text-xs text-muted-foreground hover:text-foreground transition-colors">{t("nav.getStarted")}</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-3">{t("footer.company")}</h4>
              <ul className="space-y-2">
                <li><Link to="/contact" className="text-xs text-muted-foreground hover:text-foreground transition-colors">{t("footer.contact")}</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-3">Newsletter</h4>
              <p className="text-xs text-muted-foreground mb-3">Get tips on B2B lead generation.</p>
              <form onSubmit={handleNewsletter} className="flex gap-1.5">
                <Input
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-8 text-xs rounded-lg bg-secondary border-border flex-1"
                />
                <Button type="submit" size="sm" className="h-8 w-8 p-0 rounded-lg bg-gradient-primary text-primary-foreground hover:opacity-90">
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </form>
            </div>
          </div>

          <div className="border-t border-border pt-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-4">
                <Link to="/terms" className="text-[11px] text-muted-foreground hover:text-foreground transition-colors">{t("footer.terms")}</Link>
                <Link to="/privacy" className="text-[11px] text-muted-foreground hover:text-foreground transition-colors">{t("footer.privacy")}</Link>
              </div>
              <p className="text-[11px] text-muted-foreground">© 2026 LeadMachine AI. {t("footer.rights")}</p>
              <div className="flex items-center gap-4">
                <a href="#" className="text-[11px] text-muted-foreground/50 hover:text-[hsl(203,89%,53%)] transition-colors">Twitter</a>
                <a href="#" className="text-[11px] text-muted-foreground/50 hover:text-[hsl(210,80%,51%)] transition-colors">LinkedIn</a>
                <a href="#" className="text-[11px] text-muted-foreground/50 hover:text-foreground transition-colors">GitHub</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
