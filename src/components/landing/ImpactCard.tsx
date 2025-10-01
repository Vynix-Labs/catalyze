import type { ReactNode } from "react";

interface ImpactCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}
function ImpactCard({ title, icon, description }: ImpactCardProps) {
  return (
    <div className="border border-[#EEEEEE] bg-[#FAFAFA] rounded-sm pr-6 py-6.5  pl-5.5 flex-1">
      <div className="space-y-6">
        <div className="rounded-sm bg-primary-100/8 size-8.5 flex items-center justify-center">
          {icon}
        </div>
        <div className="space-y-2">
          <p className="text-xl md:text-2xl font-bold text-black leading-[-3%]">{title}</p>
          <p className="text-xs md:text-sm text-gray-100 font-semibold tracking-[-2%] ">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ImpactCard;
