import type { EnterAmountPageProps } from "../../../types/types";
import CurrencyIcon from "./CurrencyIcon";

interface CurrencyInfoProps {
  pool: EnterAmountPageProps["pool"];
}

const CurrencyInfo = ({ pool }: CurrencyInfoProps) => (
  <div className="flex items-center justify-between mb-6">
    <div className="flex items-center space-x-3">
      <CurrencyIcon currencyType={pool.name} />
      <div>
        <h2 className="font-semibold text-lg">{pool.name}</h2>
        <p className="text-sm text-gray-500">{pool.tokenSymbol}</p>
      </div>
    </div>
    <div className="text-right">
      <span className="text-green-500 font-black text-sm">
        {pool.apy.toFixed(3)}% APY
      </span>
    </div>
  </div>
);

export default CurrencyInfo;