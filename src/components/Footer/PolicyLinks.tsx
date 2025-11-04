"use client";
import { useTranslations } from "next-intl";
import { useLocalizedNavigation } from "@/utils/navigation";

export default function PolicyLinks() {
  const t = useTranslations();
  const { navigate } = useLocalizedNavigation();

  const links = [
    {
      label: t("privacyPolicy.title"),
      path: "/privacy-policy",
    },
    {
      label: "Terms of Use",
      path: "/terms",
    },
    {
      label: "Contact Us",
      path: "/contact",
    },
  ];

  return (
    <div className="flex flex-wrap justify-center lg:justify-start items-center gap-x-4 gap-y-2 text-sm">
      {links.map((link, index) => (
        <div key={link.path} className="flex items-center">
          <button
            onClick={() => navigate(link.path)}
            className="hover:text-gray-300 transition-colors cursor-pointer"
          >
            {link.label}
          </button>
          {index < links.length - 1 && (
            <span className="ml-4 text-gray-400">|</span>
          )}
        </div>
      ))}
    </div>
  );
}
