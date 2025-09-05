import React from "react";
import type { MenuCategory as MenuCategoryType } from "./types";

interface MenuCategoryProps extends MenuCategoryType {
  onNavigate: (route: string) => void;
}

/**
 * Menu category component for organizing related navigation items
 */
export const MenuCategory: React.FC<MenuCategoryProps> = ({
  title,
  items,
  onNavigate,
}) => {
  return (
    <div className="gap-8 w-max">
      <p className="font-medium text-[20px] mb-4 text-gray-700">{title}</p>
      <ul className="space-y-1">
        {items.map((item) => (
          <li
            key={item.route}
            onClick={() => onNavigate(item.route)}
            className="text-[16px] text-gray-600 pb-4 hover:text-blue-600 cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onNavigate(item.route);
              }
            }}
          >
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
};
