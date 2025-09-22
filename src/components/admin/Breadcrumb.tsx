"use client";
import { usePathname } from "next/navigation";
import { useLocalizedNavigation } from "@/utils/navigation";

interface BreadcrumbItem {
  name: string;
  href: string;
  current?: boolean;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  const pathname = usePathname();
  const { navigate } = useLocalizedNavigation();

  // Generate breadcrumb items from pathname if not provided
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    if (items) return items;

    const pathSegments = pathname.split("/").filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [
      { name: "Admin", href: "/admin", current: pathname === "/admin" },
    ];

    if (pathSegments.length > 1) {
      const section = pathSegments[1];
      const sectionName = section.charAt(0).toUpperCase() + section.slice(1);

      breadcrumbs.push({
        name: sectionName,
        href: `/admin/${section}`,
        current: pathname === `/admin/${section}`,
      });

      // Add specific page if exists
      if (pathSegments.length > 2) {
        const page = pathSegments[2];
        if (page !== "edit" && page !== "new") {
          const pageName = page.charAt(0).toUpperCase() + page.slice(1);
          breadcrumbs.push({
            name: pageName,
            href: `/admin/${section}/${page}`,
            current: true,
          });
        } else if (page === "edit") {
          breadcrumbs.push({
            name: "Edit",
            href: pathname,
            current: true,
          });
        } else if (page === "new") {
          breadcrumbs.push({
            name: "New",
            href: pathname,
            current: true,
          });
        }
      }
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  if (breadcrumbs.length <= 1) return null;

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
      {breadcrumbs.map((item, index) => (
        <div key={item.href} className="flex items-center">
          {index > 0 && (
            <svg
              className="w-4 h-4 text-gray-400 mx-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          )}
          {item.current ? (
            <span className="font-medium text-gray-900">{item.name}</span>
          ) : (
            <button
              onClick={() => navigate(item.href)}
              className="hover:text-gray-700 transition-colors duration-150"
            >
              {item.name}
            </button>
          )}
        </div>
      ))}
    </nav>
  );
}
