import React from "react";
import Spinner from "../icons/spinner";
import clsx from "clsx";

type ButtonProps = {
  isLoading?: boolean;
  variant?: "primary" | "secondary";
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button = ({
  children,
  className,
  isLoading = false,
  variant = "primary",
  ...props
}: ButtonProps) => {
  return (
    <button
      {...props}
      className={clsx(
        className,
        " flex items-center justify-center px-5 py-2 text-xs rounded  transition-colors duration-200 disabled:opacity-50 font-bold focus:outline-none focus:shadow-outline w-full",
        {
          "text-secondary bg-primary  hover:bg-primary hover:text-white disabled:hover:bg-gray-900 disabled:hover:text-secondary":
            variant === "primary",
          "text-gray-900 bg-transparent border-gray-920 hover:bg-gray-100":
            variant === "secondary",
        }
      )}
    >
      {isLoading ? <Spinner /> : children}
    </button>
  );
};

export default Button;
