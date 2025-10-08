import { Eye } from "lucide-react";
import { forwardRef, useState } from "react";
import { useForm } from "react-hook-form";
import { EyeDropCloseIcon } from "../../../assets/svg";

interface SignUpFormData {
  email: string;
  password: string;
}

interface SignUpFormProps {
  onSubmit: (data: SignUpFormData) => void;
}

const SignUpForm = forwardRef<HTMLFormElement, SignUpFormProps>(
  ({ onSubmit }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm<SignUpFormData>({
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

        <div className="w-full">
          <label htmlFor="password">Password</label>
          <div className="relative form-control">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Create Password"
              className={`input input-bordered w-full ${
                errors.password ? "input-error" : ""
              }`}
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                  message:
                    "Password must contain at least one uppercase letter, one lowercase letter, and one number",
                },
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
      </form>
    );
  }
);

SignUpForm.displayName = "SignUpForm";

export default SignUpForm;
