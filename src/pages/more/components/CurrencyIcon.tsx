import { currencyIcons } from "../../../utils";

interface CurrencyIconProps {
  currencyType: string;
}

const CurrencyIcon = ({ currencyType }: CurrencyIconProps) => {
  const iconPath = currencyIcons[currencyType as keyof typeof currencyIcons];
  
  return (
    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
      {iconPath ? (
        <img
          src={iconPath}
          alt={`${currencyType} logo`}
          className="w-8 h-8 object-contain"
        />
      ) : (
        <span className="text-gray-700 font-bold text-sm">$</span>
      )}
    </div>
  );
};

export default CurrencyIcon;