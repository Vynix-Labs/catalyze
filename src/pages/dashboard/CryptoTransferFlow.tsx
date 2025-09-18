import React, { useEffect, useState } from "react";
import AmountEntryStep from "../../components/cryptoTransferFlow/AmountEntryStep";
import BankSelectionStep from "../../components/cryptoTransferFlow/BankSelectionStep";
import PinEntryStep from "../../components/cryptoTransferFlow/PinEntryStep";
import SuccessStep from "../../components/cryptoTransferFlow/SuccessStep";
import { ChevronLeftIcon } from "../../assets/svg";
import { useLocation, useNavigate } from "react-router-dom";
import type { CurrencyDetailPageProps } from "../../types/types";

const CryptoTransferFlow: React.FC<CurrencyDetailPageProps> = ({
  currencyType: propCurrencyType,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [currentStep, setCurrentStep] = useState(1);
  const [amount, setAmount] = useState("");
  const [amountNGN, setAmountNGN] = useState("");
  const [selectedBank, setSelectedBank] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [pin, setPin] = useState("");
  const [username] = useState("Username");
  const [transferType, setTransferType] = useState("fiat"); // 'fiat' or 'crypto'

  // Get the selected asset from navigation state or use prop
  const selectedAsset = location.state?.selectedAsset;
  const [currencyType, setCurrencyType] = useState(
    propCurrencyType || selectedAsset?.symbol || "Crypto"
  );

  // Update currency type when component mounts or when selectedAsset changes
  useEffect(() => {
    if (selectedAsset?.symbol) {
      setCurrencyType(selectedAsset.symbol);
    } else if (propCurrencyType) {
      setCurrencyType(propCurrencyType);
    }
  }, [selectedAsset, propCurrencyType]);

  const resetForm = () => {
    setCurrentStep(1);
    setAmount("");
    setAmountNGN(""); // Reset amountNGN too
    setSelectedBank("");
    setAccountNumber("");
    setPin("");
    setTransferType("fiat");
  };

  const goToNextStep = () => {
    console.log("Going to next step from:", currentStep);
    // If transferring crypto and we're on amount entry, skip bank selection
    if (transferType === "crypto" && currentStep === 1) {
      setCurrentStep(3); // Skip to pin entry
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const goToPrevStep = () => {
    // If transferring crypto and we're on pin entry, go back to amount entry
    if (transferType === "crypto" && currentStep === 3) {
      setCurrentStep(1);
    } else {
      setCurrentStep((prev) => Math.max(1, prev - 1));
    }
  };

  const handleTransferTypeChange = (type: string) => {
    setTransferType(type);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <AmountEntryStep
            amount={amount}
            amountNGN={amountNGN}
            setAmount={setAmount}
            setAmountNGN={setAmountNGN}
            onNext={goToNextStep}
            transferType={transferType}
            onTransferTypeChange={handleTransferTypeChange}
            currencyType={currencyType}
            selectedAsset={selectedAsset}
            onBack={goToPrevStep}
          />
        );
      case 2:
        return (
          <BankSelectionStep
            selectedBank={selectedBank}
            setSelectedBank={setSelectedBank}
            accountNumber={accountNumber}
            setAccountNumber={setAccountNumber}
            username={username}
            onNext={goToNextStep}
            onBack={goToPrevStep}
            amount={amount} // Add this prop
            amountNGN={amountNGN} // Add this prop
            currencyType={currencyType} // Add this prop
          />
        );
      case 3:
        return (
          <PinEntryStep
            pin={pin}
            setPin={setPin}
            transferType={transferType}
            onNext={goToNextStep}
            onBack={goToPrevStep}
            currencyType={currencyType}
            amount={amount} // Add if needed
            amountNGN={amountNGN} // Add if needed
          />
        );
      case 4:
        return (
          <SuccessStep
            transferType={transferType}
            onDone={resetForm}
            amount={amount} // Add if needed
            amountNGN={amountNGN} // Add if needed
            currencyType={currencyType} // Add if needed
          />
        );
      default:
        return (
          <AmountEntryStep
            amount={amount}
            amountNGN={amountNGN}
            setAmount={setAmount}
            setAmountNGN={setAmountNGN}
            transferType={transferType}
            onTransferTypeChange={handleTransferTypeChange}
            onNext={goToNextStep}
            currencyType={currencyType}
            selectedAsset={selectedAsset}
            onBack={goToPrevStep}
          />
        );
    }
  };

  return (
    <div className="max-w-[420px] mx-auto relative min-h-screen">
      <div className="bg-white">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
          <button
            onClick={() => navigate("/dashboard")}
            className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
          >
            <ChevronLeftIcon />
          </button>
          <h1 className="text-lg font-semibold">{currencyType}</h1>
          <div className="w-9 h-9"></div>
        </div>
      </div>
      {renderCurrentStep()}
    </div>
  );
};

export default CryptoTransferFlow;
