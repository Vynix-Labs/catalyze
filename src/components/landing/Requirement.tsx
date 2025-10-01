import bg from "../../../public/images/reqiure_bg.png";
import coins from "../../../public/images/coins.png";
import { useState } from "react";
import { motion } from "framer-motion";

function Requirement() {
  const [active, setActive] = useState(3);

  const steps = [
    {
      title: "Start Small, Grow Steady",
      description:
        "Invest from as little as $1. Whether you're a student or just starting out, Catalyze helps you build wealth on your own terms.",
    },
    {
      title: "Learn as You Invest",
      description:
        "Get built-in education resources that explain crypto and investing in simple language, so you grow your knowledge while growing wealth.",
    },
    {
      title: "Tools for the Future",
      description:
        "From portfolio tracking to goal-based saving, we give you everything you need to take control of your financial journey.",
    },
  ];

  return (
    <section className="py-13">
      <div
        style={{ backgroundImage: `url(${bg})` }}
        className="max-w-7xl  mx-auto bg-cover bg-center bg-no-repeat py-20 border border-[#EEEEEE] rounded-lg space-y-14"
      >
        <div className="max-w-[35.5rem] mx-auto space-y-3 text-center">
          <h2 className="text-5xl font-black text-black">
            Everything You Need to Start Investing — Simplified.
          </h2>
          <p className="text-base font-semibold text-gray-100">
            From micro-investments to built-in education and portfolio tools,
            Catalyze brings powerful financial features to your fingertips — no
            experience required.
          </p>
        </div>

        <div className="flex justify-between max-w-6xl mx-auto">
          {/* Left side timeline */}
          <div className="flex max-w-md gap-6 py-4 relative">
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
                  <p className="text-2xl font-black text-black">{step.title}</p>
                  <p className="text-sm font-semibold text-gray-100">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right side image */}
          <div>
            <img src={coins} alt="coins" className="max-w-lg" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Requirement;
