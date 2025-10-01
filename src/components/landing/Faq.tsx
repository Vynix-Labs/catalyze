import { useState } from "react";
import Button from "../../common/ui/button";
import { faqData } from "../../data/faq";
import Accordion from "./FaqDropDown";

function Faq() {
  const [activeAccordion, setActiveAccordion] = useState<number | null>(1);
  return (
    <section className="pt-30 pb-25">
      <div className="max-w-6xl mx-auto flex  gap-14.5">
        <div className="max-w-[35rem] space-y-16 not-[]:">
          <div className="space-y-3">
            <h3 className="text-5xl text-black font-bold tracking-[-3%] leading-auto capitalize">
              frequently asked questions
            </h3>
            <p className="text-base font-semibold text-gray-100">
              Got questions? We’ve got answers — everything you need to know
              about getting started with Catalyze.
            </p>
          </div>
          <Button
            variants="primary"
            classes="text-base !w-fit text-nowrap px-6 py-3 font-bold shadow-[inset_4px_4px_16px_#0647DF]"
          >
            Join waitlist
          </Button>
        </div>
        <div className="flex-1 space-y-4">
          {faqData.map((faq, index) => (
            <Accordion
              title={faq.title}
              key={index}
              isOpen={activeAccordion === index}
              handleOpen={() => {
                setActiveAccordion(activeAccordion === index ? null : index);
              }}
            >
              <p className="pt-3 text-gray-100 font-semibold text-base">
                {faq.description}
              </p>
            </Accordion>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Faq;
