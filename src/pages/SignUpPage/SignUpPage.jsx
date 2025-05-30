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
  const [errors, setErrors] = useState({});

  const mutation = useMutationHook((data) => UserService.signupUser(data));
  const { data, isSuccess, isError } = mutation;

  useEffect(() => {
    if (isSuccess) {
      console.log("Mutation successful, navigating to /login");
      setShowLoading(false);
      setStatusMessage({
        type: "Success",
        message: "Registration successful! Redirecting to the login page...",
      });
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } else if (isError) {
      console.log("Signup mutation failed:", mutation.error?.message || "Unknown error");
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
  }, [isSuccess, isError, mutation.error, navigate]);

  const validateForm = () => {
    const newErrors = {};
    const nameRegex = /^[a-zA-Z\s\u00C0-\u1EF9]+$/;
    const phoneRegex = /^\d{10}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!formData.familyName.trim()) {
      newErrors.familyName = "Last name is required";
    } else if (!nameRegex.test(formData.familyName.trim())) {
      newErrors.familyName = "Last Name can only contain letters and spaces";
    }

    if (!formData.userName.trim()) {
      newErrors.userName = "First name is required";
    } else if (!nameRegex.test(formData.userName.trim())) {
      newErrors.userName = "First Name can only contain letters and spaces";
    }

    if (!formData.userPhone.trim()) {
      newErrors.userPhone = "Phone number is required";
    } else if (!phoneRegex.test(formData.userPhone.trim())) {
      newErrors.userPhone = "Phone number must contain only digits";
    }

    if (!formData.userEmail.trim()) {
      newErrors.userEmail = "Email is required";
    } else if (!emailRegex.test(formData.userEmail.trim())) {
      newErrors.userEmail = "Invalid email format, no accented characters allowed";
    }

    if (!formData.userPassword.trim()) {
      newErrors.userPassword = "Password is required";
    }

    if (formData.userPassword.trim() !== formData.userConfirmPassword.trim()) {
      newErrors.userConfirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    console.log("Validation errors:", newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    console.log("Form data updated:", { ...formData, [name]: value });

    const newErrors = { ...errors };
    const nameRegex = /^[a-zA-Z\s\u00C0-\u1EF9]+$/;
    const phoneRegex = /^\d{10}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (name === "familyName") {
      if (!value.trim()) {
        newErrors.familyName = "Last name is required";
      } else if (!nameRegex.test(value.trim())) {
        newErrors.familyName = "Last Name can only contain letters and spaces";
      } else {
        delete newErrors.familyName;
      }
    }

    if (name === "userName") {
      if (!value.trim()) {
        newErrors.userName = "First name is required";
      } else if (!nameRegex.test(value.trim())) {
        newErrors.userName = "First Name can only contain letters and spaces";
      } else {
        delete newErrors.userName;
      }
    }

    if (name === "userPhone") {
      if (!value.trim()) {
        newErrors.userPhone = "Phone number is required";
      } else if (!phoneRegex.test(value.trim())) {
        newErrors.userPhone = "Phone number must contain only digits";
      } else {
        delete newErrors.userPhone;
      }
    }

    if (name === "userEmail") {
      if (!value.trim()) {
        newErrors.userEmail = "Email is required";
      } else if (!emailRegex.test(value.trim())) {
        newErrors.userEmail = "Invalid email format, no accented characters allowed";
      } else {
        delete newErrors.userEmail;
      }
    }

    if (name === "userPassword") {
      if (!value.trim()) {
        newErrors.userPassword = "Password is required";
      } else {
        delete newErrors.userPassword;
      }
      if (value.trim() !== formData.userConfirmPassword.trim()) {
        newErrors.userConfirmPassword = "Passwords do not match";
      } else {
        delete newErrors.userConfirmPassword;
      }
    }

    if (name === "userConfirmPassword") {
      if (value.trim() !== formData.userPassword.trim()) {
        newErrors.userConfirmPassword = "Passwords do not match";
      } else {
        delete newErrors.userConfirmPassword;
      }
    }

    setErrors(newErrors);
    console.log("Errors after change:", newErrors);
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

    const nameRegex = /^[a-zA-Z\s\u00C0-\u1EF9]+$/;
    const phoneRegex = /^\d{10}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    return (
      familyName.trim() !== "" &&
      nameRegex.test(familyName.trim()) &&
      userName.trim() !== "" &&
      nameRegex.test(userName.trim()) &&
      userPhone.trim() !== "" &&
      phoneRegex.test(userPhone.trim()) &&
      userEmail.trim() !== "" &&
      emailRegex.test(userEmail.trim()) &&
      userPassword.trim() !== "" &&
      userPassword.trim() === userConfirmPassword.trim()
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted with data:", formData);
    if (validateForm()) {
      console.log("Form is valid, initiating signup mutation");
      setShowLoading(true);
      mutation.mutate(formData);
    } else {
      console.log("Form validation failed:", errors);
    }
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
                type="text"
                placeholder="Last name"
                value={formData.familyName}
                onChange={handleChange}
                error={errors.familyName}
              />
              <FormComponent
                name="userName"
                type="text"
                placeholder="First name"
                value={formData.userName}
                onChange={handleChange}
                error={errors.userName}
              />
              <FormComponent
                name="userPhone"
                type="tel"
                placeholder="Phone number"
                value={formData.userPhone}
                onChange={handleChange}
                error={errors.userPhone}
              />
              <FormComponent
                name="userEmail"
                type="email"
                placeholder="Email"
                value={formData.userEmail}
                onChange={handleChange}
                error={errors.userEmail}
              />
              <FormComponent
                name="userPassword"
                type="password"
                placeholder="Password"
                value={formData.userPassword}
                onChange={handleChange}
                error={errors.userPassword}
              />
              <FormComponent
                name="userConfirmPassword"
                type="password"
                placeholder="Confirm password"
                value={formData.userConfirmPassword}
                onChange={handleChange}
                error={errors.userConfirmPassword}
              />
              <ButtonFormComponent type="submit" disabled={!isValid()}>
                Sign up
              </ButtonFormComponent>
            </form>
          )}
          <div className="case__login">
            Have you an account?{" "}
            <u>
              <Link to="/login" className="btn__goto__login">
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