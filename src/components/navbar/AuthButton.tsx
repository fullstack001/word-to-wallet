"use client";

import { motion } from "framer-motion";

interface AuthButtonProps {
  onClick: () => void;
  label: string;
}

export function AuthButton({ onClick, label }: AuthButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
    >
      {label}
    </motion.button>
  );
}
