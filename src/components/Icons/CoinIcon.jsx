import React from "react";
export const CoinIcon = ({
  fill = "currentColor",
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
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g
        id="SVGRepo_tracerCarrier"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></g>
      <g id="SVGRepo_iconCarrier">
        <path
          d="M12 16H13C13.6667 16 15 15.6 15 14C15 12.4 13.6667 12 13 12H11C10.3333 12 9 11.6 9 10C9 8.4 10.3333 8 11 8H12M12 16H9M12 16V18M15 8H12M12 8V6M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></path>
      </g>
    </svg>
  );
};
