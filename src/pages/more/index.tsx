import { ChevronRightIcon, LogOutIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { MagicWandIcon, SettingsIcon, VideoIcon } from "../../assets/svg";
import { useAuthState } from "../../hooks/useAuthState";
import { RoutePath } from "../../routes/routePath";

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
  const [activeItem, setActiveItem] = useState<string>("learning-hub");

  const navigate = useNavigate(); // ✅ React Router hook
  const { logout } = useAuthState();

  // Navigation helper function
  const handleNavigation = (itemId: string, path?: string) => {
    setActiveItem(itemId);

    if (path) {
      navigate(path); // ✅ navigate instead of router.push
    }
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate(RoutePath.SIGNIN, { replace: true });
  };

  const menuItems: MenuItem[] = [
    {
      id: "gamification",
      title: "Gamification",
      description: "Lorem ipsum dolor sit amet consectetur.",
      icon: <MagicWandIcon className="h-6 w-6" />,
      onClick: () => handleNavigation("gamification", "/more/"),
    },
    {
      id: "history",
      title: "History",
      description: "Lorem ipsum dolor sit amet consectetur.",
      icon: <VideoIcon className="h-6 w-6" />,
      onClick: () => handleNavigation("history", "/more/"),
    },
    {
      id: "learning-hub",
      title: "Learning Hub",
      description: "Lorem ipsum dolor sit amet consectetur.",
      icon: <VideoIcon className="h-6 w-6" />,
      onClick: () => handleNavigation("learning-hub", "/more/"),
    },
    {
      id: "staking",
      title: "Staking",
      description: "Lorem ipsum dolor sit amet consectetur.",
      path: RoutePath.STAKING,
      icon: <VideoIcon className="h-6 w-6" />,
      onClick: () => handleNavigation("staking", RoutePath.STAKING),
    },
    {
      id: "settings",
      title: "Settings",
      description: "Lorem ipsum dolor sit amet consectetur.",
      icon: <SettingsIcon className="h-6 w-6" />,
      onClick: () => handleNavigation("settings", RoutePath.SETTINGS),
    },
    {
      id: "logout",
      title: "Logout",
      description: "Sign out of your account",
      icon: <LogOutIcon className="h-6 w-6" />,
      onClick: handleLogout,
    },
  ];

  return (
    <div className=" bg-gray-50 p-4">
      <div className="mx-auto   max-w-md w-full space-y-4">
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
                    <p className="text-sm text-gray-500">{item.description}</p>
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
  );
};

export default MorePage;
