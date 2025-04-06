import React from "react";
import styles from "./AddToCartButtonComponent.module.css";

const AddToCartButtonComponent = ({ className = "", ...props }) => {
  return (
    <div>
      <button className={`${styles.addbtn__component} ${className}`} {...props}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="25"
          height="29"
          viewBox="0 0 25 29"
          fill="none"
        >
          <path
            d="M4.5 5.01392H5.90913C6.65838 5.01392 7.033 5.01392 7.30313 5.22271C7.31465 5.23161 7.32597 5.24076 7.33709 5.25016C7.59785 5.47055 7.67634 5.83686 7.83333 6.56947L8.08094 7.72498C8.15702 8.08001 8.19506 8.25752 8.25378 8.40793C8.51111 9.06707 9.09757 9.54117 9.79599 9.65468C9.95537 9.68058 10.1369 9.68058 10.5 9.68058V9.68058"
            stroke="black"
            stroke-width="2"
            stroke-linecap="round"
          />
          <path
            d="M18.5 20.1804H8.2026C7.86324 20.1804 7.69356 20.1804 7.56592 20.1461C7.12366 20.0271 6.81876 19.6229 6.82585 19.1649C6.8279 19.0328 6.87451 18.8696 6.96774 18.5433V18.5433C7.08002 18.1503 7.13617 17.9538 7.21829 17.7889C7.49819 17.2268 8.02586 16.8288 8.64325 16.7141C8.82437 16.6804 9.02873 16.6804 9.43746 16.6804H14.5"
            stroke="black"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M16.1812 16.6804H10.2346C9.23929 16.6804 8.39545 15.9486 8.25469 14.9633L7.74459 11.3926C7.6155 10.4889 8.31669 9.68042 9.22951 9.68042H18.9835C19.7014 9.68042 20.1854 10.4145 19.9026 11.0743L18.0195 15.4683C17.7043 16.2036 16.9813 16.6804 16.1812 16.6804Z"
            stroke="black"
            stroke-width="2"
            stroke-linecap="round"
          />
          <ellipse cx="17.5" cy="23.6806" rx="1" ry="1.16667" fill="black" />
          <ellipse cx="9.5" cy="23.6806" rx="1" ry="1.16667" fill="black" />
        </svg>{" "}
        Add to cart
      </button>
    </div>
  );
};

export default AddToCartButtonComponent;
