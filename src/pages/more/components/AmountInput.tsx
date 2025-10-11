import { useState } from "react";
import type { EnterAmountPageProps } from "../../../types/types";
import { useBalances } from "../../../hooks";

interface AmountInputProps {
  amount: string;
  onChange: (value: string) => void;
  pool: EnterAmountPageProps["pool"];
}

const AmountInput = ({ amount, onChange, pool }: AmountInputProps) => {
  const { data: balance } = useBalances();
  const [error, setError] = useState<string>("");

  const availableBalance = balance?.totalFiat || 0;
  const MIN_STAKE = 0;
  const MAX_STAKE = availableBalance;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Allow only numbers and decimal point
    if (!/^\d*\.?\d*$/.test(value) && value !== "") {
      return;
    }

    onChange(value);

    // Validate amount
    const numValue = parseFloat(value);
    if (value && !isNaN(numValue)) {
      if (numValue < MIN_STAKE) {
        setError(`Minimum stake is ${MIN_STAKE} ${pool.name}`);
      } else if (numValue > Number(MAX_STAKE)) {
        setError(
          `Insufficient balance. Available: ${Number(MAX_STAKE).toFixed(2)} ${
            pool.name
          }`
        );
      } else {
        setError("");
      }
    } else if (value === "") {
      setError("");
    }
  };

  return (
    <div className="space-y-2 mb-6">
      <label className="block text-sm font-medium text-gray-700">
        Enter amount to stake
      </label>
      <input
        type="text"
        value={amount}
        onChange={handleInputChange}
        placeholder="0.00"
        className={`w-full p-3 font-semibold border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
          error
            ? "border-red-300 focus:ring-red-500"
            : "border-gray-200 focus:ring-blue-500"
        }`}
      />
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
      <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
        <span>
          Min: {MIN_STAKE} {pool.name}
        </span>
        <span>
          Available: {Number(MAX_STAKE).toFixed(2)} {pool.name}
        </span>
      </div>
    </div>
  );
};

export default AmountInput;
