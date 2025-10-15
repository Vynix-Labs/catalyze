import { ChevronLeftIcon } from "../../assets/svg";
import CurrencyIcon from "../../components/CurrencyIcon";
import { useTransactions } from "../../hooks";
import { useNavigate } from "react-router-dom";

// Currency icon mapping - using proper image paths

const TransactionDetailsPage = () => {
  const navigate = useNavigate();

  const {
    data: transactions,
    isLoading: loadingTransactions,
    isError,
  } = useTransactions({
    sortBy: "createdAt",
    sortDir: "desc",
  });

  const onBack = () => {
    navigate(-1);
  };

  return (
    <div className="bg-neutral-50">
      <div className="  max-w-md w-full mx-auto">
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
        {loadingTransactions ? (
          <div className="w-full h-full flex items-center justify-center">
            <p>loading...</p>
          </div>
        ) : (
          <div className="p-4">
            <div className="bg-white rounded-lg p-3 space-y-3">
              {transactions?.items.map((transaction) => {
                return (
                  <div
                    key={transaction.id}
                    className="flex justify-between items-center py-2"
                  >
                    {/* Left side with icon and text */}
                    <div className="flex items-center space-x-3 flex-1">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                        <CurrencyIcon currencyType={transaction.tokenSymbol} />
                      </div>
                      <div>
                        <h3 className="font-medium text-black text-sm">
                          {transaction.type} to {transaction.tokenSymbol}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {transaction.createdAt}
                        </p>
                      </div>
                    </div>

                    {/* Right side with amount */}
                    <div className="text-right">
                      <span
                        className={`font-bold text-base ${
                          transaction.type === "deposit"
                            ? "text-black"
                            : transaction.type === "withdraw"
                            ? "text-red-600"
                            : "text-blue-600"
                        }`}
                      >
                        {transaction.type === "deposit"
                          ? "+"
                          : transaction.type === "transfer" ||
                            transaction.type === "withdraw"
                          ? "-"
                          : ""}
                        {transaction.subtype === "fiat"
                          ? `N${transaction.amountFiat}`
                          : `${Number(transaction.amountToken).toFixed(2)}`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
            {/* </div>
          ))} */}
          </div>
        )}

        {/* Empty state if no transactions */}
        {transactions?.items.length === 0 && (
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

        {isError && <div></div>}
      </div>
    </div>
  );
};

export default TransactionDetailsPage;
