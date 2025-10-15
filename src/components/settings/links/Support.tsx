import { MagicWandIcon, VideoIcon } from "../../../assets/svg";
import SettingsLink from "../links/Link";
import { RoutePath } from "../../../routes/routePath";
const links = [
  {
    name: "Help Center",
    href: RoutePath.HELP_CENTER,
    description: "FAQs and support articles",
    icon: <MagicWandIcon />,
  },

  {
    name: "Contact Support",
    href: RoutePath.CONTACT_SUPPORT,
    description: "Reach out via chat or email",
    icon: <VideoIcon />,
  },
  {
    name: "Privacy Policy",
    href: RoutePath.PRIVACY_POLICY,
    description: "Privacy Policy",
    icon: <VideoIcon />,
  },
  {
    name: "Terms Of Use",
    href: RoutePath.TERMS_OF_USE,
    description: "Read our terms of service",
    icon: <VideoIcon />,
  },
];
function Support() {
  return (
    <div className="space-y-2">
      <p className="text-base font-bold text-black">Help & Support</p>
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

export default Support;
