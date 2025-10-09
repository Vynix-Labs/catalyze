import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowDownRight,
  ArrowUpRightIcon,
  ChevronLeftIcon,
  EyeIcon,
  EyeOffIcon,
} from "../../assets/svg";
import type { CurrencyDetailPageProps } from "../../types/types";
import GlobalModal from "../../common/ui/modal/GlobalModal";
import Assets, { type Asset } from "../../components/Assets";

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
  const navigate = useNavigate();
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [selectedAssetForModal, setSelectedAssetForModal] =
    useState<Asset | null>(null);

  // State for modal and transfer type
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transferType, setTransferType] = useState<"transfer" | "deposit">(
    "transfer"
  );

  const toggleBalanceVisibility = () => {
    setIsBalanceVisible(!isBalanceVisible);
  };

  // Filter transactions for this currency
  const currencyTransactions = (transactions ?? []).filter(
    (transaction) => transaction.currencyType === currencyType
  );

  // When user clicks "Transfer"
  const handleTransferClick = () => {
    setTransferType("transfer");
    setIsModalOpen(true);
  };

  // When user clicks "Deposit"
  const handleDepositClick = () => {
    setTransferType("deposit");
    setIsModalOpen(true);
  };

  // Handle asset click in modal
  const handleModalAssetClick = (asset: Asset) => {
    setSelectedAssetForModal(asset);
  };

  // Handle proceed button click in modal
  const handleModalProceed = () => {
    if (selectedAssetForModal) {
      // Close modal first
      setIsModalOpen(false);
      setSelectedAssetForModal(null);

      // Navigate to transfer page with selected asset data and transfer type
      navigate("/dashboard/transfer", {
        state: {
          selectedAsset: selectedAssetForModal,
          transferType: transferType,
        },
      });
    }
  };

  // Add the assetsData here (you can pass this as a prop later if needed)
  const assetsData: Asset[] = [
    {
      id: "1",
      symbol: "USDT",
      name: "Tether",
      balance: "10,000",
      value: "100,000",
      currency: "₦",
    },
    {
      id: "2",
      symbol: "USDC",
      name: "USD Coin",
      balance: "5.00023",
      value: "6,000,000.00",
      currency: "₦",
    },
    {
      id: "3",
      symbol: "STRK",
      name: "Starknet",
      balance: "10,000",
      value: "100,000",
      currency: "₦",
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="  max-w-[420px] mx-auto min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
          <button
            onClick={onBack}
            className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
          >
            <ChevronLeftIcon />
          </button>
          <h1 className="text-lg font-semibold">{currencyType}</h1>
          <div className="w-9 h-9"></div>
        </div>

        {/* Balance Card */}
        <div className="space-y-4">
          <div className="p-4 bg-white">
            {/* Currency Icon and Balance */}
            <div className="flex items-center space-x-2 mb-2">
              <CurrencyIcon currencyType={currencyType ?? ""} size="small" />
              <div>
                <h2 className="text-sm font-medium text-gray-100">
                  {currencyType} Balance
                </h2>
              </div>
            </div>

            {/* Balance Display */}
            <div className="mb-4">
              <div className="flex items-center space-x-2">
                <p className="text-4xl font-bold min-w-[125px]">
                  {isBalanceVisible ? balance : "*******"}
                </p>

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
                <p className="text-lg text-gray-600 mt-1">≈₦{nairaValue}</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={handleTransferClick}
                className="bg-primary-100 backdrop-blur-sm text-white font-semibold py-3 px-6 rounded-full hover:opacity-88 transition ease-out duration-300 flex-1 flex items-center justify-center space-x-2"
              >
                <span>Transfer</span> <ArrowUpRightIcon />
              </button>
              <button
                onClick={handleDepositClick}
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
                    <div className="rounded-full flex items-center justify-center">
                      <CurrencyIcon
                        currencyType={currencyType ?? ""}
                        size="large"
                      />
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
                <div className="w-16 h-16 bg-gray-50 shadow rounded-full flex items-center justify-center mx-auto mb-4">
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

      <GlobalModal
        onClose={() => {
          setIsModalOpen(false);
          setSelectedAssetForModal(null);
        }}
        open={isModalOpen}
        setOpen={setIsModalOpen}
        headingText={`Select Currency for ${
          transferType === "deposit" ? "Deposit" : "Transfer"
        }`}
        btnText="Proceed"
        onProceed={handleModalProceed}
        isProceedDisabled={!selectedAssetForModal}
        children={
          <Assets
            assets={assetsData}
            onAssetClick={handleModalAssetClick}
            isModalMode={true}
            selectedAsset={selectedAssetForModal}
          />
        }
      />
    </div>
  );
};

export default CurrencyDetailPage;
