import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

const Terms = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{t("terms.pageTitle")}</title>
      </Helmet>
      <Navbar />
      <main className="pt-14">
        <div className="max-w-3xl mx-auto px-4 py-20">
          <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-8">{t("terms.title")}</h1>
          <div className="prose prose-invert prose-sm max-w-none space-y-6 text-muted-foreground">
            <p className="text-xs text-muted-foreground/60">{t("terms.lastUpdated")}: February 2026</p>

            <section>
              <h2 className="text-lg font-display font-semibold text-foreground mb-3">1. {t("terms.s1Title")}</h2>
              <p>By accessing LeadMachine AI, you agree to these Terms of Service. Our platform provides AI-powered B2B lead generation services. You must be at least 18 years old and provide accurate registration information. You are responsible for maintaining the security of your account credentials.</p>
            </section>

            <section>
              <h2 className="text-lg font-display font-semibold text-foreground mb-3">2. {t("terms.s2Title")}</h2>
              <p>LeadMachine AI offers free and paid tiers. Free accounts receive 10 visible leads per generation. Full list access requires a one-time payment of $129 per generation or a Pro subscription at $499/month. All prices are in USD.</p>
            </section>

            <section>
              <h2 className="text-lg font-display font-semibold text-foreground mb-3">3. {t("terms.s3Title")}</h2>
              <p>Our AI generates leads from publicly available data sources. We do not guarantee the accuracy, completeness, or suitability of any lead information. You agree to use generated data in compliance with applicable laws including GDPR, CAN-SPAM, and local data protection regulations.</p>
            </section>

            <section>
              <h2 className="text-lg font-display font-semibold text-foreground mb-3">4. {t("terms.s4Title")}</h2>
              <p>Payments are processed securely via Stripe. One-time generation payments are non-refundable once leads have been generated and delivered. Pro subscription can be cancelled at any time; you retain access until the end of the billing period.</p>
            </section>

            <section>
              <h2 className="text-lg font-display font-semibold text-foreground mb-3">5. {t("terms.s5Title")}</h2>
              <p>You may not use LeadMachine AI for spamming, harassment, or any illegal purpose. Automated scraping or bulk extraction beyond normal usage is prohibited. We reserve the right to suspend accounts that violate these terms.</p>
            </section>

            <section>
              <h2 className="text-lg font-display font-semibold text-foreground mb-3">6. {t("terms.s6Title")}</h2>
              <p>We collect and process data as described in our Privacy Policy. By using our service, you consent to the collection and use of information in accordance with our Privacy Policy.</p>
            </section>

            <section>
              <h2 className="text-lg font-display font-semibold text-foreground mb-3">7. {t("terms.s7Title")}</h2>
              <p>LeadMachine AI is provided "as is" without warranties. Our maximum liability is limited to the amount you paid in the preceding 12 months. We are not liable for indirect, incidental, or consequential damages.</p>
            </section>

            <section>
              <h2 className="text-lg font-display font-semibold text-foreground mb-3">8. {t("terms.s8Title")}</h2>
              <p>We may update these terms at any time. Continued use after changes constitutes acceptance. We will notify users of material changes via email or in-app notification.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
