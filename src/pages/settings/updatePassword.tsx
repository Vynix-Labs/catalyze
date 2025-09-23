import { useState } from "react";
import Button from "../../common/ui/button";
import ChangePasswordForm from "../../components/settings/ChangePasswordForm";
import Header from "../../components/settings/Header";

function UpdatePassword() {
  const [isFormValid, setIsFormValid] = useState(false);
  const [currentPassword, setCurrentPassword] = useState<string>();
  const [newPassword, setNewPassword] = useState<string>();
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>();
  return (
    <div className="flex flex-col h-screen">
      <Header title="Password" />
      <div className="flex-1 flex-col flex justify-between items-center w-ful pb-6">
        <ChangePasswordForm
          setCurrentPassword={setCurrentPassword}
          currentPassword={currentPassword}
          setNewPassword={setNewPassword}
          newPassword={newPassword}
          setConfirmNewPassword={setConfirmNewPassword}
          confirmNewPassword={confirmNewPassword}
          setIsFormValid={setIsFormValid}
        />
        <div className="w-full flex justify-center items-center">
          <Button
            disabled={!isFormValid}
            variants="primary"
            text="Update Password"
          />
        </div>
      </div>
    </div>
  );
}

export default UpdatePassword;
