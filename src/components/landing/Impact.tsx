import {
  BeenHereIcon,
  FestivalIcon,
  LandScaleIcon,
  MoneyBagIcon,
  PaidIcon,
} from "../../assets/svg";
import ImpactCard from "./ImpactCard";

function Impact() {
  const ourImpacts = [
    {
      icon: <MoneyBagIcon />,
      title: "Cash In, Cash Out — Instantly",
      description:
        "Convert between crypto and local currency in under a minute. Fast, affordable, and transparent — with simple 1% fees and no hidden charges.",
    },
    {
      icon: <PaidIcon />,
      title: "Your Savings, Supercharged",
      description:
        "Earn DeFi-native yields on your fiat holdings without touching a wallet. Your money works harder while you focus on what matters.",
    },
    {
      title: "No Seed Phrases. No Stress.",
      description:
        "Sign up with email, skip the gas fees, and get started in seconds. We handle the blockchain complexity so you don’t have to.",
      icon: <FestivalIcon />,
    },
    {
      icon: <LandScaleIcon />,
      title: "Learn While You Earn",
      description:
        "Access bite-sized lessons on crypto, DeFi, and investing — delivered as you go. Build knowledge while building wealth.",
    },
    {
      icon: <BeenHereIcon />,
      title: "Real Assets, Digital Access",
      description:
        "Invest in stocks and tokenized real-world assets alongside your crypto portfolio. Diversification made simple.",
    },
  ];
  return (
    <section className="md:py-20 pb-20 md:pb-0 space-y-14 px-4 lg:px-0">
      <div className="md:max-w-[39rem] mx-auto space-y-3">
        <h2 className="text-2xl md:text-5xl font-black text-black text-center">
          Your Bridge Between Two Financial Worlds
        </h2>
        <p className="text-xs text-center md:text-start md:text-base font-semibold text-gray-100">
          Seamlessly move between traditional finance and DeFi. Earn yields, convert currencies, and invest in the future — all without the complexity.
        </p>
      </div>
      <div className="space-y-4">
        <div className="flex w-full flex-col md:flex-row md:max-w-7xl gap-4 mx-auto">
          {ourImpacts.slice(0, 3).map((impact) => (
            <ImpactCard {...impact} key={impact.title} />
          ))}
        </div>
        <div className="flex w-full flex-col md:flex-row md:max-w-7xl gap-4 mx-auto">
          {ourImpacts.slice(3, 5).map((impact) => (
            <ImpactCard {...impact} key={impact.title} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Impact;
