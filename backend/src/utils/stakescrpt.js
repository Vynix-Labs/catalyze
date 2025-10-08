// scripts/evergreen.mjs
import { RpcProvider, Account, Contract, uint256, num } from 'starknet';
import erc20Abi from '../src/abi/erc20.abi.json';
import erc4626Abi from '../src/abi/erc4626.abi.json';
import masterAbi from '../src/abi/master.abi.json';

// Env
const {
  STARKNET_RPC_URL,
  STARKNET_ACCOUNT_ADDRESS,
  STARKNET_PRIVATE_KEY,

  ACTION,                 // "deposit" | "withdraw"
  MODE,                   // "erc4626" | "master"
  STRATEGY_ADDRESS,       // vault/strategy address (0x...)
  ASSET_ADDRESS,          // deposit asset (0x...); for MODE=master this is base token (e.g., STRK)
  AMOUNT,                 // e.g., "12.34"
  DECIMALS,               // e.g., "18" or "6"
  RECEIVER,               // optional, default: STARKNET_ACCOUNT_ADDRESS
  OWNER,                  // optional, default: STARKNET_ACCOUNT_ADDRESS

  // master-only
  MASTER_ADDRESS,         // optional override; defaults to repo’s constant
  MASTER_METHOD,          // "invest_auto_strk" | "invest_to_xstrk_auto" (required for MODE=master)
  // withdraw options for erc4626
  WITHDRAW_KIND,          // "redeem" | "withdraw" (default: "redeem")
  SHARES_DECIMALS,        // optional shares decimals (fallbacks to DECIMALS)
} = process.env;

function requireEnv(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env ${name}`);
  return v;
}

function parseUnits(value, decimals) {
  // Simple decimal -> bigint
  const [intPart, fracPartRaw = ''] = String(value).split('.');
  const frac = (fracPartRaw + '0'.repeat(decimals)).slice(0, decimals);
  const s = `${intPart}${frac}`.replace(/^0+/, '') || '0';
  return BigInt(s);
}

function toU256FromStr(str) {
  return uint256.bnToUint256(str);
}

function toU256(valueBN) {
  return toU256FromStr(valueBN.toString());
}

function hex(addr) {
  // Normalize to 0x hex
  return num.getHexString(num.getDecimalString((addr || '0').toString()));
}

async function main() {
  // Require basics
  requireEnv('STARKNET_RPC_URL');
  requireEnv('STARKNET_ACCOUNT_ADDRESS');
  requireEnv('STARKNET_PRIVATE_KEY');
  requireEnv('ACTION');
  requireEnv('MODE');
  requireEnv('STRATEGY_ADDRESS');
  requireEnv('AMOUNT');
  requireEnv('DECIMALS');

  const provider = new RpcProvider({ nodeUrl: STARKNET_RPC_URL });
  const account = new Account(provider, hex(STARKNET_ACCOUNT_ADDRESS), STARKNET_PRIVATE_KEY);

  const receiver = hex(RECEIVER || STARKNET_ACCOUNT_ADDRESS);
  const owner = hex(OWNER || STARKNET_ACCOUNT_ADDRESS);
  const strategyAddr = hex(STRATEGY_ADDRESS);

  const amount = parseUnits(AMOUNT, Number(DECIMALS));
  if (amount <= 0n) throw new Error('Amount must be > 0');

  if (MODE === 'erc4626') {
    if (!ASSET_ADDRESS) throw new Error('ASSET_ADDRESS is required for MODE=erc4626');
    const assetAddr = hex(ASSET_ADDRESS);
    const asset = new Contract(erc20Abi, assetAddr, provider);
    const vault = new Contract(erc4626Abi, strategyAddr, provider);

    if (ACTION === 'deposit') {
      const calls = [];

      // Approve vault to pull assets
      calls.push(
        asset.populate('approve', [strategyAddr, toU256(amount)])
      );
      // Deposit assets -> shares minted to receiver
      calls.push(
        vault.populate('deposit', [toU256(amount), receiver])
      );

      const tx = await account.execute(calls);
      console.log('Deposit tx hash:', tx.transaction_hash);
      const receipt = await provider.waitForTransaction(tx.transaction_hash);
      console.log('Deposit status:', receipt.execution_status || receipt.status);
      return;
    }

    if (ACTION === 'withdraw') {
      const kind = (WITHDRAW_KIND || 'redeem').toLowerCase();
      const sharesDecimals = Number(SHARES_DECIMALS || DECIMALS);

      if (kind === 'redeem') {
        // Interpret AMOUNT as shares to burn
        const shares = parseUnits(AMOUNT, sharesDecimals);
        const tx = await account.execute([
          vault.populate('redeem', [toU256(shares), receiver, owner]),
        ]);
        console.log('Redeem tx hash:', tx.transaction_hash);
        const receipt = await provider.waitForTransaction(tx.transaction_hash);
        console.log('Redeem status:', receipt.execution_status || receipt.status);
        return;
      }

      if (kind === 'withdraw') {
        // Interpret AMOUNT as asset amount to withdraw
        const assets = amount;
        const tx = await account.execute([
          vault.populate('withdraw', [toU256(assets), receiver, owner]),
        ]);
        console.log('Withdraw tx hash:', tx.transaction_hash);
        const receipt = await provider.waitForTransaction(tx.transaction_hash);
        console.log('Withdraw status:', receipt.execution_status || receipt.status);
        return;
      }

      throw new Error(`Invalid WITHDRAW_KIND: ${WITHDRAW_KIND}`);
    }

    throw new Error(`Invalid ACTION: ${ACTION}`);
  }

  if (MODE === 'master') {
    // Base-asset deposit routed via Master helper
    // You must provide: ASSET_ADDRESS, MASTER_METHOD
    requireEnv('ASSET_ADDRESS');
    requireEnv('MASTER_METHOD');

    const masterAddr = hex(MASTER_ADDRESS || '0x50314707690c31597849ed66a494fb4279dc060f8805f21593f52906846e28e'); // from src/constants.ts
    const assetAddr = hex(ASSET_ADDRESS);

    const asset = new Contract(erc20Abi, assetAddr, provider);
    const master = new Contract(masterAbi, masterAddr, provider);

    if (ACTION !== 'deposit') {
      throw new Error('MODE=master only supports ACTION=deposit. Use ERC4626 redeem/withdraw for exits.');
    }

    const method = MASTER_METHOD; // "invest_auto_strk" | "invest_to_xstrk_auto"
    if (!['invest_auto_strk', 'invest_to_xstrk_auto'].includes(method)) {
      throw new Error(`MASTER_METHOD must be one of invest_auto_strk | invest_to_xstrk_auto`);
    }

    const calls = [];
    // Approve Master to pull base asset
    calls.push(
      asset.populate('approve', [master.address, toU256(amount)])
    );
    // Master routes funds to the strategy and mints shares to receiver
    calls.push(
      master.populate(method, [strategyAddr, toU256(amount), receiver])
    );

    const tx = await account.execute(calls);
    console.log('Master deposit tx hash:', tx.transaction_hash);
    const receipt = await provider.waitForTransaction(tx.transaction_hash);
    console.log('Master deposit status:', receipt.execution_status || receipt.status);
    return;
  }

  throw new Error(`Invalid MODE: ${MODE}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});