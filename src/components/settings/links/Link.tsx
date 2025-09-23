import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

interface Props {
  name: string;
  href?: string;
  subtext: string;
  icon?: React.ReactNode;
  element?: React.ReactNode;
}

function SettingsLink({ name, href, subtext, icon, element }: Props) {
  const Content = (
    <div className="flex justify-between items-center group w-full">
      <div className="flex gap-3 items-center">
        {icon && <div>{icon}</div>}
        <div>
          <p className="text-base font-bold text-black capitalize group-hover:opacity-95">
            {name}
          </p>
          <p className="text-xs font-semibold text-gray-100 group-hover:opacity-95">
            {subtext}
          </p>
        </div>
      </div>
      <div>
        {element ? element : <ChevronRight className="text-[#5E5E66] size-4" />}
      </div>
    </div>
  );

  return href ? (
    <Link className=" flex  w-full" to={href}>
      {Content}
    </Link>
  ) : (
    Content
  );
}

export default SettingsLink;
