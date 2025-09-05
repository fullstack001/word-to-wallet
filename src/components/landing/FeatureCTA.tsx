"use client";

import { CheckIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export default function FeatureCTA() {
  const t = useTranslations("features");

  const features = [
    {
      icon: "🚀",
      title: t("cards.aiWriting.title"),
      description: t("cards.aiWriting.description"),
      features: [
        t("cards.aiWriting.features.0"),
        t("cards.aiWriting.features.1"),
        t("cards.aiWriting.features.2"),
      ],
      gradient: "from-pink-500 to-purple-500",
      bgGradient: "from-pink-50 to-purple-50",
      borderColor: "border-pink-200",
    },
    {
      icon: "📈",
      title: t("cards.audience.title"),
      description: t("cards.audience.description"),
      features: [
        t("cards.audience.features.0"),
        t("cards.audience.features.1"),
        t("cards.audience.features.2"),
      ],
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50",
      borderColor: "border-blue-200",
    },
    {
      icon: "💰",
      title: t("cards.sales.title"),
      description: t("cards.sales.description"),
      features: [
        t("cards.sales.features.0"),
        t("cards.sales.features.1"),
        t("cards.sales.features.2"),
      ],
      gradient: "from-green-500 to-emerald-500",
      bgGradient: "from-green-50 to-emerald-50",
      borderColor: "border-green-200",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-1/4 w-64 h-64 bg-gradient-to-r from-pink-300 to-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-float"></div>
        <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-gradient-to-r from-blue-300 to-cyan-300 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-float animation-delay-2000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {t("title")}{" "}
            <span className="bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
              {t("titleHighlight")}
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t("subtitle")}
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className={`relative group bg-gradient-to-br ${feature.bgGradient} p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border ${feature.borderColor} hover:border-opacity-50 overflow-hidden`}
              variants={cardVariants as any}
              whileHover={{
                y: -10,
                scale: 1.02,
                transition: { type: "spring", stiffness: 300 },
              }}
            >
              {/* Animated background gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
              ></div>

              {/* Floating icon */}
              <motion.div
                className="text-6xl mb-6 relative z-10"
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                {feature.icon}
              </motion.div>

              <h3 className="text-xl font-bold text-gray-900 mb-3 relative z-10">
                {feature.title}
              </h3>
              <p className="text-gray-600 mb-6 relative z-10">
                {feature.description}
              </p>

              <ul className="space-y-3 relative z-10">
                {feature.features.map((item, idx) => (
                  <motion.li
                    key={idx}
                    className="flex items-center text-sm text-gray-600"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-gradient-to-r ${feature.gradient} flex items-center justify-center mr-3 flex-shrink-0`}
                    >
                      <CheckIcon className="w-3 h-3 text-white" />
                    </div>
                    {item}
                  </motion.li>
                ))}
              </ul>

              {/* Hover effect border */}
              <div
                className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}
              ></div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
