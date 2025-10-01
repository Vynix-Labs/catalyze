import { useEffect, useState } from "react";
import Header from "../../components/settings/Header";
import SelectProfile from "../../components/settings/SelectProfile";
import PersonalInfoForm from "../../components/settings/PersonalInfoForm";
import AuthFooter from "../../common/auth/AuthFooter";

function PersonalInfo() {
  const saveChanges = () => {
    // Implement save changes logic here
    console.log(
      "Changes saved",
      firstName,
      lastName,
      email,
      phone,
      profilePicture
    );
  };

  const [isFormValid, setIsFormValid] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [profilePicture, setProfilePicture] = useState<File | null>(null);

  useEffect(() => {
    console.log(firstName, lastName, email, phone, profilePicture);

    if (firstName || lastName || email || phone || profilePicture) {
      setIsFormValid(true);
    }
  }, [firstName, lastName, email, phone, profilePicture]);
  return (
    <div className="flex flex-col h-screen ">
      <div>
        <Header title="Personal Information" />
        <SelectProfile
          profilePicture={profilePicture}
          setProfilePicture={setProfilePicture}
        />
      </div>
      <div className="flex-1 flex flex-col justify-between items-center w-full pb-6">
        <PersonalInfoForm
          firstName={firstName}
          setFirstName={setFirstName}
          lastName={lastName}
          setLastName={setLastName}
          email={email}
          setEmail={setEmail}
          phone={phone}
          setPhone={setPhone}
        />
        <div className="w-full px-4 mt-14">
          <AuthFooter
            text="Save Changes"
            disabled={isFormValid}
            handleBtnClick={saveChanges}
          />
        </div>
      </div>
    </div>
  );
}

export default PersonalInfo;
