// components/EmptyStates.tsx
import React from "react";
import { EmptyState } from "./emptyState";

// Transaction Icon
const TransactionIcon = () => (
  <svg
    className="w-8 h-8 text-gray-400"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
);

// Asset Icon
const AssetIcon = () => (
  <svg
    className="w-8 h-8 text-gray-400"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

interface NoTransactionsProps {
  onDepositClick: () => void;
}

export const NoTransactions: React.FC<NoTransactionsProps> = ({
  onDepositClick,
}) => (
  <EmptyState
    icon={<TransactionIcon />}
    title="No Transactions Yet"
    description="Your transaction history will appear here once you make your first transfer or deposit."
    actionButton={{
      label: "Make a Deposit",
      onClick: onDepositClick,
    }}
  />
);

export const NoAssets: React.FC = () => (
  <EmptyState
    icon={<AssetIcon />}
    title="No Assets Available"
    description="You don't have any assets yet. Make a deposit to get started."
  />
);


