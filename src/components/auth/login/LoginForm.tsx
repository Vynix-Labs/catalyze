import { Link } from "react-router-dom";
import { EyeDropCloseIcon } from "../../../assets/svg";
import { RoutePath } from "../../../routes/routePath";

function LoginForm() {
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
      <div className="w-full flex-col flex  justify-end items-end gap-2">
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
        <Link
          className="text-primary-100 text-sm font-bold capitalize hover:opacity-85 transition ease-in-out duration-300"
          to={RoutePath.FORGOT_PASSWORD}
        >
          forgot password?
        </Link>
      </div>
    </form>
  );
}

export default LoginForm;
