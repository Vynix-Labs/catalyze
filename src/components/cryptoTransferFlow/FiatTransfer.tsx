import { SwapIcon } from "../../assets/svg";
import type { BaseComponentProps } from "../../types/types";
import { exchangeRate } from "../../utils";

interface FiatTransferProps extends BaseComponentProps {
  onSwap: () => void;
  isSwapped: boolean;
}

export const FiatTransfer: React.FC<FiatTransferProps> = ({
  amount,
  amountNGN,
  currencyType,
  onAmountChange,
  onAmountNGNChange,
  onSwap,
  isSwapped,
}) => {
  return (
    <div className="p-4 space-y-4">
      <div className="">
        <div className="flex items-center justify-between text-sm mb-2">
          <div className="font-bold">Enter Amount</div>
          <span>Available Amount: 10,000</span>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder={`Enter ${currencyType}`}
            inputMode="numeric"
            value={amount}
            onChange={(e) => onAmountChange(e.target.value)}
            className="w-full placeholder:text-sm p-3 border border-gray-200 bg-neutral-50 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div
        className="flex justify-center cursor-pointer items-center"
        onClick={onSwap}
      >
        <SwapIcon
          className={`hover:scale-110 transition-all duration-300 hover:text-blue-600 active:text-red-500 ${
            isSwapped ? "rotate-180" : "rotate-0"
          }`}
        />
      </div>

      <div className="mb-4">
        <div className="text-sm text-gray-600 mb-2">
          Exchange Rate: ₦{exchangeRate.toLocaleString()}/{currencyType}
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Enter NGN"
            inputMode="numeric"
            value={amountNGN}
            onChange={(e) => onAmountNGNChange(e.target.value)}
            className="w-full placeholder:text-sm p-3 border border-gray-200 bg-neutral-50 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );
};
