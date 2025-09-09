"use client";
import { useTranslations } from "next-intl";
import { useI18n } from "@/hooks/useI18n";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Shield,
  Lock,
  Eye,
  Globe,
  FileText,
  Users,
  Database,
  Mail,
} from "lucide-react";

export default function PrivacyPolicyPage() {
  const t = useTranslations("privacyPolicy");
  const { locale } = useI18n();

  const sections = [
    { key: "whoWeAre", icon: Globe, color: "bg-blue-500" },
    { key: "comments", icon: Users, color: "bg-green-500" },
    { key: "media", icon: FileText, color: "bg-purple-500" },
    { key: "cookies", icon: Database, color: "bg-orange-500" },
    { key: "embeddedContent", icon: Globe, color: "bg-indigo-500" },
    { key: "dataSharing", icon: Users, color: "bg-pink-500" },
    { key: "dataRetention", icon: Database, color: "bg-teal-500" },
    { key: "userRights", icon: Shield, color: "bg-red-500" },
    { key: "dataTransfer", icon: Lock, color: "bg-gray-500" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <div className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-indigo-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-8 shadow-lg">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-6">
              {t("title")}
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Your privacy is important to us. This policy explains how we
              collect, use, and protect your information.
            </p>
            <div className="inline-flex items-center px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-white/20">
              <Eye className="w-5 h-5 text-blue-600 mr-2" />
              <span className="text-gray-700 font-medium">
                {t("lastUpdated")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Website Address Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-center">
            <Globe className="w-6 h-6 text-white mr-3" />
            <p className="text-white font-semibold text-lg">
              {t("websiteAddress")}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid gap-8">
          {sections.map((section, index) => {
            const IconComponent = section.icon;
            return (
              <div key={section.key} className="group">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 overflow-hidden">
                  {/* Section Header */}
                  <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-8 py-6 border-b border-gray-100">
                    <div className="flex items-center">
                      <div
                        className={`flex-shrink-0 w-12 h-12 ${section.color} rounded-xl flex items-center justify-center mr-4 shadow-lg`}
                      >
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                          {t(`sections.${section.key}.title`)}
                        </h2>
                        <div className="flex items-center text-sm text-gray-500">
                          <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full font-medium">
                            Section {index + 1}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section Content */}
                  <div className="px-8 py-8">
                    <div className="prose prose-lg max-w-none">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line text-base">
                        {t(`sections.${section.key}.content`)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Contact Information */}
        <div className="mt-12">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 shadow-xl">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-6">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                {t("contact.title")}
              </h3>
              <p className="text-indigo-100 mb-6 max-w-2xl mx-auto">
                {t("contact.description")}
              </p>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 max-w-md mx-auto">
                <p className="text-white font-semibold text-lg">
                  {t("contact.website")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Last Updated Footer */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center px-6 py-3 bg-white/60 backdrop-blur-sm rounded-full shadow-lg border border-white/20">
            <FileText className="w-5 h-5 text-gray-600 mr-2" />
            <span className="text-gray-600 font-medium">
              {t("lastUpdated")}
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
