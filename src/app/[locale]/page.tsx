"use client";
import ToolLandingPage from "@/components/common/ToolLandingPage";
import { getToolPageConfig } from "@/data/toolPages";
import { useTranslations } from "next-intl";

export default function HomePage() {
  const config = getToolPageConfig("home");
  const t = useTranslations();

  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-700 mb-4">
            {t("common.error")}
          </h1>
          <p className="text-gray-600">{t("common.configNotFound")}</p>
        </div>
      </div>
    );
  }

  return (
    <ToolLandingPage/>
  );
}
