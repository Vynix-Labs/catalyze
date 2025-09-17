import React, { useState } from "react";
import { AlertCircle } from "lucide-react";
import type { AmountEntryStepProps } from "../../types/types";
import CurrencyTabs from "./CurrencyTabs";
import Button from "../../common/ui/button";
import { SwapIcon } from "../../assets/svg";

const AmountEntryStep: React.FC<AmountEntryStepProps> = ({
  amount,
  onNext,
  transferType,
  onTransferTypeChange,
}) => {
  // const [activeTab, setActiveTab] = useState("fiat");

  //
  const [amountUSDC, setAmountUSDC] = useState("");
  const [amountNGN, setAmountNGN] = useState("");

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
                  placeholder="Enter USDC"
                  value={amountUSDC}
                  onChange={(e) => setAmountUSDC(e.target.value)}
                  className="w-full placeholder:text-sm p-3 border border-gray-200 bg-neutral-50 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex justify-center cursor-pointer items-center">
              <SwapIcon className="" />
            </div>

            <div className="mb-4">
              <div className="text-sm text-gray-600 mb-2">
                Exchange Rate: $1,500/NGN
              </div>

              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter NGN"
                  value={amountNGN}
                  onChange={(e) => setAmountNGN(e.target.value)}
                  className="w-full placeholder:text-sm p-3 border border-gray-200 bg-neutral-50 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            <div className="">
              <div className="flex items-center justify-between text-sm mb-2">
                <div className="font-bold"> Amount</div>
                <span>Available Amount: 10,000</span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter USDC"
                  value={amount}
                  onChange={(e) => setAmountUSDC(e.target.value)}
                  className="w-full placeholder:text-sm p-3 border border-gray-200 bg-neutral-50 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="mb-4">
              <div className="text-sm font-bold mb-2">Address</div>

              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter NGN"
                  value={amountNGN}
                  onChange={(e) => setAmountNGN(e.target.value)}
                  className="w-full placeholder:text-sm p-3 border border-gray-200 bg-neutral-50 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="mb-4">
              <div className="block text-sm font-bold mb-2">Network</div>
              <select className="w-full p-3 border border-gray-200 rounded-lg text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="">Select Network</option>
                <option value="access">Bep 20</option>
                <option value="gtb">Eth</option>
                <option value="zenith">Solana</option>
                <option value="uba">Polygon</option>
              </select>
            </div>
          </div>
        )}

        {transferType === "fiat" && (
          <div className="flex items-start space-x-2 bg-yellow-50 border border-yellow-200 rounded-lg mx-4 p-3">
            <AlertCircle className="w-5 h-5 text-secondary-100 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-secondary-100">
              <span className="font-medium">Info</span>
              <div className="mt-1">
                {transferType === "fiat"
                  ? "Your fiat amount will be converted to cryptocurrency at the current exchange rate."
                  : "The transfer amount of Naira with our current rate will be transferred to beneficiary"}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="w-full bottom-0 mx-auto flex justify-center p-4 absolute ">
        <Button variants="primary" handleClick={onNext} text="Proceed" />
      </div>
    </div>
  );
};

export default AmountEntryStep;
