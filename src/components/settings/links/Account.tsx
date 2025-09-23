import { MagicWandIcon, VideoIcon } from "../../../assets/svg";
import { RoutePath } from "../../../routes/routePath";
import SettingsLink from "../links/Link";

const links = [
  {
    name: "personal information",
    href: RoutePath.PERSONAL_INFO,
    subtext: "Update name, email, and phone number",
    icon: <MagicWandIcon />,
  },
  {
    name: "Transaction Pin",
    href: RoutePath.TRANSACTION_PIN,
    subtext: "Set up transaction PIN for security",
    icon: <VideoIcon />,
  },
  {
    name: "Verify Identity (KYC)",
    href: "/settings/kyc",
    subtext: "Complete identity verification",
    icon: <VideoIcon />,
  },
];
function Account() {
  return (
    <div className="space-y-2">
      <p className="text-base font-bold text-black">Account</p>
      <div className="bg-white py-6 px-4 rounded-sm  space-y-9 border border-neutral-100">
        {links.map((link, index) => (
          <SettingsLink
            key={link.name + index}
            icon={link.icon}
            href={link.href}
            name={link.name}
            subtext={link.subtext}
          />
        ))}
      </div>
    </div>
  );
}

export default Account;
