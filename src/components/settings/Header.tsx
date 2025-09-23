import { ChevronLeft } from "lucide-react";

function Header({ title }: { title: string }) {
  const handleBack = () => {
    window.history.back();
  };
  return (
    <div className="flex gap-4 justify-between py-4 px-5 items-center">
      <button
        onClick={handleBack}
        className="border rounded-full size-9 flex items-center justify-center border-[#DEDDDD] "
      >
        <ChevronLeft className="size-6" />
      </button>
      <h1 className="text-base font-bold text-black-100">{title}</h1>
      <div className="size-9"></div>
    </div>
  );
}

export default Header;
