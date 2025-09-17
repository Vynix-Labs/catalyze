import React, { useState } from "react";
import AmountEntryStep from "../../components/cryptoTransferFlow/AmountEntryStep";
import BankSelectionStep from "../../components/cryptoTransferFlow/BankSelectionStep";
import PinEntryStep from "../../components/cryptoTransferFlow/PinEntryStep";
import SuccessStep from "../../components/cryptoTransferFlow/SuccessStep";
import Header from "../../components/cryptoTransferFlow/Header";

const CryptoTransferFlow: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [amount, setAmount] = useState("");
  const [selectedBank, setSelectedBank] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [pin, setPin] = useState("");
  const [username] = useState("Username");
  const [transferType, setTransferType] = useState("fiat"); // 'fiat' or 'crypto'

  const resetForm = () => {
    setCurrentStep(1);
    setAmount("");
    setSelectedBank("");
    setAccountNumber("");
    setPin("");
    setTransferType("fiat");
  };

  const goToNextStep = () => {
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
            setAmount={setAmount}
            onNext={goToNextStep}
            transferType={transferType}
            onTransferTypeChange={handleTransferTypeChange}
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
          />
        );
      case 4:
        // return <SuccessStep onDone={resetForm} />;
        return <SuccessStep transferType={transferType} onDone={resetForm} />;
      default:
        return (
          <AmountEntryStep
            amount={amount}
            setAmount={setAmount}
            transferType={transferType}
            onTransferTypeChange={handleTransferTypeChange}
            onNext={goToNextStep}
            onBack={goToPrevStep}
          />
        );
    }
  };

  return (
    <div className="max-w-[420px] mx-auto min-h-screen">
      <div className="bg-white">
        <Header title="USDC" onBack={goToPrevStep} />
      </div>
      {renderCurrentStep()}
    </div>
  );
};

export default CryptoTransferFlow;
