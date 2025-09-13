import React, { useState } from "react";
import BottomNav from "../components/BottomNav";
import Assets from "../components/Assets";
import type { Transaction } from "../components/Transactions";
import TransactionDetailsPage from "./transactionDetails";
import Transactions from "../components/Transactions";
import { ArrowDownRight, ArrowUpRight, Eye, EyeOff } from "lucide-react";
import { FaBell } from "react-icons/fa";

const Home: React.FC = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [showTransactionDetails, setShowTransactionDetails] = useState(false);
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);

  const toggleBalanceVisibility = () => {
    setIsBalanceVisible(!isBalanceVisible);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleViewAllTransactions = () => {
    setShowTransactionDetails(true);
  };

  const handleBackFromTransactions = () => {
    setShowTransactionDetails(false);
  };

  const transactionsData: Transaction[] = [
    {
      id: "1",
      title: "Deposit to USDT wallet",
      date: "9th June, 2024",
      amount: "10,000",
      type: "deposit",
      currencyType: "USDT",
    },
    {
      id: "2",
      title: "Deposit to USDC wallet",
      date: "9th June, 2024",
      amount: "20,000",
      type: "deposit",
      currencyType: "USDC",
    },
    {
      id: "3",
      title: "Deposit to STRK wallet",
      date: "9th June, 2024",
      amount: "20,000",
      type: "deposit",
      currencyType: "STRK",
    },
    {
      id: "4",
      title: "Withdrawal from USDT wallet",
      date: "8th June, 2024",
      amount: "5,000",
      type: "withdrawal",
      currencyType: "USDT",
    },
    {
      id: "5",
      title: "Transfer to USDC wallet",
      date: "7th June, 2024",
      amount: "15,000",
      type: "transfer",
      currencyType: "USDC",
    },
    {
      id: "6",
      title: "Deposit to STRK wallet",
      date: "6th June, 2024",
      amount: "30,000",
      type: "deposit",
      currencyType: "STRK",
    },
  ];

  const assetsData = [
    {
      id: "1",
      symbol: "USDT",
      name: "Tether",
      balance: "10,000",
      value: "100,000",
    },
    {
      id: "2",
      symbol: "USDC",
      name: "USD Coin",
      balance: "10,000",
      value: "100,000",
    },
    {
      id: "3",
      symbol: "STRK",
      name: "Starknet",
      balance: "10,000",
      value: "100,000",
    },
  ];

  // If showing transaction details, render that page
  if (showTransactionDetails) {
    return (
      <TransactionDetailsPage
        transactions={transactionsData}
        onBack={handleBackFromTransactions}
      />
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Main content container with proper spacing for bottom nav */}
      <div className="max-w-md mx-auto min-h-screen flex flex-col pb-16">
        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto">
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
              <FaBell className="w-4 h-5 cursor-pointer fill-gray-100" />
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
                      {isBalanceVisible ? (
                        <p className="text-4xl font-bold">₦40,000</p>
                      ) : (
                        <p className="text-4xl font-bold">*******</p>
                      )}
                      <button
                        onClick={toggleBalanceVisibility}
                        className="ml-3 p-2 hover:bg-white/10 rounded-full transition-colors bg-black/40"
                      >
                        {isBalanceVisible ? (
                          <Eye className="w-5 h-5 text-white/80" />
                        ) : (
                          <EyeOff className="w-5 h-5 text-white/80" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <button className="bg-[#04329C] backdrop-blur-sm text-white font-semibold py-3 px-6 rounded-xl hover:bg-white/30 transition-all flex-1 flex items-center justify-center space-x-2">
                    <span>Transfer</span> <ArrowUpRight className="w-4 h-4" />
                  </button>
                  <button className="bg-[#04329C] backdrop-blur-sm text-white font-semibold py-3 px-6 rounded-xl hover:bg-white/30 transition-all flex-1 flex items-center justify-center space-x-2">
                    <span>Deposit</span> <ArrowDownRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="px-4">
            {/* Transactions */}
            <div className="max-w-md mx-auto">
              <Transactions
                transactions={transactionsData}
                title="Transactions"
                showDivider={false}
                maxDisplayItems={2}
                onViewAll={handleViewAllTransactions}
              />
            </div>

            {/* Divider */}
            <h2 className="text-sm font-bold text-gray-600 mb-4">Assets</h2>

            {/* Assets */}
            <div className="max-w-md mx-auto overflow-hidden">
              <Assets assets={assetsData} title="Assets" maxDisplayItems={3} />
            </div>
          </div>
        </div>

        {/* Fixed bottom navigation */}
        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto">
          <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
        </div>
      </div>
    </div>
  );
};

export default Home;
