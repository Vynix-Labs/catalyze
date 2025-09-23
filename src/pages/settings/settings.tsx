import { useNavigate } from "react-router-dom";
import Button from "../../common/ui/button";
import Account from "../../components/settings/links/Account";
import Preferences from "../../components/settings/links/Preferences";
import Security from "../../components/settings/links/Security";
import Support from "../../components/settings/links/Support";
import { RoutePath } from "../../routes/routePath";

function Settings() {
  const navigate = useNavigate();
  const handleLogout = () => {
    // Implement logout functionality here
  };
  const handleEditClick = () => {
    navigate(RoutePath.PERSONAL_INFO);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
        <p className="text-gray-600">Manage your account and preference</p>
      </div>
      <div className="space-y-6">
        <p className="text-base font-bold text-black">Profile</p>
        {/* profile */}
        <div className="p-4 gap-2.5 rounded border border-neutral-100  flex justify-between items-center bg-white">
          <div className="flex items-center gap-3">
            <div className="size-12 rounded-full bg-[#FF5138] flex items-center justify-center">
              <p className="uppercase text-base font-bold text-white">ap</p>
            </div>
            <div className="flex gap-1 flex-col">
              <p className="text-base font-bold text-black">Jeff Briggs</p>
              <p className="text-sm font-medium text-gray-100">
                jeffbriggs3@gmail.com
              </p>
            </div>
          </div>
          <div className="flex justify-between items-center w-16">
            <Button
              handleClick={handleEditClick}
              variants="primary"
              classes="!h-6 !px-5 !py-1 !text-xs"
            >
              Edit
            </Button>
          </div>
        </div>
      </div>

      <Account />
      <Security />
      <Preferences />
      <Support />

      <div>
        <Button
          variants="primary"
          classes="w-full !h-12 !text-base !font-semibold !bg-red-500 hover:!bg-red-600s"
          handleClick={handleLogout}
        >
          Log Out
        </Button>
      </div>
    </div>
  );
}

export default Settings;
