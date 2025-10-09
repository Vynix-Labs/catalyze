import { useState } from "react";
import Header from "../../components/settings/Header";
import { Wallet } from "lucide-react";

interface ClaimRewardsPageProps {
  stake: {
    id: number;
    name: string;
    amount: string;
    reward: string;
    apy: number;
    progress: number;
  };
  onBack: () => void;
}

const ClaimRewardsPage = ({ stake, onBack }: ClaimRewardsPageProps) => {
  const [isClaiming, setIsClaiming] = useState(false);
  const [isClaimed, setIsClaimed] = useState(false);

  const handleClaim = () => {
    setIsClaiming(true);

    // Simulate claim process
    setTimeout(() => {
      setIsClaiming(false);
      setIsClaimed(true);

      // Auto-redirect after showing success for 2 seconds
      setTimeout(() => {
        onBack();
      }, 2000);
    }, 2000);
  };

  // Extract numeric value from reward string (e.g., "+0.08 ETH" -> "0.08")
  const rewardValue = stake.reward.replace(/[+\s]/g, "").split(" ")[0];
  const rewardCurrency = stake.reward.split(" ")[1] || "ETH";

  // Success state after claiming
  if (isClaimed) {
    return (
      <div className="max-w-md mx-auto min-h-screen bg-gray-50 flex flex-col">
        <Header title="Claim Rewards" onBack={onBack} />

        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
            Rewards Claimed!
          </h2>

          <p className="text-gray-600 text-center mb-8">
            {rewardValue} {rewardCurrency} has been transferred to your wallet
          </p>

          <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <Header title="Claim Rewards" onBack={onBack} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-start pt-12 px-6">
        {/* Reward Icon */}
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-6">
          <svg
            className="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        {/* Reward Amount */}
        <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
          You've Earned {rewardValue} {rewardCurrency}
        </h2>

        <p className="text-sm text-gray-500 mb-8 text-center">
          Approximately $52.5 USD
        </p>

        {/* Description */}
        <p className="text-center text-gray-600 text-sm leading-relaxed mb-8 max-w-xs">
          You can withdraw your staking rewards now or choose to reinvest them
          to compound your earnings.
        </p>

        {/* Claim Option */}
        <button
          onClick={handleClaim}
          disabled={isClaiming}
          className="w-full bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3 hover:bg-blue-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-4"
        >
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Wallet className="w-5 h-5 text-blue-600" />
          </div>

          <div className="flex-1 text-left">
            <p className="font-semibold text-gray-900 mb-1">
              {isClaiming ? "Processing..." : "Claim To Wallet"}
            </p>
            <p className="text-xs text-gray-600">
              {isClaiming
                ? "Transferring rewards to your wallet..."
                : "Transfer Reward Directly To Your Wallet Balance"}
            </p>
          </div>

          {isClaiming && (
            <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin flex-shrink-0" />
          )}
        </button>

        {/* Reinvest Option */}
        <button
          onClick={onBack}
          disabled={isClaiming}
          className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-start gap-3 hover:bg-neutral-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </div>

          <div className="flex-1 text-left">
            <p className="font-semibold text-gray-900 mb-1">Reinvest</p>
            <p className="text-xs text-gray-600">
              Compound your earnings by reinvesting rewards
            </p>
          </div>
        </button>
      </div>

      {/* Bottom Indicator (iOS style) */}
      <div className="py-4 flex justify-center">
        <div className="w-32 h-1 bg-gray-300 rounded-full" />
      </div>
    </div>
  );
};

export default ClaimRewardsPage;
