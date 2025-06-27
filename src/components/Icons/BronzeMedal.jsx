import React from "react";
export const BronzeMedal = ({
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
      <g id="Bronze Medal">
        <path
          id="Rectangle 12"
          d="M11.4922 23.1104L15.0065 25.1394L7.87001 37.5002L5.82168 32.932L11.4922 23.1104Z"
          fill="#AA75CB"
        />
        <path
          id="Rectangle 13"
          d="M11.4922 23.1104L7.97783 21.0813L0.841307 33.4422L5.82168 32.932L11.4922 23.1104Z"
          fill="#73488D"
        />
        <path
          id="Rectangle 14"
          d="M16.5068 23.1104L12.9925 25.1394L20.129 37.5002L22.1773 32.932L16.5068 23.1104Z"
          fill="#73488D"
        />
        <path
          id="Rectangle 15"
          d="M16.5068 23.1104L20.0212 21.0813L27.1577 33.4422L22.1773 32.932L16.5068 23.1104Z"
          fill="#AA75CB"
        />
        <circle
          id="Ellipse 5"
          cx="13.9938"
          cy="14.5992"
          r="12.9742"
          fill="#DC9E42"
          stroke="#774700"
          strokeWidth="1.75"
        />
        <circle
          id="Ellipse 6"
          cx="13.9944"
          cy="14.5993"
          r="9.44455"
          fill="#734C12"
        />
        <g id="Mask Group">
          <mask
            id="mask0_2208_9146"
            maskUnits="userSpaceOnUse"
            x="5"
            y="6"
            width="19"
            height="20"
          >
            <circle
              id="Ellipse 4"
              cx="14.4978"
              cy="15.6076"
              r="9.46653"
              fill="#C28B37"
            />
          </mask>
          <g mask="url(#mask0_2208_9146)">
            <circle
              id="Ellipse 3"
              cx="13.9939"
              cy="14.5993"
              r="9.46653"
              fill="#A36D1D"
            />
          </g>
        </g>
        <path
          id="Vector"
          d="M14.0451 8.01367L16.0872 12.0978L20.1713 12.6083L17.3669 15.7531L18.1293 20.2661L14.0451 18.224L9.96101 20.2661L10.7302 15.7531L7.91895 12.6083L12.0031 12.0978L14.0451 8.01367Z"
          fill="url(#paint0_linear_2208_9146)"
        />
      </g>
      <defs>
        <linearGradient
          id="paint0_linear_2208_9146"
          x1="14.0451"
          y1="8.01367"
          x2="14.0451"
          y2="20.2661"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FCFF80" />
          <stop offset="0.401042" stopColor="#FDE870" />
          <stop offset="1" stopColor="#FFC759" />
        </linearGradient>
      </defs>
    </svg>
  );
};
