import type { ReactNode } from "react";
import type { Transaction } from "../components/Transactions";
export interface CurrencyDetailPageProps {
  currencyType?: string;
  balance?: string;
  nairaValue?: string;
  transactions?: Transaction[];
  onBack?: () => void;
}
export interface buttonProps {
  variants: "primary" | "secondary";
  classes?: string;
  children?: ReactNode;
  text?: string;
  handleClick?: () => void;
  disabled?: boolean; // <-- add type here
}

export interface AuthHeaderProps {
  title: string;
  description: string;
  link?: {
    url: string;
    text: string;
  };
  isLink: boolean;
}

// Types
export interface HeaderProps {
  title: string;
  onBack: () => void;
  showBackButton?: boolean;
}

export interface AmountEntryStepProps {
  amount?: string;
  amountNGN?: string;
  setAmountNGN: (amount: string) => void;
  setAmount?: (amount: string) => void;
  onNext: () => void;
  flowType: "deposit" | "transfer";
  onFlowTypeChange?: (type: "deposit" | "transfer") => void;
  currencyMode: "crypto" | "fiat";
  onCurrencyModeChange: (mode: "crypto" | "fiat") => void;
  currencyType?: string;
  selectedAsset?: string;
}

export interface BaseComponentProps {
  amount: string;
  amountNGN: string;
  currencyType: string;
  onAmountChange: (amount: string) => void;
  onAmountNGNChange: (amount: string) => void;
}

export interface CryptoComponentProps {
  cryptoAmount: string;
  address: string;
  selectedNetwork: string;
  currencyType: string;
  onCryptoAmountChange: (amount: string) => void;
  onAddressChange: (address: string) => void;
  onNetworkChange: (network: string) => void;
}

export interface CurrencyTabProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}
export interface BankSelectionStepProps {
  selectedBank: string;
  setSelectedBank: React.Dispatch<React.SetStateAction<string>>;
  accountNumber: string;
  setAccountNumber: React.Dispatch<React.SetStateAction<string>>;
  username: string;
  onNext?: () => void;
  onBack?: () => void;
  transferType?: string;
  currencyType: string;
  amount: string;
  amountNGN: string;
}

export interface PinEntryStepProps {
  flowType: "deposit" | "transfer";
  currencyMode: "crypto" | "fiat";
  pin: string;
  setPin: React.Dispatch<React.SetStateAction<string>>;
  onNext: () => void;
  onBack?: () => void;
  currencyType: string;
  amount?: string;
  amountNGN?: string;
}

export interface SuccessStepProps {
  flowType: "deposit" | "transfer";
  currencyMode: "crypto" | "fiat";
  onDone: () => void;
  amount?: string;
  amountNGN?: string;
  currencyType?: string;
}

export interface NumberPadProps {
  onNumberPress: (num: string) => void;
  onProceed: () => void;
  canProceed: boolean;
  onClear: () => void;
  showClear: boolean;
}

export interface CryptoTransferFlowProps {
  amount: string;
  setAmount: React.Dispatch<React.SetStateAction<string>>;
  onNext: () => void;
  onBack: () => void;
}

export interface AuthFooterProps {
  text: string;
  handleBtnClick?: () => void;
  disabled?: boolean; // Add this line
}
