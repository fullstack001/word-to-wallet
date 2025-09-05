"use client";
import { useTranslations } from "next-intl";
import { useLocalizedNavigation } from "@/utils/navigation";
import { useState } from "react";

// All languages to display in the modal
const allLanguages = [
  { code: "en", name: "English", nativeName: "English", supported: true },
  { code: "zh", name: "Chinese", nativeName: "中文", supported: false },
  { code: "cs", name: "Czech", nativeName: "Čeština", supported: false },
  { code: "nl", name: "Dutch", nativeName: "Nederlands", supported: false },
  { code: "fr", name: "French", nativeName: "Français", supported: true },
  { code: "de", name: "German", nativeName: "Deutsch", supported: false },
  { code: "el", name: "Greek", nativeName: "Ελληνικά", supported: false },
  { code: "hu", name: "Hungarian", nativeName: "Magyar", supported: false },
  {
    code: "id",
    name: "Indonesian",
    nativeName: "Bahasa Indonesia",
    supported: false,
  },
  { code: "it", name: "Italian", nativeName: "Italiano", supported: false },
  { code: "ja", name: "Japanese", nativeName: "日本語", supported: false },
  { code: "ko", name: "Korean", nativeName: "한국어", supported: true },
  { code: "ms", name: "Malay", nativeName: "Bahasa Melayu", supported: false },
  { code: "pl", name: "Polish", nativeName: "Polski", supported: false },
  { code: "pt", name: "Portuguese", nativeName: "Português", supported: false },
  { code: "ro", name: "Romanian", nativeName: "Română", supported: false },
  { code: "sr", name: "Serbian", nativeName: "Srpski", supported: false },
  { code: "es", name: "Spanish", nativeName: "Español", supported: true },
  { code: "se", name: "Swedish", nativeName: "Svenska", supported: true },
  { code: "th", name: "Thai", nativeName: "แบบไทย", supported: false },
  { code: "tr", name: "Turkish", nativeName: "Türkçe", supported: false },
  { code: "uk", name: "Ukrainian", nativeName: "Українська", supported: false },
  {
    code: "vi",
    name: "Vietnamese",
    nativeName: "Tiếng Việt",
    supported: false,
  },
  { code: "fi", name: "Finnish", nativeName: "Suomi", supported: false },
];

export default function LanguageSelector() {
  const t = useTranslations();
  const { switchLocale, currentLocale } = useLocalizedNavigation();
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);

  const handleLanguageSelect = (languageCode: string) => {
    const language = allLanguages.find((lang) => lang.code === languageCode);
    if (language && language.supported) {
      switchLocale(languageCode);
      setIsLanguageModalOpen(false);
    }
  };

  const getCurrentLanguageName = () => {
    const currentLang = allLanguages.find(
      (lang) => lang.code === currentLocale
    );
    return currentLang ? currentLang.name : "English";
  };

  return (
    <>
      {/* Language Selector Button */}
      <div className="space-y-3">
        <button
          onClick={() => setIsLanguageModalOpen(true)}
          className="flex items-center justify-center sm:justify-start lg:justify-start space-x-2 px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200 text-sm font-medium text-gray-700"
        >
          <svg
            className="w-5 h-5 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
            />
          </svg>
          <span>{getCurrentLanguageName()}</span>
          <svg
            className="w-4 h-4 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>

      {/* Language Selection Modal */}
      {isLanguageModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {t("footer.selectLanguage")}
                </h2>
              </div>
              <button
                onClick={() => setIsLanguageModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors duration-200"
              >
                <svg
                  className="w-5 h-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Languages Grid */}
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {allLanguages.map((language) => (
                  <button
                    key={language.code}
                    onClick={() => handleLanguageSelect(language.code)}
                    disabled={!language.supported}
                    className={`p-4 text-left border rounded-lg transition-colors duration-200 ${
                      language.code === currentLocale
                        ? "bg-blue-50 border-blue-200 text-blue-900"
                        : language.supported
                        ? "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                        : "border-gray-100 bg-gray-50 cursor-not-allowed opacity-60"
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="font-medium text-gray-900">
                        {language.nativeName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {language.name}
                      </div>
                      {!language.supported && (
                        <div className="text-xs text-gray-400 italic">
                          Coming soon
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
