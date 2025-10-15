import { MagicWandIcon, VideoIcon } from "../../../assets/svg";
import SettingsLink from "../links/Link";
import { RoutePath } from "../../../routes/routePath";

const links = [
  {
    name: "Language",
    href: RoutePath.PREFERENCES,
    description: "Choose your preferred app language",
    icon: <MagicWandIcon />,
  },

  {
    name: "Currency",
    href: RoutePath.PREFERENCES,
    description: "Switch between NGN, USD, etc.",
    icon: <VideoIcon />,
  },
  {
    name: "Notification Settings",
    href: RoutePath.NOTIFICATIONS,
    description: "Control push, email, and in-app notifications",
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
        <SettingsLink
          icon={<VideoIcon />}
          name="Dark Mode"
          subtext="Toggle between light and dark themes"
          element={
            <div className="form-control relative">
              <input
                type="checkbox"
                className="appearance-none h-8 w-13 bg-gray-400 checked:bg-[#34C759] !outline-none !ring-0 !rounded-full shadow-inner cursor-pointer transition-all duration-300 before:content-[''] before:absolute before:top-1 before:left-1 before:w-6 before:h-6 before:bg-white before:rounded-full before:shadow-md before:transform before:transition-transform before:duration-300 checked:before:translate-x-5 !border-0 "
              />
            </div>
          }
        />
      </div>
    </div>
  );
}

export default Preferences;
