"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  CheckIcon,
  CodeBracketIcon,
  EnvelopeIcon,
  ChartBarIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";

export default function ValueSection() {
  const t = useTranslations("value");

  const cards = [
    {
      key: "epub3",
      icon: CodeBracketIcon,
      gradient: "from-purple-500 via-pink-500 to-red-500",
      bgGradient: "from-purple-50 to-pink-50",
      borderGradient: "from-purple-200 to-pink-200",
    },
    {
      key: "email",
      icon: EnvelopeIcon,
      gradient: "from-blue-500 via-cyan-500 to-teal-500",
      bgGradient: "from-blue-50 to-cyan-50",
      borderGradient: "from-blue-200 to-cyan-200",
    },
    {
      key: "analytics",
      icon: ChartBarIcon,
      gradient: "from-emerald-500 via-green-500 to-lime-500",
      bgGradient: "from-emerald-50 to-green-50",
      borderGradient: "from-emerald-200 to-green-200",
    },
    {
      key: "byoa",
      icon: ArrowTopRightOnSquareIcon,
      gradient: "from-orange-500 via-amber-500 to-yellow-500",
      bgGradient: "from-orange-50 to-amber-50",
      borderGradient: "from-orange-200 to-amber-200",
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-80 h-80 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-gradient-to-r from-emerald-600/20 to-green-600/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-4000"></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {t("title")}
          </motion.h2>
          <motion.div
            className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {cards.map((card, index) => {
            // Access translations directly for each card
            const title = t(`cards.${card.key}.title`);
            const description = t(`cards.${card.key}.description`);

            // Handle features array - only show for epub3 card
            const features =
              card.key === "epub3"
                ? [
                    t("cards.epub3.features.0"),
                    t("cards.epub3.features.1"),
                    t("cards.epub3.features.2"),
                  ]
                : [];

            return (
              <motion.div
                key={card.key}
                className="group relative"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                {/* Card */}
                <div className="relative h-full bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8 shadow-2xl hover:shadow-purple-500/25 transition-all duration-500 group-hover:scale-105 group-hover:border-white/40">
                  {/* Gradient border effect */}
                  <div
                    className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${card.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}
                  ></div>

                  {/* Icon */}
                  <motion.div
                    className={`relative w-16 h-16 bg-gradient-to-r ${card.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}
                    whileHover={{ rotate: 5, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <card.icon className="w-8 h-8 text-white" />
                  </motion.div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-white mb-4 leading-tight">
                    {title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-300 leading-relaxed mb-6 text-sm">
                    {description}
                  </p>

                  {/* Features */}
                  {features && features.length > 0 && (
                    <div className="space-y-3">
                      {features.map((feature: string, featureIndex: number) => (
                        <motion.div
                          key={featureIndex}
                          className="flex items-start space-x-3"
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{
                            duration: 0.5,
                            delay: index * 0.1 + featureIndex * 0.1,
                          }}
                        >
                          <div className="flex-shrink-0 w-5 h-5 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center mt-0.5">
                            <CheckIcon className="w-3 h-3 text-white" />
                          </div>
                          <span className="text-gray-300 text-sm leading-relaxed">
                            {feature}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {/* Hover effect overlay */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>

                {/* Floating particles effect */}
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-ping"></div>
                <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-ping animation-delay-1000"></div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <motion.p
            className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            Everything you need to turn your words into sales, with professional
            tools and direct-to-reader distribution.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
