import { MagicWandIcon, VideoIcon } from "../../../assets/svg";
import { RoutePath } from "../../../routes/routePath";
import SettingsLink from "../links/Link";

function Security() {
  return (
    <div className="space-y-2">
      <p className="text-base font-bold text-black">Security</p>
      <div className="bg-white py-6 px-4 rounded-sm  space-y-9 border border-neutral-100">
        <SettingsLink
          icon={<MagicWandIcon />}
          href={RoutePath.UPDATE_PASSWORD}
          name="Password"
          subtext="Change & Update Password"
        />
        <SettingsLink
          icon={<VideoIcon />}
          name="Biometric Login"
          subtext="Use fingerprint or Face ID"
          element={
            <div className="form-control relative">
              <input
                type="checkbox"
                className="appearance-none h-8 w-13 bg-gray-400 checked:bg-[#34C759] !outline-none !ring-0 !rounded-full shadow-inner cursor-pointer transition-all duration-300 before:content-[''] before:absolute before:top-1 before:left-1 before:w-6 before:h-6 before:bg-white before:rounded-full before:shadow-md before:transform before:transition-transform before:duration-300 checked:before:translate-x-5 !border-0 "
              />
            </div>
          }
        />
        <SettingsLink
          icon={<VideoIcon />}
          name="Two-Factor Authentication"
          subtext="Extra protection for login and withdrawals"
          element={
            <div className="form-control relative">
              <input
                type="checkbox"
                className="appearance-none h-8 w-13 bg-gray-400 checked:bg-[#34C759] !outline-none !ring-0 !rounded-full shadow-inner cursor-pointer transition-all duration-300 before:content-[''] before:absolute before:top-1 before:left-1 before:w-6 before:h-6 before:bg-white before:rounded-full before:shadow-md before:transform before:transition-transform before:duration-300 checked:before:translate-x-5 !border-0 "
              />
            </div>
          }
        />
        <SettingsLink
          icon={<VideoIcon />}
          href="/settings/recent-activity"
          name="Device Management"
          subtext="Manage active logins and devices"
        />
      </div>
    </div>
  );
}

export default Security;
