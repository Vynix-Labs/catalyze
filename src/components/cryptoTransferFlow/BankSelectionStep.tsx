import React from "react";
import type { BankSelectionStepProps } from "../../types/types";

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
              className="w-full p-4 border border-gray-200 rounded-lg text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Bank</option>
              <option value="access">Access Bank</option>
              <option value="gtb">GTBank</option>
              <option value="zenith">Zenith Bank</option>
              <option value="uba">UBA</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account Number
            </label>
            <input
              type="text"
              placeholder="Enter Account Number"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              className="w-full p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {accountNumber && (
            <div className="bg-blue-600 text-white p-4 rounded-lg">
              <div className="text-center font-medium">{username}</div>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 bg-white">
        <button
          onClick={onNext}
          disabled={!selectedBank || !accountNumber}
          className="w-full bg-blue-600 text-white py-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Proceed
        </button>
      </div>
    </div>
  );
};

export default BankSelectionStep;
