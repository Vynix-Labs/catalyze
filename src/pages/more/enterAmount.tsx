import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import Button from "../../common/ui/button";
import { SuccessIcon } from "../../assets/svg";

interface EnterAmountPageProps {
  pool: {
    id: number;
    name: string;
    fullName: string;
    apy: number;
    lockPeriod: string;
  };
  onBack: () => void;
}

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

const CurrencyInfo = ({ pool }: { pool: EnterAmountPageProps["pool"] }) => {
  const currencyIcons = {
    USDT: "/images/usdt.png",
    USDC: "/images/usdc.png",
    STRK: "/images/strk.png",
    UNKNOWN: "/images/default-currency.png",
  };

  const CurrencyIcon = ({ currencyType }: { currencyType: string }) => {
    const iconPath = currencyIcons[currencyType as keyof typeof currencyIcons];

    return (
      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
        {iconPath ? (
          <img
            src={iconPath}
            alt={`${currencyType} logo`}
            className="w-8 h-8 object-contain"
          />
        ) : (
          <span className="text-white font-bold text-sm">$</span>
        )}
      </div>
    );
  };

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-3">
        <CurrencyIcon currencyType={pool.name} />
        <div>
          <h2 className="font-semibold text-lg">{pool.name}</h2>
          <p className="text-sm text-gray-500">{pool.fullName}</p>
        </div>
      </div>
      <div className="text-right">
        <span className="text-green-500 font-black text-sm">
          {pool.apy}% APY
        </span>
      </div>
    </div>
  );
};

const AmountInput = ({
  amount,
  onChange,
  pool,
}: {
  amount: string;
  onChange: (value: string) => void;
  pool: EnterAmountPageProps["pool"];
}) => {
  const AVAILABLE_BALANCE = 5000;
  const MIN_STAKE = 1;

  const handleAmountChange = (value: string) => {
    const numValue = parseFloat(value);
    if (
      value === "" ||
      (numValue >= MIN_STAKE && numValue <= AVAILABLE_BALANCE)
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
        min={MIN_STAKE}
        max={AVAILABLE_BALANCE}
        step="0.01"
      />
      <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
        <span>
          Min: {MIN_STAKE} {pool.name}
        </span>
        <span>Max: 100% of your balance</span>
      </div>
    </div>
  );
};

const RewardsPreview = ({
  amount,
  pool,
}: {
  amount: string;
  pool: EnterAmountPageProps["pool"];
}) => {
  const calculateMonthlyRewards = (stakeAmount: string) => {
    if (!stakeAmount) return "0.00";
    return ((parseFloat(stakeAmount) * pool.apy) / 100 / 12).toFixed(2);
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

// const LoadingSpinner = () => (
//   <div className="flex items-center flex-row-reverse justify-center space-x-4">
//     <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//     <span className="pr-2">Confirming...</span>
//   </div>
// );

const StakeDetails = ({
  amount,
  pool,
}: {
  amount: string;
  pool: EnterAmountPageProps["pool"];
}) => (
  <div className="bg-white rounded-lg p-6 text-left">
    <h3 className="font-semibold text-lg">Stake Details</h3>
    <div className="space-y-4 mt-4">
      {[
        { label: "Staked", value: `${amount} ${pool.name}` },
        {
          label: "APY",
          value: `${pool.apy}%`,
          className: "text-green-500",
        },
        { label: "Lock Period", value: pool.lockPeriod },
        { label: "Next Reward", value: "24 hrs" },
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
const EnterAmountPage = ({ pool, onBack }: EnterAmountPageProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [amount, setAmount] = useState("");
  const [isConfirming, setIsConfirming] = useState(false);

  const MIN_STAKE = 1;

  const handleConfirmStake = () => {
    setIsConfirming(true);
    setTimeout(() => {
      setCurrentStep(3);
      setIsConfirming(false);
    }, 2000);
  };

  const goBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      onBack(); // Go back to pools list when on first step
    }
  };

  const goHome = () => {
    setCurrentStep(1);
    setAmount("");
    onBack(); // Return to pools list
  };

  // Step 1: Enter Amount
  if (currentStep === 1) {
    return (
      <div className="max-w-md mx-auto bg-white min-h-screen">
        <Header title="Enter Amount" onBack={goBack} />
        <div className="p-6 w-full">
          <CurrencyInfo pool={pool} />
          <AmountInput amount={amount} onChange={setAmount} pool={pool} />
          <Button
            fullWidth
            variants="primary"
            handleClick={() => setCurrentStep(2)}
            disabled={!amount || parseFloat(amount) < MIN_STAKE}
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
          <CurrencyInfo pool={pool} />
          <AmountInput amount={amount} onChange={setAmount} pool={pool} />
          <RewardsPreview amount={amount} pool={pool} />
          <Button
            fullWidth
            variants="primary"
            handleClick={handleConfirmStake}
            disabled={isConfirming}
          >
            "Confirm Stake"
          </Button>
        </div>
      </div>
    );
  }

  // Step 3: Success Screen
  return (
    <div className="max-w-md mx-auto bg-neutral-50 min-h-screen">
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
        <StakeDetails amount={amount} pool={pool} />
        <Button variants="primary" handleClick={goHome} fullWidth>
          Home
        </Button>
      </div>
    </div>
  );
};

export default EnterAmountPage;
