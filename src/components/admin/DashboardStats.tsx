"use client";
import { useLocalizedNavigation } from "@/utils/navigation";

interface StatCard {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "increase" | "decrease" | "neutral";
  icon: React.ReactNode;
  href?: string;
  color: "blue" | "green" | "yellow" | "purple" | "red";
}

interface DashboardStatsProps {
  stats: StatCard[];
}

export default function DashboardStats({ stats }: DashboardStatsProps) {
  const { navigate } = useLocalizedNavigation();

  const getColorClasses = (color: string) => {
    const colors = {
      blue: {
        bg: "bg-gradient-to-r from-blue-500 to-blue-600",
        iconBg: "bg-blue-100",
        iconColor: "text-blue-600",
        changeBg: "bg-blue-50",
        changeText: "text-blue-700",
      },
      green: {
        bg: "bg-gradient-to-r from-green-500 to-green-600",
        iconBg: "bg-green-100",
        iconColor: "text-green-600",
        changeBg: "bg-green-50",
        changeText: "text-green-700",
      },
      yellow: {
        bg: "bg-gradient-to-r from-yellow-500 to-yellow-600",
        iconBg: "bg-yellow-100",
        iconColor: "text-yellow-600",
        changeBg: "bg-yellow-50",
        changeText: "text-yellow-700",
      },
      purple: {
        bg: "bg-gradient-to-r from-purple-500 to-purple-600",
        iconBg: "bg-purple-100",
        iconColor: "text-purple-600",
        changeBg: "bg-purple-50",
        changeText: "text-purple-700",
      },
      red: {
        bg: "bg-gradient-to-r from-red-500 to-red-600",
        iconBg: "bg-red-100",
        iconColor: "text-red-600",
        changeBg: "bg-red-50",
        changeText: "text-red-700",
      },
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getChangeIcon = (changeType?: string) => {
    if (changeType === "increase") {
      return (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 17l9.2-9.2M17 17V7H7"
          />
        </svg>
      );
    } else if (changeType === "decrease") {
      return (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 7l-9.2 9.2M7 7v10h10"
          />
        </svg>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => {
        const colors = getColorClasses(stat.color);
        const CardContent = (
          <div
            className={`${colors.bg} rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-blue-100 text-sm font-medium mb-1">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold mb-2">{stat.value}</p>
                {stat.change && (
                  <div
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colors.changeBg} ${colors.changeText}`}
                  >
                    {getChangeIcon(stat.changeType)}
                    <span className="ml-1">{stat.change}</span>
                  </div>
                )}
              </div>
              <div
                className={`w-12 h-12 ${colors.iconBg} rounded-lg flex items-center justify-center`}
              >
                <span className={colors.iconColor}>{stat.icon}</span>
              </div>
            </div>
          </div>
        );

        if (stat.href) {
          return (
            <button
              key={index}
              onClick={() => navigate(stat.href!)}
              className="block w-full text-left"
            >
              {CardContent}
            </button>
          );
        }

        return <div key={index}>{CardContent}</div>;
      })}
    </div>
  );
}
