import { useState } from "react";
import {
  ArrowSquareOutIcon,
  LockIcon,
  MedalIcon,
  MinusIcon,
} from "../../assets/svg";
import Button from "../../common/ui/button";
import { useNavigate } from "react-router-dom";
import { RoutePath } from "../../routes/routePath";

interface Pool {
  id: number;
  name: string;
  fullName: string;
  apy: number;
  lockPeriod: string;
}


// Currency detection function
const detectCurrencyType = (title: string): string => {
  if (title.includes("USDT")) return "USDT";
  if (title.includes("USDC")) return "USDC";
  if (title.includes("STRK")) return "STRK";
  return "UNKNOWN";
};

// Currency icon mapping
const currencyIcons = {
  USDT: "/images/usdt.png",
  USDC: "/images/usdc.png",
  STRK: "/images/strk.png",
  UNKNOWN: "/images/default-currency.png",
};

// Pool selection modal component
interface Pool {
  id: number;
  name: string;
  fullName: string;
  apy: number;
  lockPeriod: string;
}

const PoolSelectionModal = ({
  pool,
  onConfirm,
  onClose,
}: {
  pool: Pool;
  onConfirm: () => void;
  onClose: () => void;
}) => {
  const currencyType = detectCurrencyType(pool.name);

  const CurrencyIcon = ({ currencyType }: { currencyType: string }) => {
    const iconPath = currencyIcons[currencyType as keyof typeof currencyIcons];

    if (iconPath) {
      return (
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
          <img
            src={iconPath}
            alt={`${currencyType} logo`}
            className="w-12 h-12 object-contain"
          />
        </div>
      );
    }

    return (
      <div className="w-12 h-12 bg-gray-400 rounded-full flex items-center justify-center">
        <span className="text-lg font-bold text-white">
          {currencyType.charAt(0)}
        </span>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          Confirm Pool Selection
        </h3>

        <div className="flex items-center space-x-3 mb-4 p-3 bg-blue-50 rounded-lg">
          <CurrencyIcon currencyType={currencyType} />
          <div>
            <h4 className="font-semibold text-gray-800">{pool.name}</h4>
            <p className="text-sm text-gray-600">{pool.fullName}</p>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex justify-between">
            <span className="text-gray-600">APY</span>
            <span className="font-semibold text-green-500">{pool.apy}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Lock Period</span>
            <span className="font-semibold">{pool.lockPeriod}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Minimum Stake</span>
            <span className="font-semibold">1 {pool.name}</span>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variants="secondary" handleClick={onClose} classes="flex-1">
            Cancel
          </Button>
          <Button variants="primary" handleClick={onConfirm} classes="flex-1">
            Proceed to Stake
          </Button>
        </div>
      </div>
    </div>
  );
};

const StakingPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"pools" | "stakes">("pools");
  const [hasStakes] = useState(true);
  const [selectedPool, setSelectedPool] = useState<Pool>();
  const [showModal, setShowModal] = useState(false);
  const [highlightedPool, setHighlightedPool] = useState<number | null>(null);

  // Sample staking pools data
  const stakingPools = [
    {
      id: 1,
      name: "USDC",
      fullName: "USD Coin",
      apy: 4.8,
      lockPeriod: "7 days",
    },
    { id: 2, name: "STRK", fullName: "Starknet", apy: 6.5, lockPeriod: "None" },
    {
      id: 3,
      name: "USDT",
      fullName: "Tether",
      apy: 4.8,
      lockPeriod: "30 days",
    },
    {
      id: 4,
      name: "STRK",
      fullName: "Starknet",
      apy: 4.8,
      lockPeriod: "14 days",
    },
  ];

  // Sample active stakes data
  const activeStakes = [
    {
      id: 1,
      name: "USDC Stake",
      amount: "1.5ETH",
      apy: 5.2,
      lockPeriod: "7 days",
      reward: "+0.08 ETH",
      progress: 75,
    },
    {
      id: 2,
      name: "STRK Stake",
      amount: "1.5ETH",
      apy: 5.2,
      lockPeriod: "7 days",
      reward: "+0.08 ETH",
      progress: 40,
    },
    {
      id: 3,
      name: "USDT Stake",
      amount: "1.5ETH",
      apy: 5.2,
      lockPeriod: "7 days",
      reward: "+0.08 ETH",
      progress: 35,
    },
  ];

  // Currency icon component
  const CurrencyIcon = ({
    currencyType,
    size = "small",
  }: {
    currencyType: string;
    size?: "small" | "large";
  }) => {
    const iconPath = currencyIcons[currencyType as keyof typeof currencyIcons];
    const sizeClass = size === "large" ? "w-12 h-12" : "w-6 h-6";
    const imgSizeClass = size === "large" ? "w-12 h-12" : "w-6 h-6";

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

    return (
      <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center">
        <span className="text-xs font-bold text-white">
          {currencyType.charAt(0)}
        </span>
      </div>
    );
  };

  // Handle pool selection with highlight effect
  // const handlePoolClick = (pool: Pool) => {
  //   setHighlightedPool(pool.id);
  //   setSelectedPool(pool);
  //   setShowModal(true);
  // };

  // // Handle modal confirmation
  // const handleModalConfirm = () => {
  //   setShowModal(false);
  //   setShowAmountPage(true);
  // };

  // // Handle modal close
  // const handleModalClose = () => {
  //   setShowModal(false);
  //   setHighlightedPool(null);
  //   setSelectedPool(null);
  // };

  // Handle pool selection with highlight effect
  const handlePoolClick = (pool: Pool) => {
    setHighlightedPool(pool.id);
    setSelectedPool(pool);
    setShowModal(true);
  };

  // Handle modal confirmation - NAVIGATE TO ENTER AMOUNT PAGE
  const handleModalConfirm = () => {
    setShowModal(false);
    // Navigate to enter amount page with pool data
    navigate(RoutePath.ENTERAMOUNTPAGE, { state: { pool: selectedPool } });
  };

  // Handle modal close
  const handleModalClose = () => {
    setShowModal(false);
    setHighlightedPool(null);
    setSelectedPool(undefined);
  };

  // // Handle back from amount page
  // const handleBackFromAmountPage = () => {
  //   setShowAmountPage(false);
  //   setSelectedPool(null);
  //   setHighlightedPool(null);
  // };

  // // If amount page should be shown, render it
  // if (showAmountPage && selectedPool) {
  //   return (
  //     <EnterAmountPage pool={selectedPool} onBack={handleBackFromAmountPage} />
  //   );
  // }

  return (
    <>
      <div className="max-w-4xl mx-auto p-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Staking</h1>
          <p className="text-gray-600">Track your active stakes and rewards</p>
        </div>

        {/* Stats Section - Only show if user has stakes */}
        {hasStakes && (
          <div className="flex w-full py-4 gap-2">
            <div className="border space-y-2 border-neutral-100 bg-white p-4 rounded-lg w-full">
              <p className="text-gray-600 flex gap-2 items-center text-sm font-bold">
                <LockIcon className="text-primary-100" /> Total Staked
              </p>
              <h2 className="text-base font-bold text-gray-800">N127,450</h2>
              <span className="text-green-500 text-sm font-medium">
                +12.5% earned
              </span>
            </div>

            <div className="border space-y-2 border-neutral-100 bg-white p-4 rounded-lg w-full">
              <p className="text-gray-600 flex gap-2 items-center text-sm font-bold">
                <ArrowSquareOutIcon className="text-green-500" />
                Avg. APY
              </p>
              <h2 className="text-base font-bold text-gray-800">5.0%</h2>
              <span className="text-gray-500 text-sm">Account in post</span>
            </div>
          </div>
        )}

        {/* Tabs Navigation */}
        <div className="flex border-b w-full border-gray-200 mb-6">
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
          <div className="grid grid-cols-1 gap-4 mb-12">
            {stakingPools.map((pool) => {
              const currencyType = detectCurrencyType(pool.name);
              const isHighlighted = highlightedPool === pool.id;

              return (
                <div
                  key={pool.id}
                  className={`bg-white rounded-xl overflow-hidden border-2 transition-all duration-200 cursor-pointer ${
                    isHighlighted
                      ? "border-blue-500 shadow-lg"
                      : "border-transparent hover:border-gray-200"
                  }`}
                  onClick={() => handlePoolClick(pool)}
                >
                  <div className="p-4">
                    <div className="flex justify-between items-center border-b pb-4 border-neutral-200">
                      <div className="flex gap-2 w-full items-center">
                        <div className="rounded-full w-10 h-10 flex items-center justify-center overflow-hidden">
                          <CurrencyIcon
                            currencyType={currencyType ?? ""}
                            size="large"
                          />
                        </div>

                        <div className="">
                          <h3 className="font-bold text-gray-800">
                            {pool.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {pool.fullName}
                          </p>
                        </div>
                      </div>

                      <span className="text-green-500 font-bold">
                        {pool.apy}%
                      </span>
                    </div>

                    <div className="flex justify-between items-center w-full mt-4">
                      <p className="text-sm text-gray-600">Lock Period</p>
                      <p className="font-medium text-gray-800">
                        {pool.lockPeriod}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : hasStakes ? (
          /* My Stakes Content */
          <div className="space-y-4">
            {activeStakes.map((stake) => {
              const currencyType = detectCurrencyType(stake.name);
              return (
                <div
                  key={stake.id}
                  className="bg-white rounded-lg p-4 space-y-4"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <div className="rounded-full flex items-center justify-center overflow-hidden">
                        <CurrencyIcon
                          currencyType={currencyType ?? ""}
                          size="large"
                        />
                      </div>

                      <div>
                        <h3 className="font-bold text-gray-800">
                          {stake.name}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-neutral-500 mt-1">
                          <span className="">{stake.amount}</span>
                          <div className="w-1 h-1 bg-gray-400 rounded-full" />
                          <span className="">{stake.apy}% APY</span>
                        </div>
                        <p className="text-neutral-400 text-xs mt-1">
                          Lock Period
                          <span className="text-gray-800">
                            {stake.lockPeriod}
                          </span>
                        </p>
                      </div>
                    </div>
                    <span className="text-green-500 font-medium">
                      {stake.reward}
                    </span>
                  </div>

                  <div className="">
                    <div className="flex justify-between w-full">
                      <p className="text-gray-500 text-sm font-medium">
                        Progress
                      </p>
                      <span className="text-gray-500 text-xs">
                        {stake.progress}%
                      </span>
                    </div>

                    <div className="h-2 w-full bg-neutral-200 rounded-full overflow-hidden mt-2">
                      <div
                        className="h-full bg-neutral-900 transition-all duration-300"
                        style={{ width: `${stake.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 w-full pt-2">
                    <button className="px-3 w-full flex items-center justify-center gap-2 py-2 text-sm border border-blue-600 text-blue-600 rounded-full hover:bg-blue-50 transition-colors">
                      <MinusIcon className="w-4 h-4" />
                      <span>Unstake</span>
                    </button>

                    <button className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
                      <MedalIcon className="w-4 h-4" />
                      <span>Claim</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* No Active Stakes State */
          <div className="bg-white shadow-md h-full flex flex-col justify-center mx-auto items-center  p-4 text-center">
            <div className="max-w-md mx-auto">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                No Active Stakes Yet
              </h2>
              <p className="text-gray-600 mb-6">
                Start Earning Rewards By Staking Your Crypto Assets: 1st Secure,
                Beginner-Friendly, And You Can Begin With Small Amounts.
              </p>
              <div className="flex w-full gap-2 text-sm">
                <Button variants="primary">Available Pools</Button>
                <Button variants="primary">Learn Staking</Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Pool Selection Modal */}
      {showModal && selectedPool && (
        <PoolSelectionModal
          pool={selectedPool}
          onConfirm={handleModalConfirm}
          onClose={handleModalClose}
        />
      )}
    </>
  );
};

export default StakingPage;
