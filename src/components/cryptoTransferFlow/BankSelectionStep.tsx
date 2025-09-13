import React from "react";
import type { BankSelectionStepProps } from "../../types/types";
import Button from "../../common/ui/button";

const BankSelectionStep: React.FC<BankSelectionStepProps> = ({
  selectedBank,
  setSelectedBank,
  accountNumber,
  setAccountNumber,
  username,
  onNext,
}) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white flex-1">
        <div className="p-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bank
            </label>
            <select
              value={selectedBank}
              onChange={(e) => setSelectedBank(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Bank</option>
              <option value="access">Access Bank</option>
              <option value="gtb">GTBank</option>
              <option value="zenith">Zenith Bank</option>
              <option value="uba">UBA</option>
            </select>
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account Number
            </label>
            <input
              type="text"
              placeholder="Enter Account Number"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            {/* Username card */}
            {accountNumber && (
              <div className="absolute left-0 right-0 bg-blue-600 text-white p-3 rounded-b-lg">
                <div className="text-start font-semibold text-xs">
                  {username}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 bg-white">
        <Button variants="primary" handleClick={onNext}>
          Proceed
        </Button>
      </div>
    </div>
  );
};

export default BankSelectionStep;
