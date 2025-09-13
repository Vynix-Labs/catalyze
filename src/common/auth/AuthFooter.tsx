import type { AuthFooterProps } from "../../types/types";
import Button from "../ui/button";

function AuthFooter({ text, handleBtnClick }: AuthFooterProps) {
  return (
    <div className="flex-col flex items-center w-full">
      <Button text={text} handleClick={handleBtnClick} variants="primary" />
    </div>
  );
}

export default AuthFooter;
