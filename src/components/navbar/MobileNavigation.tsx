import React, { useState, useCallback } from "react";
import Image from "next/image";
import {
  MenuIcon,
  XIcon,
  ChevronDownIcon,
  UserIcon,
  FileTextIcon,
  CrownIcon,
  ChevronRightIcon,
} from "lucide-react";
import { AuthButton } from "./AuthButton";
import type { NavbarProps, MenuItem } from "./types";
import { Logo } from "./Logo";

/**
 * Mobile navigation component with collapsible menu
 */
export const MobileNavigation: React.FC<NavbarProps> = ({
  isLoggedIn,
  user,
  mobileMenuOpen,
  onMobileToggle,
  onCloseMobileMenu,
  navigate,
  onLogout,
  t,
}) => {
  const handleNavigate = useCallback(
    (route: string) => {
      navigate(route);
      onCloseMobileMenu();
    },
    [navigate, onCloseMobileMenu]
  );

  const handleLogout = useCallback(() => {
    onLogout();
    onCloseMobileMenu();
  }, [onLogout, onCloseMobileMenu]);

  return (
    <div className="md:block xl:hidden">
      <button
        onClick={onMobileToggle}
        className="xl:hidden focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-1"
        aria-expanded={mobileMenuOpen}
        aria-label="Toggle mobile menu"
      >
        {mobileMenuOpen ? <XIcon size={20} /> : <MenuIcon size={20} />}
      </button>

      {mobileMenuOpen && (
        <div className="bg-white px-6 py-4 shadow-inner absolute top-20 left-0 w-full z-40">
          <div className="flex justify-between items-center">
            <Logo onNavigateHome={() => navigate("/")} />
            <button
              onClick={onMobileToggle}
              className="xl:hidden focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-1"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <XIcon size={20} /> : <MenuIcon size={20} />}
            </button>
          </div>

          <hr className="my-4" />

          {/* User Section */}
          {isLoggedIn ? (
            <MobileUserSection
              user={user}
              t={t}
              onNavigate={handleNavigate}
              onLogout={handleLogout}
            />
          ) : (
            <AuthButton
              onClick={() => handleNavigate("/login")}
              label={t("auth.signIn")}
              className="px-4 py-2 text-md"
            />
          )}
        </div>
      )}
    </div>
  );
};

/**
 * Mobile menu item with collapsible submenu
 */
interface MobileMenuItemProps {
  label: string;
  items: MenuItem[];
  open: boolean;
  onToggle: () => void;
  onNavigate: (route: string) => void;
}

const MobileMenuItem: React.FC<MobileMenuItemProps> = ({
  label,
  items,
  open,
  onToggle,
  onNavigate,
}) => (
  <div className="mb-3">
    <button
      onClick={onToggle}
      className="flex justify-between items-center w-full text-left text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-1"
      aria-expanded={open}
    >
      {label}
      <ChevronDownIcon
        className={`transform transition-transform ${open ? "rotate-180" : ""}`}
        size={16}
      />
    </button>
    {open && (
      <ul className="mt-2 pl-4 space-y-1">
        {items.map((item) => (
          <li
            key={item.route}
            onClick={() => onNavigate(item.route)}
            className="text-sm text-gray-600 hover:text-blue-600 cursor-pointer transition-colors p-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onNavigate(item.route);
              }
            }}
          >
            {item.label}
          </li>
        ))}
      </ul>
    )}
  </div>
);

/**
 * Mobile user section for authenticated users - simplified version
 */
interface MobileUserSectionProps {
  user: any;
  t: (key: string) => string;
  onNavigate: (route: string) => void;
  onLogout: () => void;
}

const MobileUserSection: React.FC<MobileUserSectionProps> = ({
  user,
  t,
  onNavigate,
  onLogout,
}) => {
  const isPremium =
    user.subscription?.plan && user.subscription.plan !== "free";

  return (
    <div className="space-y-3">
      {/* User Profile Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Image
              src={user.avatar || "/assets/images/profile.jpg"}
              alt="User"
              width={48}
              height={48}
              className="rounded-full ring-2 ring-white shadow-md"
            />
            {isPremium && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center border-2 border-white">
                <CrownIcon size={12} className="text-yellow-800" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {user.email || t("navbar.profileDetails")}
            </p>
            <div className="flex items-center gap-2 mt-1">
              {isPremium ? (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  <CrownIcon size={10} className="mr-1" />
                  {user.subscription?.plan}
                </span>
              ) : (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                  {t("navbar.noSubscription")}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Simplified Menu - Only My Documents and My Account */}
      <div className="bg-gray-50 rounded-xl p-2 space-y-1">
        <MobileUserMenuItem
          icon={<FileTextIcon size={18} className="text-blue-600" />}
          label={t("navbar.myDocuments")}
          onClick={() => onNavigate("/files")}
        />
        <MobileUserMenuItem
          icon={<UserIcon size={18} className="text-gray-600" />}
          label={t("navbar.myAccount")}
          onClick={() => onNavigate("/my-account")}
        />
      </div>
    </div>
  );
};

/**
 * Simplified individual user menu item for mobile
 */
interface MobileUserMenuItemProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

const MobileUserMenuItem: React.FC<MobileUserMenuItemProps> = ({
  icon,
  label,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-150 hover:bg-white text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div className="flex-shrink-0">{icon}</div>
      <div className="font-medium text-sm">{label}</div>
      <ChevronRightIcon size={16} className="text-gray-400 flex-shrink-0" />
    </div>
  );
};
