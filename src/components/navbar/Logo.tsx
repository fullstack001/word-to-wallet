"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface LogoProps {
  onNavigateHome: () => void;
}

export function Logo({ onNavigateHome }: LogoProps) {
  return (
    <motion.button
      onClick={onNavigateHome}
      className="flex items-center space-x-3 group"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="relative w-10 h-10">
        <Image
          src="/logo.png"
          alt="WordToWallet Logo"
          fill
          className="object-contain"
          priority
        />
      </div>
      <span className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors duration-300">
        WordToWallet
      </span>
    </motion.button>
  );
}
