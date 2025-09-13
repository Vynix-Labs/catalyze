import type { ReactNode } from "react";

export interface buttonProps {
  variants: "primary" | "secondary"; // add more if need and button ;
  classes?: string;
  children?: ReactNode;
  text?: string;
  handleClick?: () => void;
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
  onNext: () => void;
  onBack: () => void;
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
  onNext: () => void;
  onBack: () => void;
}

export interface SuccessStepProps {
  onDone: () => void;
}

export interface NumberPadProps {
  onNumberPress: (num: string) => void;
  onProceed: () => void;
  canProceed: boolean;
  onClear: () => void;
  showClear: boolean;
}
