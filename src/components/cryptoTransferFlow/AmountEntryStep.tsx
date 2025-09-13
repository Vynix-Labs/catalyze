import React from "react";
import { AlertCircle } from "lucide-react";
import Header from "./Header";
import type { AmountEntryStepProps } from "../../types/types";

const AmountEntryStep: React.FC<AmountEntryStepProps> = ({
  amount,
  setAmount,
  onNext,
  onBack,
}) => (
  <div className="min-h-screen bg-gray-50 flex flex-col">
    <div className="bg-white">
      <Header title="USDC" onBack={onBack} />

      <div className="p-4 flex gap-2 items-center bg-neutral-200 w-full">
        <button className="text-sm text-gray-500">Fiat</button>
        <button className="text-sm font-medium">Cryptocurrency</button>
      </div>

      <div className="p-4">
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
            <span>Enter Amount</span>
            <span>Available Amount: 75,000</span>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Enter USDC"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-3 border border-gray-200 bg-neutral-50 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="text-sm text-gray-600 mb-1">
          Minimum limit: 75,000 NGN
        </div>
        <div className="text-sm text-gray-600">Amount limit: 75,000 NGN</div>
      </div>

      <div className="p-4">
        <div className="flex items-start space-x-2 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-yellow-800">
            <span className="font-medium">Info</span>
            <div className="mt-1">
              The transfer amount of Naira with our current rate will be
              transferred to beneficiary
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="mt-auto p-4 bg-white">
      <button
        onClick={onNext}
        disabled={!amount}
        className="w-full bg-blue-600 text-white py-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        Proceed
      </button>
    </div>
  </div>
);

export default AmountEntryStep;
