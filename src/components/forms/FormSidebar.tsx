"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

const categories = [
  {
    titleKey: "files.taxForms",
    sub: ["1099", "W-2"],
  },
  {
    titleKey: "files.legalForms",
    sub: ["Power of Attorney", "Will"],
  },
  {
    titleKey: "files.healthcareForms",
    sub: ["HIPAA Authorization", "Medical History"],
  },
  {
    titleKey: "files.militaryForms",
    sub: ["DD-214", "VA Forms"],
  },
  {
    titleKey: "files.educationForms",
    sub: ["Transcript Request", "School Registration Form"],
  },
  {
    titleKey: "files.businessForms",
    sub: ["Invoice Template", "Business Agreement"],
  },
  {
    titleKey: "files.financialForms",
    sub: ["Expense Report", "Budget Planner"],
  },
  {
    titleKey: "files.realEstate",
    sub: ["Rental Agreement", "Purchase Agreement"],
  },
  {
    titleKey: "files.insuranceForms",
    sub: ["Claim Form", "Policy Application"],
  },
  {
    titleKey: "files.travelForms",
    sub: ["Visa Application", "Customs Declaration"],
  },
  {
    titleKey: "files.techForms",
    sub: ["Bug Report", "Software Installation Request"],
  },
  {
    titleKey: "files.otherForms",
    sub: ["Feedback Form", "Miscellaneous Document"],
  },
];

export default function FormSidebar() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const t = useTranslations();

  return (
    <aside className="w-64 p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-sm font-semibold mb-4 text-blue-600">All Forms</h2>
      <ul className="space-y-2">
        {categories.map(({ titleKey, sub }) => (
          <li key={titleKey}>
            <div
              className="flex items-center text-sm font-medium text-gray-800 cursor-pointer hover:text-blue-600 border-b-2 mb-2 py-2"
              onClick={() =>
                setExpanded(titleKey === expanded ? null : titleKey)
              }
            >
              <ChevronRight
                size={16}
                className={`transition mr-2 ${
                  expanded === titleKey ? "rotate-90" : ""
                }`}
              />
              {t(titleKey)}{" "}
            </div>
            {expanded === titleKey && (
              <ul className="ml-4 mt-1 space-y-1">
                {sub.map((subItem) => (
                  <li
                    key={subItem}
                    className="text-sm text-gray-600 hover:text-blue-600 cursor-pointer"
                  >
                    {subItem}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </aside>
  );
}
