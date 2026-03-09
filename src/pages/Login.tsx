import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
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
  const [googleLoading, setGoogleLoading] = useState(false);
  const [appleLoading, setAppleLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useTranslation();

  useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user, navigate]);

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError("");
    const { error } = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin + "/dashboard",
    });
    if (error) {
      setError(error.message);
      setGoogleLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    setAppleLoading(true);
    setError("");
    const { error } = await lovable.auth.signInWithOAuth("apple", {
      redirect_uri: window.location.origin + "/dashboard",
    });
    if (error) {
      setError(error.message);
      setAppleLoading(false);
    }
  };

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
    <div className="min-h-screen flex items-center justify-center px-4 bg-dot-pattern">
      <div className="absolute top-4 right-4 z-10"><LanguageSwitcher /></div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2.5 mb-10">
          <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center">
            <Zap className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight">LeadMachine AI</span>
        </div>

        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          {/* Colored accent line */}
          <div className="h-1 bg-gradient-primary" />
          
          <div className="p-8 md:p-10">
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
                    <Button type="submit" disabled={loading || !email} className="w-full h-12 rounded-xl text-sm font-medium bg-gradient-primary text-primary-foreground hover:opacity-90">
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>{t("login.continue")}<ArrowRight className="w-4 h-4 ml-2" /></>}
                    </Button>
                  </form>

                  {/* Social login */}
                  <div className="mt-6">
                    <div className="relative mb-4">
                      <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
                      <div className="relative flex justify-center"><span className="bg-card px-3 text-xs text-muted-foreground">or continue with</span></div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        className="h-11 rounded-xl text-sm border-border hover:bg-secondary"
                        onClick={handleGoogleSignIn}
                        disabled={googleLoading}
                      >
                        {googleLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                          <>
                            <svg className="w-4 h-4 mr-2 shrink-0" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                            Google
                          </>
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="h-11 rounded-xl text-sm border-border hover:bg-secondary"
                        onClick={handleAppleSignIn}
                        disabled={appleLoading}
                      >
                        {appleLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                          <>
                            <svg className="w-4 h-4 mr-2 shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.42c1.39.07 2.35.74 3.15.8 1.2-.24 2.35-.93 3.62-.84 1.54.12 2.7.72 3.47 1.86-3.19 1.87-2.44 5.98.72 7.14-.57 1.53-1.3 3.05-2.96 3.9zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
                            Apple
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="sent" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4">
                  <div className="w-14 h-14 mx-auto rounded-full bg-success/10 flex items-center justify-center mb-5">
                    <CheckCircle className="w-7 h-7 text-success" />
                  </div>
                  <h2 className="text-xl font-display font-bold mb-2">{t("login.checkInbox")}</h2>
                  <p className="text-muted-foreground text-sm mb-6">{t("login.magicLinkSent")} <span className="text-foreground font-medium">{email}</span></p>
                  <Button variant="ghost" className="text-sm text-muted-foreground" onClick={() => { setSent(false); setEmail(""); }}>{t("login.differentEmail")}</Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Feature highlight */}
        <div className="mt-6 flex items-center justify-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-success" /> 10 free leads</span>
          <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-primary" /> No credit card</span>
          <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-warning" /> Setup in 60s</span>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-4">{t("login.terms")}</p>
      </motion.div>
    </div>
  );
};

export default Login;
