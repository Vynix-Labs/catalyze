import React, { useState } from "react";
import Transactions, { type Transaction } from "../../components/Transactions";
import Assets, { type Asset } from "../../components/Assets";
import CurrencyDetailPage from "./CurrencyDetailPage";
import TransactionDetailsPage from "./transactionDetails";
import {
  ArrowDownRight,
  ArrowUpRightIcon,
  BellIcon,
  EyeIcon,
  EyeOffIcon,
} from "../../assets/svg";

import GlobalModal from "../../common/ui/modal/GlobalModal";
import Layout from "../../layout";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const [showTransactionDetails, setShowTransactionDetails] = useState(false);
  const [showCurrencyDetail, setShowCurrencyDetail] = useState(false);
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAssetForModal, setSelectedAssetForModal] =
    useState<Asset | null>(null);

  const navigate = useNavigate();

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

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

      // Navigate to transfer page with selected asset data
      navigate("/dashboard/transfer", {
        state: {
          selectedAsset: selectedAssetForModal,
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
    if (title.includes("USDT")) return "USDT";
    if (title.includes("USDC")) return "USDC";
    if (title.includes("STRK")) return "STRK";
    return "UNKNOWN";
  };

  const transactionsData: Transaction[] = [
    {
      id: "1",
      title: "Deposit to USDT wallet",
      date: "9th June, 2024",
      amount: "10,000",
      currency: "₦",
      type: "deposit",
      currencyType: "USDT",
    },
    {
      id: "2",
      title: "Deposit to USDC wallet",
      date: "9th June, 2024",
      amount: "20,000",
      currency: "₦",
      type: "deposit",
      currencyType: "USDC",
    },
    {
      id: "3",
      title: "Deposit to STRK wallet",
      date: "9th June, 2024",
      amount: "20,000",
      currency: "₦",
      type: "deposit",
      currencyType: "STRK",
    },
    {
      id: "4",
      title: "Withdrawal from USDT wallet",
      date: "8th June, 2024",
      amount: "5,000",
      currency: "₦",
      type: "withdrawal",
      currencyType: "USDT",
    },
    {
      id: "5",
      title: "Transfer to USDC wallet",
      date: "7th June, 2024",
      amount: "15,000",
      currency: "₦",
      type: "transfer",
      currencyType: "USDC",
    },
    {
      id: "6",
      title: "Deposit to STRK wallet",
      date: "6th June, 2024",
      amount: "30,000",
      currency: "₦",
      type: "deposit",
      currencyType: "STRK",
    },
  ];

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
    <Layout>
      <div className="min-h-screen bg-neutral-50">
        {/* Main content container with proper spacing for bottom nav */}
        <div className="max-w-md mx-auto min-h-screen flex flex-col pb-16">
          {/* Scrollable content area */}
          <div className="flex-1 overflow-y-auto space-y-4">
            {/* Header */}
            <div className="p-5">
              <div className="flex justify-between items-center">
                <div className="flex gap-2 items-center">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-white font-black">AO</span>
                  </div>
                  <div className="text-sm">
                    <p className=" text-gray-600 font-semibold">Good Morning</p>
                    <h1 className=" font-black text-gray-800">Amara</h1>
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

                      <div className="flex items-center mt-2">
                        <p className="text-4xl font-bold min-w-[125px]">
                          {isBalanceVisible ? "₦40,000" : "*******"}
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

                  {/* Action Buttons */}
                  <div className="flex space-x-3">
                    <button
                      onClick={toggleModal}
                      className="bg-[#04329C] text-white font-semibold py-3 px-6 rounded-full hover:opacity-88  transition ease-out duration-300 flex-1 flex items-center justify-center space-x-2"
                    >
                      <span>Transfer</span> <ArrowUpRightIcon />
                    </button>
                    <button
                      onClick={toggleModal}
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
                <Transactions
                  transactions={transactionsData}
                  title="Recent Transactions"
                  showDivider={false}
                  maxDisplayItems={2}
                  onViewAll={handleViewAllTransactions}
                  onTransactionClick={handleTransactionClick}
                />
              </div>

              {/* Divider */}
              <h2 className="text-sm font-bold text-gray-600 mb-4">Assets</h2>

              {/* Assets */}
              <div className="max-w-md mx-auto overflow-hidden">
                <Assets assets={assetsData} onAssetClick={handleAssetClick} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <GlobalModal
        onClose={toggleModal}
        open={isModalOpen}
        setOpen={setIsModalOpen}
        headingText="Select Currency"
        btnText="Proceed"
        onProceed={handleModalProceed}
        isProceedDisabled={!selectedAssetForModal}
        children={
          <Assets
            assets={assetsData}
            onAssetClick={handleModalAssetClick}
            isModalMode={true} // Add this prop
            selectedAsset={selectedAssetForModal} // Add this prop
          />
        }
      />
    </Layout>
  );
};

export default Home;
