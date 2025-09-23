import { useState } from "react";
import Header from "../../components/settings/Header";
import SetPinForm from "../../components/settings/SetPinForm";
import Button from "../../common/ui/button";
import GlobalModal from "../../common/ui/modal/GlobalModal";
import SuccessModal from "../../common/ui/modal/SuccessModal";
import { useNavigate } from "react-router-dom";
import { RoutePath } from "../../routes/routePath";

function SetPin() {
  const [newPin, setNewPin] = useState<number | undefined>(undefined);
  const [confirmPin, setConfirmPin] = useState<number>();
  const [isFormValid, setIsFormValid] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const handleSetPin = () => {
    // backend functionality goes here

    console.log("new pin:" + newPin, "confirm pin" + confirmPin);

    // stimulate api call

    try {
      setTimeout(() => {
        setIsModalOpen(true);
      }, 9000);
    } catch (error) {
      console.log(error);
    }
  };
  const handleNavigateToHome = () => {
    setIsModalOpen(false);
    navigate(RoutePath.DASHBOARD);
  };
  return (
    <div className="flex flex-col h-screen justify-between">
      <Header title="Set PIN" />
      <div className="flex flex-col justify-between  flex-1 pb-6">
        <SetPinForm
          newPin={newPin}
          setNewPin={setNewPin}
          confirmPin={confirmPin}
          setConfirmPin={setConfirmPin}
          setIsFormValid={setIsFormValid}
        />
        <div className="flex w-full items-center justify-center">
          <Button
            disabled={!isFormValid}
            variants="primary"
            handleClick={handleSetPin}
          >
            Set Pin
          </Button>
        </div>
      </div>
      <GlobalModal
        open={isModalOpen}
        btnText="Go to home"
        onClose={() => setIsModalOpen(false)}
        setOpen={() => setIsModalOpen(true)}
        handleOnBtnClick={handleNavigateToHome}
      >
        <SuccessModal />
      </GlobalModal>
    </div>
  );
}

export default SetPin;
