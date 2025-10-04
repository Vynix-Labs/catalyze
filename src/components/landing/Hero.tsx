import bg from "../../../public/images/landing_hero_bg.png";
import iphone from "../../../public/images/iphone 15.png";
import solana from "../../../public/images/solana.png";
import tether from "../../../public/images/tether.png";
import bitcoin from "../../../public/images/bitcoin.png";
import ethereum from "../../../public/images/ethereum.png";
import Button from "../../common/ui/button";
import { motion } from "framer-motion";
function Hero() {
  return (
    <section
      className="bg-cover bg-center bg-no-repeat pt-46 space-y-14 min-h-svh sm:min-h-screen "
      style={{
        backgroundImage: `url(${bg})`,
      }}
    >
      <div className="max-w-3xl mx-auto flex flex-col gap-8 items-center justify-center">
        <div className="flex flex-col gap-4 items-center justify-center">
          <h1 className="text-8xl font-black text-center text-black tracking-[-3%] leading-auto">
            <span className="bg-primary-100/10 border border-primary-100 pr-2 pl-4">
              Catalyze
            </span>{" "}
            – Invest Smarter, Starting Small
          </h1>
          <p>Empowering you Through Micro-Investments in Digital Assets</p>
        </div>
        <Button
          variants="primary"
          classes="text-base text-nowrap px-6 !w-fit py-3 font-bold shadow-[inset_4px_4px_16px_#0647DF]"
        >
          Join waitlist Today!
        </Button>
      </div>
      <div className="relative">
        <motion.img
          src={solana}
          alt="solana"
          className="max-w-[350px] absolute left-1/2 -translate-x-1/2"
          initial={{
            x: 0,
            opacity: 0,
          }}
          animate={{
            x: -370,
            opacity: 1,
          }}
          transition={{
            delay: 0.4,
            duration: 0.5,
            ease: "easeInOut",
          }}
        />
        <motion.img
          src={bitcoin}
          alt="solana"
          className="max-w-[350px] absolute left-1/2 -translate-x-1/2"
          initial={{
            x: 0,
            opacity: 0,
          }}
          animate={{
            x: 370,
            opacity: 1,
          }}
          transition={{
            delay: 0.9,
            duration: 0.5,
            ease: "easeInOut",
          }}
        />
        <motion.img
          initial={{
            y: 20,
            opacity: 0.2,
          }}
          animate={{
            y: 0,
            opacity: 1,
          }}
          transition={{
            duration: 0.5,
            ease: "easeInOut",
          }}
          src={iphone}
          alt=""
          className="max-w-sm mx-auto relative z-30"
        />
        <motion.img
          src={tether}
          alt="solana"
          className="max-w-[350px] absolute left-1/2 -translate-x-1/2 bottom-20"
          initial={{
            x: 0,
            opacity: 0,
          }}
          animate={{
            x: -370,
            opacity: 1,
          }}
          transition={{
            delay: 0.6,
            duration: 0.5,
            ease: "easeInOut",
          }}
        />
        <motion.img
          src={ethereum}
          alt="solana"
          className="max-w-[350px] absolute left-1/2 -translate-x-1/2 bottom-20"
          initial={{
            x: 0,
            opacity: 0,
          }}
          animate={{
            x: 370,
            opacity: 1,
          }}
          transition={{
            delay: 0.11,
            duration: 0.5,
            ease: "easeInOut",
          }}
        />
      </div>
    </section>
  );
}

export default Hero;
