import React from "react";

export interface Asset {
  id: string;
  symbol: string;
  name: string;
  balance: string;
  value: string;
  currency?: string;
}

interface AssetsProps {
  assets: Asset[];
  title?: string;
  maxDisplayItems?: number;
  onAssetClick?: (asset: Asset) => void;
}

// Currency icon mapping - using proper image paths (same as transactions)
const currencyIcons = {
  USDT: "/images/usdt.png",
  USDC: "/images/usdc.png",
  STRK: "/images/strk.png",
};

// Fallback component for unknown currencies
const FallbackIcon = ({ symbol }: { symbol: string }) => (
  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
    <span className="text-xs font-bold">{symbol.charAt(0)}</span>
  </div>
);

const Assets: React.FC<AssetsProps> = ({
  assets,
  maxDisplayItems = assets.length,
  onAssetClick,
}) => {
  // Show only limited items if maxDisplayItems is provided
  const displayAssets = assets.slice(0, maxDisplayItems);

  return (
    <div className="mb-6 rounded-lg bg-white p-3">
      <div className="space-y-4">
        {displayAssets.map((asset) => {
          const iconPath =
            currencyIcons[asset.symbol as keyof typeof currencyIcons];

          return (
            <div
              key={asset.id}
              className={`flex justify-between items-center py-2 ${
                onAssetClick
                  ? "cursor-pointer hover:bg-gray-50 rounded-lg p-2"
                  : ""
              }`}
              onClick={() => onAssetClick && onAssetClick(asset)}
            >
              {/* Left side with icon and text */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-neutral-150 rounded-full flex items-center justify-center flex-shrink-0">
                  {iconPath ? (
                    <img
                      src={iconPath}
                      alt={`${asset.symbol} logo`}
                      className="object-contain w-5 h-5"
                    />
                  ) : (
                    <FallbackIcon symbol={asset.symbol} />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-black text-sm">
                    {asset.symbol}
                  </h3>
                  <p className="text-xs text-gray-500">{asset.name}</p>
                </div>
              </div>

              {/* Right side with balance and value */}
              <div className="text-right">
                <p className="font-black text-black text-base">{asset.balance}</p>
                <p className="text-base text-gray-500">
                  ≈{asset.currency || "₦"}
                  {asset.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Assets;
