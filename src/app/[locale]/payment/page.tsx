"use client";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store"; // Import RootState for type safety

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PaymentForm from "@/components/payment/PaymentForm";
import PaymentPreview from "@/components/payment/PaymentPreview";
import PaymentFeatures from "@/components/payment/PaymentFeatures";
import PaymentTotal from "@/components/payment/PaymentTotal";
import "@/app/globals.css";

const prices = [
  { id: "7_free", priceId: "price_1RegGPHWocuqbvt5mcTEGCtJ", price: 0.95 },
  { id: "7_full", priceId: "price_1RegGsHWocuqbvt5qR7r2lNu", price: 1.95 },
  { id: "annual", priceId: "price_1RegHuHWocuqbvt5WwHOKAJt", price: 16.58 },
];

export default function PaymentPage() {
  const user = useSelector((state: RootState) => state.user); // Use RootState for type safety
  console.log(user);

  const selectedPrice = prices[0]; // Default to first plan

  return (
    <div className="bg-[#EDF0FF] min-h-screen">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <h1 className="text-2xl md:text-4xl font-semibold mb-2 text-gray-800">
          Payment details
        </h1>
        <div className="flex flex-col lg:flex-row gap-10">
          <div className="flex-1">
            <PaymentForm plan={selectedPrice} email={user.email} />
          </div>
          <div className="w-full max-w-sm space-y-4">
            <PaymentPreview />
            <PaymentFeatures selectedPlan={selectedPrice.id} />
            <PaymentTotal price={selectedPrice.price} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
