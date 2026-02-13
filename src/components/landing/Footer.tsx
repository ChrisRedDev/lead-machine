import { Zap } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border/40 py-10 px-4">
    <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-md bg-gradient-to-br from-primary to-accent flex items-center justify-center">
          <Zap className="w-2.5 h-2.5 text-primary-foreground" />
        </div>
        <span className="font-display font-semibold text-xs tracking-tight">LeadMachine AI</span>
      </div>
      <p className="text-[11px] text-muted-foreground">© 2026 LeadMachine AI. All rights reserved.</p>
    </div>
  </footer>
);

export default Footer;
