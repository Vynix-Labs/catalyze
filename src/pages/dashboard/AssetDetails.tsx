import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowDownRight,
  ArrowUpRightIcon,
  ChevronLeftIcon,
  EyeIcon,
  EyeOffIcon,
} from "../../assets/svg";
import { type Asset } from "../../components/Assets";
import { useTokenBalance, useTransactions } from "../../hooks";
import { currencyIcons } from "../../utils";

type TransferProps = {
  transferType: "transfer" | "deposit";
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
  const iconPath = currencyIcons[currencyType.toUpperCase() as keyof typeof currencyIcons];
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

const AssetDetail = () => {
  const navigate = useNavigate();
  const { token } = useParams();

  const tokenId = token ? token : "";
  const { data: tokenBalance, isLoading } = useTokenBalance(tokenId);
  const { data: tokenTransactions, isLoading: loadingTransactions } =
    useTransactions({
      tokenSymbol: tokenId,
      sortDir: "desc",
      sortBy: "createdAt",
    });

  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [selectedAssetForModal] = useState<Asset>({
    balance: tokenBalance?.balance ?? "",
    id: tokenId,
    name: tokenBalance?.tokenSymbol ?? "",
    symbol: tokenBalance?.tokenSymbol ?? " ",
    value: tokenBalance?.fiatEquivalent ?? "",
  });

  const toggleBalanceVisibility = () => {
    setIsBalanceVisible(!isBalanceVisible);
  };

  // Handle proceed button click in modal
  const handleModalProceed = ({ transferType }: TransferProps) => {
    if (selectedAssetForModal) {
      // Close modal first

      // Navigate to transfer page with selected asset data and transfer type
      navigate("/dashboard/transfer", {
        state: {
          selectedAsset: selectedAssetForModal,
          transferType: transferType,
        },
      });
    }
  };

  return (
    <div className="min-h-screen w-md bg-neutral-50">
      <div className="  max-w-md w-full mx-auto min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
          >
            <ChevronLeftIcon />
          </button>
          <h1 className="text-lg font-semibold">{tokenId}</h1>
          <div className="w-9 h-9"></div>
        </div>

        {/* Balance Card */}
        <div className="space-y-4">
          <div className="p-4 bg-white">
            {/* Currency Icon and Balance */}
            {!isLoading && (
              <div className="flex items-center space-x-2 mb-2">
                <CurrencyIcon currencyType={tokenId} size="small" />
                <div>
                  <h2 className="text-sm font-medium text-gray-100 ">
                    <span className="uppercase">{tokenId}</span> Balance
                  </h2>
                </div>
              </div>
            )}

            {/* Balance Display */}
            <div className="mb-4">
              <div className="flex items-center space-x-2">
                {isLoading ? (
                  <p className="text-4xl font-bold min-w-[125px]">0.000</p>
                ) : (
                  <p className="text-4xl font-bold min-w-[125px]">
                    {isBalanceVisible ? tokenBalance?.balance : "*******"}
                  </p>
                )}

                <button
                  onClick={toggleBalanceVisibility}
                  className="p-2 hover:bg-blue-100 rounded-full transition-colors"
                >
                  {isBalanceVisible ? (
                    <EyeIcon className="text-primary-100" />
                  ) : (
                    <EyeOffIcon className="text-primary-100" />
                  )}
                </button>
              </div>

              {isBalanceVisible && (
                <p className="text-lg text-gray-600 mt-1">
                  ≈₦{tokenBalance?.fiatEquivalent}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={() => handleModalProceed({ transferType: "transfer" })}
                className="bg-primary-100 backdrop-blur-sm text-white font-semibold py-3 px-6 rounded-full hover:opacity-88 transition ease-out duration-300 flex-1 flex items-center justify-center space-x-2"
              >
                <span>Transfer</span> <ArrowUpRightIcon />
              </button>
              <button
                onClick={() => handleModalProceed({ transferType: "deposit" })}
                className="bg-primary-100 backdrop-blur-sm text-white font-semibold py-3 px-6 rounded-full hover:opacity-88 transition ease-out duration-300 flex-1 flex items-center justify-center space-x-2"
              >
                <span>Deposit</span> <ArrowDownRight />
              </button>
            </div>
          </div>

          {/* History Section */}
          <div className="px-4 pb-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">History</h2>
            </div>

            {/* Transactions List */}
            {loadingTransactions ? (
              <div className="w-full h-full flex items-center justify-center">
                <p>loading...</p>
              </div>
            ) : (
              <div className="p-4">
                <div className="bg-white rounded-lg p-3 space-y-3">
                  {tokenTransactions?.items.map((transaction) => {
                    return (
                      <div
                        key={transaction.id}
                        className="flex justify-between items-center py-2"
                      >
                        {/* Left side with icon and text */}
                        <div className="flex items-center space-x-3 flex-1">
                          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                            <CurrencyIcon
                              currencyType={transaction.tokenSymbol}
                            />
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
                              : `${transaction.tokenSymbol.toUpperCase()} ${Number(transaction.amountToken).toFixed(2)}`}
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

            {/* Empty state */}
            {tokenTransactions?.items.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-50 shadow rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-gray-400 text-2xl">📝</span>
                </div>
                <h3 className="text-lg font-medium text-gray-600 mb-2">
                  No transactions yet
                </h3>
                <p className="text-sm text-gray-500">
                  Your {tokenId} transaction history will appear here.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetDetail;
