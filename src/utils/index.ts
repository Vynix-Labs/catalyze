import strkIcon from "../assets/images/strk.png";
import usdcIcon from "../assets/images/usdc.png";
import usdtIcon from "../assets/images/usdt.png";

export const currencyIcons = {
  USDT: usdtIcon,
  USDC: usdcIcon,
  STRK: strkIcon,
  UNKNOWN: usdtIcon, // fallback to usdt icon
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


 // Helper function to get dynamic greeting based on time

  export const getGreeting = (): string => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };