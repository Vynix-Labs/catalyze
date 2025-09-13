import React, { useState } from "react";
import {
  ChevronLeft,
  Eye,
  EyeOff,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import type { Transaction } from "../components/Transactions";
import Button from "../common/ui/button";

interface CurrencyDetailPageProps {
  currencyType: string;
  balance: string;
  nairaValue: string;
  transactions: Transaction[];
  onBack: () => void;
}

// Currency icon mapping
const currencyIcons = {
  USDT: "/images/usdt.png",
  USDC: "/images/usdc.png",
  STRK: "/images/strk.png",
};

// Fallback component for unknown currencies
const FallbackIcon = ({ currencyType }: { currencyType: string }) => (
  <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center">
    <span className="text-xs font-bold text-white">
      {currencyType.charAt(0)}
    </span>
  </div>
);

const CurrencyIcon = ({
  currencyType,
  size = "small",
}: {
  currencyType: string;
  size?: "small" | "large";
}) => {
  const iconPath = currencyIcons[currencyType as keyof typeof currencyIcons];
  const sizeClass = size === "large" ? "w-8 h-8" : "w-6 h-6";
  const imgSizeClass = size === "large" ? "w-6 h-6" : "w-4 h-4";

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

  return <FallbackIcon currencyType={currencyType} />;
};

const CurrencyDetailPage: React.FC<CurrencyDetailPageProps> = ({
  currencyType,
  balance,
  nairaValue,
  transactions,
  onBack,
}) => {
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);

  const toggleBalanceVisibility = () => {
    setIsBalanceVisible(!isBalanceVisible);
  };

  // Filter transactions for this currency
  const currencyTransactions = transactions.filter(
    (transaction) => transaction.currencyType === currencyType
  );

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-md mx-auto min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
          <button
            onClick={onBack}
            className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">{currencyType}</h1>
          <div className="w-9 h-9"></div>
        </div>

        {/* Balance Card */}
        <div className="space-y-4">
          <div className="p-4 bg-white">
            {/* Currency Icon and Balance */}
            <div className="flex items-center space-x-2 mb-2">
              <CurrencyIcon currencyType={currencyType} size="small" />
              <div>
                <h2 className="text-sm font-medium text-gray-100">
                  {currencyType} Balance
                </h2>
              </div>
            </div>

            {/* Balance Display */}
            <div className="mb-4">
              <div className="flex items-center space-x-2">
                {isBalanceVisible ? (
                  <p className="text-[40px] font-black text-gray-900">
                    {balance}
                  </p>
                ) : (
                  <p className="text-[40px] font-bold text-gray-900">••••••</p>
                )}

                <button
                  onClick={toggleBalanceVisibility}
                  className="p-2 hover:bg-blue-100 rounded-full transition-colors"
                >
                  {isBalanceVisible ? (
                    <Eye className="w-5 h-5 text-primary-100" />
                  ) : (
                    <EyeOff className="w-5 h-5 text-primary-100" />
                  )}
                </button>
              </div>

              {isBalanceVisible && (
                <p className="text-lg text-gray-600 mt-1">≈₦{nairaValue}</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 ">
              <Button variants="primary" classes="text-xs">
                <span>Transfer</span> <ArrowUpRight className="w-4 h-4" />
              </Button>
              <Button variants="primary" classes="text-xs">
                <span>Deposit</span> <ArrowDownRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* History Section */}
          <div className="px-4 pb-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">History</h2>
              <button className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors">
                See all
              </button>
            </div>

            {/* Transaction List */}
            <div className="space-y-3 bg-white rounded-lg">
              {currencyTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between py-3 px-4"
                >
                  {/* Left side */}
                  <div className="flex items-center space-x-3">
                    <div className=" rounded-full flex items-center justify-center">
                      <CurrencyIcon currencyType={currencyType} size="large" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 text-sm">
                        {transaction.title}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {transaction.date}
                      </p>
                    </div>
                  </div>

                  {/* Right side */}
                  <div className="text-right">
                    <span
                      className={`font-semibold text-base ${
                        transaction.type === "deposit"
                          ? "text-green-600"
                          : transaction.type === "withdrawal"
                          ? "text-red-600"
                          : "text-blue-600"
                      }`}
                    >
                      {transaction.type === "deposit"
                        ? "+"
                        : transaction.type === "withdrawal"
                        ? "-"
                        : ""}
                      {transaction.currency || "₦"}
                      {transaction.amount}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty state */}
            {currencyTransactions.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-gray-400 text-2xl">📝</span>
                </div>
                <h3 className="text-lg font-medium text-gray-600 mb-2">
                  No transactions yet
                </h3>
                <p className="text-sm text-gray-500">
                  Your {currencyType} transaction history will appear here.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrencyDetailPage;
