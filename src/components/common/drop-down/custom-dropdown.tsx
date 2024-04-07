import { ReactNode, useState } from "react";
import ChevronDown from "../icons/chevron-down";

interface CustomDropdownProps {
  options: { value: string; label: string }[];
  placeholder?: string;
  icon?: ReactNode;
}

export const CustomDropdown = (
  props: CustomDropdownProps & React.SelectHTMLAttributes<HTMLSelectElement>
) => {
  const [error, setError] = useState("");
  const [isError, setIsError] = useState(false);

  // Example validation function
  const validate = (value: string) => {
    if (!value && props.required) {
      setError("Required");
      setIsError(true);
    } else {
      setError("");
      setIsError(false);
    }
  };

  return (
    <div className="relative flex items-center text-gray-700">
      <div className="absolute z-20 left-1.5 text-xs ">{props.icon}</div>
      <select
        {...props}
        onBlur={() => validate(props.value as string)}
        className={`text-xs block appearance-none w-full bg-white border border-gray-200   text-gray-700 py-2 pl-2 pr-10 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 z-10 ${
          isError && "border-red-500"
        } ${props.icon && "pl-7"}`}
      >
        <option value="">{props.placeholder}</option>
        {props.options.map((option) => (
          <option className="text-xs" key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <span
        className={`absolute right-2.5 top-1/2 transform -translate-y-1/2 pointer-events-none`}
      >
        <ChevronDown color="black" />
      </span>
      <span
        className={`absolute left-0 bottom-0 text-xs text-red-500 transition-all duration-300 translate-y-[110%] ${
          isError ? "opacity-100" : "opacity-0"
        }`}
      >
        {error}
      </span>
    </div>
  );
};
