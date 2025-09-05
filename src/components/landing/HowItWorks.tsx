"use client";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import "../../app/globals.css";

export default function HowItWorks() {
  const t = useTranslations("howItWorks");
  const [activeStep, setActiveStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const steps = [
    {
      step: "01",
      title: t("steps.step1.title"),
      description: t("steps.step1.description"),
      image:
        "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      icon: "📚",
      gradient: "from-emerald-400 via-teal-500 to-cyan-600",
      bgGradient: "from-emerald-50 to-cyan-50",
      borderGradient: "from-emerald-400 to-cyan-600",
    },
    {
      step: "02",
      title: t("steps.step2.title"),
      description: t("steps.step2.description"),
      image:
        "https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      icon: "📧",
      gradient: "from-purple-400 via-pink-500 to-rose-600",
      bgGradient: "from-purple-50 to-rose-50",
      borderGradient: "from-purple-400 to-rose-600",
    },
    {
      step: "03",
      title: t("steps.step3.title"),
      description: t("steps.step3.description"),
      image:
        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      icon: "🚀",
      gradient: "from-orange-400 via-red-500 to-pink-600",
      bgGradient: "from-orange-50 to-pink-50",
      borderGradient: "from-orange-400 to-pink-600",
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.querySelector("#how-it-works");
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isVisible) {
      const interval = setInterval(() => {
        setActiveStep((prev) => (prev + 1) % steps.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isVisible, steps.length]);

  return (
    <section
      id="how-it-works"
      className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div
          className={`text-center mb-16 transition-all duration-1000 ease-out transform ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-6">
            {t("title")}
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t("subtitle")}
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`group relative transition-all duration-700 ease-out transform ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-20 opacity-0"
              }`}
              style={{ transitionDelay: `${index * 200}ms` }}
              onMouseEnter={() => setActiveStep(index)}
            >
              {/* Card Container */}
              <div
                className={`relative h-full p-6 sm:p-8 rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 ease-out transform hover:-translate-y-2 border-2 border-transparent hover:border-gradient-to-r ${step.borderGradient} group-hover:scale-105`}
              >
                {/* Background Pattern */}
                <div
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${step.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />

                {/* Step Number Badge */}
                <div className={`relative z-10 mb-6 flex justify-center`}>
                  <div
                    className={`relative w-16 h-16 bg-gradient-to-r ${step.gradient} rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    {step.step}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>

                {/* Icon */}
                <div className="relative z-10 text-center mb-4">
                  <span className="text-4xl sm:text-5xl filter drop-shadow-lg group-hover:scale-110 transition-transform duration-300">
                    {step.icon}
                  </span>
                </div>

                {/* Image */}
                <div className="relative z-10 mb-6 overflow-hidden rounded-xl">
                  <div className="relative">
                    <img
                      src={step.image}
                      alt={step.title}
                      className="w-full h-40 sm:h-48 object-cover rounded-xl group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                    <div
                      className={`absolute inset-0 bg-gradient-to-t ${step.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="relative z-10 text-center">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-gray-900 group-hover:to-blue-800 transition-all duration-300">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                    {step.description}
                  </p>
                </div>

                {/* Hover Effect Border */}
                <div
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${step.borderGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-sm`}
                />
              </div>

              {/* Connection Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-gray-300 to-gray-400 transform -translate-y-1/2 z-0">
                  <div className="w-full h-full bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div
          className={`text-center mt-16 transition-all duration-1000 ease-out transform ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
          style={{ transitionDelay: "600ms" }}
        >
          <div className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer">
            <span>{t("cta")}</span>
            <svg
              className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-r from-pink-400/20 to-orange-400/20 rounded-full blur-xl animate-pulse" />
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-full blur-lg animate-bounce" />
    </section>
  );
}
