"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLoading } from "../../contexts/LoadingContext";
import Loading from "./Loading";

export default function GlobalLoading() {
  const { isLoading, loadingMessage } = useLoading();

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-xl shadow-xl p-8 max-w-sm mx-4"
          >
            <Loading message={loadingMessage} size="lg" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
