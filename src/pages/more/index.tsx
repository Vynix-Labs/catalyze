import React from "react";
import {
  ChevronRight,
  Trophy,
  Clock,
  GraduationCap,
  Layers,
  Settings,
} from "lucide-react";
import Layout from "../../layout";

interface MenuItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  isHighlighted?: boolean;
  onClick?: () => void;
}

const MorePage = () => {
  const menuItems: MenuItem[] = [
    {
      id: "gamification",
      title: "Gamification",
      description: "Lorem ipsum dolor sit amet consectetur.",
      icon: <Trophy className="h-6 w-6" />,
      onClick: () => console.log("Navigate to Gamification"),
    },
    {
      id: "history",
      title: "History",
      description: "Lorem ipsum dolor sit amet consectetur.",
      icon: <Clock className="h-6 w-6" />,
      onClick: () => console.log("Navigate to History"),
    },
    {
      id: "learning-hub",
      title: "Learning Hub",
      description: "Lorem ipsum dolor sit amet consectetur.",
      icon: <GraduationCap className="h-6 w-6" />,
      isHighlighted: true,
      onClick: () => console.log("Navigate to Learning Hub"),
    },
    {
      id: "staking",
      title: "Staking",
      description: "Lorem ipsum dolor sit amet consectetur.",
      icon: <Layers className="h-6 w-6" />,
      onClick: () => console.log("Navigate to Staking"),
    },
    {
      id: "settings",
      title: "Settings",
      description: "Lorem ipsum dolor sit amet consectetur.",
      icon: <Settings className="h-6 w-6" />,
      onClick: () => console.log("Navigate to Settings"),
    },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="mx-auto max-w-md">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
              More
            </h1>
            <p className="mt-1 text-sm text-gray-600 md:text-base">
              Explore tools, settings, and extras
            </p>
          </div>

          {/* Menu Items */}
          <div className="space-y-3">
            {menuItems.map((item) => (
              <div
                key={item.id}
                onClick={item.onClick}
                className={`
                flex cursor-pointer items-center justify-between rounded-lg bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:scale-[1.02]
                ${
                  item.isHighlighted
                    ? "border-2 border-blue-500 ring-2 ring-blue-100"
                    : "border border-gray-200"
                }
              `}
              >
                <div className="flex items-center space-x-4">
                  {/* Icon */}
                  <div
                    className={`
                  flex h-10 w-10 items-center justify-center rounded-lg
                  ${
                    item.isHighlighted
                      ? "bg-blue-100 text-blue-600"
                      : "bg-gray-100 text-gray-600"
                  }
                `}
                  >
                    {item.icon}
                  </div>

                  {/* Text Content */}
                  <div className="flex flex-col">
                    <h3 className="text-base font-semibold text-gray-900 md:text-lg">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                </div>

                {/* Chevron Arrow */}
                <ChevronRight
                  className={`h-5 w-5 transition-colors
                  ${item.isHighlighted ? "text-blue-600" : "text-gray-400"}
                `}
                />
              </div>
            ))}
          </div>

          {/* Footer Space */}
          <div className="mt-8 pb-4">
            {/* Add any footer content or spacing here */}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MorePage;
