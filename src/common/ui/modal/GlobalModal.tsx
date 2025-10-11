import { type ReactNode, type Dispatch, type SetStateAction } from "react";
import AuthFooter from "../../auth/AuthFooter";
import { motion } from "framer-motion";
interface Props {
  onClose: () => void;
  children: ReactNode;
  open: boolean;
  onProceed?: () => void;
  setOpen: Dispatch<SetStateAction<boolean>>;
  handleOnBtnClick?: () => void;
  isProceedDisabled?: boolean;
  btnText: string;
  headingText?: string;
}

export default function GlobalModal({
  onClose,
  children,
  open,
  setOpen,
  handleOnBtnClick,
  btnText,
  onProceed,
  isProceedDisabled = false,
  headingText,
}: Props) {
  if (!open) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
      setOpen(false);
    }
  };

  // Use onProceed if provided, otherwise fall back to handleOnBtnClick
  const buttonClickHandler = onProceed || handleOnBtnClick;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 "
      onClick={handleBackdropClick}
    >
      <motion.div
        className="bg-white rounded-t-lg shadow-xl max-w-md flex items-baseline justify-baseline absolute bottom-0 py-6 px-4 w-full max-h-[90vh] overflow-auto flex-col gap-8.5"
        onClick={(e) => e.stopPropagation()}
        initial={{
          y: "10vh",
          opacity: 0,
        }}
        animate={{
          y: "0",
          opacity: 1,
        }}
        transition={{
          duration: 0.3,
          ease: "easeInOut",
        }}
        exit={{ y: "10vh", opacity: 0 }}
      >
        <div className="w-full">
          <p className="font-bold text-xl text-black">{headingText}</p>
          {children}
        </div>

        <AuthFooter
          text={btnText}
          handleBtnClick={buttonClickHandler}
          disabled={isProceedDisabled}
        />
      </motion.div>
    </div>
  );
}
