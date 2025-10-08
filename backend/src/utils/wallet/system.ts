import { Account, Provider, type Call } from "starknet";
import env from "../../config/env";
import { TOKEN_MAP, type CryptoCurrency } from "../../config";
import { getTokenDecimals } from "./tokens";
import { balance as onChainBalance } from "./tokens";

const rpcUrl = env.STARKNET_RPC_URL || "https://starknet-mainnet.public.blastapi.io";
const provider = new Provider({ nodeUrl: rpcUrl });

function toUint256(value: bigint): { low: string; high: string } {
  const mask = (1n << 128n) - 1n;
  const low = value & mask;
  const high = value >> 128n;
  return { low: `0x${low.toString(16)}`, high: `0x${high.toString(16)}` };
}

function getSystemAccount(): Account {
  return new Account(provider, env.SYSTEM_WALLET_ADDRESS, env.SYSTEM_WALLET_KEY);
}

export async function getSystemTokenBalance(token: CryptoCurrency): Promise<number> {
  return onChainBalance(env.SYSTEM_WALLET_ADDRESS, token);
}

export async function transferFromSystem(
  token: CryptoCurrency,
  toAddress: string,
  amountHuman: number
): Promise<{ transactionHash: string }> {
  const decimals = await getTokenDecimals(token);
  const units = BigInt(Math.floor(amountHuman * 10 ** decimals));
  const amount = toUint256(units);

  const call: Call = {
    contractAddress: TOKEN_MAP[token],
    entrypoint: "transfer",
    calldata: [toAddress, amount.low, amount.high],
  };

  const account = getSystemAccount();
  const { transaction_hash } = await account.execute(call);
  return { transactionHash: transaction_hash };
}
