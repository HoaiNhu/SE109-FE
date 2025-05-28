import React from "react";

const CheckboxComponent = ({ isChecked, onChange }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      onClick={onChange}
      style={{
        cursor: "pointer",
        transition: "all 0.3s ease",
        // borderRadius: "50%",
      }}
    >
      {/* Vòng tròn hoặc nền */}
      <g filter="url(#filter0_d)">
        <rect
          x="8.5"
          y="8.9"
          width="22.6"
          height="22.6"
          rx="50"
          fill={isChecked ? "#e53888" : "#D9D9D9"}
          style={{ transition: "fill 0.3s ease", padding: "4px" }}
        />
      </g>

      {/* Dấu tích */}
      {isChecked && (
        <path
          d="M14 20l4 4 8-8"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            transition: "stroke-dasharray 0.3s ease",
            strokeDasharray: "0 24",
            animation: "dash 0.5s forwards",
          }}
        />
      )}

      {/* Animation cho dấu tích */}
      <style>
        {`
          @keyframes dash {
            to {
              stroke-dasharray: 24 0;
            }
          }
        `}
      </style>
    </svg>
  );
};

export default CheckboxComponent;
