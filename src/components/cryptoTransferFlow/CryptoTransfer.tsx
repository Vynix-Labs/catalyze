import type { CryptoComponentProps } from "../../types/types";

export const CryptoTransfer: React.FC<CryptoComponentProps> = ({
  cryptoAmount,
  address,
  selectedNetwork,
  currencyType,
  onCryptoAmountChange,
  onAddressChange,
  onNetworkChange,
}) => {
  return (
    <div className="flex-1  w-md p-4 space-y-4">
      <div className="mb-4 w-full">
        <div className="flex items-center justify-between text-sm mb-2">
          <div className="font-medium text-gray-900">Amount</div>
          <span className="text-gray-500">Available Amount: 10,000</span>
        </div>
        <div className="relative w-full">
          <input
            type="text"
            inputMode="numeric"
            placeholder="Enter Amount"
            value={cryptoAmount}
            onChange={(e) => onCryptoAmountChange(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-lg text-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>
      </div>

      <div className="mb-4 w-full">
        <div className="text-sm font-medium text-gray-900 mb-2">Address</div>
        <input
          type="text"
          placeholder={`Enter ${currencyType} address`}
          value={address}
          onChange={(e) => onAddressChange(e.target.value)}
          className="w-full p-3 border border-gray-200 rounded-lg text-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        />
      </div>

      <div className="mb-4 w-full">
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Network
        </label>
        <select
          value={selectedNetwork}
          onChange={(e) => onNetworkChange(e.target.value)}
          className="w-full p-3 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="">Select Network</option>
          <option value="bep20">BEP-20 (Binance Smart Chain)</option>
          <option value="erc20">ERC-20 (Ethereum)</option>
          <option value="spl">SPL (Solana)</option>
          <option value="polygon">Polygon</option>
        </select>
      </div>
    </div>
  );
};
