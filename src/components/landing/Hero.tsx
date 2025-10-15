import bg from "../../assets/images/landing_hero_bg.png";
import iphone from "../../assets/images/iphone 15.png";
import solana from "../../assets/images/solana.png";
import tether from "../../assets/images/tether.png";
import bitcoin from "../../assets/images/bitcoin.png";
import ethereum from "../../assets/images/ethereum.png";
import Button from "../../common/ui/button";
import { motion } from "framer-motion";
import { useWaitlist } from "../../hooks/useWaitlist";

function Hero() {
  const { email, setEmail, isLoading, showInput, setShowInput, handleJoinWaitlist } = useWaitlist();

  return (
    <section
      className="bg-cover bg-center bg-no-repeat pt-32 px-4 md:px-0 md:pt-46 space-y-14 min-h-svh sm:min-h-screen "
      style={{
        backgroundImage: `url(${bg})`,
      }}
    >
      <div className="md:max-w-3xl mx-auto flex flex-col gap-8 items-center justify-center">
        <div className="flex flex-col gap-4 items-center justify-center">
          <h1 className="text-2xl md:text-6xl lg:text-8xl font-black text-center text-black tracking-[-3%] leading-auto">
            <span className="bg-primary-100/10 border border-primary-100 pr-2 pl-4">
              Catalyze
            </span>{" "}
            – Invest Smarter, Starting Small
          </h1>
          <p className="text-sm text-center md:text-base">
            Empowering you Through Micro-Investments in Digital Assets
          </p>
        </div>
        {!showInput ? (
          <Button
            variants="primary"
            classes="text-base text-nowrap px-6 !w-fit py-3 font-bold shadow-[inset_4px_4px_16px_#0647DF]"
            handleClick={() => setShowInput(true)}
          >
            Join waitlist Today!
          </Button>
        ) : (
          <div className="flex gap-2 items-center w-full max-w-md">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-full border border-gray-300 outline-none focus:border-primary-100"
              onKeyPress={(e) => e.key === "Enter" && handleJoinWaitlist()}
            />
            <Button
              variants="primary"
              classes="text-base text-nowrap px-6 !w-fit py-3 font-bold shadow-[inset_4px_4px_16px_#0647DF]"
              handleClick={handleJoinWaitlist}
              disabled={isLoading}
            >
              {isLoading ? "Joining..." : "Join"}
            </Button>
          </div>
        )}
      </div>

      <div className="relative">
        <motion.img
          src={solana}
          alt="solana"
          className="md:max-w-[280px]  xl:max-w-[350px] absolute lg:block hidden left-1/2 -translate-x-1/2"
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
          className="md:max-w-[280px]  xl:max-w-[350px] absolute lg:block hidden left-1/2 -translate-x-1/2"
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
          className="md:max-w-sm mx-auto h-[25rem] relative z-30"
        />
        <motion.img
          src={tether}
          alt="solana"
          className="md:max-w-[280px]  xl:max-w-[350px] absolute lg:block hidden left-1/2 -translate-x-1/2 bottom-20"
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
          className="md:max-w-[280px]  xl:max-w-[350px] absolute lg:block hidden left-1/2 -translate-x-1/2 bottom-20"
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
