import { detectCurrencyType } from "../types/types";
import { currencyIcons } from "../utils";

// export interface Transaction {
//   id: string;
//   title: string;
//   date: string;
//   amount: string;
//   currency?: string;
//   type: "deposit" | "withdrawal" | "transfer";
//   currencyType?: "USDT" | "USDC" | "STRK" | string;
// }

export interface Transaction {
  id: string;
  title: string;
  date: string;
  amount: string;
  currency?: string;
  type: string; // Make more flexible instead of strict union
  currencyType?: string; // Remove strict union
  subtype?: string;
}

interface TransactionsProps {
  transactions: Transaction[];
  title?: string;
  showDivider?: boolean;
  maxDisplayItems?: number;
  onViewAll?: () => void;
  onTransactionClick?: (transaction: Transaction) => void;
}

// Currency icon mapping - using proper image paths

// Fallback component for unknown currencies
const FallbackIcon = ({ currencyType }: { currencyType: string }) => (
  <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
    <span className="text-xs font-bold">{currencyType.charAt(0)}</span>
  </div>
);

const Transactions: React.FC<TransactionsProps> = ({
  transactions,
  title = "Transactions",
  showDivider = true,
  maxDisplayItems = 2,
  onViewAll,
  onTransactionClick,
}) => {
  // Show only limited items if maxDisplayItems is provided
  const displayTransactions = transactions.slice(0, maxDisplayItems);
  const hasMoreTransactions = transactions.length > maxDisplayItems;

  return (
    <div className="mb-6 rounded-lg bg-white p-3">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm font-bold text-gray-800">{title}</h2>
        {hasMoreTransactions && onViewAll && (
          <button
            onClick={onViewAll}
            className="text-primary-100 text-sm font-bold flex cursor-pointer items-center space-x-1 hover:text-blue-700 transition-colors"
          >
            <span>See all</span>
          </button>
        )}
      </div>

      <div className="space-y-4">
        {displayTransactions.map((transaction) => {
          const currencyType =
            transaction.currencyType || detectCurrencyType(transaction.title);
          const iconPath =
            currencyIcons[currencyType.toUpperCase() as keyof typeof currencyIcons];

          return (
            <div
              key={transaction.id}
              className={`flex justify-between items-start py-2 ${
                onTransactionClick
                  ? "cursor-pointer hover:bg-gray-50 rounded-lg p-2"
                  : ""
              }`}
              onClick={() =>
                onTransactionClick && onTransactionClick(transaction)
              }
            >
              {/* Left side with icon and text */}
              <div className="flex items-start space-x-3 flex-1">
                <div className="w-8 h-8 bg-neutral-150 rounded-full flex items-center justify-center mt-1 flex-shrink-0">
                  {iconPath ? (
                    <img
                      src={iconPath}
                      alt={`${currencyType} logo`}
                      className="object-contain "
                    />
                  ) : (
                    <FallbackIcon currencyType={currencyType} />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-black text-sm">
                    {transaction.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
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
                  {transaction.type === "deposit" ? "+" : "-"}
                  {transaction.subtype === "fiat" ? transaction.currency || "₦" : ""}
                  {Number(transaction.amount).toFixed(2)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      {showDivider && <div className="border-t border-gray-200 my-6"></div>}
    </div>
  );
};

export default Transactions;
