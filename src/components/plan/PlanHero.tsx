import "../../app/globals.css";
import { useTranslations } from "next-intl";

export default function PlanHero({
  handleGoPayment,
}: {
  handleGoPayment: () => void;
}) {
  const t = useTranslations();

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-20">
      <div className="text-[24px] md:text-[28px] lg:text-[36px] font-medium mb-4 text-center md:text-left text-gray-800">
        {t("plan.choosePlan")}
      </div>
      <div>
        <button
          className="bg-primary-900 text-[16px] md:text-[20px] text-white font-semibold px-8 md:px-16 py-2 md:py-3 rounded-2xl"
          onClick={handleGoPayment}
        >
          {t("plan.continue")} →
        </button>
      </div>
    </div>
  );
}
