import { EyeDropCloseIcon } from "../../../assets/svg";

function TransactionPinForm() {
  return (
    <div>
      <form className="space-y-6">
        <div className="w-full">
          <label htmlFor="pin">Pin</label>
          <div className="relative form-control">
            <input
              type="text"
              inputMode="numeric"
              name="pin"
              id="pin"
              placeholder="Create pin"
            />
            <div className=" absolute top-1/2 -translate-y-1/2 right-5">
              <EyeDropCloseIcon />
            </div>
          </div>
        </div>
        <div className="w-full">
          <label htmlFor="confirm-pin">Confirm pin</label>
          <div className="relative form-control">
            <input
              type="text"
              inputMode="numeric"
              name="confirm-pin"
              id="confirm-pin"
              placeholder="Re-enter pin"
            />
            <div className=" absolute top-1/2 -translate-y-1/2 right-5">
              <EyeDropCloseIcon />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
export default TransactionPinForm;
