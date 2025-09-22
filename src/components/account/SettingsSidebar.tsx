"use client";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { CreditCard, LogOut, Star, User } from "lucide-react";
import { logout } from "@/store/slices/authSlice";
import { clearUser } from "@/store/slices/userSlice";
import { clearFlow } from "@/store/slices/flowSlice";
import { useLocalizedNavigation } from "@/utils/navigation";

const items = [
  { label: "Account", icon: User, id: "account" },
  { label: "Payment", icon: CreditCard, id: "payment" },
  { label: "Membership", icon: Star, id: "membership" },
  { label: "Logout", icon: LogOut, id: "logout" },
];

interface SettingsSidebarProps {
  onItemClick?: (sectionId: string) => void;
}

export default function SettingsSidebar({ onItemClick }: SettingsSidebarProps) {
  const [active, setActive] = useState("account");
  const dispatch = useDispatch();
  const { navigate } = useLocalizedNavigation();

  useEffect(() => {
    // Only set up intersection observer for non-logout items
    const sectionIds = items
      .filter((item) => item.id !== "logout")
      .map((item) => item.id);
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      {
        root: null,
        rootMargin: "-100px 0px -60% 0px", // Adjusted for fixed sidebar
        threshold: 0.3,
      }
    );

    sections.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => {
      sections.forEach((section) => {
        if (section) observer.unobserve(section);
      });
    };
  }, []);

  const handleItemClick = (item: (typeof items)[0]) => {
    if (item.id === "logout") {
      // Clear all global state
      dispatch(logout());
      dispatch(clearUser());
      dispatch(clearFlow());

      // Clear both localStorage and sessionStorage
      localStorage.removeItem("authToken");
      localStorage.removeItem("rememberedEmail");
      localStorage.removeItem("rememberMe");
      sessionStorage.removeItem("authToken");

      // Navigate to home page
      navigate("/");
      return;
    }

    setActive(item.id);
    if (onItemClick) {
      onItemClick(item.id);
    }
  };

  return (
    <aside className="w-full lg:w-64 bg-white rounded-lg shadow-lg lg:shadow p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-4 lg:mb-6">
        Settings
      </h2>
      <ul className="space-y-1 sm:space-y-2">
        {items.map((item) => (
          <li
            key={item.label}
            onClick={() => handleItemClick(item)}
            className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg cursor-pointer transition-all duration-200 border-l-4 ${
              active === item.id
                ? "bg-blue-600 text-white border-l-blue-400 shadow-sm"
                : "text-gray-700 hover:bg-blue-50 hover:text-blue-600 border-l-transparent hover:border-l-blue-200"
            }`}
          >
            <item.icon size={18} className="flex-shrink-0" />
            <span className="text-sm sm:text-base font-medium">
              {item.label}
            </span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
