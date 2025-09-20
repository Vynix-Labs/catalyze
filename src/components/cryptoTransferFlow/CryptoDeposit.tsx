"use client";

import { QRCodeCanvas } from "qrcode.react";
import type { CryptoComponentProps } from "../../types/types";

// Currency Icon Component (you need to implement this)
const CurrencyIcon = ({ currencyType }: { currencyType: string }) => {
  const currencyIcons = {
    USDT: "/images/usdt.png",
    USDC: "/images/usdc.png",
    STRK: "/images/strk.png",
  };

  const iconPath = currencyIcons[currencyType as keyof typeof currencyIcons];

  if (iconPath) {
    return (
      <img
        src={iconPath}
        alt={`${currencyType} logo`}
        className="w-6 h-6 object-contain"
      />
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

export const CryptoDeposit: React.FC<CryptoComponentProps> = ({
  selectedNetwork,
  currencyType,
  onNetworkChange,
}) => {
  const depositAddress = "Awsd4543685jdnnu556547addsa12454wr355";

  // Encode address + currency + network
  const qrValue = JSON.stringify({
    currency: currencyType,
    network: selectedNetwork,
    address: depositAddress,
  });

  return (
    <div className="flex flex-col items-center space-y-6 p-4">
      {/* ✅ QR Code with custom overlay */}
      <div className="relative w-48 h-48 bg-white border border-blue-500 rounded-lg flex items-center justify-center">
        <QRCodeCanvas
          value={qrValue}
          size={180}
          bgColor="#ffffff"
          fgColor="#000000"
          level="H"
          includeMargin
        />

        {/* Custom currency icon overlay in the center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border-2 border-white shadow-md">
            <CurrencyIcon currencyType={currencyType}  />
          </div>
        </div>
      </div>

      {/* Network Selection */}
      <div className="w-full">
        <div className="block text-sm font-medium text-gray-700 mb-2">
          Network
        </div>
        <select
          value={selectedNetwork}
          onChange={(e) => onNetworkChange(e.target.value)}
          className="w-full p-3 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
        >
          <option value="">Select Network</option>
          <option value="bep20">BEP-20 (Binance Smart Chain)</option>
          <option value="erc20">ERC-20 (Ethereum)</option>
          <option value="spl">SPL (Solana)</option>
          <option value="polygon">Polygon</option>
        </select>
      </div>

      {/* Address Display */}
      <div className="w-full">
        <div className="text-sm text-gray-600 mb-2">
          Send {currencyType} to this address
        </div>
        <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
          <span className="text-sm font-mono text-gray-800 truncate flex-1 mr-2">
            {depositAddress}
          </span>
          <button
            className="text-blue-500 hover:text-blue-700 flex-shrink-0"
            onClick={() => navigator.clipboard.writeText(depositAddress)}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"></path>
              <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
