"use client";
import { useLocalizedNavigation } from "@/utils/navigation";
import { usePathname } from "next/navigation";

interface AdminSidebarProps {
  className?: string;
  mobileMenuOpen?: boolean;
  onMobileMenuClose?: () => void;
}

export default function AdminSidebar({
  className = "",
  mobileMenuOpen = false,
  onMobileMenuClose,
}: AdminSidebarProps) {
  const { navigate } = useLocalizedNavigation();
  const pathname = usePathname();

  const handleNavigation = (href: string) => {
    navigate(href);
    if (onMobileMenuClose) {
      onMobileMenuClose();
    }
  };

  const navigation = [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      description: "Overview and analytics",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z"
          />
        </svg>
      ),
    },
    {
      name: "Courses & Subjects",
      href: "/admin/courses",
      description: "Manage courses and subjects",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
    },
    {
      name: "Users",
      href: "/admin/users",
      description: "User management",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
          />
        </svg>
      ),
    },
    {
      name: "Analytics",
      href: "/admin/analytics",
      description: "Reports and insights",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
    },
  ];

  const isCurrentPath = (href: string) => {
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <>
      {/* Mobile sidebar overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 md:hidden"
          onClick={onMobileMenuClose}
        />
      )}

      {/* Desktop sidebar */}
      <div className={`hidden md:flex md:w-72 md:flex-col ${className}`}>
        <div className="flex flex-col flex-grow pt-6 bg-gradient-to-b from-gray-50 to-white overflow-y-auto border-r border-gray-200 shadow-sm">
          <div className="flex items-center flex-shrink-0 px-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                <img
                  src="/logo.png"
                  alt="Word2Wallet Logo"
                  className="w-6 h-6"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
                <p className="text-xs text-gray-500">Management Console</p>
              </div>
            </div>
          </div>
          <div className="mt-8 flex-grow flex flex-col">
            <nav className="flex-1 px-3 pb-4 space-y-2">
              {navigation.map((item) => {
                const isCurrent = isCurrentPath(item.href);
                return (
                  <button
                    key={item.name}
                    onClick={() => handleNavigation(item.href)}
                    className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl w-full text-left transition-all duration-200 ${
                      isCurrent
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25"
                        : "text-gray-600 hover:bg-white hover:text-gray-900 hover:shadow-md"
                    }`}
                  >
                    <div
                      className={`mr-4 flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 ${
                        isCurrent
                          ? "bg-white/20"
                          : "bg-gray-100 group-hover:bg-blue-100"
                      }`}
                    >
                      <span
                        className={`h-5 w-5 transition-colors duration-200 ${
                          isCurrent
                            ? "text-white"
                            : "text-gray-500 group-hover:text-blue-600"
                        }`}
                      >
                        {item.icon}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{item.name}</p>
                      <p
                        className={`text-xs ${
                          isCurrent ? "text-blue-100" : "text-gray-500"
                        }`}
                      >
                        {item.description}
                      </p>
                    </div>
                    {isCurrent && (
                      <div className="ml-auto w-2 h-2 bg-white rounded-full shadow-sm" />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Mobile sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white transform transition-transform duration-300 ease-in-out md:hidden shadow-2xl ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full bg-gradient-to-b from-gray-50 to-white">
          <div className="flex items-center justify-between px-6 py-6 border-b border-gray-200">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                <img
                  src="/logo.png"
                  alt="Word2Wallet Logo"
                  className="w-6 h-6"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
                <p className="text-xs text-gray-500">Management Console</p>
              </div>
            </div>
            <button
              onClick={onMobileMenuClose}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors duration-200"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <nav className="flex-1 px-3 py-4 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const isCurrent = isCurrentPath(item.href);
              return (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.href)}
                  className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl w-full text-left transition-all duration-200 ${
                    isCurrent
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25"
                      : "text-gray-600 hover:bg-white hover:text-gray-900 hover:shadow-md"
                  }`}
                >
                  <div
                    className={`mr-4 flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 ${
                      isCurrent
                        ? "bg-white/20"
                        : "bg-gray-100 group-hover:bg-blue-100"
                    }`}
                  >
                    <span
                      className={`h-5 w-5 transition-colors duration-200 ${
                        isCurrent
                          ? "text-white"
                          : "text-gray-500 group-hover:text-blue-600"
                      }`}
                    >
                      {item.icon}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{item.name}</p>
                    <p
                      className={`text-xs ${
                        isCurrent ? "text-blue-100" : "text-gray-500"
                      }`}
                    >
                      {item.description}
                    </p>
                  </div>
                  {isCurrent && (
                    <div className="ml-auto w-2 h-2 bg-white rounded-full shadow-sm" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
}
