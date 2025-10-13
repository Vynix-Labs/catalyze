import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronLeftIcon } from "../../assets/svg";
import DepositModal from "../../common/ui/modal/DepositModal";
import AmountEntryStep from "../../components/cryptoTransferFlow/AmountEntryStep";
import BankSelectionStep from "../../components/cryptoTransferFlow/BankSelectionStep";
import PinEntryStep from "../../components/cryptoTransferFlow/PinEntryStep";
import SuccessStep from "../../components/cryptoTransferFlow/SuccessStep";
import type { BankResponse, CurrencyDetailPageProps } from "../../types/types";

// Define proper types
type FlowType = "deposit" | "transfer";
type CurrencyMode = "crypto" | "fiat";

const CryptoTransferFlow: React.FC<CurrencyDetailPageProps> = ({
  currencyType: propCurrencyType,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [currentStep, setCurrentStep] = useState(1);
  const [amount, setAmount] = useState("");
  const [amountNGN, setAmountNGN] = useState("");
  const [selectedBank, setSelectedBank] = useState<BankResponse | null>(null);
  const [accountNumber, setAccountNumber] = useState("");
  const [pin, setPin] = useState("");
  const [username] = useState("Username");
  const [showDepositModal, setShowDepositModal] = useState(false);

  // Get the selected asset and transfer type from navigation state
  const { selectedAsset, transferType: stateTransferType } =
    location.state || {};

  // Separate flow type from currency mode
  const [flowType, setFlowType] = useState<FlowType>(
    stateTransferType === "deposit" ? "deposit" : "transfer"
  );

  const [currencyMode, setCurrencyMode] = useState<CurrencyMode>(
    stateTransferType === "crypto" ? "crypto" : "fiat"
  );

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
    setSelectedBank(null);
    setAccountNumber("");
    setPin("");
    setFlowType(stateTransferType === "deposit" ? "deposit" : "transfer");
    setCurrencyMode(stateTransferType === "crypto" ? "crypto" : "fiat");
  };

  const goToNextStep = () => {
    console.log(
      "Going to next step from:",
      currentStep,
      "Flow type:",
      flowType,
      "Currency mode:",
      currencyMode
    );

    // If it's deposit and we're on amount entry, show deposit modal instead of going to bank selection
    if (flowType === "deposit" && currentStep === 1) {
      setShowDepositModal(true);
      return;
    }

    // If transferring crypto and we're on amount entry, skip bank selection
    if (currencyMode === "crypto" && currentStep === 1) {
      setCurrentStep(3); // Skip to pin entry
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const goToPrevStep = () => {
    // If transferring crypto and we're on pin entry, go back to amount entry
    if (currencyMode === "crypto" && currentStep === 3) {
      setCurrentStep(1);
    } else {
      setCurrentStep((prev) => Math.max(1, prev - 1));
    }
  };

  const handleCurrencyModeChange = (mode: CurrencyMode) => {
    setCurrencyMode(mode);
  };

  const handleFlowTypeChange = (type: FlowType) => {
    setFlowType(type);
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
    if (flowType === "deposit") {
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
            onCurrencyModeChange={handleCurrencyModeChange}
            onFlowTypeChange={handleFlowTypeChange}
            currencyType={currencyType}
            flowType={flowType}
            currencyMode={currencyMode}
            selectedAsset={selectedAsset}
          />
        );
      case 2:
        // Skip bank selection for deposit (handled by modal)
        if (flowType === "deposit") {
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
        if (flowType === "deposit") {
          return null;
        }
        return (
          <PinEntryStep
            pin={pin}
            setPin={setPin}
            flowType={flowType}
            bankName={selectedBank?.name}
            bankCode={selectedBank?.code}
            accountNumber={accountNumber}
            currencyMode={currencyMode}
            onNext={goToNextStep}
            onBack={goToPrevStep}
            currencyType={currencyType}
            amount={amount}
            amountNGN={amountNGN}
            tokenSymbol={currencyType}
          />
        );
      case 4:
        return (
          <SuccessStep
            flowType={flowType}
            currencyMode={currencyMode}
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
            flowType={flowType}
            currencyMode={currencyMode}
            onCurrencyModeChange={handleCurrencyModeChange}
            onFlowTypeChange={handleFlowTypeChange}
            onNext={goToNextStep}
            currencyType={currencyType}
            selectedAsset={selectedAsset}
          />
        );
    }
  };

  return (
    <div className="max-w-md w-full mx-auto h-screen bg-neutral-100 flex flex-col overflow-hidden relative">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white shrink-0">
        <button
          onClick={() => navigate("/dashboard")}
          className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
        >
          <ChevronLeftIcon />
        </button>
        <h1 className="text-lg font-semibold">{getPageTitle()}</h1>
        <div className="w-9 h-9"></div>
      </div>

      {/* Content area */}
      <div className="flex-1 flex flex-col justify-between pb-20">
        {/* pb-24 adds space above BottomNav */}
        {renderCurrentStep()}
      </div>

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
