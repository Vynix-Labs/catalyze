import { AlertCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Button from "../../common/ui/button";
import DepositModal from "../../common/ui/modal/DepositModal";
import GlobalModal from "../../common/ui/modal/GlobalModal";
import { useInitiateDeposit, useTokenRate, useTradingFees, useBalances } from "../../hooks";
import type { AmountEntryStepProps } from "../../types/types";
import type { fiatResponse } from "../../utils/types";
import { currencyIcons, getNetworkName } from "../../utils";
import Tabs from "../Tabs";
import { CryptoDeposit } from "./CryptoDeposit";
import { CryptoTransfer } from "./CryptoTransfer";
import { FiatDeposit } from "./FiatDeposit";
import { FiatTransfer } from "./FiatTransfer";

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
  const iconPath = currencyIcons[currencyType.toUpperCase() as keyof typeof currencyIcons];

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

const AmountEntryStep: React.FC<AmountEntryStepProps> = ({
  amount,
  amountNGN,
  setAmountNGN,
  setAmount,
  onNext,
  flowType = "transfer",
  currencyMode = "fiat",
  onCurrencyModeChange,
  currencyType = "USDC",
  // selectedAsset,
}) => {
  const [cryptoAmount, setCryptoAmount] = useState("");
  const [fiatAmount, setFiatAmount] = useState(amount || "");
  const [fiatAmountNGN, setFiatAmountNGN] = useState(amountNGN || "");
  const [address, setAddress] = useState("");
  const [selectedNetwork, setSelectedNetwork] = useState("starknet");
  const [isSwapped, setIsSwapped] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [depositDetails, setDepositDetails] = useState<fiatResponse | null>(null);
  // const [rates, setRates] = useState<RatePrices | null>(null);
  // const [isRateLoading, setIsRateLoading] = useState(false);
  // const [rateError, setRateError] = useState<string | null>(null);
  const {
    data: rates,
    isLoading: isRateLoading,
    error: rateError,
  } = useTokenRate(currencyType);
  const {
    data: fees,
    isLoading: isFeeLoading,
    error: feeError,
  } = useTradingFees();
  const { mutate: initiateDeposit, isPending: isInitiateDepositPending } =
    useInitiateDeposit();
  const { data: balances } = useBalances();

  // Use currencyMode directly instead of deriving from transferType
  const [activeTab, setActiveTab] = useState<"fiat" | "crypto">(currencyMode);
  // Sync activeTab with currencyMode changes
  useEffect(() => {
    setActiveTab(currencyMode);
  }, [currencyMode]);

  useEffect(() => {
    if (activeTab === "fiat") {
      setAmount?.(fiatAmount);
      setAmountNGN(fiatAmountNGN);
    } else {
      setAmount?.(cryptoAmount);
    }
  }, [
    activeTab,
    fiatAmount,
    fiatAmountNGN,
    cryptoAmount,
    setAmount,
    setAmountNGN,
  ]);

  // Enforce Starknet for crypto deposit (no network selector)
  useEffect(() => {
    if (flowType === "deposit" && activeTab === "crypto" && selectedNetwork !== "starknet") {
      setSelectedNetwork("starknet");
    }
  }, [flowType, activeTab, selectedNetwork]);

  const quoteType = useMemo<"base" | "buy" | "sell">(() => {
    if (activeTab !== "fiat") return "base";
    if (flowType === "deposit") return "buy";
    if (flowType === "transfer") return "sell";
    return "base";
  }, [activeTab, flowType]);

  const currentRate = useMemo(() => {
    if (!rates) return 0;
    switch (quoteType) {
      case "buy":
        return rates.buy;
      case "sell":
        return rates.sell;
      default:
        return rates.base;
    }
  }, [rates, quoteType]);

  const adjustedRate = useMemo(() => {
    const buyFee = fees?.buy ?? 0; // decimal fraction e.g., 0.01
    const sellFee = fees?.sell ?? 0;
    if (!currentRate) return 0;
    switch (quoteType) {
      case "buy":
        return currentRate * (1 + buyFee);
      case "sell":
        return currentRate * (1 - sellFee);
      default:
        return currentRate;
    }
  }, [currentRate, fees, quoteType]);

  const baseRate = useMemo(() => rates?.base ?? 0, [rates]);

  // Derive available balance for the selected token
  const availableTokenBalance = useMemo(() => {
    const symbol = currencyType?.toUpperCase();
    const match = balances?.items?.find(
      (b) => b.tokenSymbol?.toUpperCase() === symbol
    );
    return match ? parseFloat(match.balance || "0") : 0;
  }, [balances, currencyType]);

  const handleFiatUSDCChange = (value: string) => {
    setFiatAmount(value);
    const usdcAmount = parseFloat(value) || 0;
    if (!adjustedRate) {
      setFiatAmountNGN("");
      return;
    }
    const ngnEquivalent = (usdcAmount * adjustedRate).toFixed(2);
    setFiatAmountNGN(ngnEquivalent);
  };

  const handleFiatNGNChange = (value: string) => {
    setFiatAmountNGN(value);
    const ngnAmount = parseFloat(value) || 0;
    if (!adjustedRate) {
      setFiatAmount("");
      return;
    }
    const usdcEquivalent = (ngnAmount / adjustedRate).toFixed(6);
    setFiatAmount(usdcEquivalent);
  };

  const handleCryptoAmountChange = (value: string) => {
    setCryptoAmount(value);
  };

  const handleSwap = () => {
    const tempUSDC = fiatAmount;
    const tempNGN = fiatAmountNGN;
    setFiatAmount(tempNGN);
    setFiatAmountNGN(tempUSDC);
    setIsSwapped(!isSwapped);
  };

  const handleTabChange = (tabKey: string) => {
    const newCurrencyMode = tabKey === "crypto" ? "crypto" : "fiat";
    setActiveTab(newCurrencyMode);
    onCurrencyModeChange(newCurrencyMode);
  };

  const getCurrentAmount = () => {
    return activeTab === "fiat" ? fiatAmount : cryptoAmount;
  };

  const getCurrentAmountNGN = () => {
    return activeTab === "fiat" ? fiatAmountNGN : "";
  };

  const handleProceedClick = () => {
    if (flowType === "deposit" && activeTab === "crypto") {
      return;
    }

    switch (activeTab) {
      case "crypto": {
        if (!cryptoAmount || !address || !selectedNetwork) {
          alert("Please fill in all crypto transfer details");
          return;
        }
        setIsModalOpen(true);
        break;
      }
      case "fiat":
      default: {
        switch (flowType) {
          case "deposit": {
            if (!fiatAmount || !fiatAmountNGN) {
              alert("Please enter both amount values");
              return;
            }
            setDepositDetails(null);
            setIsDepositModalOpen(true);
            initiateDeposit(
              {
                amountFiat: parseFloat(fiatAmountNGN),
                tokenSymbol: currencyType.toUpperCase(),
              },
              {
                onSuccess: (response) => {
                  setDepositDetails(response);
                },
                onError: (error) => {
                  setIsDepositModalOpen(false);
                  alert(error.message || "Unable to initiate deposit");
                },
              }
            );
            break;
          }
          case "transfer":
          default: {
            if (!fiatAmount || !fiatAmountNGN) {
              alert("Please enter both USDC and NGN amounts");
              return;
            }
            onNext();
            break;
          }
        }
        break;
      }
    }
  };

  const handleModalProceed = () => {
    setIsModalOpen(false);
    onNext();
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const closeDepositModal = () => {
    setIsDepositModalOpen(false);
    setDepositDetails(null);
  };

  const handleDepositConfirm = () => {
    closeDepositModal();
    onNext();
  };

  return (
    <div className="flex-1 flex flex-col bg-white h-screen w-full  overflow-hidden relative">
      <Tabs
        className="max-w-44 m-2"
        tabs={[
          { key: "fiat", label: "Fiat" },
          { key: "crypto", label: "Cryptocurrency" },
        ]}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      {activeTab === "fiat" ? (
        flowType === "deposit" ? (
          <FiatDeposit
            availableAmount={fiatAmountNGN}
            amount={fiatAmount}
            amountNGN={fiatAmountNGN}
            currencyType={currencyType}
            onAmountChange={handleFiatUSDCChange}
            onAmountNGNChange={handleFiatNGNChange}
            onSwap={handleSwap}
            isSwapped={isSwapped}
            rate={adjustedRate}
            isRateLoading={isRateLoading || isFeeLoading}
            rateError={rateError?.message || feeError?.message}
          />
        ) : (
          <FiatTransfer
            availableAmount={availableTokenBalance.toFixed(6)}
            amount={fiatAmount}
            amountNGN={fiatAmountNGN}
            currencyType={currencyType}
            onAmountChange={handleFiatUSDCChange}
            onAmountNGNChange={handleFiatNGNChange}
            onSwap={handleSwap}
            isSwapped={isSwapped}
            rate={adjustedRate}
            isRateLoading={isRateLoading || isFeeLoading}
            rateError={rateError?.message || feeError?.message}
          />
        )
      ) : flowType === "deposit" ? (
        <CryptoDeposit
          selectedNetwork={selectedNetwork}
          currencyType={currencyType}
          onNetworkChange={setSelectedNetwork}
          cryptoAmount={cryptoAmount}
          address={address}
          onCryptoAmountChange={handleCryptoAmountChange}
          onAddressChange={setAddress}
        />
      ) : (
        <CryptoTransfer
          cryptoAmount={cryptoAmount}
          address={address}
          selectedNetwork={selectedNetwork}
          currencyType={currencyType}
          onCryptoAmountChange={handleCryptoAmountChange}
          onAddressChange={setAddress}
          onNetworkChange={setSelectedNetwork}
          balance={availableTokenBalance.toFixed(6)}
        />
      )}

      {activeTab === "fiat" && (
        <div className="flex items-start flex-col space-x-2 text-sm text-secondary-100 bg-secondary-200 space-y-2 rounded-lg mx-4 p-3">
          <div className="text-sm flex gap-2 items-center">
            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <span className="font-medium">Info</span>
          </div>
          <div className="">
            Estimated amount of naira with our current rate will be transferred
            to beneficiary
          </div>
          <div className="">
            {flowType === "deposit"
              ? `Fee applied: ${((fees?.buy ?? 0) * 100).toFixed(2)}% (included in rate)`
              : `Fee applied: ${((fees?.sell ?? 0) * 100).toFixed(2)}% (included in rate)`}
          </div>
        </div>
      )}

      <div className="w-full bottom-0 mx-auto flex justify-center p-4 absolute">
        <Button
          variants="primary"
          handleClick={handleProceedClick}
          text={
            flowType === "deposit" && activeTab === "crypto"
              ? "Done"
              : "Proceed"
          }
          disabled={
            flowType === "deposit" && activeTab === "crypto"
              ? !selectedNetwork
              : activeTab === "fiat"
              ? !fiatAmount || !fiatAmountNGN ||
                (flowType === "deposit" && isInitiateDepositPending)
              : !cryptoAmount || !address || !selectedNetwork
          }
        />
      </div>

      {/* Crypto Confirmation Modal - ONLY for crypto transfers, NOT deposits */}
      {activeTab === "crypto" && flowType !== "deposit" && (
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
                {cryptoAmount || "0"}
              </h2>
              <p className="text-sm text-gray-500">
                ≈₦
                {((parseFloat(cryptoAmount) || 0) * baseRate).toLocaleString()}
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

      {/* Deposit Modal */}
      {flowType === "deposit" && (
        <DepositModal
          isOpen={isDepositModalOpen}
          onClose={closeDepositModal}
          onConfirm={handleDepositConfirm}
          amount={getCurrentAmount()}
          amountNGN={getCurrentAmountNGN()}
          currencyType={currencyType}
          depositData={depositDetails}
          isLoading={isInitiateDepositPending}
        />
      )}
    </div>
  );
};

export default AmountEntryStep;
