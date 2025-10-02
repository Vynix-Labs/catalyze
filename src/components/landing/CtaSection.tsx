import Button from "../../common/ui/button";
import bg from "../../assets/images/cta_bg.png";
function CtaSection() {
  return (
    <section className="px-4">
      <div
        style={{
          backgroundImage: `url(${bg})`,
        }}
        className="bg-cover bg-center bg-no-repeat rounded-2xl px-2 md:py-19 py-8 md:max-w-7xl mx-auto flex items-center justify-center w-full flex-col gap-10"
      >
        <div className="space-y-4 text-center">
          <h2 className="text-2xl md:text-4xl lg:text-7xl font-black text-white md:max-w-[29ch]">
            Ready to start your investment journey? Join the waitlist now!
          </h2>

          <p className="text-sm md:text-xl font-semibold md:leading-8 text-white md:max-w-[49ch] mx-auto">
            Be among the first to unlock easy, affordable investing — no
            experience needed.
          </p>
        </div>
        <div className="relative max-w-[35rem] w-full bg-white/40 rounded-full md:h-16 h-10 overflow-hidden ">
          <input
            type="email"
            placeholder="email address"
            className="w-full h-full md:px-11 md:py-5.5 pl-2  outline-none border-0 text-xs md:text-base font-semibold text-white placeholder:capitalize placeholder:text-white"
          />
          <div className="absolute top-1/2 md:right-1.5 right-0 -translate-y-1/2">
            <Button
              variants="primary" fullWidth
              classes="text-xs md:text-base !w-fit text-nowrap md:px-6 md:py-3 capitalize font-bold shadow-[inset_4px_4px_16px_#0647DF]"
            >
              join waitlist today!
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CtaSection;
