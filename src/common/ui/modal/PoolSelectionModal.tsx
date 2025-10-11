// Pool selection modal component

import { detectCurrencyType } from "../../../types/types";
import { currencyIcons } from "../../../utils";
import GlobalModal from "./GlobalModal";

interface Pool {
  id: string;
  name: string;
  apy: number;
  tokenSymbol: string;
  tvlUsd: number;
  contractAddress: string;
  isAudited: true;
}

const PoolSelectionModal = ({
  pool,
  isOpen,
  onConfirm,
  onClose,
}: {
  isOpen: boolean;
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
    <GlobalModal
      onClose={onClose}
      open={isOpen}
      setOpen={(open) => !open && onClose()}
      headingText="Confirm Pool Selection"
      btnText="Proceed to Stake"
      onProceed={onConfirm}
      isProceedDisabled={false}
    >
      <div className="bg-white rounded-xl   max-w-md w-full w-full pt-4">
        <div className="flex items-center space-x-3 mb-4 p-3 bg-neutral-100 rounded-lg">
          <CurrencyIcon currencyType={currencyType} />
          <div>
            <h4 className="font-semibold text-gray-800">{pool.tokenSymbol}</h4>
            <p className="text-sm text-gray-600">{pool.name}</p>
          </div>
        </div>

        <div className="space-y-3 text-sm bg-neutral-100 p-3 rounded-lg">
          <div className="flex justify-between pb-2">
            <span className="text-gray-600">APY</span>
            <span className="font-semibold text-green-500">
              {pool.apy.toFixed(3)}%
            </span>
          </div>
          <div className="flex justify-between pb-2">
            <span className="text-gray-600">Lock Period</span>
            <span className="font-semibold">Flexible</span>
          </div>
          <div className="flex justify-between pb-2">
            <span className="text-gray-600">Minimum Stake</span>
            <span className="font-semibold">1 {pool.name}</span>
          </div>
        </div>
      </div>
    </GlobalModal>
  );
};

export default PoolSelectionModal;
