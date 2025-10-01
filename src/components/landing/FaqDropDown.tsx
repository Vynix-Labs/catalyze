import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { type ReactNode } from "react";

function Accordion({
  children,
  isOpen = false,
  title,
  handleOpen,
}: {
  children: ReactNode;
  isOpen: boolean;
  title: string;
  handleOpen: () => void;
}) {
  return (
    <AnimatePresence initial={isOpen} mode="wait">
      <div
        onClick={handleOpen}
        role="button"
        className={`px-6 bg-[#FAFAFA] rounded-sm py-8 `}
      >
        <div className="flex items-center justify-between gap-2  font-semibold  cursor-pointer">
          <div className="flex gap-11.5 items-center">
            <p
              className={`text-black font-bold text-xl leading-auto truncate `}
            >
              {title}
            </p>
          </div>
          <motion.span
            initial={{ rotate: 0 }}
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <ChevronDown />
          </motion.span>
        </div>
        <motion.div
          key="accordion-content"
          initial={{ opacity: 0, height: "0", visibility: "hidden" }}
          animate={
            isOpen
              ? { opacity: 1, height: "auto", visibility: "visible" }
              : { opacity: 0, height: "0", visibility: "hidden" }
          }
          exit="exit"
          custom={isOpen}
          transition={{ duration: 0.3, ease: "easeInOut", delay: 0.2 }}
        >
          {children}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
export default Accordion;
