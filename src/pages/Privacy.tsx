import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

const Privacy = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{t("privacy.pageTitle")}</title>
      </Helmet>
      <Navbar />
      <main className="pt-14">
        <div className="max-w-3xl mx-auto px-4 py-20">
          <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-8">{t("privacy.title")}</h1>
          <div className="prose prose-invert prose-sm max-w-none space-y-6 text-muted-foreground">
            <p className="text-xs text-muted-foreground/60">{t("privacy.lastUpdated")}: February 2026</p>

            <section>
              <h2 className="text-lg font-display font-semibold text-foreground mb-3">1. {t("privacy.s1Title")}</h2>
              <p>We collect information you provide directly: email address, company URL, business description, and lead generation preferences. We also collect usage data including pages visited, features used, and generation history. We use cookies for authentication and analytics.</p>
            </section>

            <section>
              <h2 className="text-lg font-display font-semibold text-foreground mb-3">2. {t("privacy.s2Title")}</h2>
              <p>Your data is used to provide and improve our AI lead generation service, process payments, communicate with you about your account, analyze usage patterns to improve our platform, and comply with legal obligations.</p>
            </section>

            <section>
              <h2 className="text-lg font-display font-semibold text-foreground mb-3">3. {t("privacy.s3Title")}</h2>
              <p>Your data is stored securely on encrypted servers. We implement industry-standard security measures including encryption at rest and in transit, regular security audits, and access controls. Data is retained for as long as your account is active or as required by law.</p>
            </section>

            <section>
              <h2 className="text-lg font-display font-semibold text-foreground mb-3">4. {t("privacy.s4Title")}</h2>
              <p>We may share data with payment processors (Stripe) for transaction processing, AI providers for lead generation (data is processed, not stored), and law enforcement when legally required. We do not sell your personal data to third parties.</p>
            </section>

            <section>
              <h2 className="text-lg font-display font-semibold text-foreground mb-3">5. {t("privacy.s5Title")}</h2>
              <p>Under GDPR, CCPA, and other applicable regulations, you have the right to: access your personal data, request data correction or deletion, export your data in a portable format, opt out of marketing communications, and withdraw consent at any time. To exercise these rights, contact us at privacy@leadmachine.ai.</p>
            </section>

            <section>
              <h2 className="text-lg font-display font-semibold text-foreground mb-3">6. {t("privacy.s6Title")}</h2>
              <p>We may update this Privacy Policy periodically. We will notify you of any material changes via email or through a notice on our website. Your continued use of the service after changes constitutes acceptance.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;
