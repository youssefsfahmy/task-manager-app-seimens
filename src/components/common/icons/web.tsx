import React from "react";
import { IconProps } from "@/utils/types";

const Web: React.FC<IconProps> = ({
  size = "16",
  color = "currentColor",
  ...attributes
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...attributes}
    >
      <path
        id="icon/social/publicon/social/24px"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.47998 2 2 6.47998 2 12C2 17.52 6.47998 22 12 22C17.52 22 22 17.52 22 12C22 6.47998 17.52 2 12 2ZM11 19.93C7.05005 19.44 4 16.08 4 12C4 11.38 4.07996 10.79 4.20996 10.21L9 15V16C9 17.1 9.90002 18 11 18V19.93ZM16 16C16.9 16 17.64 16.58 17.9 17.39C19.2 15.97 20 14.08 20 12C20 8.65002 17.9301 5.78003 15 4.59003V5C15 6.10004 14.1 7 13 7H11V9C11 9.55005 10.55 10 10 10H8V12H14C14.55 12 15 12.45 15 13V16H16Z"
        fill={color}
      />
    </svg>
  );
};

export default Web;
