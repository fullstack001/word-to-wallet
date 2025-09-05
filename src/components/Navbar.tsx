"use client";

import React, { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslations } from "next-intl";

import { RootState } from "../store/store";
import { logout } from "../store/slices/authSlice";
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

  // Handlers
  const handleMobileToggle = useCallback(() => {
    setMobileMenuOpen((prev) => !prev);
  }, []);

  const handleUserDropdownToggle = useCallback(() => {
    setUserDropdownOpen((prev) => !prev);
  }, []);

  const handleLogout = useCallback(() => {
    dispatch(logout());
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
    <header className="sticky bg-transport-0 rounded-xl top-0 z-50 m-4">
      <div className="mx-auto flex bg-gray-50 sticky rounded-xl items-center justify-between px-8 py-3">
        {/* Logo */}
        <Logo onNavigateHome={() => navigate("/")} />

        {/* Desktop Authentication */}
        <div className="relative hidden xl:flex items-center gap-4">
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
    </header>
  );
}
