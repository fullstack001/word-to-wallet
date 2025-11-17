"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Bars3Icon,
  XMarkIcon,
  UserIcon,
  CogIcon,
  ArrowRightOnRectangleIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";
import type { NavbarProps } from "./types";

export function MobileNavigation({
  isLoggedIn,
  user,
  t,
  navigate,
  mobileMenuOpen,
  onMobileToggle,
  onCloseMobileMenu,
  onLogout,
}: NavbarProps) {
  const navigationItems = [
    { label: t("navbar.course"), path: "/course" },
    { label: t("navbar.contactUs"), path: "/contact" },
    { label: t("navbar.blogs"), path: "/blogs" },
    // { label: "Start with Free", path: "/start-free" },
  ];

  return (
    <div className="lg:hidden">
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
              className="fixed top-0 right-0 h-full w-full sm:w-96 bg-white/95 backdrop-blur-sm shadow-2xl z-50 p-6 overflow-y-auto"
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-bold text-gray-900">{t("navbar.menu")}</h2>
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
                <div className="pt-6 border-t border-gray-200 space-y-3">
                  {isLoggedIn ? (
                    <>
                      <div className="px-4 py-2 text-sm text-gray-600 mb-2">
                        <div className="font-semibold text-gray-900">
                          {user.name || user.email || t("navbar.user")}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {t("navbar.welcomeBack")}
                        </div>
                      </div>
                      
                      <button
                        onClick={() => {
                          navigate("/dashboard");
                          onCloseMobileMenu();
                        }}
                        className="w-full text-left px-4 py-3 rounded-xl text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-all duration-200 flex items-center space-x-3"
                      >
                        <HomeIcon className="w-5 h-5" />
                        <span>{t("navbar.dashboard")}</span>
                      </button>

                      <button
                        onClick={() => {
                          navigate("/account");
                          onCloseMobileMenu();
                        }}
                        className="w-full text-left px-4 py-3 rounded-xl text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-all duration-200 flex items-center space-x-3"
                      >
                        <UserIcon className="w-5 h-5" />
                        <span>{t("navbar.myAccount")}</span>
                      </button>

                      <button
                        onClick={() => {
                          navigate("/account");
                          onCloseMobileMenu();
                        }}
                        className="w-full text-left px-4 py-3 rounded-xl text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-all duration-200 flex items-center space-x-3"
                      >
                        <CogIcon className="w-5 h-5" />
                        <span>{t("navbar.settings")}</span>
                      </button>

                      {"isAdmin" in user && (user as any).isAdmin && (
                        <button
                          onClick={() => {
                            navigate("/admin/dashboard");
                            onCloseMobileMenu();
                          }}
                          className="w-full text-left px-4 py-3 rounded-xl text-blue-600 hover:bg-blue-50 transition-all duration-200 flex items-center space-x-3"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                            />
                          </svg>
                          <span>{t("navbar.adminPanel")}</span>
                        </button>
                      )}

                      <hr className="my-2 border-gray-200" />

                      <button
                        onClick={() => {
                          onLogout();
                          onCloseMobileMenu();
                        }}
                        className="w-full text-left px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-200 flex items-center space-x-3"
                      >
                        <ArrowRightOnRectangleIcon className="w-5 h-5" />
                        <span>{t("navbar.logout")}</span>
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        navigate("/login");
                        onCloseMobileMenu();
                      }}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
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
