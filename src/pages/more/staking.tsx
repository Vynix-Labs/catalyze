import { useState } from "react";
import {
  ArrowSquareOutIcon,
  LockIcon,
  MedalIcon,
  MinusIcon,
} from "../../assets/svg";
import Button from "../../common/ui/button";
import EnterAmountPage from "./enterAmount";
import PoolSelectionModal from "../../common/ui/modal/PoolSelectionModal";
import CurrencyIcon from "../../components/CurrencyIcon";
import { detectCurrencyType, type Pool } from "../../types/types";
import { useGetStakes, useStrategies, useUnstake } from "../../hooks/useStake";
import { UnstakeModal } from "./components";
import { toast } from "sonner";
import ClaimRewardsPage from "./claimRewards";

const StakingPage = () => {
  const [activeTab, setActiveTab] = useState<"pools" | "stakes">("pools");
  const { mutateAsync: unstake, isPending: isUnstaking } = useUnstake();

  const [selectedPool, setSelectedPool] = useState<Pool | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showAmountPage, setShowAmountPage] = useState(false);
  const [highlightedPool, setHighlightedPool] = useState<string | null>(null);

  // Claim modal state
  const [showClaimPage, setShowClaimPage] = useState(false);
  const [selectedStakeForClaim, setSelectedStakeForClaim] = useState<{
    id: string;
    name: string;
    amount: string;
    apy: number;
    lockPeriod: string;
    reward: string;
    progress: number;
  } | null>(null);

  // Unstake modal state
  const [showUnstakeModal, setShowUnstakeModal] = useState(false);
  const [selectedStakeForUnstake, setSelectedStakeForUnstake] = useState<{
    id: string;
    name: string;
    amount: string;
    strategyId?: string;
  } | null>(null);

  const { data: pools, isLoading: poolIsLoading } = useStrategies();
  const { data: userStakes, isLoading: userStakeLoading } = useGetStakes();

  // Derive hasStakes from actual data
  const hasStakes = userStakes?.stakes && userStakes.stakes.length > 0;

  const totalStaked = hasStakes
    ? userStakes!.stakes.reduce(
        (acc, s) => acc + Number(s.amountStaked || 0),
        0
      )
    : 0;
  const symbolSet = new Set(
    (userStakes?.stakes || []).map((s) => (s.tokenSymbol || "").toUpperCase())
  );
  const singleSymbol = symbolSet.size === 1 ? Array.from(symbolSet)[0] : "";
  const avgApy = hasStakes && totalStaked > 0
    ? userStakes!.stakes.reduce(
        (acc, s) => acc + Number(s.apy || 0) * Number(s.amountStaked || 0),
        0
      ) / totalStaked
    : 0;

  // Handle pool selection with highlight effect
  const handlePoolClick = (pool: Pool) => {
    setHighlightedPool(pool.id);
    setSelectedPool(pool);
    setShowModal(true);
  };

  // Handle modal confirmation
  const handleModalConfirm = () => {
    setShowModal(false);
    setShowAmountPage(true);
  };

  // Handle modal close
  const handleModalClose = () => {
    setShowModal(false);
    setHighlightedPool(null);
    setSelectedPool(null);
  };

  // Handle back from amount page
  const handleBackFromAmountPage = () => {
    setShowAmountPage(false);
    setSelectedPool(null);
    setHighlightedPool(null);
  };

  const handleUnstake = async ({
    strategyId,
    amount,
    pinToken,
  }: {
    strategyId: string;
    amount: number;
    pinToken: string;
  }) => {
    try {
      const result = await unstake({ strategyId, amount, pinToken });
      console.log("✅ Unstake successful:", result);
      toast.success(`Successfully unstaked ${amount} tokens`);
      setShowUnstakeModal(false);
      setSelectedStakeForUnstake(null);
    } catch (error) {
      console.error("❌ Unstake failed:", error);
      toast.error("Failed to unstake. Please try again.");
    }
  };

  const handleUnstakeClick = (stake: {
    id: string;
    name: string;
    amount: string;
    strategyId?: string;
  }) => {
    setSelectedStakeForUnstake(stake);
    setShowUnstakeModal(true);
  };

  const handleCloseUnstakeModal = () => {
    setShowUnstakeModal(false);
    setSelectedStakeForUnstake(null);
  };

  // Handle claim button click
  const handleClaimClick = (stake: {
    id: string;
    name: string;
    amount: string;
    apy: number;
    lockPeriod: string;
    reward: string;
    progress: number;
  }) => {
    setSelectedStakeForClaim(stake);
    setShowClaimPage(true);
  };

  // Handle back from claim page
  const handleBackFromClaimPage = () => {
    setShowClaimPage(false);
    setSelectedStakeForClaim(null);
  };

  // If amount page should be shown, render it
  if (showAmountPage && selectedPool) {
    return (
      <EnterAmountPage pool={selectedPool} onBack={handleBackFromAmountPage} />
    );
  }
  // If claim page should be shown, render it
  if (showClaimPage && selectedStakeForClaim) {
    return (
      <ClaimRewardsPage
        stake={selectedStakeForClaim}
        onBack={handleBackFromClaimPage}
      />
    );
  }
  return (
    <div className=" w-screen max-w-md">
      <div className="mx-auto p-4 w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Staking</h1>
          <p className="text-gray-600">Track your active stakes and rewards</p>
        </div>

        {/* Stats Section */}
        {hasStakes && (
          <div className="flex w-full py-4 gap-2">
            <div className="border space-y-2 border-neutral-100 bg-white p-4 rounded-lg w-full">
              <p className="text-gray-600 flex gap-2 items-center text-sm font-bold">
                <LockIcon className="text-primary-100" /> Total Staked
              </p>
              <h2 className="text-base font-bold text-gray-800">{singleSymbol ? `${totalStaked} ${singleSymbol}` : totalStaked}</h2>
              <span className="text-green-500 text-sm font-medium">
                +N/A% earned
              </span>
            </div>

            <div className="border space-y-2 border-neutral-100 bg-white p-4 rounded-lg w-full">
              <p className="text-gray-600 flex gap-2 items-center text-sm font-bold">
                <ArrowSquareOutIcon className="text-green-500" />
                Avg. APY
              </p>
              <h2 className="text-base font-bold text-gray-800">{Number(avgApy * 100).toFixed(2)}%</h2>
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

        {/* <StakingEmptyState showBottomNav={false} /> */}

        {/* Content Based on Active Tab */}
        {activeTab === "pools" ? (
          poolIsLoading ? (
            <div className="text-center py-12 text-gray-500">
              Loading pools...
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 mb-12">
              {pools?.strategies.map((pool) => {
                const currencyType = detectCurrencyType(pool.name);
                const isHighlighted =
                  highlightedPool?.toString() === pool.id.toString();

                return (
                  <div
                    key={pool.id}
                    className={`bg-white rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
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

                          <div>
                            <h3 className="font-bold text-gray-800">
                              {pool.tokenSymbol}
                            </h3>
                            <p className="text-sm text-gray-500">{pool.name}</p>
                          </div>
                        </div>

                        <span className="text-green-500 font-bold">
                          {Number(pool.apy * 100).toFixed(2)}%
                        </span>
                      </div>

                      <div className="flex justify-between items-center w-full mt-4">
                        <p className="text-sm text-gray-600">Lock Period</p>
                        <p className="font-medium text-gray-800">Flexible</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        ) : userStakeLoading ? (
          <div className="text-center py-12 text-gray-500">
            Loading stakes...
          </div>
        ) : hasStakes ? (
          <div className="space-y-4">
            {userStakes?.stakes.map((stake) => {
              const currencyType = detectCurrencyType(stake.strategyName);
              return (
                <div
                  key={stake.id}
                  className="bg-white rounded-lg p-4 space-y-4 transition-all duration-700 ease-in-out"
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
                          {stake.strategyName}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-neutral-500 mt-1">
                          <span>{stake.amountStaked}</span>
                          <div className="w-1 h-1 bg-gray-400 rounded-full" />
                          <span>{Number(stake.apy * 100).toFixed(2)}% APY</span>
                        </div>
                        <p className="text-neutral-400 text-xs mt-1">
                          Lock Period:{" "}
                          <span className="text-gray-800">Flexible</span>
                        </p>
                      </div>
                    </div>
                    <span className="text-green-500 font-medium">
                      {Number(stake.apy * 100).toFixed(2)}%
                    </span>
                  </div>

                  <div className="flex gap-2 w-full pt-2">
                    <button
                      onClick={() =>
                        handleUnstakeClick({
                          amount: stake.amountStaked.toString(),
                          id: stake.strategyId,
                          name: stake.strategyName,
                          strategyId: stake.strategyId,
                        })
                      }
                      disabled={isUnstaking}
                      className="px-3 w-full flex items-center justify-center gap-2 py-2 text-sm border border-blue-600 text-blue-600 rounded-full hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <MinusIcon className="w-4 h-4" />
                      <span>{isUnstaking ? "Processing..." : "Unstake"}</span>
                    </button>

                    <button
                      className="w-full flex items-center justify-center cursor-pointer gap-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                      onClick={() =>
                        handleClaimClick({
                          amount: stake.amountStaked.toString(),
                          apy: stake.apy,
                          id: stake.id,
                          lockPeriod: "Flexible",
                          name: stake.strategyName,
                          progress: 30,
                          reward: "",
                        })
                      }
                    >
                      <MedalIcon className="w-4 h-4" />
                      <span>Claim</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md h-full flex flex-col justify-center mx-auto items-center p-8 text-center">
            <div className="max-w-md mx-auto">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                No Active Stakes Yet
              </h2>
              <p className="text-gray-600 mb-6">
                Start earning rewards by staking your crypto assets — secure,
                beginner-friendly, and flexible.
              </p>
              <div className="flex w-full gap-2 text-sm">
                <Button
                  variants="primary"
                  handleClick={() => setActiveTab("pools")}
                >
                  Available Pools
                </Button>
                <Button variants="primary">Learn Staking</Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Pool Selection Modal */}
      {showModal && selectedPool && (
        <PoolSelectionModal
          isOpen={true}
          pool={selectedPool}
          onConfirm={handleModalConfirm}
          onClose={handleModalClose}
        />
      )}

      {/* Unstake Confirmation Modal */}
      {showUnstakeModal && selectedStakeForUnstake && (
        <UnstakeModal
          isOpen={showUnstakeModal}
          setIsOpen={setShowUnstakeModal}
          onClose={handleCloseUnstakeModal}
          onConfirm={handleUnstake}
          stake={selectedStakeForUnstake}
          isLoading={isUnstaking}
        />
      )}
    </div>
  );
};

export default StakingPage;
