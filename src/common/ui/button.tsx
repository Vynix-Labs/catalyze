import type { buttonProps } from "../../types/types";

function Button({
  variants,
  text,
  classes,
  children,
  handleClick,
  disabled,
}: buttonProps) {
  const btnShape = () => {
    switch (variants) {
      case "primary":
        return "bg-primary-100 text-base font-bold hover:opacity-88 transition ease-out duration-300 leading-[132%] text-white px-3 py-2 rounded";
      case "secondary":
        return "bg-neutral-100 text-gray-600 px-4 py-2";
      default:
        return "bg-transparent text-black px-4 py-2";
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`${btnShape()} ${classes} gap-2 h-12 max-w-[21.9rem] flex w-full rounded-full items-center justify-center cursor-pointer disabled:bg-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed`}
      disabled={disabled}
    >
      {children ? children : text}
    </button>
  );
}

export default Button;
