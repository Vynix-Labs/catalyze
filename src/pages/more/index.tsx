import React from "react";
import Layout from "../../layout";
import { MagicWandIcon, SettingsIcon, VideoIcon } from "../../assets/svg";
import { ChevronRightIcon } from "lucide-react";
import { RoutePath } from "../../routes/routePath";
import { useNavigate } from "react-router-dom";

interface MenuItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  path?: string;
  onClick?: () => void;
}

const MorePage = () => {
  // Fixed: Set initial state to the learning-hub id (string), not undefined variable
  const [activeItem, setActiveItem] = React.useState<string>("learning-hub");

  const navigate = useNavigate(); // ✅ React Router hook

  // Navigation helper function
  const handleNavigation = (itemId: string, path?: string) => {
    setActiveItem(itemId);

    if (path) {
      navigate(path); // ✅ navigate instead of router.push
    }

    console.log(`Navigate to ${itemId}`);
  };
  const menuItems: MenuItem[] = [
    {
      id: "gamification",
      title: "Gamification",
      description: "Lorem ipsum dolor sit amet consectetur.",
      icon: <MagicWandIcon className="h-6 w-6" />,
      onClick: () => handleNavigation("gamification", "/more/gamification"),
    },
    {
      id: "history",
      title: "History",
      description: "Lorem ipsum dolor sit amet consectetur.",
      icon: <VideoIcon className="h-6 w-6" />,
      onClick: () => handleNavigation("history", "/more/history"),
    },
    {
      id: "learning-hub",
      title: "Learning Hub",
      description: "Lorem ipsum dolor sit amet consectetur.",
      icon: <VideoIcon className="h-6 w-6" />,
      onClick: () => handleNavigation("learning-hub", "/more/learning-hub"),
    },
    {
      id: "staking",
      title: "Staking",
      description: "Lorem ipsum dolor sit amet consectetur.",
      path: RoutePath.STAKING,
      icon: <VideoIcon className="h-6 w-6" />,
      onClick: () => handleNavigation("staking", "/more/staking"),
    },
    {
      id: "settings",
      title: "Settings",
      description: "Lorem ipsum dolor sit amet consectetur.",
      icon: <SettingsIcon className="h-6 w-6" />,
      onClick: () => handleNavigation("settings", "/more/settings"),
    },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="mx-auto max-w-md space-y-4">
          {/* Header */}
          <div className="space-y-1">
            <h1 className="text-[32px] font-bold text-black-100">More</h1>
            <p className="text-sm text-gray-600 md:text-base">
              Explore tools, settings, and extras
            </p>
          </div>

          {/* Menu Items */}
          <div className="space-y-3">
            {menuItems.map((item) => {
              // Check if this item is currently active
              const isHighlighted = activeItem === item.id;
              return (
                <div
                  key={item.id}
                  onClick={item.onClick}
                  className={`
                    flex cursor-pointer items-center justify-between rounded-lg bg-white p-4 transition-all duration-200 hover:shadow-md hover:scale-[1.02]
                    ${
                      isHighlighted
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
                          isHighlighted
                            ? "bg-blue-100 text-blue-600"
                            : " text-gray-600"
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
                      <p className="text-sm text-gray-500">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Chevron Arrow */}
                  <ChevronRightIcon
                    className={`h-5 w-5 transition-colors
                      ${isHighlighted ? "text-blue-600" : "text-gray-400"}
                    `}
                  />
                </div>
              );
            })}
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
