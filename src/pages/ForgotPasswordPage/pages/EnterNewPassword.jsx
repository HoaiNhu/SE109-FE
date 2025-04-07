import React from "react";
import "./EnterNewPassword.css";
import img1 from "../../../assets/img/hero_2.jpg";
import img2 from "../../../assets/img/AVOCADO.png";
import ButtonFormComponent from "../../../components/ButtonFormComponent/ButtonFormComponent";
import FormComponent from "../../../components/FormComponent/FormComponent";
import { useNavigate } from "react-router-dom";

const EnterNewPassword = () => {
  const nav = useNavigate();

  const handleSendNewPassword = () => {
    alert("Đổi mật khẩu thành công");
    nav("/login");
  };

  return (
    <div className="container-xl container-new-password">
      <div className="new-password-container">
        {/* new-password right */}
        <div className="new-password-container__img">
          <img className="new-password__img" src={img1} alt="Hình cái bánh" />
          <img
            className="new-password__logo"
            src={img2}
            alt="new-password logo"
          />
        </div>
        {/* new-password left */}
        <div className="new-password__left">
          <h1 className="new-password__title">FORGOT PASSWORD</h1>
          <form className="new-password__form">
            <FormComponent
              id="passwordInput"
              label="Password"
              type="password"
              placeholder="Enter the new password"
            />

            <FormComponent
              id="passwordConfirmInput"
              label="PasswordConfirm"
              type="password"
              placeholder="Confirm the new password"
            />

            {/* back to login */}
            <ButtonFormComponent
              className="btn__confirm"
              onClick={handleSendNewPassword}
            >
              Submit
            </ButtonFormComponent>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EnterNewPassword;
