"use client";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setPlan } from "@/store/slices/flowSlice"; // Import the setPlan action
import { useLocalizedNavigation } from "@/utils/navigation"; // Import localized navigation
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PlanHero from "@/components/plan/PlanHero";
import PlanPreview from "@/components/plan/PlanPreview";
import PlanOptions from "@/components/plan/PlanOptions";
import PlanFeatures from "@/components/plan/PlanFeatures";
import "@/app/globals.css"; // Ensure global styles are imported

export default function PlanPage() {
  const dispatch = useDispatch();
  const { navigate } = useLocalizedNavigation(); // Use localized navigation
  const [selectedOption, setSelectedOption] = useState<string | null>("7_full");

  const confirmPlan = () => {
    if (selectedOption) {
      dispatch(setPlan(selectedOption)); // Save the selected plan to the global store
      navigate("/payment"); // Navigate to the payment page with proper locale handling
    }
  };

  return (
    <div className="bg-primary-50-1 min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 lg:px-8 xl:px-16 py-4 md:py-8 space-y-8 md:space-y-12 pb-24 lg:pb-8">
        {/* Plan Hero - Hidden on mobile/tablet, shown on desktop */}
        <div className="hidden lg:block">
          <PlanHero handleGoPayment={confirmPlan} />
        </div>
        {/* Mobile/Tablet Hero - Continue button removed from here */}
        <div className="text-center lg:hidden space-y-4">
          <h1 className="text-2xl md:text-3xl font-medium text-gray-900">
            Choose a plan to download your file
          </h1>
        </div>

        {/* Mobile/Tablet Layout */}
        <div className="lg:hidden space-y-6">
          {/* Plan Options first on mobile/tablet */}
          <div className="w-full">
            <PlanOptions
              selectedOption={selectedOption}
              setSelectedOption={setSelectedOption}
            />
            <PlanFeatures selectedPlan={selectedOption} />
          </div>

          {/* PDF Preview */}
          <div className="w-full">
            <PlanPreview />
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:flex flex-col lg:flex-row justify-between gap-10">
          <PlanPreview />
          <div className="max-w-full lg:max-w-[50%]">
            <PlanOptions
              selectedOption={selectedOption}
              setSelectedOption={setSelectedOption}
            />
            <PlanFeatures selectedPlan={selectedOption} />
          </div>
        </div>
      </main>

      {/* Floating Continue Button for Mobile/Tablet */}
      <button
        className="lg:hidden fixed bottom-4 left-0 right-0 mx-4  bg-primary-900 text-lg md:text-xl text-white font-semibold px-8 py-4 rounded-2xl shadow-lg hover:bg-primary-800 transition-colors"
        onClick={confirmPlan}
      >
        Continue →
      </button>

      <Footer />
    </div>
  );
}
