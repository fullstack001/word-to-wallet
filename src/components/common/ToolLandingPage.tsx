"use client";

import HeroSection from "@/components/landing/HeroSection";
import AudiencesSection from "@/components/landing/AudiencesSection";
import ValueSection from "@/components/landing/ValueSection";
import CourseSection from "@/components/landing/CourseSection";
import HowItWorksNew from "@/components/landing/HowItWorksNew";
import FeatureCTA from "@/components/landing/FeatureCTA";
import SpecialOffer from "@/components/landing/SpecialOffer";
import SecurityPriority from "@/components/landing/SecurityPriority";
import CustomerTestimonials from "@/components/landing/CustomerTestimonials";
import FAQ from "@/components/landing/FAQ";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { useTranslations } from "next-intl";

export default function ToolLandingPage() {
  const t = useTranslations();

  return (
    <main>
      <Navbar />
      <div>
        <HeroSection />
        <SpecialOffer />
        <AudiencesSection />
        <ValueSection />
        <HowItWorksNew />
        <CourseSection />
        <FeatureCTA />        
        {/* <WhyUs /> */}
        <SecurityPriority />
        <FAQ />
        <CustomerTestimonials />
        <Footer />
      </div>
    </main>
  );
}
