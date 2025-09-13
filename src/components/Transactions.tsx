import React from "react";

export interface Transaction {
  id: string;
  title: string;
  date: string;
  amount: string;
  currency?: string;
  type: "deposit" | "withdrawal" | "transfer";
}

interface TransactionsProps {
  transactions: Transaction[];
  title?: string;
  showDivider?: boolean;
}

const Transactions: React.FC<TransactionsProps> = ({
  transactions,
  title = "Transactions",
  showDivider = true,
}) => {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">{title}</h2>

      <div className="space-y-4">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex justify-between items-start py-2 border-gray-100"
          >
            <div className="flex-1">
              <h3 className="font-medium text-gray-800">{transaction.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{transaction.date}</p>
            </div>

            <div className="text-right">
              <span
                className={`font-semibold ${
                  transaction.type === "deposit"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {transaction.type === "deposit" ? "+" : "-"}
                {transaction.currency || "N"}
                {transaction.amount}
              </span>
            </div>
          </div>
        ))}
      </div>

      {showDivider && <div className="border-t border-gray-200 my-6"></div>}
    </div>
  );
};

export default Transactions;
