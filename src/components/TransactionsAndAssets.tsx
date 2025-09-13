import React from "react";

const TransactionsAndAssets: React.FC = () => {
  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-5">
      {/* Transactions Section */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Transactions</h2>

        <div className="space-y-4">
          {/* Transaction 1 */}
          <div className="flex justify-between items-start py-3 border-b border-gray-100">
            <div className="flex-1">
              <h3 className="font-medium text-gray-800">
                Deposit to USDT wallet
              </h3>
              <p className="text-sm text-gray-500 mt-1">9th June, 2024</p>
            </div>
            <div className="text-right">
              <span className="text-green-600 font-semibold">+N10,000</span>
            </div>
          </div>

          {/* Transaction 2 */}
          <div className="flex justify-between items-start py-3 border-b border-gray-100">
            <div className="flex-1">
              <h3 className="font-medium text-gray-800">
                Deposit to USDC wallet
              </h3>
              <p className="text-sm text-gray-500 mt-1">9th June, 2024</p>
            </div>
            <div className="text-right">
              <span className="text-green-600 font-semibold">+N20,000</span>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 my-6"></div>

      {/* Assets Section */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Assets</h2>

        <div className="space-y-4">
          {/* Asset 1 - USDT */}
          <div className="flex justify-between items-center py-3">
            <div>
              <h3 className="font-bold text-gray-800">USDT</h3>
              <p className="text-sm text-gray-600">Tether</p>
            </div>
            <div className="text-right">
              <p className="font-medium text-gray-800">10,000</p>
              <p className="text-sm text-gray-600">≈N100,000</p>
            </div>
          </div>

          {/* Asset 2 - USDC */}
          <div className="flex justify-between items-center py-3">
            <div>
              <h3 className="font-bold text-gray-800">USDC</h3>
              <p className="text-sm text-gray-600">USD Coin</p>
            </div>
            <div className="text-right">
              <p className="font-medium text-gray-800">10,000</p>
              <p className="text-sm text-gray-600">≈N100,000</p>
            </div>
          </div>

          {/* Asset 3 - STRK */}
          <div className="flex justify-between items-center py-3">
            <div>
              <h3 className="font-bold text-gray-800">STRK</h3>
              <p className="text-sm text-gray-600">Starknet</p>
            </div>
            <div className="text-right">
              <p className="font-medium text-gray-800">10,000</p>
              <p className="text-sm text-gray-600">≈N100,000</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionsAndAssets;
