import { Check } from "lucide-react";
import iphone_top from "../../assets/images/iphone 15.png";
import iphone_bottom from "../../assets/images/iphone_bottom.png";
import Button from "../../common/ui/button";
function FeaturesSection() {
  return (
    <section className="py-30 space-y-20 bg-[#FEFEFE]">
      <div className="max-w-6xl flex gap-16 justify-between mx-auto">
        <div className="bg-white pt-15 px-11 w-fit border border-[#EEEEEE]">
          <img
            src={iphone_top}
            alt="illustration of the Catalyze app on mobile"
            className="max-w-[26rem]"
          />
        </div>
        <div className="bg-transparent space-y-10 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="space-y-3">
              <h3 className="text-4xl leading-[44px] font-black tracking-[-3%]">
                Investment Opportunities for the General Population
              </h3>
              <p className="text-base font-semibold text-gray-100 leading-[30px]">
                For many people — especially in emerging markets — investing
                feels like an exclusive club. Traditional platforms require
                large sums of money, are packed with confusing financial jargon,
                and are built for those who already understand the game.
              </p>
            </div>
            <ul className="space-y-6">
              <li className="flex items-center gap-3">
                <span className="size-6 rounded-full flex items-center justify-center bg-primary-100">
                  <Check className="text-white" size={20} />
                </span>
                High entry barriers keep first-time investors out.
              </li>
              <li className="flex items-center gap-3">
                <span className="size-6 rounded-full flex items-center justify-center bg-primary-100">
                  <Check className="text-white" size={20} />
                </span>
                Complex platforms intimidate rather than invite.{" "}
              </li>
              <li className="flex items-center gap-3">
                <span className="size-6 rounded-full flex items-center justify-center bg-primary-100">
                  <Check className="text-white" size={20} />
                </span>
                Minimum deposit requirements are often higher than people can
                afford.{" "}
              </li>
            </ul>
          </div>
          <div>
            <div>
              <Button
                variants="primary"
                classes="text-base !w-fit text-nowrap px-6 py-3 font-bold shadow-[inset_4px_4px_16px_#0647DF]"
              >
                Join waitlist
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-6xl flex flex-row-reverse gap-16 justify-between mx-auto">
        <div className="bg-white pt-15 px-11 w-fit border border-[#EEEEEE]">
          <img
            src={iphone_bottom}
            alt="illustration of the Catalyze app on mobile"
            className="max-w-[26rem]"
          />
        </div>
        <div className="bg-transparent space-y-10 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="space-y-3">
              <h3 className="text-4xl leading-[44px] font-black tracking-[-3%]">
                Investment Opportunities for the General Population
              </h3>
              <p className="text-base font-semibold text-gray-100 leading-[30px]">
                For many people — especially in emerging markets — investing
                feels like an exclusive club. Traditional platforms require
                large sums of money, are packed with confusing financial jargon,
                and are built for those who already understand the game.
              </p>
            </div>
            <ul className="space-y-6">
              <li className="flex items-center gap-3">
                <span className="size-6 rounded-full flex items-center justify-center bg-primary-100">
                  <Check className="text-white" size={20} />
                </span>
                High entry barriers keep first-time investors out.
              </li>
              <li className="flex items-center gap-3">
                <span className="size-6 rounded-full flex items-center justify-center bg-primary-100">
                  <Check className="text-white" size={20} />
                </span>
                Complex platforms intimidate rather than invite.{" "}
              </li>
              <li className="flex items-center gap-3">
                <span className="size-6 rounded-full flex items-center justify-center bg-primary-100">
                  <Check className="text-white" size={20} />
                </span>
                Minimum deposit requirements are often higher than people can
                afford.{" "}
              </li>
            </ul>
          </div>
          <div>
            <div>
              <Button
                variants="primary"
                classes="text-base !w-fit text-nowrap px-6 py-3 font-bold shadow-[inset_4px_4px_16px_#0647DF]"
              >
                Join waitlist
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;
