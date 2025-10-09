import { LogoIcon } from "../assets/svg";

function EmptyState() {
  return (
    <div className="flex flex-col w-full  h-full m-auto items-center justify-center">
      <LogoIcon className="w-10 h-10" color="#868686" />
      <p className="text-xs font-medium text-[#868686]">No Records found</p>
    </div>
  );
}

export default EmptyState;
