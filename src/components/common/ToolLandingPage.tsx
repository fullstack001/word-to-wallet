"use client";

import HeroSection from "@/components/landing/HeroSection";
import PromoFreeCourse from "@/components/landing/PromoFreeCourse";
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
      <PromoFreeCourse />
      <FeatureCTA />
      <HowItWorks />
      {/* <WhyUs /> */}
      <SecurityPriority />
      <FAQ />
      <CustomerTestimonials />
      <Footer />
    </main>
  );
}
