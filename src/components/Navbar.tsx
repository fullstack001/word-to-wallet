"use client";

import React, { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

import { RootState } from "../store/store";
import { logout } from "../store/slices/authSlice";
import { clearUser } from "../store/slices/userSlice";
import { useLocalizedNavigation } from "../utils/navigation";
import { MobileNavigation } from "./navbar/MobileNavigation";
import { UserDropdown } from "./navbar/UserDropdown";
import { AuthButton } from "./navbar/AuthButton";
import { Logo } from "./navbar/Logo";

import type { NavbarProps } from "./navbar/types";

/**
 * Main navigation bar component that provides responsive navigation
 * with user authentication, dropdown menus, and mobile support
 */
export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const user = useSelector((state: RootState) => state.user);
  const t = useTranslations();
  const { navigate } = useLocalizedNavigation();

  // Navigation items
  const navigationItems = [
    { label: "Free Course", path: "/free-course" },
    { label: "Contact Us", path: "/contact" },
    { label: "Blogs", path: "/blogs" },
    // { label: "Start with Free", path: "/start-free" },
  ];

  // Handlers
  const handleMobileToggle = useCallback(() => {
    setMobileMenuOpen((prev) => !prev);
  }, []);

  const handleUserDropdownToggle = useCallback(() => {
    setUserDropdownOpen((prev) => !prev);
  }, []);

  const handleLogout = useCallback(() => {
    // Clear all global state
    dispatch(logout());
    dispatch(clearUser());

    // Clear both localStorage and sessionStorage
    localStorage.removeItem("authToken");
    localStorage.removeItem("rememberedEmail");
    localStorage.removeItem("rememberMe");
    sessionStorage.removeItem("authToken");

    navigate("/");
    setUserDropdownOpen(false);
  }, [dispatch, navigate]);

  const handleCloseMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  const handleCloseUserDropdown = useCallback(() => {
    setUserDropdownOpen(false);
  }, []);

  const navbarProps: NavbarProps = {
    isLoggedIn,
    user: {
      ...user,
      subscription: user.subscription
        ? {
            plan: user.subscription.plan,
          }
        : undefined,
    },
    t,
    navigate,
    mobileMenuOpen,
    userDropdownOpen,
    onMobileToggle: handleMobileToggle,
    onUserDropdownToggle: handleUserDropdownToggle,
    onLogout: handleLogout,
    onCloseMobileMenu: handleCloseMobileMenu,
    onCloseUserDropdown: handleCloseUserDropdown,
  };

  return (
    <motion.header
      className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="bg-white/80 backdrop-blur-md border border-white/50 rounded-2xl shadow-2xl px-6 py-4 w-full max-w-6xl">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Logo onNavigateHome={() => navigate("/")} />

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigationItems.map((item, index) => (
              <motion.button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="text-gray-700 hover:text-purple-600 font-medium transition-colors duration-300 relative group"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.3 }}
                whileHover={{ y: -2 }}
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 group-hover:w-full transition-all duration-300"></span>
              </motion.button>
            ))}
          </nav>

          {/* Desktop Authentication */}
          <div className="hidden lg:flex items-center gap-4">
            {isLoggedIn ? (
              <UserDropdown {...navbarProps} />
            ) : (
              <AuthButton
                onClick={() => navigate("/login")}
                label={t("auth.signIn")}
              />
            )}
          </div>

          {/* Mobile Navigation */}
          <MobileNavigation {...navbarProps} />
        </div>
      </div>
    </motion.header>
  );
}
