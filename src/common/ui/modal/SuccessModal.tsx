import { SuccessIcon } from "../../../assets/svg";

function SuccessModal() {
  return (
    <div className="space-y-4 flex items-center flex-col justify-center pt-10 pb-10">
      <div className="text-white">
        <SuccessIcon />
      </div>
      <div className=" flex flex-col gap-1 items-center justify-center">
        <p className="text-2xl font-bold leading-[100%] text-black capitalize -tracking-[2%]">
          Pin Set Successfully
        </p>
        <p className="text-sm font-medium text-center leading-5.5 tracking-[0%] text-gray-100 max-w-[32ch]">
          Your transaction pin has been set successfully
        </p>
      </div>
    </div>
  );
}

export default SuccessModal;
