import { Outlet, useLocation } from "react-router-dom";
import { RoutePath } from "../routes/routePath";
import BottomNav from "./BottomNav";

const Layout = () => {
  const location = useLocation();

  // Map pathname → tab id
  const getActiveTab = () => {
    if (location.pathname === RoutePath.DASHBOARD) return "home";
    if (location.pathname.startsWith(RoutePath.INVESTMENT)) return "investment";
    if (location.pathname.startsWith(RoutePath.REWARD)) return "rewards";
    if (location.pathname.startsWith(RoutePath.MORE)) return "more";
    return "home";
  };

  const activeTab = getActiveTab();

  return (
    <div className="min-h-vh overflow-hidden  w-screen max-w-md">
      <div className="flex-1 w-full max-h-[91vh] mx-auto max-w-[420px] overflow-x-hidden no-scrollbar">
        <Outlet />
      </div>

      {/* Fixed Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[420px] w-full mx-auto overflow-hidden">
        <BottomNav activeTab={activeTab} />
      </div>
    </div>
  );
};

export default Layout;
