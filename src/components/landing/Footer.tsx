import { Zap } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border/50 py-12 px-4">
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-md bg-gradient-to-br from-primary to-neon-blue flex items-center justify-center">
          <Zap className="w-3 h-3 text-primary-foreground" />
        </div>
        <span className="font-display font-semibold text-sm">LeadMachine AI</span>
      </div>
      <p className="text-xs text-muted-foreground">© 2026 LeadMachine AI. All rights reserved.</p>
    </div>
  </footer>
);

export default Footer;
