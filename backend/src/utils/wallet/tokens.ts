import { Contract, Provider } from "starknet";
import env from "../../config/env";
import erc20Abi from "./erc20-abi";
import { TOKEN_MAP, type CryptoCurrency } from "../../config";

// Starknet provider
const rpcUrl =
  env.STARKNET_RPC_URL || "https://starknet-mainnet.public.blastapi.io";
const provider = new Provider({ nodeUrl: rpcUrl });

export const TOKEN_DECIMALS: Record<CryptoCurrency, number> = {
  usdt: 6,
  usdc: 6,
  strk: 18,
  weth: 18,
  wbtc: 8,
};

/**
 * Get token decimals for a specific currency
 */
export async function getTokenDecimals(currency: CryptoCurrency): Promise<number> {
  return TOKEN_DECIMALS[currency]
}



/**
 * Convert human-readable amount to token units (multiply by 10^decimals)
 */
export async function toTokenUnits(
  amount: number,
  currency: CryptoCurrency,
  decimals?: number
): Promise<bigint> {
  const tokenDecimals = decimals ?? (await getTokenDecimals(currency));
  return BigInt(Math.floor(amount * 10 ** tokenDecimals));
}

/**
 * Convert token units to human-readable amount (divide by 10^decimals)
 */
export async function fromTokenUnits(
  amount: bigint | string,
  currency: CryptoCurrency,
  decimals?: number
): Promise<number> {
  const tokenDecimals = decimals ?? (await getTokenDecimals(currency));
  const bigIntAmount = typeof amount === "string" ? BigInt(amount) : amount;
  return Number(bigIntAmount) / 10 ** tokenDecimals;
}

/**
 * Validate if user has sufficient balance for a transaction
 */
export async function validateSufficientBalance(
  walletAddress: string,
  amount: number,
  currency: CryptoCurrency
): Promise<{ isValid: boolean; currentBalance: number; message: string }> {
  try {
    const contract = new Contract(erc20Abi, TOKEN_MAP[currency], provider);
    const balanceFn = contract.functions?.balanceOf;
    const decimalsFn = contract.functions?.decimals;

    const [rawBalance, decimals] = await Promise.all([
      typeof balanceFn === "function"
        ? balanceFn(walletAddress)
        : contract.call("balanceOf", [walletAddress]),
      typeof decimalsFn === "function"
        ? decimalsFn()
        : contract.call("decimals"),
    ]);

    const currentBalance = await fromTokenUnits(
      rawBalance,
      currency,
      Number(decimals)
    );

    if (currentBalance < amount) {
      return {
        isValid: false,
        currentBalance,
        message: `Insufficient balance. Current: ${currentBalance} ${currency.toUpperCase()}, Required: ${amount} ${currency.toUpperCase()}`,
      };
    }

    return {
      isValid: true,
      currentBalance,
      message: "Sufficient balance available",
    };
  } catch (error) {
    console.error(`Error validating balance for ${currency}:`, error);
    return {
      isValid: false,
      currentBalance: 0,
      message: "Error checking balance",
    };
  }
}

/**
 * Get normalized balance for display purposes
 */
export async function getNormalizedBalance(
  walletAddress: string,
  currency: CryptoCurrency
): Promise<{ balance: number; decimals: number; rawBalance: string } | null> {
  try {
    const contract = new Contract(erc20Abi, TOKEN_MAP[currency], provider);
    const balanceFn = contract.functions?.balanceOf;
    const decimalsFn = contract.functions?.decimals;

    const [rawBalance, decimals] = await Promise.all([
      typeof balanceFn === "function"
        ? balanceFn(walletAddress)
        : contract.call("balanceOf", [walletAddress]),
      typeof decimalsFn === "function"
        ? decimalsFn()
        : contract.call("decimals"),
    ]);

    const normalizedBalance = await fromTokenUnits(
      rawBalance,
      currency,
      Number(decimals)
    );

    return {
      balance: normalizedBalance,
      decimals: Number(decimals),
      rawBalance: rawBalance.toString(),
    };
  } catch (error) {
    console.error(`Error getting normalized balance for ${currency}:`, error);
    return null;
  }
}

/**
 * Validate transaction amount (must be positive and have reasonable decimal places)
 */
export function validateTransactionAmount(
  amount: number,
  currency: CryptoCurrency
): { isValid: boolean; message: string } {
  if (amount <= 0) {
    return {
      isValid: false,
      message: "Amount must be greater than 0",
    };
  }

  const maxDecimals: Record<CryptoCurrency, number> = {
    usdt: 6,
    usdc: 6,
    strk: 8,
    weth: 8,
    wbtc: 6,
  };

  const decimalPlaces = (amount.toString().split(".")[1] || "").length;
  if (decimalPlaces > maxDecimals[currency]) {
    return {
      isValid: false,
      message: `Too many decimal places. Maximum ${maxDecimals[currency]} for ${currency.toUpperCase()}`,
    };
  }

  return { isValid: true, message: "Valid amount" };
}

/**
 * Lightweight balance fetcher
 */
export async function balance(address: string, token: CryptoCurrency) {
  const contract = new Contract(erc20Abi, TOKEN_MAP[token], provider);
  const balanceFn = contract.functions?.balanceOf;
  const decimalsFn = contract.functions?.decimals;

  const [rawBalance, decimals] = await Promise.all([
    typeof balanceFn === "function"
      ? balanceFn(address)
      : contract.call("balanceOf", [address]),
    typeof decimalsFn === "function"
      ? decimalsFn()
      : contract.call("decimals"),
  ]);

  return fromTokenUnits(rawBalance, token, Number(decimals));
}
