import React, { useState, useRef, useEffect, useCallback } from "react";
import { ChevronDownIcon } from "lucide-react";
import type { DropdownProps } from "./types";

/**
 * Reusable dropdown component with proper event handling and accessibility
 */
export const Dropdown: React.FC<DropdownProps> = ({
  label,
  icon,
  children,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsOpen(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 200); // Small delay to prevent accidental closes
  }, []);

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        handleClose();
      }
    },
    [handleClose]
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    },
    [handleClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isOpen, handleClickOutside]);

  const childrenCount = React.Children.count(children);
  const dropdownClasses = `absolute top-full mt-2 ${
    childrenCount === 2 ? "min-w-[430px] -left-20" : "min-w-[200px]"
  } bg-white shadow-lg rounded-xl p-8 grid grid-cols-${childrenCount} gap-8 z-50`;

  return (
    <div
      className={`relative mr-6 ${className}`}
      ref={dropdownRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onKeyDown={handleKeyDown}
    >
      <button
        className="flex items-center text-2xl font-semibold gap-1 hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label={`${label} menu`}
      >
        {icon}
        {label}
        <ChevronDownIcon
          size={14}
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && <div className={dropdownClasses}>{children}</div>}
    </div>
  );
};
