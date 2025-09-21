import { Outlet, useLocation } from "react-router-dom";
import BottomNav from "./BottomNav";
import { RoutePath } from "../routes/routePath";

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
    <div className="min-h-screen bg-neutral-50">
      {/* Page Content */}
      <div className="max-w-[420px] mx-auto min-h-screen flex flex-col pb-16">
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </div>

      {/* Fixed Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[420px] mx-auto">
        <BottomNav activeTab={activeTab} />
      </div>
    </div>
  );
};

export default Layout;
