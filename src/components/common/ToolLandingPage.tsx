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

/**
 * Check if current date is within the holiday season
 * Default: December 1st through January 7th
 */
// function isHolidaySeason(): boolean {
//   const now = new Date();
//   const currentYear = now.getFullYear();
//   const currentMonth = now.getMonth() + 1; // getMonth() returns 0-11
//   const currentDay = now.getDate();

//   // December (month 12): show from December 1st
//   if (currentMonth === 12) {
//     return true;
//   }

//   // January (month 1): show until January 7th
//   if (currentMonth === 1 && currentDay <= 7) {
//     return true;
//   }

//   return false;
// }

export default function ToolLandingPage() {
  const t = useTranslations();
  // const showHolidayBanner = isHolidaySeason();

  return (
    <main>
      <Navbar />
      {/* Holiday Banner - Only shown during holiday season
      {showHolidayBanner && (
        <div className="w-full">
          <img
            src="/assets/images/holidays-banner.png"
            alt="Happy Holidays from James, Nazar, and Ilonka"
            className="w-full h-auto object-cover"
          />
        </div>
      )} */}
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
