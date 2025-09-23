import { MagicWandIcon, VideoIcon } from "../../../assets/svg";
import SettingsLink from "./link";

const links = [
  {
    name: "Language",
    href: "/settings/preferences",
    description: "Choose your preferred app language",
    icon: <MagicWandIcon />,
  },

  {
    name: "Currency",
    href: "/settings/preferences",
    description: "Switch between NGN, USD, etc.",
    icon: <VideoIcon />,
  },
  {
    name: "Notification Settings",
    href: "/settings/notifications",
    description: "Control push, email, and in-app notifications",
    icon: <VideoIcon />,
  },
  {
    name: "Dark Mode",
    description: "Toggle between light and dark themes",
    icon: <VideoIcon />,
  },
];
function Preferences() {
  return (
    <div className="space-y-2">
      <p className="text-base font-bold text-black">Preferences</p>
      <div className="bg-white py-6 px-4 rounded-sm  space-y-9 border border-neutral-100">
        {links.map((link, index) => (
          <SettingsLink
            key={link.name + index}
            icon={link.icon}
            href={link.href}
            name={link.name}
            subtext={link.description}
          />
        ))}
      </div>
    </div>
  );
}

export default Preferences;
