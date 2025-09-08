"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  CheckIcon,
  ArrowRightIcon,
  StarIcon,
} from "@heroicons/react/24/outline";

export default function PromoFreeCourse() {
  const t = useTranslations("promo");

  const points = [
    t("points.0"),
    t("points.1"),
    t("points.2"),
    t("points.3"),
    t("points.4"),
  ];

  return (
    <section className="relative py-20 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-40 h-40 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/3 w-36 h-36 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          {/* Badge */}
          <motion.div
            className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 text-sm font-medium mb-8 border border-purple-200 shadow-lg backdrop-blur-sm"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <StarIcon className="w-5 h-5 mr-2 text-yellow-500" />
            {t("badge")}
          </motion.div>

          {/* Title */}
          <motion.h2
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {t("title")}
          </motion.h2>

          {/* Subtitle */}
          <motion.div
            className="max-w-4xl mx-auto mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-700 leading-relaxed mb-4">
              {t("sub.part1")}
            </p>
            <p className="text-lg sm:text-xl font-semibold text-purple-600">
              {t("sub.highlight")}
            </p>
          </motion.div>
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left side - Points */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
          >
            {points.map((point, index) => (
              <motion.div
                key={index}
                className="flex items-start space-x-4 p-6 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02, y: -2 }}
              >
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <CheckIcon className="w-5 h-5 text-white" />
                </div>
                <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
                  {point}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Right side - CTA */}
          <motion.div
            className="text-center lg:text-left"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 lg:p-12 shadow-2xl border border-white/50">
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.0 }}
                viewport={{ once: true }}
              >
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
                  Ready to Get Started?
                </h3>

                <div className="space-y-4">
                  <motion.button
                    className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 flex items-center justify-center relative overflow-hidden group"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    <span className="relative z-10 flex items-center">
                      {t("ctaPrimary")}
                      <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
                    </span>
                  </motion.button>

                  <motion.button
                    className="w-full border-2 border-purple-300 text-purple-700 px-8 py-4 rounded-xl font-semibold text-lg hover:border-purple-400 hover:bg-purple-50 transition-all duration-300 bg-white/50 backdrop-blur-sm"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {t("ctaSecondary")}
                  </motion.button>
                </div>

                <motion.p
                  className="text-sm text-gray-600 leading-relaxed pt-4 border-t border-gray-200"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 1.2 }}
                  viewport={{ once: true }}
                >
                  {t("legal")}
                </motion.p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
