import type { EnterAmountPageProps } from "../../../types/types";

interface StakeDetailsProps {
  amount: string;
  pool: EnterAmountPageProps["pool"];
}

const StakeDetails = ({ amount, pool }: StakeDetailsProps) => (
  <div className="bg-white rounded-lg p-6 text-left">
    <h3 className="font-semibold text-lg">Stake Details</h3>
    <div className="space-y-4 mt-4">
      {[
        { label: "Staked", value: `${amount} ${pool.name}` },
        { label: "APY", value: `${Number(pool.apy * 100).toFixed(2)}%`, className: "text-green-500" },
        // { label: "Next Reward", value: "24 hrs" },
      ].map((item, index) => (
        <div key={index} className="flex justify-between items-center py-2">
          <span className="text-gray-600 text-xs">{item.label}</span>
          <span className={`font-semibold text-sm ${item.className || ""}`}>
            {item.value}
          </span>
        </div>
      ))}
    </div>
  </div>
);

export default StakeDetails;