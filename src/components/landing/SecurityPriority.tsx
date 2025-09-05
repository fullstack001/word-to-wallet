"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import { Shield, Lock, Eye, CheckCircle } from "lucide-react";
import { useTranslations } from "next-intl";

export default function SecurityPriority() {
  const t = useTranslations("security");
  const sectionRef = useRef<HTMLElement>(null);

  const securityFeatures = [
    {
      icon: Shield,
      title: t("features.encryption.title"),
      description: t("features.encryption.description"),
    },
    {
      icon: Lock,
      title: t("features.processing.title"),
      description: t("features.processing.description"),
    },
    {
      icon: Eye,
      title: t("features.privacy.title"),
      description: t("features.privacy.description"),
    },
    {
      icon: CheckCircle,
      title: t("features.compliance.title"),
      description: t("features.compliance.description"),
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in-up");
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex flex-col items-center justify-center w-full min-h-[500px] md:min-h-[600px] lg:min-h-[700px] bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 overflow-hidden"
      style={{
        backgroundImage: "url('/assets/images/sec_bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Background overlay with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-600/98 via-primary-700/95 to-primary-800/98"></div>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full mix-blend-overlay filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-white/10 rounded-full mix-blend-overlay filter blur-3xl animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full mix-blend-overlay filter blur-3xl animate-pulse animation-delay-4000"></div>
      </div>

      {/* Content container */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-16 md:py-20 lg:py-24 w-full max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-12 md:mb-16 transform transition-all duration-1000 ease-out opacity-0 translate-y-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <Shield className="w-5 h-5 text-white" />
            <span className="text-sm font-medium text-white">{t("badge")}</span>
          </div>

          <h2 className="text-[32px] md:text-[40px] lg:text-[48px] font-bold text-cyan-300 mb-6 leading-tight">
            {t("title")}
          </h2>

          <p className="text-lg md:text-xl lg:text-2xl text-blue-300 max-w-3xl mx-auto leading-relaxed">
            {t("subtitle")}
          </p>
        </div>

        {/* Security Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-12 md:mb-16 w-full max-w-6xl">
          {securityFeatures.map((feature, index) => (
            <div
              key={feature.title}
              className="group bg-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/20 hover:border-white/40 transition-all duration-300 hover:bg-white/20 transform hover:-translate-y-2 animate-fade-in"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-emerald-100 mb-3">
                {feature.title}
              </h3>
              <p className="text-sky-100 text-sm md:text-base leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Security Priority SVG Icon */}
        <div className="transform transition-all duration-1000 ease-out opacity-0 translate-y-8 animation-delay-600">
          <div className="relative group">
            <div className="absolute -inset-8 bg-white/10 rounded-3xl blur-2xl opacity-50 group-hover:opacity-70 transition-opacity duration-500"></div>
            <Image
              src="/assets/images/security_priority.svg"
              alt="Security Priority"
              width={1426}
              height={320}
              style={{ height: "auto" }}
              className="w-full max-w-4xl relative z-10 transform transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 md:mt-16 transform transition-all duration-1000 ease-out opacity-0 translate-y-8 animation-delay-800">
          <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 border border-white/30">
            <CheckCircle className="w-5 h-5 text-green-300" />
            <span className="text-white font-medium">{t("trustedBy")}</span>
          </div>
        </div>
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        .animate-fade-in-up {
          animation: fadeInUp 1s ease-out forwards;
        }
        .animate-fade-in {
          animation: fadeIn 1s ease-out forwards;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animation-delay-600 {
          animation-delay: 600ms;
        }
        .animation-delay-800 {
          animation-delay: 800ms;
        }
        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          to {
            opacity: 1;
          }
        }
      `}</style>
    </section>
  );
}
