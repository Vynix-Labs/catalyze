import type { AuthFooterProps } from "../../types/types";
import Button from "../ui/button";

const AuthFooter: React.FC<AuthFooterProps> = ({
  text,
  handleBtnClick,
  disabled = false,
}) => {
  return (
    <div className="flex-col flex items-center w-full">
      <Button
        text={text}
        handleClick={handleBtnClick}
        variants="primary"
        disabled={disabled}
      />
    </div>
  );
};

export default AuthFooter;
