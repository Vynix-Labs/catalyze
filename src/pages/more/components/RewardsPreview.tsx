import type { EnterAmountPageProps } from "../../../types/types";

interface RewardsPreviewProps {
  amount: string;
  pool: EnterAmountPageProps["pool"];
}

const RewardsPreview = ({ amount, pool }: RewardsPreviewProps) => {
  const calculateMonthlyRewards = (stakeAmount: string) => {
    if (!stakeAmount || isNaN(parseFloat(stakeAmount))) return "0.00";
    return ((parseFloat(stakeAmount) * pool.apy) / 100 / 12).toFixed(2);
  };

  return (
    <div className="bg-blue-50 border-2 border-blue-200 rounded-lg my-5">
      <div className="text-center p-4">
        <h3 className="font-semibold text-gray-700 mb-1">
          Estimated Monthly Rewards
        </h3>
        <p className="text-2xl font-bold text-blue-600">
          {calculateMonthlyRewards(amount)}/month
        </p>
        <p className="text-sm text-gray-500 mt-1">
          You could earn this much with your stake
        </p>
      </div>
    </div>
  );
};

export default RewardsPreview;