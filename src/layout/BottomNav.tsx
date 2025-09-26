import { Link } from "react-router-dom";
import { HomeIcon, MoreIcon, RewardsIcon, InvestmentIcon } from "../assets/svg";
import { RoutePath } from "../routes/routePath";

interface BottomNavProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab = "home" }) => {
  const navItems = [
    {
      id: "home",
      label: "Home",
      path: RoutePath.DASHBOARD,
      icon: <HomeIcon color={activeTab === "home" ? "#4F46E5" : "#6A7282"} />,
    },
    {
      id: "investment",
      label: "Investment",
      path: RoutePath.INVESTMENT,
      icon: (
        <InvestmentIcon
          color={activeTab === "investment" ? "#4F46E5" : "#6A7282"}
        />
      ),
    },
    {
      id: "rewards",
      label: "Rewards",
      path: RoutePath.REWARD,
      icon: (
        <RewardsIcon color={activeTab === "rewards" ? "#4F46E5" : "#6A7282"} />
      ),
    },
    {
      id: "more",
      label: "More",
      path: RoutePath.MORE,
      icon: <MoreIcon color={activeTab === "more" ? "#4F46E5" : "#6A7282"} />,
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-center">
      <div className="w-full max-w-[420px] mx-auto">
        <div className="bg-white border-t border-gray-200 shadow-lg">
          <div className="flex justify-around items-center py-3">
            {navItems.map((item) => (
              <Link
                to={item.path}
                role="link"
                key={item.id}
                className={`flex flex-col items-center justify-center w-16 ${
                  activeTab === item.id ? "text-primary-100" : "text-gray-400"
                }`}
              >
                <div
                  className={`w-8 h-8 flex items-center justify-center ${
                    activeTab === item.id ? "text-primary-100" : ""
                  }`}
                >
                  {item.icon}
                </div>
                <span className="text-xs font-medium mt-1">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BottomNav;
