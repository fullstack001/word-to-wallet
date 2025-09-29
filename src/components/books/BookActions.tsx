"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  EllipsisVerticalIcon,
  ArrowDownTrayIcon,
  ShareIcon,
  PencilIcon,
  TrashIcon,
  DocumentDuplicateIcon,
} from "@heroicons/react/24/outline";

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
  const [showMenu, setShowMenu] = useState(false);

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
  );
}
