import { Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { EyeDropCloseIcon } from "../../assets/svg";
interface Props {
  setIsFormValid?: (isValid: boolean) => void;
  currentPassword?: string;
  newPassword?: string;
  confirmNewPassword?: string;
  setCurrentPassword?: (password: string) => void;
  setNewPassword?: (password: string) => void;
  setConfirmNewPassword?: (password: string) => void;
}
function ChangePasswordForm({
  setIsFormValid,
  currentPassword,
  setCurrentPassword,
  newPassword,
  setNewPassword,
  confirmNewPassword,
  setConfirmNewPassword,
}: Props) {
  const [isPasswordVisible, setIsPasswordVisible] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  useEffect(() => {
    const isValid =
      currentPassword &&
      newPassword &&
      confirmNewPassword &&
      newPassword === confirmNewPassword &&
      newPassword.length >= 8;
    if (setIsFormValid) {
      setIsFormValid(!!isValid);
    }
  }, [newPassword, currentPassword, confirmNewPassword]);
  return (
    <div className="px-4 pt-9 w-full">
      <form className="space-y-6">
        <div className="w-full">
          <label htmlFor="currentPassword">Current Password</label>
          <div className="relative form-control">
            <input
              type={isPasswordVisible.current ? "text" : "password"}
              name="currentPassword"
              id="currentPassword"
              placeholder="Enter Current Password"
              value={currentPassword}
              onChange={(e) => {
                if (setCurrentPassword) {
                  setCurrentPassword(e.target.value);
                }
              }}
            />
            <div
              role="button"
              aria-roledescription="toggle current password visibility"
              onClick={() => {
                setIsPasswordVisible((prev) => ({
                  ...prev,
                  current: !prev.current,
                }));
              }}
              className=" absolute top-1/2 -translate-y-1/2 right-5"
            >
              {isPasswordVisible.current ? <Eye /> : <EyeDropCloseIcon />}
            </div>
          </div>
        </div>
        <div className="w-full">
          <label htmlFor="newPassword">New Password</label>
          <div className="relative form-control">
            <input
              type={isPasswordVisible.new ? "text" : "password"}
              name="newPassword"
              id="newPassword"
              placeholder="Enter New Password"
              value={newPassword}
              onChange={(e) => {
                if (setNewPassword) {
                  setNewPassword(e.target.value);
                }
              }}
            />
            <div
              role="button"
              aria-roledescription="toggle new password visibility"
              onClick={() => {
                setIsPasswordVisible((prev) => ({
                  ...prev,
                  new: !prev.new,
                }));
              }}
              className=" absolute top-1/2 -translate-y-1/2 right-5"
            >
              <EyeDropCloseIcon />
            </div>
          </div>
        </div>
        <div className="w-full">
          <label htmlFor="confirmNewPassword">Confirm New Password</label>
          <div className="relative form-control">
            <input
              type={isPasswordVisible.confirm ? "text" : "password"}
              name="confirmNewPassword"
              id="confirmNewPassword"
              placeholder="Confirm New Password"
              value={confirmNewPassword}
              onChange={(e) => {
                if (setConfirmNewPassword) {
                  setConfirmNewPassword(e.target.value);
                }
              }}
            />
            <div
              role="button"
              aria-roledescription="toggle confirm password visibility"
              onClick={() => {
                setIsPasswordVisible((prev) => ({
                  ...prev,
                  confirm: !prev.confirm,
                }));
              }}
              className=" absolute top-1/2 -translate-y-1/2 right-5"
            >
              <EyeDropCloseIcon />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default ChangePasswordForm;
