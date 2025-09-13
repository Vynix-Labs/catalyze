import React, { useState } from "react";
import BottomNav from "../components/BottomNav";
import Transactions, { type Transaction } from "../components/Transactions";
import Assets, { type Asset } from "../components/Assets";

const Home: React.FC = () => {
  const [activeTab, setActiveTab] = useState("home");

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    // You can add navigation logic here
  };

  const transactionsData: Transaction[] = [
    {
      id: "1",
      title: "Deposit to USDT wallet",
      date: "9th June, 2024",
      amount: "10,000",
      type: "deposit",
    },
    {
      id: "2",
      title: "Deposit to USDC wallet",
      date: "9th June, 2024",
      amount: "20,000",
      type: "deposit",
    },
  ];

  const assetsData: Asset[] = [
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
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main content container with proper spacing for bottom nav */}
      <div className="max-w-md mx-auto min-h-screen bg-white flex flex-col pb-16">
        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto">
          {/* Header */}
          <div className="p-5 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-800">AO</h1>
          </div>
          {/* Total Balance */}
          <div className="p-5">
            <h2 className="text-sm font-semibold text-gray-500 uppercase">
              Total Balance
            </h2>
            <p className="text-3xl font-bold text-gray-800 mt-1">¥40,000</p>
          </div>
          {/* Transfer Section */}
          <div className="p-5 bg-gray-50">
            <h2 className="text-sm font-semibold text-gray-500 uppercase mb-2">
              Transfer
            </h2>
            <div className="flex space-x-3">
              <button className="bg-primary text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors flex-1">
                Transfer
              </button>
              <button className="bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors flex-1">
                Deposit
              </button>
            </div>
          </div>
          {/* Transactions and Assets */}
          <div className="max-w-md mx-auto p-5">
            <Transactions
              transactions={transactionsData}
              title="Recent Transactions"
              showDivider={false}
            />
          </div>
          {/* Divider */}
          <div className="border-t border-gray-200"></div>
          {/* Assets */}
          <div className="max-w-md mx-auto overflow-hidden p-5">
            <Assets assets={assetsData} title="My Assets" />
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
