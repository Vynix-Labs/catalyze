import { uint256, type Call, type Uint256 } from "starknet";


export function toU256(v: bigint): Uint256 {
  return uint256.bnToUint256(v);
}

export function parseUnits(amount: number, decimals: number): bigint {
  // Avoid floats by using string where possible; here we accept number input from validated API
  const factor = 10 ** Math.max(0, decimals);
  return BigInt(Math.floor(amount * factor));
}

export function buildApprove(tokenAddr: string, spender: string, amountWei: bigint): Call {
  const u = toU256(amountWei);
  return {
    contractAddress: tokenAddr,
    entrypoint: "approve",
    calldata: [spender, u.low, u.high],
  } as Call;
}

export function buildErc4626DepositCalls(params: {
  vault: string;
  tokenAddr: string;
  receiver: string;
  amountWei: bigint;
}): Call[] {
  const { vault, tokenAddr, receiver, amountWei } = params;
  const u = toU256(amountWei);
  const approve = buildApprove(tokenAddr, vault, amountWei);
  const deposit: Call = {
    contractAddress: vault,
    entrypoint: "deposit",
    calldata: [u.low, u.high, receiver],
  };
  return [approve, deposit];
}

export function buildErc4626WithdrawCalls(params: {
  vault: string;
  receiver: string;
  owner: string;
  amountWei: bigint;
}): Call[] {
  const { vault, receiver, owner, amountWei } = params;
  const u = toU256(amountWei);
  const withdraw: Call = {
    contractAddress: vault,
    entrypoint: "withdraw",
    calldata: [u.low, u.high, receiver, owner],
  };
  return [withdraw];
}
