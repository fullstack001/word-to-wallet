"use client";

import React, { useState, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import {
  EllipsisVerticalIcon,
  ArrowDownTrayIcon,
  ShareIcon,
  PencilIcon,
  TrashIcon,
  DocumentDuplicateIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";
import { useLocalizedNavigation } from "@/utils/navigation";
import { locales, localeNames } from "@/i18n/config";

interface Book {
  _id: string;
  title: string;
  status: string;
}

interface BookActionsProps {
  book: Book;
  onDelete: () => void;
  onDownload: () => void;
}

export function BookActions({ book, onDelete, onDownload }: BookActionsProps) {
  const t = useTranslations("books");
  const locale = useLocale();
  const { switchLocale } = useLocalizedNavigation();
  const [showMenu, setShowMenu] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const languageDropdownRef = useRef<HTMLDivElement>(null);

  // Close language dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        languageDropdownRef.current &&
        !languageDropdownRef.current.contains(event.target as Node)
      ) {
        setShowLanguageDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleAction = (action: string) => {
    setShowMenu(false);

    switch (action) {
      case "download":
        onDownload();
        break;
      case "delete":
        onDelete();
        break;
      case "edit":
        // Navigate to edit page
        window.location.href = `/books/${book._id}/edit`;
        break;
      case "duplicate":
        // Handle duplication
        console.log("Duplicate book:", book._id);
        break;
      case "share":
        // Handle sharing
        console.log("Share book:", book._id);
        break;
    }
  };

  const isReady = book.status === "ready";

  return (
    <div className="flex items-center space-x-2">
      {/* Language Switcher */}
      <div className="relative" ref={languageDropdownRef}>
        <button
          onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
          className="inline-flex items-center px-2 py-1 border border-gray-300 shadow-sm text-xs leading-4 font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <GlobeAltIcon className="h-3 w-3 mr-1" />
          {localeNames[locale as keyof typeof localeNames]}
        </button>

        {showLanguageDropdown && (
          <div className="absolute right-0 mt-1 w-40 bg-white rounded-md shadow-lg z-10 border border-gray-200">
            <div className="py-1">
              {locales.map((loc) => (
                <button
                  key={loc}
                  onClick={() => {
                    switchLocale(loc);
                    setShowLanguageDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-100 transition-colors ${
                    locale === loc
                      ? "bg-blue-50 text-blue-700 font-medium"
                      : "text-gray-700"
                  }`}
                >
                  {localeNames[loc]}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Actions Menu */}
      <div className="relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="inline-flex items-center p-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <EllipsisVerticalIcon className="h-5 w-5" />
        </button>

        {showMenu && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => setShowMenu(false)}
            />

            {/* Menu */}
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 border border-gray-200">
              {isReady && (
                <>
                  <button
                    onClick={() => handleAction("download")}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <ArrowDownTrayIcon className="h-4 w-4 mr-3" />
                    {t("download")}
                  </button>

                  <button
                    onClick={() => handleAction("share")}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <ShareIcon className="h-4 w-4 mr-3" />
                    {t("share")}
                  </button>

                  <button
                    onClick={() => handleAction("duplicate")}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <DocumentDuplicateIcon className="h-4 w-4 mr-3" />
                    {t("duplicate")}
                  </button>

                  <div className="border-t border-gray-100 my-1" />
                </>
              )}

              <button
                onClick={() => handleAction("edit")}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <PencilIcon className="h-4 w-4 mr-3" />
                {t("edit")}
              </button>

              <button
                onClick={() => handleAction("delete")}
                className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50"
              >
                <TrashIcon className="h-4 w-4 mr-3" />
                {t("delete")}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
