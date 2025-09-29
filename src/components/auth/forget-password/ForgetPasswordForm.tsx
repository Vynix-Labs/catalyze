import { forwardRef } from "react";
import { useForm } from "react-hook-form";

interface ForgetPasswordFormData {
  email: string;
}

interface ForgetPasswordFormProps {
  onSubmit: (data: ForgetPasswordFormData) => void;
}

const ForgetPasswordForm = forwardRef<HTMLFormElement, ForgetPasswordFormProps>(
  ({ onSubmit }, ref) => {
    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm<ForgetPasswordFormData>({
      defaultValues: {
        email: "",
      },
    });

    return (
      <form ref={ref} onSubmit={handleSubmit(onSubmit)}>
        <div className="form-control w-full">
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            placeholder="Enter email address"
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

      </form>
    );
  }
);

ForgetPasswordForm.displayName = "ForgetPasswordForm";

export default ForgetPasswordForm;
