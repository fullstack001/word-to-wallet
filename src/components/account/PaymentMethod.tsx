"use client";
import { useTranslations } from "next-intl";

interface PaymentMethodProps {
  cardnumber: string;
}

export default function PaymentMethod({ cardnumber }: PaymentMethodProps) {
  const t = useTranslations();

  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 lg:p-8 shadow-lg border border-gray-200">
      <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-700 mb-3 sm:mb-4 lg:mb-6">
        {t("account.paymentMethod")}
      </h2>
      <p className="text-sm sm:text-base lg:text-lg text-gray-600 mb-4 sm:mb-6 leading-relaxed">
        {t("account.saveTime")}
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
            {t("account.cardNumber")}
          </label>
          <input
            type="text"
            disabled
            defaultValue={cardnumber || t("account.notSpecified")}
            className="w-full p-3 sm:p-4 rounded-lg bg-gray-50 border border-gray-300 text-sm sm:text-base text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        <div className="mt-6 sm:mt-8">
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed">
            {t("account.importantUpdates")}
          </p>
        </div>
      </div>
    </div>
  );
}
