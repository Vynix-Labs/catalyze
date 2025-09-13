import React, { useState } from "react";
import AmountEntryStep from "../../components/cryptoTransferFlow/AmountEntryStep";
import BankSelectionStep from "../../components/cryptoTransferFlow/BankSelectionStep";
import PinEntryStep from "../../components/cryptoTransferFlow/PinEntryStep";
import SuccessStep from "../../components/cryptoTransferFlow/SuccessStep";


const CryptoTransferFlow: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [amount, setAmount] = useState("");
  const [selectedBank, setSelectedBank] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [pin, setPin] = useState("");
  const [username] = useState("Username");

  const resetForm = () => {
    setCurrentStep(1);
    setAmount("");
    setSelectedBank("");
    setAccountNumber("");
    setPin("");
  };

  const goToNextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const goToPrevStep = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <AmountEntryStep
            amount={amount}
            setAmount={setAmount}
            onNext={goToNextStep}
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
            onNext={goToNextStep}
            onBack={goToPrevStep}
          />
        );
      case 4:
        return <SuccessStep onDone={resetForm} />;
      default:
        return (
          <AmountEntryStep
            amount={amount}
            setAmount={setAmount}
            onNext={goToNextStep}
            onBack={goToPrevStep}
          />
        );
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-white">
      {renderCurrentStep()}
    </div>
  );
};

export default CryptoTransferFlow;
