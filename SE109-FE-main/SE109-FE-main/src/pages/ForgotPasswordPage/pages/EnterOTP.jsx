import React from "react";
import { useNavigate } from "react-router-dom";
import img2 from "../../../assets/img/AVOCADO.png";
import img1 from "../../../assets/img/hero_2.jpg";
import ButtonFormComponent from "../../../components/ButtonFormComponent/ButtonFormComponent";
import OTPComponent from "../../../components/OTPComponent/OTPComponent";
import "./EnterOTP.css";

const EnterOTP = () => {
  const nav = useNavigate();
  const handleSendBackOTP = () => {};

  const handleEnterOTP = () => {
    const otpInputs = document.querySelectorAll(".input__otp"); // Lấy tất cả các ô nhập OTP
    const otp = Array.from(otpInputs)
      .map((input) => input.value)
      .join(""); // Gộp các giá trị của các ô OTP thành chuỗi

    // Kiểm tra OTP có hợp lệ hay không
    if (otp.length !== otpInputs.length) {
      alert("Please enter the complete OTP!");
      return;
    }

    // Thêm logic kiểm tra OTP hợp lệ từ server nếu cần (giả sử OTP đúng)
    const isValidOTP = true; // Thay bằng logic thực tế
    if (!isValidOTP) {
      alert("Invalid OTP code!");
      return;
    }

    nav("/forgot-password/new-password");
  };
  return (
    <div className="container-xl container-enter-otp">
      <div className="enter-otp-container">
        {/* enter-otp right */}
        <div className="enter-otp-container__img">
          <img className="enter-otp__img" src={img1} alt="Hình cái bánh" />
          <img className="enter-otp__logo" src={img2} alt="enter-otp logo" />
        </div>
        {/* enter-otp left */}
        <div className="enter-otp__left">
          <h1 className="enter-otp__title">FORGOT PASSWORD</h1>
          <form className="enter-otp__form">
            <div className="otp__input">
              <OTPComponent></OTPComponent>
              <OTPComponent></OTPComponent>
              <OTPComponent></OTPComponent>
              <OTPComponent></OTPComponent>
            </div>
            {/* back to login */}
            <div className="enter-otp__extend">
              <div onClick={handleSendBackOTP} className="enter-otp">
              You have not received OTP yet? <b>Resend</b>
              </div>
            </div>
            <ButtonFormComponent onClick={handleEnterOTP}>
              Submit
            </ButtonFormComponent>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EnterOTP;
