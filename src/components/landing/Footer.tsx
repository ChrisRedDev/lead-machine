import { Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-border py-14 px-4">
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
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-3">{t("footer.legal")}</h4>
            <ul className="space-y-2">
              <li><Link to="/terms" className="text-xs text-muted-foreground hover:text-foreground transition-colors">{t("footer.terms")}</Link></li>
              <li><Link to="/privacy" className="text-xs text-muted-foreground hover:text-foreground transition-colors">{t("footer.privacy")}</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-muted-foreground">© 2026 LeadMachine AI. {t("footer.rights")}</p>
          <div className="flex items-center gap-4">
            {["Twitter", "LinkedIn", "GitHub"].map((social) => (
              <a key={social} href="#" className="text-[11px] text-muted-foreground/50 hover:text-muted-foreground transition-colors">{social}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
