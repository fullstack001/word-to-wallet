"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDownIcon,
  UserIcon,
  CogIcon,
  ArrowRightOnRectangleIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";
import type { NavbarProps } from "./types";

export function UserDropdown({
  user,
  t,
  navigate,
  userDropdownOpen,
  onUserDropdownToggle,
  onLogout,
  onCloseUserDropdown,
}: NavbarProps) {
  return (
    <div className="relative">
      <motion.button
        onClick={onUserDropdownToggle}
        className="flex items-center space-x-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
          <UserIcon className="w-5 h-5 text-white" />
        </div>
        <span className="text-gray-700 font-medium hidden sm:block">
          {user.name || user.email || "User"}
        </span>
        <ChevronDownIcon
          className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${
            userDropdownOpen ? "rotate-180" : ""
          }`}
        />
      </motion.button>

      <AnimatePresence>
        {userDropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-48 bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/50 py-2 z-50"
          >
            <button
              onClick={() => {
                navigate("/dashboard");
                onCloseUserDropdown();
              }}
              className="w-full px-4 py-3 text-left text-gray-700 hover:bg-purple-50 transition-colors duration-200 flex items-center space-x-3"
            >
              <HomeIcon className="w-5 h-5" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => {
                navigate("/account");
                onCloseUserDropdown();
              }}
              className="w-full px-4 py-3 text-left text-gray-700 hover:bg-purple-50 transition-colors duration-200 flex items-center space-x-3"
            >
              <UserIcon className="w-5 h-5" />
              <span>{t("navbar.myAccount")}</span>
            </button>

            <button
              onClick={() => {
                navigate("/account");
                onCloseUserDropdown();
              }}
              className="w-full px-4 py-3 text-left text-gray-700 hover:bg-purple-50 transition-colors duration-200 flex items-center space-x-3"
            >
              <CogIcon className="w-5 h-5" />
              <span>Settings</span>
            </button>

            {"isAdmin" in user && (user as any).isAdmin && (
              <button
                onClick={() => {
                  navigate("/admin/dashboard");
                  onCloseUserDropdown();
                }}
                className="w-full px-4 py-3 text-left text-blue-600 hover:bg-blue-50 transition-colors duration-200 flex items-center space-x-3"
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
                <span>Admin Panel</span>
              </button>
            )}

            <hr className="my-2 border-gray-200" />

            <button
              onClick={onLogout}
              className="w-full px-4 py-3 text-left text-red-600 hover:bg-red-50 transition-colors duration-200 flex items-center space-x-3"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
