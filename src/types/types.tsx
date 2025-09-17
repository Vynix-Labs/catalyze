import type { ReactNode } from "react";

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
  amount: string;
  setAmount: React.Dispatch<React.SetStateAction<string>>;
  transferType: string;
  onTransferTypeChange: (type: string) => void;
  onNext: () => void;
  onBack: () => void;
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
  onNext: () => void;
  onBack: () => void;
}

export interface PinEntryStepProps {
  pin: string;
  setPin: React.Dispatch<React.SetStateAction<string>>;
  transferType: string;
  onNext: () => void;
  onBack: () => void;
}

export interface SuccessStepProps {
  onDone: () => void;
  transferType: string;
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
}
