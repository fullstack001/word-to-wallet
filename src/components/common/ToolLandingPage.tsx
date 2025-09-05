"use client";

import HeroSection from "@/components/landing/HeroSection";
import HowItWorks from "@/components/landing/HowItWorks";
import FeatureCTA from "@/components/landing/FeatureCTA";
import SecurityPriority from "@/components/landing/SecurityPriority";
import CustomerTestimonials from "@/components/landing/CustomerTestimonials";
import FAQ from "@/components/landing/FAQ";
import Footer from "@/components/Footer";
import { useTranslations } from "next-intl";

export default function ToolLandingPage() {
  const t = useTranslations();

  return (
    <main>
      {/* <Navbar /> */}
      <HeroSection />
      <HowItWorks />
      <FeatureCTA />
      {/* <WhyUs /> */}
      <SecurityPriority />
      <FAQ />
      <CustomerTestimonials />
      <Footer />
    </main>
  );
}
