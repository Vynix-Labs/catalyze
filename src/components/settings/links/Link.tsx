import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

interface Props {
  // Add any props if needed in the future
  name: string;
  href?: string;
  subtext: string;
  icon?: React.ReactNode;
  element?: React.ReactNode;
}
function SettingsLink({ name, href, subtext, icon, element }: Props) {
  return (
    <Link to={href ?? ""} className="flex justify-between items-center group">
      <div className="flex gap-3  items-center">
        {icon && <div className="">{icon}</div>}
        <div>
          <p className="text-base font-bold text-black  capitalize group-hover:opacity-95">
            {name}
          </p>
          <p className="text-xs font-semibold text-gray-100 group-hover:opacity-95">
            {subtext}
          </p>
        </div>
      </div>
      <div>
        {element ? (
          element
        ) : (
          <ChevronRight className="text-[#5E5E66]  size-4" />
        )}
      </div>
    </Link>
  );
}

export default SettingsLink;
