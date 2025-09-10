"use client";
import { useState } from "react";
import { ChevronDownIcon } from "lucide-react";
import { ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import "../../app/globals.css";

export default function FAQ() {
  const t = useTranslations("faq");
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const faqData = [
    {
      question: t("q1.q"),
      answer: t("q1.a"),
    },
    {
      question: t("q2.q"),
      answer: t("q2.a"),
    },
    {
      question: t("q3.q"),
      answer: t("q3.a"),
    },
  ];

  const toggle = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="py-6 md:py-8 lg:py-12 px-6 sm:px-10 md:px-16 lg:px-24 bg-blue-50 mx-auto">
      {/* FAQ Accordion */}
      <div className="max-w-4xl mx-auto">
        <h2 className="text-[20px] sm:text-[24px] md:text-[28px] lg:text-[40px] font-medium text-gray-900 mb-4 sm:mb-6 md:mb-8 text-center">
          {t("title")}
        </h2>
        <div className="space-y-4">
          {faqData.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-4 sm:p-6 shadow-lg"
            >
              <button
                className="w-full text-left text-[16px] sm:text-[18px] py-2 sm:py-4 font-semibold text-gray-800 flex justify-between items-center"
                onClick={() => toggle(index)}
              >
                {faq.question}
                <ChevronDownIcon
                  className={`transition-transform duration-300 ${
                    activeIndex === index ? "rotate-180" : ""
                  }`}
                  size={20}
                />
              </button>
              {activeIndex === index && (
                <div className="py-4 text-sm text-[14px] sm:text-[16px] border-t text-gray-600">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
