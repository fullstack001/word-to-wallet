"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  ChatBubbleLeftRightIcon,
  CodeBracketIcon,
  RocketLaunchIcon,
} from "@heroicons/react/24/outline";

export default function HowItWorksNew() {
  const t = useTranslations("howItWorksNew");

  const steps = [
    {
      number: "01",
      icon: ChatBubbleLeftRightIcon,
      title: t("steps.step1.title"),
      description: t("steps.step1.description"),
      gradient: "from-blue-500 via-purple-500 to-pink-500",
      bgGradient: "from-blue-50 to-purple-50",
    },
    {
      number: "02",
      icon: CodeBracketIcon,
      title: t("steps.step2.title"),
      description: t("steps.step2.description"),
      gradient: "from-emerald-500 via-teal-500 to-cyan-500",
      bgGradient: "from-emerald-50 to-teal-50",
    },
    {
      number: "03",
      icon: RocketLaunchIcon,
      title: t("steps.step3.title"),
      description: t("steps.step3.description"),
      gradient: "from-orange-500 via-red-500 to-pink-500",
      bgGradient: "from-orange-50 to-red-50",
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-white via-gray-50 to-blue-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-r from-emerald-400/10 to-teal-400/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-gradient-to-r from-orange-400/10 to-pink-400/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-4000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {t("title")}
          </motion.h2>
          <motion.div
            className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="group relative"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
              {/* Connection line for desktop */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-gray-300 to-transparent z-0"></div>
              )}

              {/* Step card */}
              <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 group-hover:scale-105 border border-gray-200/50">
                {/* Step number */}
                <div className="absolute -top-4 -left-4 w-16 h-16 bg-gradient-to-r from-gray-900 to-gray-700 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">
                    {step.number}
                  </span>
                </div>

                {/* Icon */}
                <motion.div
                  className={`w-20 h-20 bg-gradient-to-r ${step.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg mx-auto`}
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <step.icon className="w-10 h-10 text-white" />
                </motion.div>

                {/* Content */}
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 leading-tight">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Hover effect overlay */}
                <div
                  className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${step.bgGradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}
                ></div>
              </div>

              {/* Floating particles effect */}
              <div
                className={`absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-r ${step.gradient} rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-ping`}
              ></div>
              <div
                className={`absolute -bottom-2 -left-2 w-3 h-3 bg-gradient-to-r ${step.gradient} rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-ping animation-delay-1000`}
              ></div>
            </motion.div>
          ))}
        </div>

        {/* Bottom decorative element */}
        <motion.div
          className="flex justify-center mt-16"
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className="flex space-x-2">
            {[0, 1, 2].map((dot) => (
              <motion.div
                key={dot}
                className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: dot * 0.3 }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
