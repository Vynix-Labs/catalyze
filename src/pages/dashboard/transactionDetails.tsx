import type { Transaction } from "../../components/Transactions";
import { ChevronLeftIcon } from "../../assets/svg";
import { detectCurrencyType } from "../../types/types";
import CurrencyIcon from "../../components/CurrencyIcon";

interface TransactionDetailsPageProps {
  transactions: Transaction[];
  onBack: () => void;
}

// Currency icon mapping - using proper image paths



const TransactionDetailsPage: React.FC<TransactionDetailsPageProps> = ({
  transactions,
  onBack,
}) => {
  

  // Group transactions by date
  const groupedTransactions = transactions.reduce((acc, transaction) => {
    const date = transaction.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(transaction);
    return acc;
  }, {} as Record<string, Transaction[]>);

  // Sort dates to show most recent first
  const sortedDates = Object.keys(groupedTransactions).sort((a, b) => {
    // Simple date comparison - in real app you'd use proper date parsing
    return b.localeCompare(a);
  });

  // Helper function to get readable date labels
  const getDateLabel = (date: string, index: number): string => {
    if (index === 0) return "Today";
    if (index === 1) return "Yesterday";
    return date;
  };

  return (
    <div className="bg-neutral-50">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
          <button
            onClick={onBack}
            className="p-2 hover:bg-neutral-100 rounded-full"
          >
            <ChevronLeftIcon />
          </button>
          <h1 className="text-lg font-semibold">Transactions</h1>
          <div className="w-9 h-9"></div> {/* Spacer for center alignment */}
        </div>

        {/* Transactions List */}
        <div className="p-4">
          {sortedDates.map((date, index) => (
            <div key={date} className="mb-6">
              <h2 className="text-sm font-semibold text-gray-600 mb-3">
                {getDateLabel(date, index)}
              </h2>

              <div className="bg-white rounded-lg p-3 space-y-3">
                {groupedTransactions[date].map((transaction) => {
                  const currencyType =
                    transaction.currencyType ||
                    detectCurrencyType(transaction.title);

                  return (
                    <div
                      key={transaction.id}
                      className="flex justify-between items-center py-2"
                    >
                      {/* Left side with icon and text */}
                      <div className="flex items-center space-x-3 flex-1">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                          <CurrencyIcon currencyType={currencyType} />
                        </div>
                        <div>
                          <h3 className="font-medium text-black text-sm">
                            {transaction.title}
                          </h3>
                          <p className="text-xs text-gray-500">
                            {transaction.date}
                          </p>
                        </div>
                      </div>

                      {/* Right side with amount */}
                      <div className="text-right">
                        <span
                          className={`font-bold text-base ${
                            transaction.type === "deposit"
                              ? "text-black"
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
                          {transaction.currency || "N"}
                          {transaction.amount}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Empty state if no transactions */}
        {transactions.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-gray-400 text-2xl">💳</span>
            </div>
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              No transactions yet
            </h3>
            <p className="text-sm text-gray-500 text-center px-8">
              Your transaction history will appear here once you make your first
              transaction.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionDetailsPage;
