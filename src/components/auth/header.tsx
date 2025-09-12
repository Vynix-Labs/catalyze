import { Link } from "react-router-dom";
import type { AuthHeaderProps } from "../../types/types";

function AuthHeader({ title, description, link, isLink }: AuthHeaderProps) {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-black text-gray-800">{title}</h1>
      <p className="text-sm font-medium text-gray-400 leading-[160%]">
        {description}{" "}
        {isLink && (
          <Link
            aria-label={link?.text}
            className="text-primary-100 hover:opacity-90 font-medium"
            to={link?.url ?? ""}
          >
            {link?.text}
          </Link>
        )}
      </p>
    </div>
  );
}
export default AuthHeader;
