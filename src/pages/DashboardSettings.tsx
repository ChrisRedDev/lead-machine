import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { useTranslation } from "react-i18next";

const DashboardSettings = () => {
  const { t } = useTranslation();
  return (
    <>
      <DashboardHeader title={t("dashboard.settings")} />
      <main className="p-4 lg:p-6 max-w-lg">
        <div className="border border-border/40 rounded-2xl p-6">
          <h3 className="text-[15px] font-display font-semibold mb-2">{t("common.settingsTitle")}</h3>
          <p className="text-sm text-muted-foreground">{t("common.settingsDesc")}</p>
        </div>
      </main>
    </>
  );
};

export default DashboardSettings;
