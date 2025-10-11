import { Outlet, useLocation } from "react-router-dom";
import { RoutePath } from "../routes/routePath";
import BottomNav from "./BottomNav";

const Layout = () => {
  const location = useLocation();

  const getActiveTab = () => {
    if (location.pathname === RoutePath.DASHBOARD) return "home";
    if (location.pathname.startsWith(RoutePath.INVESTMENT)) return "investment";
    if (location.pathname.startsWith(RoutePath.REWARD)) return "rewards";
    if (location.pathname.startsWith(RoutePath.MORE)) return "more";
    return "home";
  };

  const activeTab = getActiveTab();

  return (
    <div className="min-h-screen flex flex-col overflow-hidden bg-neutral-50">
      <div className="flex-1 max-w-md w-screen mx-auto overflow-x-hidden no-scrollbar">
        <Outlet />
      </div>

      {/* Fixed Bottom Navigation */}
      <div className="fixed bottom-0 left-0 max-w-md w-full right-0 mx-auto overflow-hidden bg-white">
        <BottomNav activeTab={activeTab} />
      </div>
    </div>
  );
};

export default Layout;
