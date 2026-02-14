import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Zap, ArrowRight, Mail, Loader2, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const Login = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useTranslation();

  useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin + "/dashboard" },
    });

    setLoading(false);
    if (error) setError(error.message);
    else setSent(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="absolute top-4 right-4 z-10"><LanguageSwitcher /></div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2.5 mb-10">
          <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center">
            <Zap className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight">LeadMachine AI</span>
        </div>

        <div className="rounded-2xl border border-border bg-card p-8 md:p-10">
          <AnimatePresence mode="wait">
            {!sent ? (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <h1 className="text-2xl font-display font-bold text-center mb-2">{t("login.welcome")}</h1>
                <p className="text-muted-foreground text-center text-sm mb-8">{t("login.subtitle")}</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input type="email" placeholder={t("login.emailPlaceholder")} value={email} onChange={(e) => setEmail(e.target.value)} required className="pl-10 h-12 rounded-xl bg-secondary border-border text-sm" />
                  </div>
                  {error && <p className="text-destructive text-sm text-center">{error}</p>}
                  <Button type="submit" disabled={loading || !email} className="w-full h-12 rounded-xl text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90">
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>{t("login.continue")}<ArrowRight className="w-4 h-4 ml-2" /></>}
                  </Button>
                </form>
              </motion.div>
            ) : (
              <motion.div key="sent" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4">
                <div className="w-14 h-14 mx-auto rounded-full bg-secondary flex items-center justify-center mb-5">
                  <CheckCircle className="w-7 h-7 text-primary" />
                </div>
                <h2 className="text-xl font-display font-bold mb-2">{t("login.checkInbox")}</h2>
                <p className="text-muted-foreground text-sm mb-6">{t("login.magicLinkSent")} <span className="text-foreground font-medium">{email}</span></p>
                <Button variant="ghost" className="text-sm text-muted-foreground" onClick={() => { setSent(false); setEmail(""); }}>{t("login.differentEmail")}</Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">{t("login.terms")}</p>
      </motion.div>
    </div>
  );
};

export default Login;
