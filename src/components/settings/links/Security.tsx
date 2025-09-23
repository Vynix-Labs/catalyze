import { MagicWandIcon, VideoIcon } from "../../../assets/svg";
import { RoutePath } from "../../../routes/routePath";
import SettingsLink from "./link";

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
          href="/settings/2fa"
          name="Two-Factor Authentication (2FA)"
          subtext="Enhance account security with 2FA"
        />
        <SettingsLink
          icon={<VideoIcon />}
          href="/settings/recent-activity"
          name="Recent Activity"
          subtext="Review recent login and account activity"
        />
        <SettingsLink
          icon={<VideoIcon />}
          href="/settings/login-alerts"
          name="Device Management"
          subtext="Manage active logins and devices"
        />
      </div>
    </div>
  );
}

export default Security;
