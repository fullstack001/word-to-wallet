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
      question: t("multipleUsers"),
      answer: t("multipleUsersAnswer"),
    },
    {
      question: t("customerSupport"),
      answer: t("customerSupportAnswer"),
    },
    {
      question: t("processingSpeed"),
      answer: t("processingSpeedAnswer"),
    },
    {
      question: t("moneyBack"),
      answer: t("moneyBackAnswer"),
    },
  ];

  const toggle = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="py-6 md:py-8 lg:py-12 px-6 sm:px-10 md:px-16 lg:px-24 bg-blue-50 mx-auto flex flex-col lg:flex-row gap-6 md:gap-10 items-center justify-between">
      {/* Accordion */}
      <div className="flex-1 p-6 sm:p-8 md:p-12 gap-6 md:gap-8">
        <h2 className="text-[20px] sm:text-[24px] md:text-[28px] lg:text-[40px] font-medium text-gray-900 mb-4 sm:mb-6 md:mb-8">
          {t("title")}
        </h2>
        {faqData.map((faq, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-4 sm:p-6 shadow mb-2"
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

      {/* CTA Box */}
      <div className="flex-1 bg-primary-900 text-white rounded-2xl p-6 sm:p-8 md:p-12 flex flex-col justify-between">
        <div>
          <h3 className="text-[24px] sm:text-[30px] md:text-[40px] font-medium mb-6 sm:mb-8">
            {t("ctaTitle")}
          </h3>
          <p className="text-[16px] sm:text-[18px] md:text-[20px] font-medium leading-relaxed">
            {t("ctaDescription")}
          </p>
        </div>
        <div className="mt-4 sm:mt-6">
          <button className="bg-[#4B68FF] px-4 py-3 rounded-2xl text-[16px] sm:text-[18px] md:text-[24px] font-bold shadow-md flex items-center">
            {t("ctaButton")}
            <ChevronRight className="inline w-4 sm:w-5 md:w-6 h-4 sm:h-5 md:h-6 ml-1 mb-1" />
          </button>
        </div>
      </div>
    </section>
  );
}
