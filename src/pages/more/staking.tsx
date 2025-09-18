import { useState } from "react";
import Layout from "../../layout";

const StakingPage = () => {
  const [activeTab, setActiveTab] = useState<"pools" | "stakes">("pools");
  const [hasStakes] = useState(true);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Staking</h1>
          <p className="text-gray-600">Track your active stakes and rewards</p>
        </div>

        {/* Stats Section - Only show if user has stakes */}
        {hasStakes && (
          <div className="flex w-full py-4 gap-2">
            <div className="bg-neutral-100 p-4 rounded-lg w-full">
              <p className="text-gray-600 text-sm">Total Staked</p>
              <h2 className="text-2xl font-bold text-gray-800">N127,450</h2>
              <span className="ml-2 text-green-500 text-sm font-medium">
                +0.5% earned
              </span>
            </div>

            <div className="bg-neutral-100 p-4 rounded-lg w-full">
              <p className="text-gray-600 text-sm">Avg. APY</p>
              <h2 className="text-2xl font-bold text-gray-800">5.0%</h2>
              <span className="ml-2 text-gray-500 text-sm">
                Account in post
              </span>
            </div>
          </div>
        )}

        {/* Tabs Navigation */}
        <div className="flex border-b  w-full border-gray-200 mb-6">
          <button
            className={`px-4 w-full py-2 font-medium ${
              activeTab === "pools"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("pools")}
          >
            Available Pools
          </button>
          <button
            className={`px-4 w-full py-2 font-medium ${
              activeTab === "stakes"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("stakes")}
          >
            My Stakes
          </button>
        </div>

        {/* Content based on active tab */}
        {activeTab === "pools" ? (
          /* Available Pools Content */
          <div className="grid grid-cols-1 gap-6 mb-12">
            {/* USDC Pool */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-5 border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-gray-800">USDC</h3>
                    <p className="text-sm text-gray-500">USD Coin</p>
                  </div>
                  <span className="text-green-500 font-bold">4.8%</span>
                </div>
              </div>
              <div className="flex">
                <p className="text-sm text-gray-600 mb-2">Lock Period</p>
                <p className="font-medium">7 days</p>
              </div>
            </div>
          </div>
        ) : hasStakes ? (
          /* My Stakes Content */
          <div className="">
            {/* STRK Stake */}
            <div className="border border-gray-200 rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex gap-2">
                  <div className="rounded-full w-12 h-12 bg-neutral-150" />
                  <div>
                    <h3 className="font-bold text-gray-800">
                      STRK Stake
                    </h3>

                    <div className="flex items-center gap-2 text-xs text-neutral-500">
                      <span className="">1.5ETH</span>
                      <div className="w-1 h-1 bg-black rounded-full" />
                      <span className="">5.2% APY</span>
                    </div>

                    <p className="text-neutral-400 text-xs">
                      Lock Period: <span className="text-gray-100">7 days</span>
                    </p>
                  </div>
                </div>
                <span className="text-green-500 font-medium mr-2">
                  +0.88 Eth
                </span>
              </div>

              <div className="">
                <div className="flex justify-between w-full">
                  <p className="text-gray-500 ">Progress</p>
                  <span className=" text-gray-500 text-xs">40%</span>
                </div>
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden mt-2">
                  <div className="h-full bg-neutral-900 w-1/2"></div>
                </div>
              </div>

              <div className="flex gap-2 w-full mt-4">
                <button className="px-3 w-full py-2 text-sm border border-gray-300 rounded-full hover:bg-gray-50">
                  Unstake
                </button>
                <button className="px-3 w-full py-2 text-sm bg-blue-600 text-white rounded-full hover:bg-blue-700">
                  Claim
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* No Active Stakes State */
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <div className="max-w-md mx-auto">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                No Active Stakes Yet
              </h2>
              <p className="text-gray-600 mb-6">
                Start Earning Rewards By Staking Your Crypto Assets: 1st Secure,
                Beginner-Friendly, And You Can Begin With Small Amounts.
              </p>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                onClick={() => setActiveTab("pools")}
              >
                Start Staking
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default StakingPage;
