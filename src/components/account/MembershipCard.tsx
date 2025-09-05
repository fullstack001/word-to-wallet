"use client";
import { useTranslations } from "next-intl";

export default function MembershipCard() {
  const t = useTranslations();

  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 lg:p-8 shadow-lg border border-gray-200">
      <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-700 mb-3 sm:mb-4 lg:mb-6">
        {t("account.membership")}
      </h2>
      <p className="text-sm sm:text-base lg:text-lg text-gray-600 mb-4 sm:mb-6 leading-relaxed">
        {t("account.noSubscription")}
      </p>

      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6 lg:p-8 rounded-xl border border-blue-200 text-center">
        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-2 sm:mb-3">
          {t("account.unlockAllTools")}
        </h3>
        <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed">
          {t("account.fullAccess")} <br className="hidden sm:block" />
          <span className="sm:inline block mt-1 sm:mt-0">
            {t("account.subscribeNow")}
          </span>
        </p>
        <button className="w-full sm:w-auto bg-blue-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-sm sm:text-base hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-md hover:shadow-lg">
          {t("account.subscribe")}
        </button>
      </div>
    </div>
  );
}
