"use client";

import { useTranslations } from "next-intl";
import {
  BookOpenIcon,
  UserIcon,
  CalendarIcon,
  LanguageIcon,
  TagIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";

interface Book {
  _id: string;
  title: string;
  author: string;
  description?: string;
  isbn?: string;
  publisher?: string;
  publicationDate?: string;
  language: string;
  genre?: string[];
  tags?: string[];
  metadata: any;
  uploadDate: string;
  lastModified: string;
}

interface BookDetailsProps {
  book: Book;
}

export function BookDetails({ book }: BookDetailsProps) {
  const t = useTranslations("books");

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <DocumentTextIcon className="h-5 w-5 mr-2" />
          {t("bookDetails")}
        </h3>

        <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-gray-500 flex items-center">
              <BookOpenIcon className="h-4 w-4 mr-2" />
              {t("title")}
            </dt>
            <dd className="mt-1 text-sm text-gray-900">{book.title}</dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500 flex items-center">
              <UserIcon className="h-4 w-4 mr-2" />
              {t("author")}
            </dt>
            <dd className="mt-1 text-sm text-gray-900">{book.author}</dd>
          </div>

          {book.isbn && (
            <div>
              <dt className="text-sm font-medium text-gray-500">ISBN</dt>
              <dd className="mt-1 text-sm text-gray-900">{book.isbn}</dd>
            </div>
          )}

          {book.publisher && (
            <div>
              <dt className="text-sm font-medium text-gray-500">
                {t("publisher")}
              </dt>
              <dd className="mt-1 text-sm text-gray-900">{book.publisher}</dd>
            </div>
          )}

          {book.publicationDate && (
            <div>
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <CalendarIcon className="h-4 w-4 mr-2" />
                {t("publicationDate")}
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(book.publicationDate).toLocaleDateString()}
              </dd>
            </div>
          )}

          <div>
            <dt className="text-sm font-medium text-gray-500 flex items-center">
              <LanguageIcon className="h-4 w-4 mr-2" />
              {t("language")}
            </dt>
            <dd className="mt-1 text-sm text-gray-900">
              {book.language.toUpperCase()}
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500 flex items-center">
              <CalendarIcon className="h-4 w-4 mr-2" />
              {t("uploadDate")}
            </dt>
            <dd className="mt-1 text-sm text-gray-900">
              {new Date(book.uploadDate).toLocaleDateString()}
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">
              {t("lastModified")}
            </dt>
            <dd className="mt-1 text-sm text-gray-900">
              {new Date(book.lastModified).toLocaleDateString()}
            </dd>
          </div>
        </dl>

        {book.description && (
          <div className="mt-6">
            <dt className="text-sm font-medium text-gray-500 mb-2">
              {t("description")}
            </dt>
            <dd className="text-sm text-gray-900 whitespace-pre-wrap">
              {book.description}
            </dd>
          </div>
        )}

        {book.genre && book.genre.length > 0 && (
          <div className="mt-6">
            <dt className="text-sm font-medium text-gray-500 mb-2 flex items-center">
              <TagIcon className="h-4 w-4 mr-2" />
              {t("genre")}
            </dt>
            <dd className="flex flex-wrap gap-2">
              {book.genre.map((genre, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {genre}
                </span>
              ))}
            </dd>
          </div>
        )}

        {book.tags && book.tags.length > 0 && (
          <div className="mt-6">
            <dt className="text-sm font-medium text-gray-500 mb-2 flex items-center">
              <TagIcon className="h-4 w-4 mr-2" />
              {t("tags")}
            </dt>
            <dd className="flex flex-wrap gap-2">
              {book.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                >
                  {tag}
                </span>
              ))}
            </dd>
          </div>
        )}

        {/* EPUB Metadata */}
        {book.metadata && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-900 mb-3">
              {t("epubMetadata")}
            </h4>
            <dl className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
              {book.metadata.creator && (
                <div>
                  <dt className="text-xs font-medium text-gray-500">
                    {t("creator")}
                  </dt>
                  <dd className="mt-1 text-xs text-gray-900">
                    {book.metadata.creator}
                  </dd>
                </div>
              )}
              {book.metadata.publisher && (
                <div>
                  <dt className="text-xs font-medium text-gray-500">
                    {t("publisher")}
                  </dt>
                  <dd className="mt-1 text-xs text-gray-900">
                    {book.metadata.publisher}
                  </dd>
                </div>
              )}
              {book.metadata.date && (
                <div>
                  <dt className="text-xs font-medium text-gray-500">
                    {t("date")}
                  </dt>
                  <dd className="mt-1 text-xs text-gray-900">
                    {book.metadata.date}
                  </dd>
                </div>
              )}
              {book.metadata.rights && (
                <div>
                  <dt className="text-xs font-medium text-gray-500">
                    {t("rights")}
                  </dt>
                  <dd className="mt-1 text-xs text-gray-900">
                    {book.metadata.rights}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        )}
      </div>
    </div>
  );
}
