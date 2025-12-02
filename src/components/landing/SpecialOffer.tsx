"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Gift, Sparkles } from "lucide-react";

export default function SpecialOffer() {
  return (
    <section className="py-20 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-1/4 w-64 h-64 bg-gradient-to-r from-pink-300 to-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-gradient-to-r from-blue-300 to-cyan-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float animation-delay-2000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-pink-100 to-purple-100 text-purple-800 text-sm font-medium mb-6 border border-purple-200 shadow-lg backdrop-blur-sm"
            whileHover={{ scale: 1.05, y: -2 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Gift className="w-5 h-5 mr-2 text-pink-500" />
            <Sparkles className="w-5 h-5 mr-2 text-yellow-500" />
            Limited Time Offer
          </motion.div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Special Offer for New Members
          </h2>
        </motion.div>

        <motion.div
          className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-purple-200"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="prose prose-lg max-w-none">
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-6">
              Enjoy your{" "}
              <strong className="text-purple-600">7-day free trial</strong>, and
              if you decide to upgrade with a custom-built website, we'll
              include a{" "}
              <strong className="text-pink-600">
                free six-month Pro Account Membership
              </strong>{" "}
              at no extra cost.
            </p>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
              This limited-time deal is available to new members who purchase a
              tailored, integrated website built to match your business. For
              further information, please{" "}
              <Link
                href="https://wordtowallet.com/en/blogs/how-purchasing-a-tailored-website-can-increase-your-brand-awareness"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-600 hover:text-purple-800 font-semibold underline decoration-2 underline-offset-2 transition-colors duration-200"
              >
                read this blog post
              </Link>{" "}
              by our founder and CEO.
            </p>
          </div>
        </motion.div>
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
      `}</style>
    </section>
  );
}
