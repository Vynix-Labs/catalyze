import Button from "../../common/ui/button";
import bg from "../../../public/images/cta_bg.png";
function CtaSection() {
  return (
    <section>
      <div
        style={{
          backgroundImage: `url(${bg})`,
        }}
        className="bg-cover bg-center bg-no-repeat rounded-2xl  py-19 max-w-7xl mx-auto flex items-center justify-center w-full flex-col gap-10"
      >
        <div className="space-y-3  text-center">
          <h2 className="text-7xl font-black text-white max-w-[29ch]">
            Ready to start your investment journey? Join the waitlist now!
          </h2>
          <p className="text-xl font-semibold leading-8 text-white max-w-[49ch] mx-auto">
            Be among the first to unlock easy, affordable investing — no
            experience needed.
          </p>
        </div>
        <div className="relative max-w-[35rem] w-full bg-white/40 rounded-full h-16 overflow-hidden ">
          <input
            type="email"
            placeholder="email address"
            className="w-full h-full px-11 py-5.5 outline-none border-0 text-base font-semibold text-white placeholder:capitalize placeholder:text-white"
          />
          <div className="absolute top-1/2 right-1.5 -translate-y-1/2">
            <Button
              variants="primary"
              classes="text-base !w-fit text-nowrap px-6 py-3 capitalize font-bold shadow-[inset_4px_4px_16px_#0647DF]"
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
