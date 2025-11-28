"use client";

import FacebookPixel from "@/components/common/FacebookPixel";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { useLocale } from "next-intl";
import Link from "next/link";

export default function ThankYouPage() {
  const locale = useLocale();
  const dashboardHref = `/${locale}/dashboard`;

  return (
    <div className="flex min-h-screen flex-col bg-[#EDF0FF]">
      <FacebookPixel id="facebook-pixel-thank-you" />
      <Navbar />
      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="w-full max-w-2xl rounded-3xl bg-white p-10 text-center shadow-lg">
          <p className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">
            🎉
          </p>
          <h1 className="text-3xl font-semibold text-gray-900 md:text-4xl">
            Thank you for your purchase!
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Your payment was successful. We&apos;ve unlocked full access to your
            Word2Wallet dashboard so you can start managing your books and
            automations right away.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 md:flex-row md:justify-center">
            <Link
              href={dashboardHref}
              className="inline-flex w-full items-center justify-center rounded-full bg-[#5465FF] px-6 py-3 font-semibold text-white shadow-md transition hover:bg-[#4252d6] md:w-auto"
            >
              Go to dashboard
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
