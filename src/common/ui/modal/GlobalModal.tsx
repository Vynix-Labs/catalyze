import { type ReactNode, type Dispatch, type SetStateAction } from "react";
import AuthFooter from "../../auth/AuthFooter";

interface Props {
  onClose: () => void;
  children: ReactNode;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  handleOnBtnClick?: () => void;
  btnText: string;
  headingText: string;
}
export default function GlobalModal({
  onClose,
  children,
  open,
  setOpen,
  handleOnBtnClick,
  btnText,
  headingText,
}: Props) {
  if (!open) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
      setOpen(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 "
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white rounded-t-lg shadow-xl max-w-md flex items-baseline justify-baseline absolute bottom-0 py-6 px-4 w-full max-h-[90vh] overflow-auto  flex-col gap-8.5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full">
          <p className="font-bold text-2xl text-black">{headingText}</p>
          {children}
        </div>
        <AuthFooter text={btnText} handleBtnClick={handleOnBtnClick} />
      </div>
    </div>
  );
}
