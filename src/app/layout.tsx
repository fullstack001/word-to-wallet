import { Poppins } from "next/font/google";
import { Metadata } from "next";
import "./globals.css";
import TikTokPixel from "@/components/common/TikTokPixel";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "WordToWallet - Writer and Seller",
  description: "Writer and Seller",
  icons: {
    icon: [
      { url: "/assets/images/logo.png", sizes: "32x32", type: "image/png" },
      { url: "/assets/images/logo.png", type: "image/png" },
    ],
    apple: [
      { url: "/assets/images/logo.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className={poppins.variable} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <TikTokPixel id="tiktok-pixel-root" />
        {children}
      </body>
    </html>
  );
}
