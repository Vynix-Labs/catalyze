import React, { useState } from "react";
import type { BankSelectionStepProps } from "../../types/types";
import Button from "../../common/ui/button";
import GlobalModal from "../../common/ui/modal/GlobalModal";

// Currency icon mapping
const currencyIcons = {
  USDT: "/images/usdt.png",
  USDC: "/images/usdc.png",
  STRK: "/images/strk.png",
};

const BankSelectionStep: React.FC<BankSelectionStepProps> = ({
  selectedBank,
  setSelectedBank,
  accountNumber,
  setAccountNumber,
  username,
  onNext,
  amount,
  amountNGN,
  currencyType = "USDC",
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleProceedClick = () => {
    // Validate form before showing modal
    console.log("Proceed clicked", { selectedBank, accountNumber });
    if (selectedBank && accountNumber) {
      setIsModalOpen(true);
    }
  };

  const handleModalProceed = () => {
    setIsModalOpen(false);
    onNext?.(); // Navigate to PIN entry step
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  // Get bank name for display
  const getBankName = (bankCode: string) => {
    const banks = {
      access: "Access Bank",
      gtb: "GT Bank",
      zenith: "Zenith Bank",
      uba: "UBA",
    };
    return banks[bankCode as keyof typeof banks] || bankCode;
  };

  // Format amounts safely
  const formatAmount = (value: string | undefined) => {
    if (!value || isNaN(parseFloat(value))) return "0";
    return parseFloat(value).toFixed(2);
  };

  const formatNGNAmount = (value: string | undefined) => {
    if (!value || isNaN(parseFloat(value))) return "0";
    return parseFloat(value).toLocaleString();
  };

  // Fallback component for unknown currencies
  const FallbackIcon = ({ currencyType }: { currencyType: string }) => (
    <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center">
      <span className="text-xs font-bold text-white">
        {currencyType.charAt(0)}
      </span>
    </div>
  );

  // Currency Icon Component
  const CurrencyIcon = ({ currencyType }: { currencyType: string }) => {
    const iconPath = currencyIcons[currencyType as keyof typeof currencyIcons];

    if (iconPath) {
      return (
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
          <img
            src={iconPath}
            alt={`${currencyType} logo`}
            className="w-6 h-6 object-contain"
          />
        </div>
      );
    }

    return <FallbackIcon currencyType={currencyType} />;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative">
      <div className="bg-white flex-1">
        <div className="p-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bank
            </label>
            <select
              value={selectedBank}
              onChange={(e) => setSelectedBank(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Bank</option>
              <option value="access">Access Bank</option>
              <option value="gtb">GTBank</option>
              <option value="zenith">Zenith Bank</option>
              <option value="uba">UBA</option>
            </select>
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account Number
            </label>
            <input
              type="text"
              placeholder="Enter Account Number"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {/* Username card */}
            {accountNumber && (
              <div className="absolute left-0 right-0 bg-blue-600 text-white p-3 rounded-b-lg">
                <div className="text-start font-semibold text-xs">
                  {username}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="w-full bottom-0 mx-auto flex justify-center p-4 absolute">
        <Button variants="primary" handleClick={handleProceedClick}>
          Proceed
        </Button>
      </div>

      {/* Confirmation Modal */}
      <GlobalModal
        onClose={toggleModal}
        open={isModalOpen}
        setOpen={setIsModalOpen}
        btnText="Proceed"
        onProceed={handleModalProceed}
        isProceedDisabled={false}
      >
        <div className="py-6">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs text-center">
                {selectedBank ? getBankName(selectedBank) : ""}
              </span>
            </div>
          </div>

          {/* Transfer Details - UPDATED SECTION */}
          <div className="text-center mb-6">
            <h1 className="text-base font-black text-gray-600 mb-2">
              Transfer to {username}
            </h1>
            <p className="text-sm text-gray-600 mb-2">{accountNumber}</p>
            <h2 className="text-2xl font-bold text-black mb-1">
              ₦{formatNGNAmount(amountNGN)}
            </h2>
            <div className="flex items-center justify-center gap-2 mt-2">
              <p className="text-sm text-gray-500">
                ≈{formatAmount(amount)} {currencyType}
              </p>
              <CurrencyIcon currencyType={currencyType} />
            </div>
          </div>

          {/* Bank Details */}
          <div className="space-y-3 text-left">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Bank</span>
              <span className="text-sm font-medium text-black">
                {selectedBank ? getBankName(selectedBank) : ""}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Account Name</span>
              <span className="text-sm font-medium text-black">{username}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Transaction ID</span>
              <span className="text-sm font-medium text-black">
                123999583020442
              </span>
            </div>
          </div>
        </div>
      </GlobalModal>
    </div>
  );
};

export default BankSelectionStep;
