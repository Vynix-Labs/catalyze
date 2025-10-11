import { randomUUID } from "crypto";
export type AppErrorCode =
  | "INSUFFICIENT_ONCHAIN_BALANCE"
  | "TOKEN_NOT_SUPPORTED"
  | "NETWORK_MISMATCH"
  | "PAYMASTER_REJECTED"
  | "ALLOWANCE_REQUIRED"
  | "RATE_LIMITED"
  | "TEMPORARY_FAILURE"
  | "INTERNAL_ERROR";

export type NormalizedError = {
  code: AppErrorCode;
  message: string;
  hint?: string;
  errorId: string;
  retryable?: boolean;
};


export function normalizeOnchainError(err: unknown): NormalizedError {
  const raw = String(
    (err as any)?.message ?? (err as any)?.revertError ?? err ?? ""
  ).toLowerCase();

  const errorId = randomUUID();

  // Known Starknet wallet patterns
  if (raw.includes("u256_sub overflow") || raw.includes("insufficient balance")) {
    return {
      code: "INSUFFICIENT_ONCHAIN_BALANCE",
      message: "You don’t have enough tokens in your wallet to complete this transfer.",
      hint: "Top up your USDT or try a smaller amount.",
      errorId,
      retryable: false,
    };
  }

  if (raw.includes("argent/multicall-failed")) {
    return {
      code: "TEMPORARY_FAILURE",
      message: "The wallet call failed while bundling actions.",
      hint: "Retry with a smaller amount or wait a moment and try again.",
      errorId,
      retryable: true,
    };
  }

  if (raw.includes("paymaster") || raw.includes("execution failed due to contract error")) {
    return {
      code: "PAYMASTER_REJECTED",
      message: "The transaction was rejected by the paymaster.",
      hint: "Make sure you’re signed in and on the correct network, then try again.",
      errorId,
      retryable: true,
    };
  }

  if (raw.includes("entrypoint_failed")) {
    return {
      code: "NETWORK_MISMATCH",
      message: "This token or contract isn’t available on the current network.",
      hint: "Switch to the right network and try again.",
      errorId,
      retryable: false,
    };
  }

  if (raw.includes("allowance") || raw.includes("approve")) {
    return {
      code: "ALLOWANCE_REQUIRED",
      message: "Approval is required before transferring this token.",
      hint: "Please approve the token first, then retry the transfer.",
      errorId,
      retryable: true,
    };
  }

  // Fallback
  return {
    code: "INTERNAL_ERROR",
    message: "We couldn’t complete your transaction.",
    hint: "Try again shortly. If it persists, contact support with the error ID.",
    errorId,
    retryable: true,
  };
}
