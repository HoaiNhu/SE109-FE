import React from "react";
import "./AddBtn.css";
import { useNavigate } from "react-router-dom";

const AddBtn = ({ path }) => {
  const navigate = useNavigate();

  const handleClickAdd = (path) => {
    navigate(path);
  };

  return (
    <div className="AddBtnHolder">
      <button className="AddBtn" onClick={() => handleClickAdd(path)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="40"
          height="50"
          viewBox="0 0 50 50"
          fill="none"
        >
          <circle cx="34.5" cy="34.5" r="34.5" fill="none" />
          <text
            x="50%"
            y="60%"
            dominant-baseline="middle"
            text-anchor="middle"
            fill="#fff"
            font-size="50"
          >
            +
          </text>
        </svg>
      </button>
    </div>
  );
};

export default AddBtn;
