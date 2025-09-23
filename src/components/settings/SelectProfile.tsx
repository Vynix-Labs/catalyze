import { useEffect, useState } from "react";
import { CameraIcon } from "../../assets/svg";
import { UserIcon } from "lucide-react";
interface Props {
  profilePicture?: File | null;
  setProfilePicture?: (file: File | null) => void;
}
function SelectProfile({ profilePicture, setProfilePicture }: Props) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleProfilePictureChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file && setProfilePicture) {
      setProfilePicture(file);
    }
  };

  useEffect(() => {
    if (profilePicture) {
      const objectUrl = URL.createObjectURL(profilePicture);
      setPreviewUrl(objectUrl);

      // cleanup: revoke old object URL when file changes or component unmounts
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [profilePicture]);


  return (
    <div>
      <div className="flex items-center justify-center border border-neutral-300 size-29 rounded-full mx-auto mb-6 relative">
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Profile"
            className="size-29 rounded-full object-cover"
          />
        ) : (
          <UserIcon size={49} />
        )}

        <div className="absolute bottom-0 right-0 size-9 rounded-full p-1 cursor-pointer bg-white flex items-center justify-center">
          <CameraIcon />
          <input
            onChange={handleProfilePictureChange}
            className="absolute !appearance-none opacity-0 size-6 overflow-hidden cursor-pointer inset-0"
            type="file"
            accept="image/*"
            max={1}
            name="profile-picture"
            id="profile_picture"
          />
        </div>
      </div>
    </div>
  );
}

export default SelectProfile;
