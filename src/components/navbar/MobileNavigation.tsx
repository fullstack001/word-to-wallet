"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import type { NavbarProps } from "./types";

export function MobileNavigation({
  isLoggedIn,
  user,
  t,
  navigate,
  mobileMenuOpen,
  onMobileToggle,
  onCloseMobileMenu,
}: NavbarProps) {
  const navigationItems = [
    { label: "Course", path: "/course" },
    { label: "Contact Us", path: "/contact" },
    { label: "Blogs", path: "/blogs" },
    // { label: "Start with Free", path: "/start-free" },
  ];

  return (
    <div className="xl:hidden">
      {/* Mobile menu button */}
      <motion.button
        onClick={onMobileToggle}
        className="p-2 rounded-full bg-white/80 backdrop-blur-sm border border-white/50 shadow-lg"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {mobileMenuOpen ? (
          <XMarkIcon className="w-6 h-6 text-gray-700" />
        ) : (
          <Bars3Icon className="w-6 h-6 text-gray-700" />
        )}
      </motion.button>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={onCloseMobileMenu}
            />

            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-80 bg-white/95 backdrop-blur-sm shadow-2xl z-50 p-6"
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-bold text-gray-900">Menu</h2>
                  <button
                    onClick={onCloseMobileMenu}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                  >
                    <XMarkIcon className="w-6 h-6 text-gray-700" />
                  </button>
                </div>

                {/* Navigation items */}
                <nav className="flex-1 space-y-4">
                  {navigationItems.map((item, index) => (
                    <motion.button
                      key={item.path}
                      onClick={() => {
                        navigate(item.path);
                        onCloseMobileMenu();
                      }}
                      className="w-full text-left px-4 py-3 rounded-xl text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-all duration-200"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {item.label}
                    </motion.button>
                  ))}
                </nav>

                {/* Auth section */}
                <div className="pt-6 border-t border-gray-200">
                  {isLoggedIn ? (
                    <div className="space-y-3">
                      <div className="px-4 py-2 text-sm text-gray-600">
                        Welcome, {user.name || user.email || "User"}
                      </div>
                      <button
                        onClick={() => {
                          navigate("/account");
                          onCloseMobileMenu();
                        }}
                        className="w-full text-left px-4 py-3 rounded-xl text-gray-700 hover:bg-purple-50 transition-colors duration-200"
                      >
                        My Account
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        navigate("/login");
                        onCloseMobileMenu();
                      }}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg"
                    >
                      {t("auth.signIn")}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
