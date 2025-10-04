import { Eye } from "lucide-react";
import { forwardRef, useState } from "react";
import { useForm } from "react-hook-form";
import { EyeDropCloseIcon } from "../../../assets/svg";

interface CreateNewPasswordFormData {
  password: string;
  confirmPassword: string;
}

interface CreateNewPasswordFormProps {
  onSubmit: (data: CreateNewPasswordFormData) => void;
}

const CreateNewPasswordForm = forwardRef<
  HTMLFormElement,
  CreateNewPasswordFormProps
>(({ onSubmit }, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<CreateNewPasswordFormData>({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");

  return (
    <form ref={ref} onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="form-control w-full">
        <label htmlFor="password">Password</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            placeholder="Enter new password"
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

      <div className="form-control w-full">
        <label htmlFor="confirmPassword">Confirm Password</label>
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            id="confirmPassword"
            placeholder="Re-enter new password"
            className={`input input-bordered w-full ${
              errors.confirmPassword ? "input-error" : ""
            }`}
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) =>
                value === password || "Passwords do not match",
            })}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute top-1/2 -translate-y-1/2 right-5 focus:outline-none"
            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
          >
            {showConfirmPassword ? <Eye /> : <EyeDropCloseIcon />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-error text-xs text-red-500 mt-1">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>
    </form>
  );
});

CreateNewPasswordForm.displayName = "CreateNewPasswordForm";

export default CreateNewPasswordForm;
