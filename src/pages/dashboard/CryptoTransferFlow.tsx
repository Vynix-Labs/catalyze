import React, { useEffect, useState } from "react";
import AmountEntryStep from "../../components/cryptoTransferFlow/AmountEntryStep";
import BankSelectionStep from "../../components/cryptoTransferFlow/BankSelectionStep";
import PinEntryStep from "../../components/cryptoTransferFlow/PinEntryStep";
import SuccessStep from "../../components/cryptoTransferFlow/SuccessStep";
import { ChevronLeftIcon } from "../../assets/svg";
import { useLocation, useNavigate } from "react-router-dom";
import type { CurrencyDetailPageProps } from "../../types/types";
import DepositModal from "../../common/ui/modal/DepositModal";

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
  const [showDepositModal, setShowDepositModal] = useState(false);

  // Get the selected asset and transfer type from navigation state or use prop
  const { selectedAsset, transferType: stateTransferType } =
    location.state || {};
  const [transferType, setTransferType] = useState<
    "transfer" | "deposit" | "fiat" | "crypto"
  >(stateTransferType || "fiat");

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
    setAmountNGN("");
    setSelectedBank("");
    setAccountNumber("");
    setPin("");
    setTransferType(stateTransferType || "fiat");
  };

  const goToNextStep = () => {
    console.log(
      "Going to next step from:",
      currentStep,
      "Transfer type:",
      transferType
    );

    // If it's deposit and we're on amount entry, show deposit modal instead of going to bank selection
    if (transferType === "deposit" && currentStep === 1) {
      setShowDepositModal(true);
      return;
    }

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
    setTransferType(type as "transfer" | "deposit" | "fiat" | "crypto");
  };

  const handleDepositConfirmation = () => {
    setShowDepositModal(false);
    setCurrentStep(4); // Go directly to success step after deposit
  };

  const handleDepositModalClose = () => {
    setShowDepositModal(false);
    // Don't change the step, stay on amount entry
  };

  const getPageTitle = () => {
    if (transferType === "deposit") {
      return `Deposit ${currencyType}`;
    }
    return currencyType;
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
            onBack={() => navigate("/dashboard")}
          />
        );
      case 2:
        // Skip bank selection for deposit (handled by modal)
        if (transferType === "deposit") {
          return null;
        }
        return (
          <BankSelectionStep
            selectedBank={selectedBank}
            setSelectedBank={setSelectedBank}
            accountNumber={accountNumber}
            setAccountNumber={setAccountNumber}
            username={username}
            onNext={goToNextStep}
            onBack={goToPrevStep}
            amount={amount}
            amountNGN={amountNGN}
            currencyType={currencyType}
          />
        );
      case 3:
        // Skip pin entry for deposit (handled by modal)
        if (transferType === "deposit") {
          return null;
        }
        return (
          <PinEntryStep
            pin={pin}
            setPin={setPin}
            transferType={transferType}
            onNext={goToNextStep}
            onBack={goToPrevStep}
            currencyType={currencyType}
            amount={amount}
            amountNGN={amountNGN}
          />
        );
      case 4:
        return (
          <SuccessStep
            transferType={transferType}
            onDone={resetForm}
            amount={amount}
            amountNGN={amountNGN}
            currencyType={currencyType}
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
            onBack={() => navigate("/dashboard")}
          />
        );
    }
  };

  return (
    <div className="max-w-[420px] mx-auto relative min-h-screen bg-neutral-100 flex flex-col">
      {/* Header */}
      <div className="bg-white">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
          <button
            onClick={() => navigate("/dashboard")}
            className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
          >
            <ChevronLeftIcon />
          </button>
          <h1 className="text-lg font-semibold">{getPageTitle()}</h1>
          <div className="w-9 h-9"></div>
        </div>
      </div>

      {/* Steps wrapper → this grows to fill remaining screen */}
      <div className="flex-1 flex flex-col">{renderCurrentStep()}</div>

      {/* Deposit Modal */}
      {showDepositModal && (
        <DepositModal
          isOpen={showDepositModal}
          onClose={handleDepositModalClose}
          onConfirm={handleDepositConfirmation}
          amount={amount}
          amountNGN={amountNGN}
          currencyType={currencyType}
        />
      )}
    </div>
  );
};

export default CryptoTransferFlow;
