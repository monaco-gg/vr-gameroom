import React from "react";
export const BackIcon = ({
  fill = "currentColor",
  color = "currentColor",
  filled,
  size,
  height = 32,
  width = 32,
  label,
  ...props
}) => {
  return (
    <svg
      width={size || width}
      height={size || height}
      viewBox="0 0 24 24"
      fill="none"
    >
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g
        id="SVGRepo_tracerCarrier"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></g>
      <g id="SVGRepo_iconCarrier">
        <path
          d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></path>
        <path
          d="M9.00002 15.3802H13.92C15.62 15.3802 17 14.0002 17 12.3002C17 10.6002 15.62 9.22021 13.92 9.22021H7.15002"
          stroke={color}
          strokeWidth="1.5"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></path>
        <path
          d="M8.57 10.7701L7 9.19012L8.57 7.62012"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></path>
      </g>
    </svg>
  );
};
