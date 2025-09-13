import React from "react";
import type { CurrencyTabProps } from "../../types/types";

const CurrencyTabs: React.FC<CurrencyTabProps> = ({
  activeTab,
  onTabChange,
}) => (
  <div className="p-2 flex gap-2 items-center bg-neutral-50 w-fit rounded-lg">
    <button
      className={`text-sm px-4 py-2 rounded-lg transition-colors ${
        activeTab === "fiat"
          ? "bg-white text-black font-medium shadow-sm"
          : "text-gray-500 hover:text-gray-700"
      }`}
      onClick={() => onTabChange("fiat")}
    >
      Fiat
    </button>
    <button
      className={`text-sm px-4 py-2 rounded-lg transition-colors ${
        activeTab === "crypto"
          ? "bg-white text-black font-medium shadow-sm"
          : "text-gray-500 hover:text-gray-700"
      }`}
      onClick={() => onTabChange("crypto")}
    >
      Cryptocurrency
    </button>
  </div>
);

export default CurrencyTabs;
