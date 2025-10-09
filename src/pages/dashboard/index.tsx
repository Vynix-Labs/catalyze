import { useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRightIcon,
  BellIcon,
  EyeIcon,
  EyeOffIcon,
} from "../../assets/svg";
import Assets, { type Asset } from "../../components/Assets";
import Transactions, { type Transaction } from "../../components/Transactions";
import CurrencyDetailPage from "./CurrencyDetailPage";
import TransactionDetailsPage from "./transactionDetails";

import { useAtom } from "jotai";
import { useNavigate } from "react-router-dom";
import GlobalModal from "../../common/ui/modal/GlobalModal";
import {
  useAssets,
  useBalances,
  useRates,
  useTransactions,
  type Rate,
} from "../../hooks";

import { NoTransactions } from "../../components/EmptyStates";
import { authAtom } from "../../store/jotai";

const Home: React.FC = () => {
  const [showTransactionDetails, setShowTransactionDetails] = useState(false);
  const [showCurrencyDetail, setShowCurrencyDetail] = useState(false);
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAssetForModal, setSelectedAssetForModal] =
    useState<Asset | null>(null);
  const [transferType, setTransferType] = useState<"transfer" | "deposit">(
    "transfer"
  );
  const {
    data: transactionData,
    // isLoading: transactionsLoading,
    // error: transactionsError,
  } = useTransactions();
  const {
    data: balanceData,
    isLoading: balancesLoading,
    // error: balancesError,
  } = useBalances();
  const { data: assetsDatas } = useAssets();
  const {
    data: rates,
    // isLoading: isRateLoading,
    // error: rateError,
  } = useRates();
  const [user] = useAtom(authAtom);
  const navigate = useNavigate();

  const toggleBalanceVisibility = () => {
    setIsBalanceVisible(!isBalanceVisible);
  };

  const [selectedCurrency, setSelectedCurrency] = useState<{
    type: string;
    balance: string;
    nairaValue: string;
  } | null>(null);

  const handleViewAllTransactions = () => {
    setShowTransactionDetails(true);
  };

  const handleBackFromTransactions = () => {
    setShowTransactionDetails(false);
  };

  // In your Home component
  const handleAssetClick = (asset: Asset) => {
    setSelectedCurrency({
      type: asset.symbol,
      balance: asset.balance,
      nairaValue: asset.value,
    });
    setShowCurrencyDetail(true);
  };

  // Handle Transfer button click from dashboard
  const handleTransferClick = () => {
    setTransferType("transfer");
    setIsModalOpen(true);
  };

  // Handle Deposit button click from dashboard
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
          fromDashboard: true, // Flag to indicate source
        },
      });
    }
  };

  const handleTransactionClick = (transaction: Transaction) => {
    const currencyType =
      transaction.currencyType || detectCurrencyType(transaction.title);

    // Find the asset data for this currency
    const asset = assetsData.find((a) => a.symbol === currencyType);

    setSelectedCurrency({
      type: currencyType,
      balance: asset?.balance || "0.00",
      nairaValue: asset?.value || "0.00",
    });
    setShowCurrencyDetail(true);
  };

  const handleBackFromCurrencyDetail = () => {
    setShowCurrencyDetail(false);
    setSelectedCurrency(null);
  };

  // Helper function to detect currency type from title
  const detectCurrencyType = (title: string): string => {
    switch (true) {
      case title.includes("USDT"):
        return "USDT";
      case title.includes("USDC"):
        return "USDC";
      case title.includes("STRK"):
        return "STRK";
      default:
        return "UNKNOWN";
    }
  };

  const transactionsData: Transaction[] =
    transactionData?.items?.map((tx) => ({
      id: tx.id,
      title: `${tx.type} ${tx.tokenSymbol}`,
      date: new Date(tx.createdAt).toLocaleDateString(),
      amount: tx.amountFiat || tx.amountToken,
      currency: "₦",
      type: tx.type as "transfer" | "deposit" | "withdrawal",
      currencyType: tx.tokenSymbol,
    })) || [];

  // Helper function to get token name from symbol
  const getTokenName = (symbol: string): string => {
    const tokenNames: Record<string, string> = {
      USDT: "Tether",
      USDC: "USD Coin",
      STRK: "Starknet",
    };
    return tokenNames[symbol] || symbol;
  };

  // Convert balance data to Asset format

  const assetsData: Asset[] =
    assetsDatas?.crypto && assetsDatas.crypto.length > 0
      ? assetsDatas.crypto.map((balance, index) => {
          // Find matching rate for this token symbol
          const matchingRate = rates?.items?.find(
            (rate: Rate) => rate.tokenSymbol === balance?.symbol
          );
          const balanceAmount = balance?.decimals || 0;
          const rateValue = matchingRate
            ? parseFloat(matchingRate.priceNgnBase?.toString() || "0") || 0
            : 0;
          const calculatedValue = balanceAmount * rateValue;

          return {
            id: (index + 1).toString(),
            symbol: balance?.symbol,
            name: getTokenName(balance?.symbol),
            balance: balanceAmount.toString(),
            value: calculatedValue.toFixed(2),
            currency: "₦",
          };
        })
      : [];

  // Render currency detail page
  if (showCurrencyDetail && selectedCurrency) {
    return (
      <CurrencyDetailPage
        currencyType={selectedCurrency.type}
        balance={selectedCurrency.balance}
        nairaValue={selectedCurrency.nairaValue}
        transactions={transactionsData}
        onBack={handleBackFromCurrencyDetail}
      />
    );
  }

  // Render transaction details page
  if (showTransactionDetails) {
    return (
      <TransactionDetailsPage
        transactions={transactionsData}
        onBack={handleBackFromTransactions}
      />
    );
  }

  return (
    <div className="bg-neutral-50 w-full">
      {/* Main content container with proper spacing for bottom nav */}
      <div className="max-w-md mx-auto flex flex-col">
        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto space-y-4">
          {/* Header */}
          <div className="p-5">
            <div className="flex justify-between items-center">
              <div className="flex gap-2 items-center">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-white font-black">
                    {user?.name
                      ? user.name.charAt(0) + user.name.charAt(1)
                      : "AO"}
                  </span>
                </div>
                <div className="text-sm">
                  <p className=" text-gray-600 font-semibold">Good Morning</p>
                  <h1 className=" font-black capitalize text-gray-800">
                    {user?.name}
                  </h1>
                </div>
              </div>
              <BellIcon className="w-6 h-6 cursor-pointer" />
            </div>
          </div>

          {/* Total Balance Card */}
          <div className="mx-5 mb-5">
            <div className="bg-gradient-to-br from-primary-100 to-blue-700 rounded-2xl p-6 text-white relative overflow-hidden">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-5 rounded-full translate-y-12 -translate-x-12"></div>

              {/* Balance Section */}
              <div className="relative z-10 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-white text-sm font-semibold">
                      Total Balance
                    </p>

                    <div className="flex items-center mt-2 justify-center">
                      <p className="text-4xl font-bold min-w-36 max-w-36 truncate ">
                        {balancesLoading
                          ? "Loading..."
                          : isBalanceVisible
                          ? `₦${balanceData?.totalFiat || "0.00"}`
                          : "****"}
                      </p>
                      <button
                        onClick={toggleBalanceVisibility}
                        className="ml-3 p-1 hover:bg-white/10 rounded-full transition-colors bg-black/40"
                      >
                        {isBalanceVisible ? (
                          <EyeIcon className="w-4 h-4 text-white/80" />
                        ) : (
                          <EyeOffIcon className="w-4 h-4 text-white/80" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Action Buttons - Multi-currency operations */}
                <div className="flex space-x-3">
                  <button
                    onClick={handleTransferClick}
                    className="bg-[#04329C] text-white font-semibold py-3 px-6 rounded-full hover:opacity-88  transition ease-out duration-300 flex-1 flex items-center justify-center space-x-2"
                  >
                    <span>Transfer</span> <ArrowUpRightIcon />
                  </button>
                  <button
                    onClick={handleDepositClick}
                    className="bg-[#04329C] text-white font-semibold py-3 px-6 rounded-full hover:opacity-88  transition ease-out duration-300 flex-1 flex items-center justify-center space-x-2"
                  >
                    <span>Deposit</span> <ArrowDownRight />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="p-5">
            {/* Transactions */}
            <div className="max-w-md mx-auto">
              {transactionsData.length > 0 ? (
                <Transactions
                  transactions={transactionsData}
                  title="Recent Transactions"
                  showDivider={false}
                  maxDisplayItems={2}
                  onViewAll={handleViewAllTransactions}
                  onTransactionClick={handleTransactionClick}
                />
              ) : (
                <div className="mb-8">
                  <h2 className="text-lg font-bold text-gray-800 mb-4">
                    Recent Transactions
                  </h2>
                  <NoTransactions onDepositClick={handleDepositClick} />
                </div>
              )}
            </div>

            {/* Divider */}
            <h2 className="text-sm font-bold text-gray-900 mb-4">Assets</h2>

            {/* Assets */}
            <div className="max-w-md h-auto max-h-120 overflow-y-auto no-scrollbar mx-auto overflow-hidden">
              <Assets assets={assetsData} onAssetClick={handleAssetClick} />
            </div>
          </div>
        </div>
      </div>

      {/* Modal for multi-currency selection */}
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

export default Home;
