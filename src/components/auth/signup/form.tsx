import { EyeDropCloseIcon } from "../../../assets/svg";

function SignUpForm() {
  return (
    <form className="gap-y-6 flex b items-center w-full flex-col">
      <div className="form-control w-full">
        <label htmlFor="email">Email</label>
        <input
          type="text"
          id="email"
          name="email"
          placeholder="Enter Email Address"
        />
      </div>
      <div className="w-full">
        <label htmlFor="password">Password</label>
        <div className="relative form-control">
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Create Password"
          />
          <div className=" absolute top-1/2 -translate-y-1/2 right-5">
            <EyeDropCloseIcon />
          </div>
        </div>
      </div>
    </form>
  );
}

export default SignUpForm;
