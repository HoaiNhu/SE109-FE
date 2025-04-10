import React, { useEffect, useState } from "react";
import axios from "axios";
import ButtonFormComponent from "../../components/ButtonFormComponent/ButtonFormComponent";
import FormComponent from "../../components/FormComponent/FormComponent";
import "./SignUpPage.css";
import img1 from "../../assets/img/hero_2.jpg";
import img2 from "../../assets/img/AVOCADO.png";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import * as UserService from "../../services/UserService";
import { useMutationHook } from "../../hooks/useMutationHook";
import Loading from "../../components/LoadingComponent/Loading";
import Message from "../../components/MessageComponent/Message";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    familyName: "",
    userName: "",
    userPhone: "",
    userEmail: "",
    userPassword: "",
    userConfirmPassword: "",
  });
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showLoading, setShowLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const mutation = useMutationHook((data) => UserService.signupUser(data));
  const { data, isSuccess, isError } = mutation;

  useEffect(() => {
    if (mutation.isSuccess) {
      setShowLoading(false);
      setStatusMessage({
        type: "Success",
        message: "Registration successful! Redirecting to the login page...",
      });
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } else if (mutation.isError) {
      setShowLoading(false);
      const errorMessage =
        mutation.error?.message?.message ||
        "Registration failed. Please try again.";
      setStatusMessage({
        type: "Error",
        message:
          typeof errorMessage === "object"
            ? JSON.stringify(errorMessage)
            : errorMessage,
      });
    }
  }, [mutation.isSuccess, mutation.isError, mutation.error, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowLoading(true);
    mutation.mutate(formData);
  };

  const isValid = () => {
    const {
      familyName,
      userName,
      userPhone,
      userEmail,
      userPassword,
      userConfirmPassword,
    } = formData;
    return (
      familyName.trim() !== "" &&
      userName.trim() !== "" &&
      userPhone.trim() !== "" &&
      userEmail.trim() !== "" &&
      userPassword.trim() !== "" &&
      userPassword === userConfirmPassword
    );
  };

  return (
    <div className="container-xl container-signup">
      {statusMessage && (
        <Message
          type={statusMessage.type}
          message={statusMessage.message}
          duration={3000}
          onClose={() => setStatusMessage(null)}
        />
      )}
      <div className="signup-container">
        <div className="signup-container__img">
          <img className="signup__img" src={img1} alt="Hình cái bánh" />
          <img className="signup__logo" src={img2} alt="Signup logo" />
        </div>
        <div className="signup__right">
          <h1 className="signup__title">SIGN UP</h1>

          <Loading isLoading={showLoading} />
          {!showLoading && (
            <form onSubmit={handleSubmit}>
              <FormComponent
                name="familyName"
                label="FamilyName"
                type="text"
                placeholder="Last name"
                value={formData.familyName}
                onChange={handleChange}
              />
              <FormComponent
                name="userName"
                label="Name"
                type="text"
                placeholder="First name"
                value={formData.userName}
                onChange={handleChange}
              />
              <FormComponent
                name="userPhone"
                label="Phone"
                type="tel"
                placeholder="Phone number"
                value={formData.userPhone}
                onChange={handleChange}
              />
              <FormComponent
                name="userEmail"
                label="Email"
                type="email"
                placeholder="Email"
                value={formData.userEmail}
                onChange={handleChange}
              />
              <FormComponent
                name="userPassword"
                label="Password"
                type="password"
                placeholder="Password"
                value={formData.userPassword}
                onChange={handleChange}
              />
              <FormComponent
                name="userConfirmPassword"
                label="ConfirmPassword"
                type="password"
                placeholder="Confirm password"
                value={formData.userConfirmPassword}
                onChange={handleChange}
              />
              <ButtonFormComponent type="submit" disabled={!isValid()}>
                Sign up
              </ButtonFormComponent>
            </form>
          )}
          <div className="case__login">
          Have you an account ?
            <u>
              <Link to="./login" className="btn__goto__login">
                Log in
              </Link>
            </u>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
