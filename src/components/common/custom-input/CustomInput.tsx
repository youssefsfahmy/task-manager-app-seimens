import { ReactNode, useState } from "react";

export const CustomInput = (
  props: {
    onChange?: (e: any) => void;
    icon?: ReactNode;
  } & React.InputHTMLAttributes<HTMLInputElement>
) => {
  const { onChange, icon } = props;
  const [error, setError] = useState(null);
  const [isError, setIsError] = useState(false);

  const numberInputOnWheelPreventChange = (e: any) => {
    e.target.blur();
    e.stopPropagation();
    setTimeout(() => {
      e.target.focus();
    }, 0);
  };

  return (
    <div className="relative flex items-center">
      <div className="absolute z-20 left-1.5">{icon}</div>
      <input
        {...props}
        className={`relative shadow text-xs appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline z-10 ${
          isError && "border-red-500"
        } ${icon && "pl-7"}`}
        onChange={(e) => {
          setIsError(false);
          onChange && onChange(e);
        }}
        onWheel={numberInputOnWheelPreventChange}
        onInvalid={(e) => {
          e.preventDefault();
          const target = e.target as unknown as any;
          let error = target.validationMessage;
          if (error === "Please fill out this field.") {
            error = "Required";
          }
          target.scrollIntoView({ block: "center", behavior: "smooth" });
          setError(error);
          setIsError(true);
        }}
      />
      <span
        className={`absolute left-0 bottom-0 text-xs text-melon transition-all duration-700 translate-y-[0] opacity-0 ${
          isError
            ? "translate-y-[111%] opacity-100 "
            : "translate-y-[0] opacity-0"
        }`}
      >
        {error}
      </span>
    </div>
  );
};
