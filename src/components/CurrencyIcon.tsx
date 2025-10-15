// Currency icon component
import { currencyIcons } from "../utils";

// Currency icon mapping
// const currencyIcons = {
//   USDT: "/images/usdt.png",
//   USDC: "/images/usdc.png",
//   STRK: "/images/strk.png",
//   UNKNOWN: "/images/default-currency.png",
// };

const CurrencyIcon = ({
  currencyType,
  size = "small",
}: {
  currencyType: string;
  size?: "small" | "large";
}) => {
  const iconPath = currencyIcons[currencyType.toUpperCase() as keyof typeof currencyIcons];
  const sizeClass = size === "large" ? "w-12 h-12" : "w-6 h-6";
  const imgSizeClass = size === "large" ? "w-12 h-12" : "w-6 h-6";

  if (iconPath) {
    return (
      <div
        className={`${sizeClass} bg-blue-100 rounded-full flex items-center justify-center`}
      >
        <img
          src={iconPath}
          alt={`${currencyType} logo`}
          className={`${imgSizeClass} object-contain`}
        />
      </div>
    );
  }

  return (
    <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center">
      <span className="text-xs font-bold text-white">
        {currencyType.charAt(0)}
      </span>
    </div>
  );
};

export default CurrencyIcon;
