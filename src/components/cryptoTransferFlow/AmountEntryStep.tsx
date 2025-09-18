import React, { useState } from "react";
import { AlertCircle } from "lucide-react";
import type { AmountEntryStepProps } from "../../types/types";
import CurrencyTabs from "./CurrencyTabs";
import Button from "../../common/ui/button";
import { SwapIcon } from "../../assets/svg";
import GlobalModal from "../../common/ui/modal/GlobalModal";

const AmountEntryStep: React.FC<AmountEntryStepProps> = ({
  amount,
  amountNGN,
  setAmountNGN,
  setAmount,
  onNext,
  transferType,
  onTransferTypeChange,
  currencyType = "USDC",
}) => {
  const [address, setAddress] = useState("");
  const [selectedNetwork, setSelectedNetwork] = useState("");
  const [isSwapped, setIsSwapped] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Exchange rate calculation
  const exchangeRate = 1500; // 1 USD = 1500 NGN

  const handleUSDCChange = (value: string) => {
    setAmount?.(value);
    // Auto-calculate NGN equivalent
    const usdcAmount = parseFloat(value) || 0;
    const ngnEquivalent = (usdcAmount * exchangeRate).toFixed(2);
    setAmountNGN(ngnEquivalent);
  };

  const handleNGNChange = (value: string) => {
    setAmountNGN(value);
    // Auto-calculate USDC equivalent
    const ngnAmount = parseFloat(value) || 0;
    const usdcEquivalent = (ngnAmount / exchangeRate).toFixed(6);
    setAmount?.(usdcEquivalent);
  };

  const handleSwap = () => {
    // Swap the values between USDC and NGN inputs
    const tempUSDC = amount;
    const tempNGN = amountNGN;
    setAmount?.(tempNGN ?? "");
    setAmountNGN(tempUSDC ?? "");
    setIsSwapped(!isSwapped);
  };

  const handleProceedClick = () => {
    if (transferType === "crypto") {
      // For crypto, validate and show confirmation modal first
      if (!amount || !address || !selectedNetwork) {
        alert("Please fill in all crypto transfer details");
        return;
      }
      setIsModalOpen(true);
    } else {
      // For fiat, validate and proceed directly to next step (BankSelectionStep)
      if (!amount || !amountNGN) {
        alert("Please enter both USDC and NGN amounts");
        return;
      }
      onNext();
    }
  };

  const handleModalProceed = () => {
    setIsModalOpen(false);
    onNext(); // This will go to PinEntryStep (step 3) for crypto transfers
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  // Currency icon mapping
  const currencyIcons = {
    USDT: "/images/usdt.png",
    USDC: "/images/usdc.png",
    STRK: "/images/strk.png",
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
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
          <img
            src={iconPath}
            alt={`${currencyType} logo`}
            className="w-8 h-8 object-contain"
          />
        </div>
      );
    }

    return <FallbackIcon currencyType={currencyType} />;
  };

  // Get network display name
  const getNetworkName = (network: string) => {
    const networks = {
      bep20: "BEP-20",
      erc20: "ERC-20",
      spl: "SPL",
      polygon: "Polygon",
    };
    return networks[network as keyof typeof networks] || network;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative">
      <div className="bg-white h-full">
        <CurrencyTabs
          activeTab={transferType}
          onTabChange={onTransferTypeChange}
        />

        {/* Show different content based on active tab */}
        {transferType === "fiat" ? (
          <div className="p-4 space-y-4">
            <div className="">
              <div className="flex items-center justify-between text-sm mb-2">
                <div className="font-bold">Enter Amount</div>
                <span>Available Amount: 10,000</span>
              </div>

              <div className="relative">
                <input
                  type="text"
                  placeholder={`Enter ${currencyType}`}
                  inputMode="numeric"
                  value={amount}
                  onChange={(e) => handleUSDCChange(e.target.value)}
                  className="w-full placeholder:text-sm p-3 border border-gray-200 bg-neutral-50 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div
              className="flex justify-center cursor-pointer items-center"
              onClick={handleSwap}
            >
              <SwapIcon
                className={`hover:scale-110 transition-all duration-300 hover:text-blue-600 active:text-red-500 ${
                  isSwapped ? "rotate-180" : "rotate-0"
                }`}
              />
            </div>

            <div className="mb-4">
              <div className="text-sm text-gray-600 mb-2">
                Exchange Rate: ₦{exchangeRate.toLocaleString()}/{currencyType}
              </div>

              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter NGN"
                  inputMode="numeric"
                  value={amountNGN}
                  onChange={(e) => handleNGNChange(e.target.value)}
                  className="w-full placeholder:text-sm p-3 border border-gray-200 bg-neutral-50 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            <div className="">
              <div className="flex items-center justify-between text-sm mb-2">
                <div className="font-bold">Amount</div>
                <span>Available Amount: 10,000 {currencyType}</span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder={`Enter ${currencyType} amount`}
                  value={amount}
                  onChange={(e) => setAmount?.(e.target.value)}
                  className="w-full placeholder:text-sm p-3 border border-gray-200 bg-neutral-50 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="mb-4">
              <div className="text-sm font-bold mb-2">Address</div>

              <div className="relative">
                <input
                  type="text"
                  placeholder={`Enter ${currencyType} address`}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full placeholder:text-sm p-3 border border-gray-200 bg-neutral-50 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="mb-4">
              <div className="block text-sm font-bold mb-2">Network</div>
              <select
                value={selectedNetwork}
                onChange={(e) => setSelectedNetwork(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Network</option>
                <option value="bep20">BEP-20 (Binance Smart Chain)</option>
                <option value="erc20">ERC-20 (Ethereum)</option>
                <option value="spl">SPL (Solana)</option>
                <option value="polygon">Polygon</option>
              </select>
            </div>
          </div>
        )}

        {transferType === "fiat" && (
          <div className="flex items-start flex-col space-x-2 text-sm text-secondary-100 bg-secondary-200 space-y-2 rounded-lg mx-4 p-3">
            <div className="text-sm flex gap-2 items-center">
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <span className="font-medium">Info</span>
            </div>

            <div className="">
              Estimated amount of naira with our current rate will be
              transferred to beneficiary
            </div>
          </div>
        )}
      </div>

      <div className="w-full bottom-0 mx-auto flex justify-center p-4 absolute">
        <Button
          variants="primary"
          handleClick={handleProceedClick}
          text="Proceed"
          disabled={
            transferType === "fiat"
              ? !amount || !amountNGN
              : !amount || !address || !selectedNetwork
          }
        />
      </div>

      {/* Crypto Confirmation Modal */}
      {transferType === "crypto" && (
        <GlobalModal
          onClose={toggleModal}
          open={isModalOpen}
          setOpen={setIsModalOpen}
          btnText="Proceed"
          onProceed={handleModalProceed}
          isProceedDisabled={false}
        >
          <div className="py-6">
            {/* Currency Icon */}
            <div className="flex justify-center mb-6">
              <CurrencyIcon currencyType={currencyType} />
            </div>

            {/* Transfer Details */}
            <div className="text-center mb-6">
              <h1 className="text-base font-black text-gray-600 mb-2">
                Transfer {currencyType}
              </h1>
              <h2 className="text-2xl font-bold text-black mb-1">
                {amount || "0"}
              </h2>
              <p className="text-sm text-gray-500">
                ≈₦
                {(
                  (parseFloat(amount ?? "") || 0) * exchangeRate
                ).toLocaleString()}
              </p>
            </div>

            {/* Transaction Details */}
            <div className="space-y-3 text-left">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Crypto</span>
                <span className="text-sm font-medium text-black">
                  {currencyType}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Address</span>
                <span className="text-sm font-medium text-black break-all">
                  {address || "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Network</span>
                <span className="text-sm font-medium text-black">
                  {selectedNetwork ? getNetworkName(selectedNetwork) : "N/A"}
                </span>
              </div>
            </div>
          </div>
        </GlobalModal>
      )}
    </div>
  );
};

export default AmountEntryStep;
