import { Contract, Provider, uint256 } from "starknet";
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

type U256Like = { low: string | bigint; high: string | bigint } | [string | bigint, string | bigint] | string | bigint | number;

export async function getAllowanceU256(
  owner: string,
  spender: string,
  currency: CryptoCurrency
): Promise<bigint> {
  const contract = new Contract(erc20Abi, TOKEN_MAP[currency], provider);
  const allowanceFn = contract.functions?.allowance;
  const res: U256Like = await (
    typeof allowanceFn === "function"
      ? allowanceFn(owner, spender)
      : contract.call("allowance", [owner, spender])
  );
  if (res && typeof res === "object" && !Array.isArray(res) && "low" in res && "high" in res) {
    const obj = res as { low: string | bigint; high: string | bigint };
    return uint256.uint256ToBN({ low: BigInt(obj.low), high: BigInt(obj.high) });
  }
  if (Array.isArray(res) && res.length >= 2) {
    const arr = res as [string | bigint, string | bigint];
    return uint256.uint256ToBN({ low: BigInt(arr[0]), high: BigInt(arr[1]) });
  }
  if (typeof res === "string" || typeof res === "number" || typeof res === "bigint") {
    return BigInt(res);
  }
  throw new Error("Unexpected allowance result shape");
}

export async function waitForAllowance(
  owner: string,
  spender: string,
  required: bigint,
  currency: CryptoCurrency,
  timeoutMs = 60000,
  intervalMs = 2000
): Promise<void> {
  const start = Date.now();
  for (;;) {
    const current = await getAllowanceU256(owner, spender, currency);
    if (current >= required) return;
    if (Date.now() - start > timeoutMs) throw new Error("Allowance not updated in time");
    await new Promise((r) => setTimeout(r, intervalMs));
  }
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
