import { useState } from "react";
import Button from "../../common/ui/button";
import { SuccessIcon } from "../../assets/svg";
import type { EnterAmountPageProps } from "../../types/types";
import { useBalances, useStake, useVerifyPin } from "../../hooks";
import OtpInput from "../../common/auth/OtpInput";
import { toast } from "sonner";
import {
  Header,
  CurrencyInfo,
  AmountInput,
  RewardsPreview,
  StakeDetails,
} from "./components";

// Utility functions
const validateAmount = (
  amount: string,
  maxBalance: number
): { isValid: boolean; error: string } => {
  if (!amount || amount === "") return { isValid: false, error: "" };

  const numAmount = parseFloat(amount);
  if (isNaN(numAmount))
    return { isValid: false, error: "Please enter a valid number" };
  if (numAmount < 0)
    return {
      isValid: false,
      error: "Amount must be greater than or equal to 0",
    };
  if (numAmount > maxBalance)
    return {
      isValid: false,
      error: `Insufficient balance. Available: ${maxBalance.toFixed(2)}`,
    };

  return { isValid: true, error: "" };
};

// ---------- Main Component ----------
const EnterAmountPage = ({ pool, onBack }: EnterAmountPageProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [amount, setAmount] = useState("");
  const [isConfirming, setIsConfirming] = useState(false);
  const [pin, setPin] = useState<string | null>(null);

  const { data: balance } = useBalances();
  const { mutate: verifyPin } = useVerifyPin();
  const { mutateAsync: stake } = useStake();

  const availableBalance = Number(balance?.totalFiat ?? 0);
  const validation = validateAmount(amount, availableBalance);
  const isValidAmount = validation.isValid;

  const handleConfirmStake = async ({ pin }: { pin: string }) => {
    if (!pin || !isValidAmount) {
      toast.error("Please enter a valid amount and PIN");
      return;
    }

    setIsConfirming(true);

    verifyPin(
      { pin, scope: "crypto_stake" },
      {
        onSuccess: async (res) => {
          console.log("✅ Pin verified:", res);

          const payload = {
            strategyId: pool.id,
            amount: parseFloat(amount),
            pinToken: res.token,
          };

          try {
            const stakeRes = await stake(payload);
            console.log("✅ Stake successful:", stakeRes);
            setCurrentStep(3);
          } catch (error) {
            console.error("❌ Stake failed:", error);
            toast.error("Stake failed. Please try again.");
          } finally {
            setIsConfirming(false);
          }
        },
        onError: (err) => {
          console.error("❌ Invalid pin:", err);
          setIsConfirming(false);
          toast.error("Incorrect PIN. Please try again.");
        },
      }
    );
  };

  const goBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      onBack();
    }
  };

  const goHome = () => {
    setCurrentStep(1);
    setAmount("");
    setPin(null);
    onBack();
  };

  const handleAmountChange = (value: string) => {
    setAmount(value);
  };

  // ---------- Step 1: Enter Amount ----------
  if (currentStep === 1) {
    return (
      <div className="  max-w-md w-full mx-auto bg-white min-h-screen">
        <Header title="Enter Amount" onBack={goBack} />
        <div className="p-6 w-full">
          <CurrencyInfo pool={pool} />
          <AmountInput
            amount={amount}
            onChange={handleAmountChange}
            pool={pool}
          />

          <Button
            fullWidth
            variants="primary"
            disabled={!isValidAmount}
            handleClick={() => setCurrentStep(2)}
          >
            Confirm Stake
          </Button>
        </div>
      </div>
    );
  }

  // ---------- Step 2: Confirm Stake ----------
  if (currentStep === 2) {
    return (
      <div className="max-w-md mx-auto bg-white min-h-screen">
        <Header title="Confirm Stake" onBack={goBack} />
        <div className="p-6 space-y-4">
          <CurrencyInfo pool={pool} />
          <RewardsPreview amount={amount} pool={pool} />
          <OtpInput
            onComplete={(otp) => setPin(otp)}
            showCounter={false}
            otpLength={4}
          />

          <Button
            fullWidth
            variants="primary"
            handleClick={() => pin && handleConfirmStake({ pin })}
            disabled={isConfirming || !pin}
          >
            {isConfirming ? "Confirming..." : "Confirm Stake"}
          </Button>
        </div>
      </div>
    );
  }

  // ---------- Step 3 ----------
  return (
    <div className="  max-w-md w-full mx-auto bg-neutral-50 min-h-screen">
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
              Your Stake Has Been Activated.
              <br /> Rewards will start generating automatically.
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
