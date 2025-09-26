import { Eye } from "lucide-react";
import { forwardRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { EyeDropCloseIcon } from "../../../assets/svg";
import { RoutePath } from "../../../routes/routePath";

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => void;
}

const LoginForm = forwardRef<HTMLFormElement, LoginFormProps>(
  ({ onSubmit }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const {
      register,
      handleSubmit,
      formState: { errors, isSubmitting },
    } = useForm<LoginFormData>({
      defaultValues: {
        email: "",
        password: "",
      },
    });

    return (
      <form
        ref={ref}
        onSubmit={handleSubmit(onSubmit)}
        className="gap-y-6 flex b items-center w-full flex-col"
      >
        <div className="form-control w-full">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Enter Email Address"
            className={`input input-bordered w-full ${
              errors.email ? "input-error" : ""
            }`}
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
          />
          {errors.email && (
            <p className="text-error text-xs text-red-500 mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="w-full flex-col flex justify-end items-end gap-2">
          <div className="w-full">
            <label htmlFor="password">Password</label>
            <div className="relative form-control">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Enter Password"
                className={`input input-bordered w-full ${
                  errors.password ? "input-error" : ""
                }`}
                {...register("password", {
                  required: "Password is required",
                })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 -translate-y-1/2 right-5 focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <Eye /> : <EyeDropCloseIcon />}
              </button>
            </div>
            {errors.password && (
              <p className="text-error text-xs text-red-500 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
          <Link
            className="text-primary-100 text-sm font-bold capitalize hover:opacity-85 transition ease-in-out duration-300"
            to={RoutePath.FORGOT_PASSWORD}
          >
            forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-primary w-full mt-4"
        >
          {isSubmitting ? "Signing In..." : "Sign In"}
        </button>
      </form>
    );
  }
);

LoginForm.displayName = "LoginForm";

export default LoginForm;
