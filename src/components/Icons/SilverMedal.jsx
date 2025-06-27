import React from "react";
export const SilverMedal = ({
  fill = "currentColor",
  filled,
  size = 32,
  height = 32,
  width = 32,
  label,
  ...props
}) => {
  return (
    <svg
      width="28"
      height="38"
      viewBox="0 0 28 38"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.4922 23.1101L15.0065 25.1391L7.87001 37.4999L5.82168 32.9317L11.4922 23.1101Z"
        fill="#418ED6"
      />
      <path
        d="M11.4922 23.1101L7.97783 21.0811L0.841307 33.4419L5.82168 32.9317L11.4922 23.1101Z"
        fill="#2B63A6"
      />
      <path
        d="M16.5068 23.1101L12.9925 25.1391L20.129 37.4999L22.1773 32.9317L16.5068 23.1101Z"
        fill="#2B63A6"
      />
      <path
        d="M16.5068 23.1101L20.0212 21.0811L27.1577 33.4419L22.1773 32.9317L16.5068 23.1101Z"
        fill="#418ED6"
      />
      <circle
        cx="13.9938"
        cy="14.5992"
        r="12.9742"
        fill="#E3E3E3"
        stroke="#404040"
        strokeWidth="1.75"
      />
      <circle cx="13.9934" cy="14.5993" r="9.44455" fill="#595959" />
      <mask
        id="mask0_2191_3931"
        maskUnits="userSpaceOnUse"
        x="5"
        y="6"
        width="19"
        height="20"
      >
        <circle cx="14.4978" cy="15.6074" r="9.46653" fill="#C28B37" />
      </mask>
      <g mask="url(#mask0_2191_3931)">
        <circle
          cx="13.9939"
          cy="14.5991"
          r="9.46653"
          fill="url(#paint0_linear_2191_3931)"
        />
      </g>
      <path
        d="M14.0451 8.01367L16.0872 12.0978L20.1713 12.6083L17.3669 15.7531L18.1293 20.2661L14.0451 18.224L9.96101 20.2661L10.7302 15.7531L7.91895 12.6083L12.0031 12.0978L14.0451 8.01367Z"
        fill="url(#paint1_linear_2191_3931)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_2191_3931"
          x1="13.9939"
          y1="5.13257"
          x2="13.9939"
          y2="24.0656"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#9CA1A3" />
          <stop offset="1" stopColor="#9CA1A3" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_2191_3931"
          x1="14.0451"
          y1="8.01367"
          x2="14.0451"
          y2="20.2661"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F1F5F5" />
          <stop offset="0.0001" stopColor="white" />
          <stop offset="1" stopColor="#F1F5F5" />
        </linearGradient>
      </defs>
    </svg>
  );
};
