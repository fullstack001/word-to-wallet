import React from "react";
import Image from "next/image";
import { UserIcon, FileTextIcon, CrownIcon } from "lucide-react";
import type { NavbarProps } from "./types";

/**
 * Simplified user section with direct access to key features
 */
export const UserDropdown: React.FC<NavbarProps> = ({ user, navigate, t }) => {
  const isPremium =
    user.subscription?.plan && user.subscription.plan !== "free";

  return (
    <div className="flex items-center gap-3">
      {/* My Documents Button */}
      <button
        onClick={() => navigate("/files")}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-label={t("navbar.myDocuments")}
      >
        <FileTextIcon size={18} className="text-blue-600" />
        <span>{t("navbar.myDocuments")}</span>
      </button>
      {/* My Account Button with Avatar */}
      <button
        onClick={() => navigate("/my-account")}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-label={t("navbar.myAccount")}
      >
        <UserIcon size={18} className="text-gray-600" />
        <span>{t("navbar.myAccount")}</span>
      </button>
      {/* User Avatar
      <div className="relative ml-2">
        <div className="relative">
          <Image
            src={user.avatar || "/assets/images/profile.jpg"}
            alt="User Avatar"
            width={40}
            height={40}
            className="rounded-full ring-2 ring-white shadow-md"
          />

          {isPremium && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
              <CrownIcon size={10} className="text-yellow-800" />
            </div>
          )}

          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
        </div>
      </div> */}
    </div>
  );
};
