import { type ReactNode, type Dispatch, type SetStateAction } from "react";
import AuthFooter from "../../auth/AuthFooter";

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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white rounded-t-lg shadow-xl max-w-[420px] w-full absolute bottom-0 flex flex-col py-6 px-4 space-y-4 max-h-[25rem]"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="font-bold text-xl text-black mb-4">{headingText}</p>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto no-scrollbar pr-2 min-h-0">
          {children}
        </div>

        <AuthFooter
          text={btnText}
          handleBtnClick={buttonClickHandler}
          disabled={isProceedDisabled}
        />
      </div>
    </div>
  );
}
