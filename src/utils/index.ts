export const currencyIcons = {
  USDT: "/images/usdt.png",
  USDC: "/images/usdc.png",
  STRK: "/images/strk.png",
  UNKNOWN: "/images/default-currency.png",
};

export const getNetworkName = (network: string) => {
  const networks = {
    bep20: "BEP-20",
    erc20: "ERC-20",
    spl: "SPL",
    polygon: "Polygon",
  };
  return networks[network as keyof typeof networks] || network;
};
