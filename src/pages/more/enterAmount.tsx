import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import Button from "../../common/ui/button";
import { SuccessIcon } from "../../assets/svg";

// Constants
const CONSTANTS = {
  AVAILABLE_BALANCE: 5000,
  APY: 8,
  MIN_STAKE: 1,
  LOCK_PERIOD: "7 days",
  NEXT_REWARD: "24 hrs",
} as const;

// Reusable Components
const Header = ({ title, onBack }: { title: string; onBack: () => void }) => (
  <div className="flex items-center p-4">
    <ArrowLeft
      className="w-6 h-6 text-gray-600 cursor-pointer"
      onClick={onBack}
    />
    <h1 className="flex-1 text-center font-semibold text-lg">{title}</h1>
  </div>
);

const CurrencyInfo = () => (
  <div className="flex items-center justify-between mb-6">
    <div className="flex items-center space-x-3">
      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
        <span className="text-white font-bold text-sm">$</span>
      </div>
      <div>
        <h2 className="font-semibold text-lg">USDC</h2>
        <p className="text-sm text-gray-500">
          Available: {CONSTANTS.AVAILABLE_BALANCE} USDC
        </p>
      </div>
    </div>
    <div className="text-right">
      <span className="text-green-500 font-black text-sm">
        {CONSTANTS.APY}% APY
      </span>
    </div>
  </div>
);

const AmountInput = ({
  amount,
  onChange,
}: {
  amount: string;
  onChange: (value: string) => void;
}) => {
  const handleAmountChange = (value: string) => {
    const numValue = parseFloat(value);
    if (
      value === "" ||
      (numValue >= CONSTANTS.MIN_STAKE &&
        numValue <= CONSTANTS.AVAILABLE_BALANCE)
    ) {
      onChange(value);
    }
  };

  return (
    <div className="space-y-2 mb-6">
      <label className="block text-sm font-medium text-gray-700">
        Enter amount to stake
      </label>
      <input
        value={amount}
        onChange={(e) => handleAmountChange(e.target.value)}
        placeholder="0.00"
        className="w-full p-3 font-semibold border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        min={CONSTANTS.MIN_STAKE}
        max={CONSTANTS.AVAILABLE_BALANCE}
        step="0.01"
      />
      <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
        <span>Min: {CONSTANTS.MIN_STAKE} USDT</span>
        <span>Max: 100% of your balance</span>
      </div>
    </div>
  );
};

const RewardsPreview = ({ amount }: { amount: string }) => {
  const calculateMonthlyRewards = (stakeAmount: string) => {
    if (!stakeAmount) return "0.00";
    return ((parseFloat(stakeAmount) * CONSTANTS.APY) / 100 / 12).toFixed(2);
  };

  const monthlyRewards = calculateMonthlyRewards(amount);

  return (
    <div className="bg-blue-50 border-2 border-blue-200 rounded-lg my-5">
      <div className="text-center p-4">
        <h3 className="font-semibold text-gray-700 mb-1">
          Estimated Monthly Rewards
        </h3>
        <p className="text-2xl font-bold text-blue-600">
          ₦{monthlyRewards}/month
        </p>
        <p className="text-sm text-gray-500 mt-1">
          You could earn this much with your stake
        </p>
      </div>
    </div>
  );
};

const LoadingSpinner = () => (
  <div className="flex items-center flex-row-reverse justify-center space-x-4">
    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
    <span className="pr-2">Confirming...</span>
  </div>
);

const StakeDetails = ({ amount }: { amount: string }) => (
  <div className="bg-white rounded-lg p-6 text-left">
    <h3 className="font-semibold text-lg">Stake Details</h3>
    <div className="space-y-4 mt-4">
      {[
        { label: "Staked", value: `${amount} USDT` },
        {
          label: "APY",
          value: `${CONSTANTS.APY}%`,
          className: "text-green-500",
        },
        { label: "Lock Period", value: CONSTANTS.LOCK_PERIOD },
        { label: "Next Reward", value: CONSTANTS.NEXT_REWARD },
      ].map((item, index) => (
        <div key={index} className="flex justify-between items-center py-2">
          <span className="text-gray-600 text-xs">{item.label}</span>
          <span className={`font-semibold text-sm ${item.className || ""}`}>
            {item.value}
          </span>
        </div>
      ))}
    </div>
  </div>
);

// Main Component
const EnterAmountPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [amount, setAmount] = useState("");
  const [isConfirming, setIsConfirming] = useState(false);

  const handleConfirmStake = () => {
    setIsConfirming(true);
    setTimeout(() => {
      setCurrentStep(3);
      setIsConfirming(false);
    }, 2000);
  };

  const goBack = () => currentStep > 1 && setCurrentStep(currentStep - 1);
  const goHome = () => {
    setCurrentStep(1);
    setAmount("");
  };

  // Step 1: Enter Amount
  if (currentStep === 1) {
    return (
      <div className="max-w-md mx-auto bg-white min-h-screen">
        <Header title="Enter Amount" onBack={goBack} />
        <div className="p-6 w-full">
          <CurrencyInfo />
          <AmountInput amount={amount} onChange={setAmount} />
          <Button
            fullWidth
            variants="primary"
            handleClick={() => setCurrentStep(2)}
            disabled={!amount || parseFloat(amount) < CONSTANTS.MIN_STAKE}
          >
            Confirm Stake
          </Button>
        </div>
      </div>
    );
  }

  // Step 2: Confirm with Rewards Preview
  if (currentStep === 2) {
    return (
      <div className="max-w-md mx-auto bg-white min-h-screen">
        <Header title="Enter Amount" onBack={goBack} />
        <div className="p-6 space-y-4">
          <CurrencyInfo />
          <AmountInput amount={amount} onChange={setAmount} />
          <RewardsPreview amount={amount} />
          <Button
            fullWidth
            variants="primary"
            handleClick={handleConfirmStake}
            disabled={isConfirming}
          >
            {isConfirming ? <LoadingSpinner /> : "Confirm Stake"}
          </Button>
        </div>
      </div>
    );
  }

  // Step 3: Success Screen
  return (
    <div className="max-w-md mx-auto bg-neutral-50">
      <Header title="Confirm Stake" onBack={goHome} />
      <div className="p-6 text-center space-y-6">
        <div className="space-y-4 py-2">
          <div className="rounded-full bg-white inline-flex p-2">
            <SuccessIcon className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              You're All Set!
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Your Stake Has Been Activated. Rewards
              <br />
              Will Start Generating Automatically.
            </p>
          </div>
        </div>
        <StakeDetails amount={amount} />
        <Button variants="primary" handleClick={goHome} fullWidth>
          Home
        </Button>
      </div>
    </div>
  );
};

export default EnterAmountPage;
