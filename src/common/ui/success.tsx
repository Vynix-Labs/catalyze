import type { ReactNode } from "react";
import { SuccessConfit } from "../../assets/svg";

interface Props {
  icon?: ReactNode;
  title: string;
  description: string;
}
function Success({ icon, title, description }: Props) {
  return (
    <div className="w-screen max-w-md h-screen flex items-center justify-center flex-col ">
      {icon ? icon : <SuccessConfit />}
      <div className="flex items-center justify-center flex-col gap-1">
        <h2 className="text-2xl font-bold text-black  capitalize">{title}</h2>
        <p className="text-sm font-semibold text-[#414141] max-w-[30ch]  text-center">
          {description}
        </p>
      </div>
    </div>
  );
}

export default Success;
