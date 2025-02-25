import React from "react";
import "./EnterEmail.css";
import img1 from "../../../assets/img/hero_2.jpg";
import img2 from "../../../assets/img/AVOCADO.png";
import ButtonFormComponent from "../../../components/ButtonFormComponent/ButtonFormComponent";
import FormComponent from "../../../components/FormComponent/FormComponent";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const nav = useNavigate();

  const handleBackLogin = () => {
    nav("/login");
  };

  const handleSendEmail = () => {
    const emailInput = document.getElementById("emailInput"); // Lấy phần tử input email
    const emailValue = emailInput.value.trim(); // Lấy giá trị email

    // Kiểm tra email có hợp lệ hay không
    if (!emailValue) {
      alert("Vui lòng nhập email!");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(emailValue)) {
      alert("Email không hợp lệ!");
      return;
    }

    nav("/forgot-password/enter-otp");
  };

  return (
    <div className="container-xl container-forgot-password">
      <div className="forgot-password-container">
        {/* forgot-password right */}
        <div className="forgot-password-container__img">
          <img
            className="forgot-password__img"
            src={img1}
            alt="Hình cái bánh"
          />
          <img
            className="forgot-password__logo"
            src={img2}
            alt="forgot-password logo"
          />
        </div>
        {/* forgot-password left */}
        <div className="forgot-password__left">
          <h1 className="forgot-password__title">QUÊN MẬT KHẨU</h1>
          <form className="forgot-password__form">
            <FormComponent
              id="emailInput"
              label="Email"
              type="email"
              placeholder="Nhập email"
            />

            {/* back to login */}
            <div className="forgot-password__extend">
              <div onClick={handleBackLogin} className="forgot-password">
                Quay lại đăng nhập
              </div>
            </div>
            <ButtonFormComponent onClick={handleSendEmail}>
              Gửi
            </ButtonFormComponent>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
