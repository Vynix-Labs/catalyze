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
}

const Assets: React.FC<AssetsProps> = ({ assets }) => {
  return (
    <div>
      {/* <h2 className="text-xl font-bold text-gray-800 mb-4">{title}</h2> */}

      <div className="space-y-4">
        {assets.map((asset) => (
          <div
            key={asset.id}
            className="flex justify-between items-center py-2"
          >
            <div>
              <h3 className="font-bold text-gray-800">{asset.symbol}</h3>
              <p className="text-sm text-gray-600">{asset.name}</p>
            </div>
            <div className="text-right">
              <p className="font-medium text-gray-800">{asset.balance}</p>
              <p className="text-sm text-gray-600">
                ≈{asset.currency || "N"}
                {asset.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Assets;
