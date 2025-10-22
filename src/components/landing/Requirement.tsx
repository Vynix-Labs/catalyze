import bg from "../../assets/images/reqiure_bg.png";
import coins from "../../assets/images/coins.png";
import { useState } from "react";
import { motion } from "framer-motion";

function Requirement() {
  const [active, setActive] = useState(3);

  const steps = [
    {
      title: "Convert Instantly, Earn Automatically",
      description:
        "Move between crypto and cash in under a minute, earn DeFi yields — all without managing wallets or understanding blockchain.",
    },
    {
      title: "Invest Beyond Crypto",
      description:
        "Access stocks and tokenized real-world assets alongside your crypto holdings. Build a diversified portfolio from one unified platform.",
    },
    {
      title: "Grow Smarter with Every Step",
      description:
        "Track your portfolio, complete challenges, and unlock bite-sized lessons that turn curiosity into confidence — all while your money works for you.",
    },
  ];

  return (
    <section className="md:py-13 px-4 md:px-0">
      <div
        style={{ backgroundImage: `url(${bg})` }}
        className="md:max-w-7xl mx-auto bg-cover bg-center bg-no-repeat md:py-20 pt-10 border border-[#EEEEEE] rounded-lg space-y-14"
      >
        <div className="md:max-w-[35.5rem] mx-auto space-y-3 text-center">
          <h2 className="text-2xl md:text-5xl font-black text-black">
            Everything You Need — Nothing You Don't.
          </h2>
          <p className="text-xs md:text-base font-semibold text-gray-100">
            Crypto conversion, DeFi yields, learning tools, and real-world asset investing — all in one seamless platform designed for the way you live.
          </p>
        </div>

        <div className="flex justify-between flex-col space-y-4 md:flex-row md:max-w-6xl md:mx-auto">
          {/* Left side timeline */}
          <div className="flex md:  max-w-md w-full gap-6 py-4 relative">
            <div className="w-1 bg-[#D1D1D1B2] flex flex-col justify-between relative max-h-[31rem]">
              {steps.map((_, index) => (
                <div key={index} className="h-34 relative">
                  {index + 1 === active && (
                    <motion.div
                      layoutId="active-bar"
                      className="absolute top-0 left-0 w-full h-full bg-primary-100"
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Step content */}
            <div className="py-1 space-y-10 flex flex-col justify-between">
              {steps.map((step, index) => (
                <div
                  key={index}
                  onClick={() => setActive(index + 1)}
                  className={`cursor-pointer space-y-2`}
                >
                  <p className="text-xl md:text-2xl font-black text-black">
                    {step.title}
                  </p>
                  <p className="text-xs md:text-sm font-semibold text-gray-100">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right side image */}
          <div className="hidden md:block">
            <img src={coins} alt="coins" className="md:max-w-lg" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Requirement;
