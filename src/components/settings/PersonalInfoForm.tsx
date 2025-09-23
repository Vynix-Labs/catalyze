interface PersonalInfoFormProps {
  firstName?: string;
  setFirstName?: (name: string) => void;
  lastName?: string;
  setLastName?: (name: string) => void;
  email?: string;
  setEmail?: (email: string) => void;
  phone?: string;
  setPhone?: (phone: string) => void;
}
function PersonalInfoForm({
  firstName,
  lastName,
  email,
  phone,
  setFirstName,
  setLastName,
  setEmail,
  setPhone,
}: PersonalInfoFormProps) {
  return (
    <form className="space-y-6 px-4 pt-8 w-full">
      <div className="form-control">
        <label htmlFor="firstName">First name</label>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName && setFirstName(e.target.value)}
          name="firstName"
          id="firstName"
          placeholder="Enter your  Name"
        />
      </div>
      <div className="form-control">
        <label htmlFor="lastName">Last name</label>
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName && setLastName(e.target.value)}
          placeholder="Enter your  Last Name"
          name="lastName"
          id="lastName"
        />
      </div>
      <div className="form-control">
        <label htmlFor="email">Email</label>
        <input
          value={email}
          onChange={(e) => setEmail && setEmail(e.target.value)}
          type="email"
          name="email"
          id="email"
          placeholder="Enter email "
        />
      </div>
      <div className="form-control">
        <label htmlFor="phone">Phone Number</label>
        <input
          value={phone}
          onChange={(e) => setPhone && setPhone(e.target.value)}
          type="tel"
          name="phone"
          id="phone"
          placeholder="Enter phone number"
        />
      </div>
    </form>
  );
}

export default PersonalInfoForm;
