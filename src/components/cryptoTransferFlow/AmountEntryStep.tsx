import React, { useState } from "react";
import { AlertCircle } from "lucide-react";
import type { AmountEntryStepProps } from "../../types/types";
import CurrencyTabs from "./CurrencyTabs";
import Button from "../../common/ui/button";
import { SwapIcon } from "../../assets/svg";

const AmountEntryStep: React.FC<AmountEntryStepProps> = ({
  amount,
  setAmount,
  onNext,
  transferType,
  onTransferTypeChange,
  currencyType = "USDC",
}) => {
  const [amountNGN, setAmountNGN] = useState("");
  const [address, setAddress] = useState("");
  const [selectedNetwork, setSelectedNetwork] = useState("");
  const [isSwapped, setIsSwapped] = useState(false);
  // Exchange rate calculation
  const exchangeRate = 1500; // 1 USD = 1500 NGN

  const handleUSDCChange = (value: string) => {
    setAmount?.(value);
    // Auto-calculate NGN equivalent
    const usdcAmount = parseFloat(value) || 0;
    const ngnEquivalent = (usdcAmount * exchangeRate).toFixed(2);
    setAmountNGN(ngnEquivalent);
  };

  const handleNGNChange = (value: string) => {
    setAmountNGN(value);
    // Auto-calculate USDC equivalent
    const ngnAmount = parseFloat(value) || 0;
    const usdcEquivalent = (ngnAmount / exchangeRate).toFixed(6);
    setAmount?.(usdcEquivalent);
  };

  const handleSwap = () => {
    // Swap the values between USDC and NGN inputs
    const tempUSDC = amount;
    const tempNGN = amountNGN;
    setAmount?.(tempNGN);
    setAmountNGN(tempUSDC);
    setIsSwapped(!isSwapped);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative">
      <div className="bg-white h-full">
        <CurrencyTabs
          activeTab={transferType}
          onTabChange={onTransferTypeChange}
        />

        {/* Show different content based on active tab */}
        {transferType === "fiat" ? (
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
                  onChange={(e) => handleUSDCChange(e.target.value)}
                  className="w-full placeholder:text-sm p-3 border border-gray-200 bg-neutral-50 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div
              className="flex justify-center cursor-pointer items-center"
              onClick={handleSwap}
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
                  onChange={(e) => handleNGNChange(e.target.value)}
                  className="w-full placeholder:text-sm p-3 border border-gray-200 bg-neutral-50 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            <div className="">
              <div className="flex items-center justify-between text-sm mb-2">
                <div className="font-bold">Amount</div>
                <span>Available Amount: 10,000 {currencyType}</span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder={`Enter ${currencyType} amount`}
                  value={amount}
                  onChange={(e) => setAmount?.(e.target.value)}
                  className="w-full placeholder:text-sm p-3 border border-gray-200 bg-neutral-50 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="mb-4">
              <div className="text-sm font-bold mb-2">Address</div>

              <div className="relative">
                <input
                  type="text"
                  placeholder={`Enter ${currencyType} address`}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full placeholder:text-sm p-3 border border-gray-200 bg-neutral-50 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="mb-4">
              <div className="block text-sm font-bold mb-2">Network</div>
              <select
                value={selectedNetwork}
                onChange={(e) => setSelectedNetwork(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Network</option>
                <option value="bep20">BEP-20 (Binance Smart Chain)</option>
                <option value="erc20">ERC-20 (Ethereum)</option>
                <option value="spl">SPL (Solana)</option>
                <option value="polygon">Polygon</option>
              </select>
            </div>
          </div>
        )}

        {transferType === "fiat" && (
          <div className="flex items-start flex-col space-x-2 text-sm text-secondary-100 bg-secondary-200 space-y-2 rounded-lg mx-4 p-3">
            <div className="text-sm flex gap-2 items-center">
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <span className="font-medium">Info</span>
            </div>

            <div className="">
              Estimated amount of naira with our current rate will be
              transferred to beneficiary
            </div>
          </div>
        )}
      </div>

      <div className="w-full bottom-0 mx-auto flex justify-center p-4 absolute">
        <Button
          variants="primary"
          handleClick={onNext}
          text="Proceed"
          disabled={
            transferType === "fiat"
              ? !amount || !amountNGN
              : !amount || !address || !selectedNetwork
          }
        />
      </div>
    </div>
  );
};

export default AmountEntryStep;
