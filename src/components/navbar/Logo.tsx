import React from "react";
import Image from "next/image";
import type { LogoProps } from "./types";

/**
 * Logo component that displays the application logo and navigates to home when clicked
 */
export const Logo: React.FC<LogoProps> = ({ onNavigateHome }) => {
  return (
    <div
      onClick={onNavigateHome}
      className="flex items-center gap-2 cursor-pointer"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onNavigateHome();
        }
      }}
      aria-label="Navigate to home page"
    >
      {/* <Image
        src="/assets/images/logo.svg"
        alt="ZoomPDF"
        width={100}
        height={0}
        style={{ height: "auto" }}
        priority
      /> */}
      <div className="text-xl font-bold">

      LOGO
      </div>
    </div>
  );
};
