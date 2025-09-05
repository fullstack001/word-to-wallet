"use client";

import {
  StarIcon,
  CheckIcon,
  ArrowRightIcon,
  PlayIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useState } from "react";

// Video Modal Component
function VideoModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        className="relative w-full max-w-4xl mx-4 bg-black rounded-2xl overflow-hidden shadow-2xl"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors duration-200"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        {/* Video */}
        <video
          className="w-full h-auto"
          controls
          autoPlay
          muted
          onEnded={onClose}
        >
          <source
            src="/assets/videos/Word to Wallet Promo.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
      </motion.div>
    </div>
  );
}

export default function HeroSection() {
  const t = useTranslations("hero");
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const openVideoModal = () => setIsVideoModalOpen(true);
  const closeVideoModal = () => setIsVideoModalOpen(false);

  return (
    <>
      <section className="relative overflow-hidden min-h-screen">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="assets/images/hero_bg.png"
            alt="Hero Background"
            className="w-full h-full object-cover"
          />
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        {/* Animated background elements */}
        <div className="absolute inset-0 z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10 z-20"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32 z-30">
          {/* Main content grid - text left, image right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-[80vh]">
            {/* Left side - Text content */}
            <motion.div
              className="text-left order-2 lg:order-1"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-pink-100 to-purple-100 text-purple-800 text-sm font-medium mb-8 border border-purple-200 shadow-lg backdrop-blur-sm"
                whileHover={{ scale: 1.05, y: -2 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <StarIcon className="w-5 h-5 mr-2 text-yellow-500" />
                {t("badge")}
              </motion.div>

              <motion.h1
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight mb-6 drop-shadow-2xl"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                {t("title")}{" "}
                <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent animate-gradient-x">
                  {t("titleHighlight")}
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient-x-reverse">
                  Sell Direct to Your Readers
                </span>
              </motion.h1>

              <motion.p
                className="text-lg sm:text-xl lg:text-2xl text-gray-200 max-w-2xl mb-10 leading-relaxed drop-shadow-lg"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                {t("subtitle")}
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-4 mb-12"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <motion.button
                  className="group bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 flex items-center justify-center relative overflow-hidden"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="relative z-10 flex items-center">
                    {t("ctaPrimary")}
                    <ArrowRightIcon className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
                  </span>
                </motion.button>

                <motion.button
                  onClick={openVideoModal}
                  className="flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 border-2 border-white/30 rounded-xl font-semibold text-base sm:text-lg hover:border-white/50 hover:bg-white/10 transition-all duration-300 bg-white/10 backdrop-blur-sm text-white"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <PlayIcon className="w-4 h-4 sm:w-5 sm:w-5 mr-2" />
                  {t("ctaSecondary")}
                </motion.button>
              </motion.div>

              <motion.div
                className="flex flex-col sm:flex-row gap-4 sm:gap-8 text-sm text-gray-300"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                {[
                  {
                    text: t("features.noCreditCard"),
                    icon: CheckIcon,
                    color: "text-green-400",
                  },
                  {
                    text: t("features.freeForever"),
                    icon: CheckIcon,
                    color: "text-blue-400",
                  },
                  {
                    text: t("features.cancelAnytime"),
                    icon: CheckIcon,
                    color: "text-purple-400",
                  },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <item.icon className={`w-4 h-4 mr-2 ${item.color}`} />
                    {item.text}
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right side - Hero Image */}
            <motion.div
              className="order-1 lg:order-2 flex items-center justify-center"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              <div className="relative group w-full max-w-lg lg:max-w-xl xl:max-w-2xl">
                <div className="absolute -inset-4 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                <img
                  src="/assets/images/hero_feature.avif"
                  alt="AI Writing Platform"
                  className="relative w-full h-auto rounded-2xl shadow-2xl transform group-hover:scale-[1.02] transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent rounded-2xl"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      <VideoModal isOpen={isVideoModalOpen} onClose={closeVideoModal} />
    </>
  );
}
