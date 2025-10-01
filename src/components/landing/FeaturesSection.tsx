import { Check } from "lucide-react";
import iphone_top from "../../assets/images/iphone 15.png";
import iphone_bottom from "../../assets/images/iphone_bottom.png";
import Button from "../../common/ui/button";
function FeaturesSection() {
  return (
    <section className="md:py-30 py-14 space-y-20 px-4 md:px-0 bg-[#FEFEFE]">
      <div className="md:max-w-6xl flex flex-col md:flex-row gap-6 md:gap-16 justify-between mx-auto">
        <div className="bg-white pt-15 md:px-11 w-fit border border-[#EEEEEE]">
          <img
            src={iphone_top}
            alt="illustration of the Catalyze app on mobile"
            className="md:max-w-[26rem]"
          />
        </div>

        <div className="bg-transparent space-y-10 flex flex-col pt-6  justify-between">
          <div className="space-y-6">
            <div className="space-y-3">
              <h3 className="text-xl md:text-4xl md:leading-[44px] text-center md:text-start font-black tracking-[-3%]">
                Investment Opportunities for the General Population
              </h3>
              <p className="text-xs md:text-base font-semibold text-gray-100 md:leading-[30px]">
                For many people — especially in emerging markets — investing
                feels like an exclusive club. Traditional platforms require
                large sums of money, are packed with confusing financial jargon,
                and are built for those who already understand the game.
              </p>
            </div>

            <ul className="space-y-6 text-xs md:text-base">
              <li className="flex items-center gap-2">
                <span className="md:size-6 p-1 size-4 rounded-full flex items-center justify-center bg-primary-100">
                  <Check className="text-white" size={20} />
                </span>
                High entry barriers keep first-time investors out.
              </li>
              <li className="flex items-center gap-2">
                <span className="md:size-6 p-1 size-4 rounded-full flex items-center justify-center bg-primary-100">
                  <Check className="text-white" size={20} />
                </span>
                Complex platforms intimidate rather than invite.{" "}
              </li>
              <li className="flex items-center gap-2">
                <span className="md:size-6 p-1 size-4 rounded-full flex items-center justify-center bg-primary-100">
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
                classes="text-sm md:text-base md:!w-fit text-nowrap px-6 py-3 font-bold shadow-[inset_4px_4px_16px_#0647DF]"
              >
                Join waitlist
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="md:max-w-6xl flex md:flex-row-reverse flex-col gap-6 md:gap-16 justify-between mx-auto">
        <div className="bg-white  md:px-11 w-fit ">
          <img
            src={iphone_bottom}
            alt="illustration of the Catalyze app on mobile"
            className="md:max-w-[26rem]"
          />
        </div>


        <div className="bg-transparent space-y-10 flex flex-col pt-6  justify-between">
          <div className="space-y-6">
            <div className="space-y-3">
              <h3 className="text-xl md:text-4xl md:leading-[44px] text-center md:text-start font-black tracking-[-3%]">
                Limited Availability of Financial Tools and Educational
                Resources{" "}
              </h3>
              <p className="text-xs md:text-base font-semibold text-gray-100 md:leading-[30px]">
                in underserved communities, access to trustworthy financial
                knowledge is scarce or non-existent. People are eager to learn,
                but the right tools aren’t available — and most educational
                content is too complex, too foreign, or too inaccessible.
              </p>
            </div>

            <ul className="space-y-6 text-xs md:text-base">
              <li className="flex items-center gap-2">
                <span className="md:size-6 p-1 size-4 rounded-full flex items-center justify-center bg-primary-100">
                  <Check className="text-white" size={20} />
                </span>
                Little or no guidance on how to begin investing.
              </li>
              <li className="flex items-center gap-2">
                <span className="md:size-6 p-1 size-4 rounded-full flex items-center justify-center bg-primary-100">
                  <Check className="text-white" size={20} />
                </span>
                Overly technical content that doesn’t match users’ literacy or
                language levels.
              </li>
              <li className="flex items-center gap-2">
                <span className="md:size-6 p-1 size-4 rounded-full flex items-center justify-center bg-primary-100">
                  <Check className="text-white" size={20} />
                </span>
                No tools designed for low-end devices or unstable internet.
              </li>
            </ul>
          </div>
          <div>
            <div>
              <Button
                variants="primary"
                classes="text-sm md:text-base md:!w-fit text-nowrap px-6 py-3 font-bold shadow-[inset_4px_4px_16px_#0647DF]"
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
