import React from "react";
import styles from "./EditIconComponent.module.css";

const EditIconComponent = (props) => {
  return (
    <div
      className={`${styles.editButton}`}
      onClick={props.onClick}
      style={{ cursor: "pointer" }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="30"
        height="30"
        viewBox="0 0 30 30"
        fill="none"
      >
        <path
          d="M17.575 11.275L18.725 12.425L7.4 23.75H6.25V22.6L17.575 11.275ZM22.075 3.75C21.7625 3.75 21.4375 3.875 21.2 4.1125L18.9125 6.4L23.6 11.0875L25.8875 8.8C26.0034 8.68436 26.0953 8.547 26.158 8.39578C26.2208 8.24456 26.2531 8.08246 26.2531 7.91875C26.2531 7.75504 26.2208 7.59294 26.158 7.44172C26.0953 7.2905 26.0034 7.15314 25.8875 7.0375L22.9625 4.1125C22.7125 3.8625 22.4 3.75 22.075 3.75ZM17.575 7.7375L3.75 21.5625V26.25H8.4375L22.2625 12.425L17.575 7.7375Z"
          fill="#fff"
        />
      </svg>
    </div>
  );
};

export default EditIconComponent;
