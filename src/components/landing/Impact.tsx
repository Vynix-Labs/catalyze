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
      title: "Invest From As Low As $1",
      description:
        "No big capital? No problem. Catalyze lets you start investing with pocket change — grow your wealth, one micro-investment at a time.",
    },
    {
      icon: <PaidIcon />,
      title: "Crypto Made Simple",
      description:
        "Say goodbye to confusing wallets and technical jargon. We make crypto and digital asset investing as easy as topping up your phone.",
    },
    {
      title: "Built for Emerging Markets",
      description:
        "Designed to work seamlessly on low-end smartphones, even with limited internet. Because accessibility should never be a barrier to opportunity.",
      icon: <FestivalIcon />,
    },
    {
      icon: <LandScaleIcon />,
      title: "Invest From As Low As $1",
      description:
        "No big capital? No problem. Catalyze lets you start investing with pocket change — grow your wealth, one micro-investment at a time.",
    },
    {
      icon: <BeenHereIcon />,
      title: "Crypto Made Simple",
      description:
        "Say goodbye to confusing wallets and technical jargon. We make crypto and digital asset investing as easy as topping up your phone.",
    },
  ];
  return (
    <section className="py-20 space-y-14">
      <div className="max-w-[39rem] mx-auto space-y-3">
        <h2 className="text-5xl font-black text-black text-center">
          Why Catalyze? Real Benefits. Real Impact.
        </h2>
        <p className="text-base font-semibold text-gray-100">
          reimagining how people in emerging markets access crypto, grow wealth,
          and build financial confidence — starting with small steps that lead
          to big changes.
        </p>
      </div>
      <div className="space-y-2">
        <div className="flex w-full max-w-7xl gap-2 mx-auto">
          {ourImpacts.slice(0, 3).map((impact) => (
            <ImpactCard {...impact} key={impact.title} />
          ))}
        </div>
        <div className="flex w-full max-w-7xl gap-2 mx-auto">
          {ourImpacts.slice(3, 5).map((impact) => (
            <ImpactCard {...impact} key={impact.title} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Impact;
