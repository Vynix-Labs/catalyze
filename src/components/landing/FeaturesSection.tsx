import { Check } from "lucide-react";
import iphone_top from "../../assets/images/iphone 15.png";
import iphone_bottom from "../../assets/images/iphone_bottom.png";
import Button from "../../common/ui/button";

function FeaturesSection() {

  const scrollToWaitlist = () => {
    const element = document.getElementById("waitlist-cta");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <section id="features" className="lg:py-30 pb-14 space-y-20 px-4 lg:px-6 bg-[#FEFEFE]">
      <div className="lg:max-w-6xl flex flex-col lg:flex-row gap-6 md:gap-16 justify-between mx-auto items-center">
        <div className="bg-white/50 pt-15 lg:px-11 w-fit">
          <img
            src={iphone_top}
            alt="illustration of the Catalyze app on mobile"
            className="md:max-w-[26rem]"
          />
        </div>

        <div className="bg-transparent space-y-10 flex flex-col pt-6 justify-between">
          <div className="space-y-6">
            <div className="space-y-3">
              <h3 className="text-xl lg:text-4xl lg:leading-[44px] text-center lg:text-start font-black tracking-[-3%]">
                Seamless Crypto-Fiat Conversion
              </h3>
              <p className="text-xs lg:text-base font-semibold text-gray-100 lg:leading-[30px]">
                Moving money between crypto and traditional currency shouldn't take hours or cost a fortune. With Catalyze, you get instant conversions with transparent fees — no complexity, no waiting.
              </p>
            </div>

            <ul className="space-y-6 text-xs lg:text-base">
              <li className="flex items-center gap-2">
                <span className="lg:size-6 p-1 size-4 rounded-full flex items-center justify-center bg-primary-100">
                  <Check className="text-white" size={20} />
                </span>
                Convert crypto to local currency in under 1 minute
              </li>
              <li className="flex items-center gap-2">
                <span className="lg:size-6 p-1 size-4 rounded-full flex items-center justify-center bg-primary-100">
                  <Check className="text-white" size={20} />
                </span>
                Simple 1% fee structure with no hidden charges
              </li>
              <li className="flex items-center gap-2">
                <span className="lg:size-6 p-1 size-4 rounded-full flex items-center justify-center bg-primary-100">
                  <Check className="text-white" size={20} />
                </span>
                Support for USDC, USDT, STRK, and more
              </li>
            </ul>
          </div>

          <div>
            <Button
              variants="primary"
              fullWidth
              classes="text-sm lg:text-base md:!w-fit text-nowrap px-6 py-3 font-bold shadow-[inset_4px_4px_16px_#0647DF]"
              handleClick={scrollToWaitlist}
            >
              Join waitlist
            </Button>
          </div>
        </div>
      </div>

      <div className="lg:max-w-6xl flex lg:flex-row-reverse flex-col gap-6 lg:gap-16 justify-between mx-auto items-center">
        <div className="bg-white lg:px-11 w-fit ">
          <img
            src={iphone_bottom}
            alt="illustration of the Catalyze app on mobile"
            className="md:max-w-[26rem]"
          />
        </div>

        <div className="bg-transparent space-y-10 flex flex-col pt-6  justify-between">
          <div className="space-y-6">
            <div className="space-y-3">
              <h3 className="text-xl lg:text-4xl lg:leading-[44px] text-center lg:text-start font-black tracking-[-3%]">
                DeFi Yields Without the Complexity
              </h3>
              <p className="text-xs lg:text-base font-semibold text-gray-100 lg:leading-[30px]">
                Earning DeFi yields shouldn't require a computer science degree. Deposit your fiat, and we automatically put it to work in audited DeFi protocols — you earn while we handle the technical details.
              </p>
            </div>

            <ul className="space-y-6 text-xs lg:text-base">
              <li className="flex items-center gap-2">
                <span className="lg:size-6 p-1 size-4 rounded-full flex items-center justify-center bg-primary-100">
                  <Check className="text-white" size={20} />
                </span>
                Earn yields on your fiat holdings automatically
              </li>
              <li className="flex items-center gap-2">
                <span className="lg:size-6 p-1 size-4 rounded-full flex items-center justify-center bg-primary-100">
                  <Check className="text-white" size={20} />
                </span>
                No wallets, seed phrases, or gas fees to manage
              </li>
              <li className="flex items-center gap-2">
                <span className="lg:size-6 p-1 size-4 rounded-full flex items-center justify-center bg-primary-100">
                  <Check className="text-white" size={20} />
                </span>
                Powered by audited DeFi protocols you can trust
              </li>
            </ul>
          </div>

          <div>
            <Button
              variants="primary"
              fullWidth
              classes="text-sm lg:text-base md:!w-fit text-nowrap px-6 py-3 font-bold shadow-[inset_4px_4px_16px_#0647DF]"
              handleClick={scrollToWaitlist}
            >
              Join waitlist
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;
