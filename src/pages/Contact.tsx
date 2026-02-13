import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, CheckCircle, MessageSquare, Mail, User, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

const Contact = () => {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("contact-ai", {
        body: form,
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setAiResponse(data.ai_response);
      setSent(true);
    } catch (err: any) {
      console.error("Contact error:", err);
      toast.error(err.message || "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{t("contact.pageTitle")}</title>
        <meta name="description" content="Contact LeadMachine AI — Get in touch with our team." />
      </Helmet>
      <Navbar />
      <main className="pt-14">
        <section className="min-h-[85vh] flex items-center justify-center px-4 py-20">
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/6 rounded-full blur-[150px]" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative w-full max-w-lg"
          >
            <div className="text-center mb-8">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-7 h-7 text-primary" />
              </div>
              <h1 className="text-3xl font-display font-bold tracking-tight mb-2">{t("contact.title")}</h1>
              <p className="text-muted-foreground text-sm">{t("contact.subtitle")}</p>
            </div>

            <div className="rounded-3xl border border-border/50 bg-card/40 backdrop-blur-xl p-8">
              <AnimatePresence mode="wait">
                {!sent ? (
                  <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input placeholder={t("contact.namePlaceholder")} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="pl-10 h-12 rounded-xl bg-secondary/50 border-border/50 text-sm" />
                    </div>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input type="email" placeholder={t("contact.emailPlaceholder")} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required className="pl-10 h-12 rounded-xl bg-secondary/50 border-border/50 text-sm" />
                    </div>
                    <div className="relative">
                      <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input placeholder={t("contact.subjectPlaceholder")} value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required className="pl-10 h-12 rounded-xl bg-secondary/50 border-border/50 text-sm" />
                    </div>
                    <Textarea placeholder={t("contact.messagePlaceholder")} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required className="min-h-[120px] rounded-xl bg-secondary/50 border-border/50 text-sm resize-none" />
                    <Button type="submit" disabled={loading} className="w-full h-12 rounded-xl text-sm font-medium bg-foreground text-background hover:bg-foreground/90">
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Send className="w-4 h-4 mr-2" />{t("contact.send")}</>}
                    </Button>
                  </motion.form>
                ) : (
                  <motion.div key="sent" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6">
                    <div className="w-14 h-14 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-5">
                      <CheckCircle className="w-7 h-7 text-primary" />
                    </div>
                    <h2 className="text-xl font-display font-bold mb-3">{t("contact.thankYou")}</h2>
                    <div className="rounded-xl bg-secondary/30 border border-border/40 p-4 mb-4 text-left">
                      <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-medium">{t("contact.aiResponse")}</p>
                      <p className="text-sm text-foreground/90 leading-relaxed">{aiResponse}</p>
                    </div>
                    <Button variant="ghost" className="text-sm text-muted-foreground" onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }); }}>
                      {t("contact.sendAnother")}
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
