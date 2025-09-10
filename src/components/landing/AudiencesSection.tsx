"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  UserGroupIcon,
  BookOpenIcon,
  ArrowRightIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";

export default function AudiencesSection() {
  const t = useTranslations("audiences");

  const audiences = [
    {
      key: "solopreneurs",
      icon: UserGroupIcon,
      color: "emerald",
      features: [
        "Launch campaigns",
        "Collect subscribers",
        "Sell products",
        "No ad costs",
      ],
      stats: "10K+ Active Users",
    },
    {
      key: "authors",
      icon: BookOpenIcon,
      color: "violet",
      features: [
        "Create book layouts",
        "Deliver ARCs",
        "Niche marketing",
        "Direct sales",
      ],
      stats: "5K+ Authors",
    },
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      emerald: {
        bg: "bg-emerald-500",
        light: "bg-emerald-50",
        border: "border-emerald-200",
        text: "text-emerald-600",
        accent: "bg-emerald-100",
        gradient: "from-emerald-400 to-teal-500",
      },
      violet: {
        bg: "bg-violet-500",
        light: "bg-violet-50",
        border: "border-violet-200",
        text: "text-violet-600",
        accent: "bg-violet-100",
        gradient: "from-violet-400 to-purple-500",
      },
    };
    return colors[color as keyof typeof colors];
  };

  return (
    <section className="py-24 bg-white relative">
      {/* Geometric background pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-emerald-100 to-transparent rounded-full opacity-60"></div>
          <div className="absolute top-40 right-32 w-24 h-24 bg-gradient-to-br from-violet-100 to-transparent rounded-full opacity-60"></div>
          <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-gradient-to-br from-blue-100 to-transparent rounded-full opacity-60"></div>
          <div className="absolute bottom-20 right-20 w-28 h-28 bg-gradient-to-br from-pink-100 to-transparent rounded-full opacity-60"></div>
        </div>

        {/* Grid lines */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
            linear-gradient(rgba(0,0,0,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.02) 1px, transparent 1px)
          `,
            backgroundSize: "50px 50px",
          }}
        ></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center px-4 py-2 bg-gray-100 rounded-full text-sm font-medium text-gray-600 mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
            Trusted by creators worldwide
          </motion.div>

          <motion.h2
            className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {t("title")}
          </motion.h2>

          <motion.p
            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Join thousands of creators who are building successful businesses
            with our platform
          </motion.p>
        </motion.div>

        {/* Audience Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {audiences.map((audience, index) => {
            const IconComponent = audience.icon;
            const colors = getColorClasses(audience.color);

            return (
              <motion.div
                key={audience.key}
                className="group relative"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.3 }}
              >
                {/* Main Card */}
                <div
                  className={`relative bg-white rounded-2xl border-2 ${colors.border} p-8 shadow-lg hover:shadow-2xl transition-all duration-500 group-hover:border-opacity-60`}
                >
                  {/* Top section with icon and stats */}
                  <div className="flex items-start justify-between mb-8">
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-16 h-16 ${colors.bg} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                      >
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <motion.h3
                          className="text-2xl font-bold text-gray-900 mb-1"
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{
                            duration: 0.6,
                            delay: 0.5 + index * 0.1,
                          }}
                        >
                          {t(`${audience.key}.title`)}
                        </motion.h3>
                        <div
                          className={`inline-flex items-center px-3 py-1 ${colors.accent} rounded-full text-sm font-medium ${colors.text}`}
                        >
                          {audience.stats}
                        </div>
                      </div>
                    </div>

                    <motion.div
                      className={`w-12 h-12 ${colors.light} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                      whileHover={{ rotate: 45 }}
                    >
                      <ArrowRightIcon className={`w-6 h-6 ${colors.text}`} />
                    </motion.div>
                  </div>

                  {/* Description */}
                  <motion.p
                    className="text-gray-600 text-lg leading-relaxed mb-8"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                  >
                    {t(`${audience.key}.desc`)}
                  </motion.p>

                  {/* Features list */}
                  <div className="space-y-3">
                    {audience.features.map((feature, featureIndex) => (
                      <motion.div
                        key={featureIndex}
                        className="flex items-center space-x-3"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 0.5,
                          delay: 0.7 + index * 0.1 + featureIndex * 0.1,
                        }}
                      >
                        <div
                          className={`w-6 h-6 ${colors.bg} rounded-full flex items-center justify-center flex-shrink-0`}
                        >
                          <CheckIcon className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-gray-700 font-medium">
                          {feature}
                        </span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Bottom accent line */}
                  <motion.div
                    className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${colors.gradient} rounded-b-2xl`}
                    initial={{ width: 0 }}
                    whileInView={{ width: "100%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 1 + index * 0.2 }}
                  />
                </div>

                {/* Floating badge */}
                <motion.div
                  className={`absolute -top-4 -right-4 ${colors.bg} text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg`}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 1.2 + index * 0.2 }}
                  whileHover={{ scale: 1.1 }}
                >
                  Popular
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom section */}
        <motion.div
          className="text-center mt-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-8 max-w-4xl mx-auto">
            <motion.h3
              className="text-2xl font-bold text-gray-900 mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 1.0 }}
            >
              Ready to get started?
            </motion.h3>
            <motion.p
              className="text-gray-600 text-lg mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 1.1 }}
            >
              Join our community of successful creators and start building your
              business today.
            </motion.p>
            <motion.button
              className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 1.2 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Your Journey
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
