import React from "react";
export const GoldMedal = ({
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
        fill="#CE4444"
      />
      <path
        d="M11.4922 23.1101L7.97784 21.0811L0.841309 33.4419L5.82168 32.9317L11.4922 23.1101Z"
        fill="#983535"
      />
      <path
        d="M16.5068 23.1101L12.9925 25.1391L20.129 37.4999L22.1773 32.9317L16.5068 23.1101Z"
        fill="#983535"
      />
      <path
        d="M16.5068 23.1101L20.0212 21.0811L27.1577 33.4419L22.1773 32.9317L16.5068 23.1101Z"
        fill="#CE4444"
      />
      <circle
        cx="13.8912"
        cy="14.5992"
        r="12.9742"
        fill="url(#paint0_linear_2191_3919)"
        stroke="#765C00"
        strokeWidth="1.75"
      />
      <circle cx="13.8918" cy="14.5993" r="9.44454" fill="#A88300" />
      <mask
        id="mask0_2191_3919"
        maskUnits="userSpaceOnUse"
        x="4"
        y="6"
        width="20"
        height="20"
      >
        <circle cx="14.3962" cy="15.6074" r="9.46653" fill="#C28B37" />
      </mask>
      <g mask="url(#mask0_2191_3919)">
        <circle cx="13.8923" cy="14.5993" r="9.46653" fill="#C09525" />
      </g>
      <path
        d="M13.9426 8.01367L15.9847 12.0978L20.0688 12.6083L17.2644 15.7531L18.0267 20.2661L13.9426 18.224L9.85847 20.2661L10.6276 15.7531L7.81641 12.6083L11.9005 12.0978L13.9426 8.01367Z"
        fill="url(#paint1_linear_2191_3919)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_2191_3919"
          x1="13.8912"
          y1="2.5"
          x2="13.8912"
          y2="26.6985"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFC600" />
          <stop offset="1" stopColor="#FFDE69" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_2191_3919"
          x1="13.9426"
          y1="8.01367"
          x2="13.9426"
          y2="20.2661"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFFCDD" />
          <stop offset="1" stopColor="#FFE896" />
        </linearGradient>
      </defs>
    </svg>
  );
};
