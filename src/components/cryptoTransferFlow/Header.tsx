import React from "react";
import { ChevronLeft } from "lucide-react";
import type { HeaderProps } from "../../types/types";

const Header: React.FC<HeaderProps> = ({
  title,
  onBack,
  showBackButton = true,
}) => (
  <div className="flex items-center justify-between p-4 border-gray-100 bg-white">
    {showBackButton ? (
      <button
        onClick={onBack}
        className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
        aria-label="Go back"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
    ) : (
      <div className="w-9 h-9"></div>
    )}
    <h1 className="text-lg font-semibold">{title}</h1>
    <div className="w-9 h-9"></div>
  </div>
);

export default Header;
