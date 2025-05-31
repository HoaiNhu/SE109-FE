import React from "react";
import FormComponent from "../../../../components/FormComponent/FormComponent";
import SideMenuComponent from "../../../../components/SideMenuComponent/SideMenuComponent";
import ButtonComponent from "../../../../components/ButtonComponent/ButtonComponent";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createUser } from "../../../../services/UserService";
import Loading from "../../../../components/LoadingComponent/Loading";
import Message from "../../../../components/MessageComponent/Message";
import * as UserService from "../../../../services/UserService";
import { useMutationHook } from "../../../../hooks/useMutationHook";
import { isAdmin } from "../../../../utils";

const AddUserPage = () => {
  const [formData, setFormData] = useState({
    familyName: "",
    userName: "",
    userPhone: "",
    userEmail: "",
    userPassword: "",
    userConfirmPassword: "",
    userAddress: "",
    userImage: "",
    isAdmin: "",
  });

  const [showLoading, setShowLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length === 0 && isValid()) {
      setShowLoading(true);
      mutation.mutate(formData);
    } else {
      setErrors(validationErrors);
    }
  };

  const handleExit = () => {
    navigate(location.state?.from || "/user-list");
  };

  const mutation = useMutationHook((data) => UserService.signupUser(data));
  useEffect(() => {
    if (mutation.isSuccess) {
      setFormData({
        familyName: "",
        userName: "",
        userPhone: "",
        userEmail: "",
        userPassword: "",
        userConfirmPassword: "",
        userAddress: "",
        userImage: "",
        isAdmin: "",
      });
      setStatusMessage({
        type: "Success",
        message: "Add user successful!",
      });
      setErrors({});
    } else if (mutation.isError) {
      const errorMessage =
        mutation.error?.message.message ||
        JSON.stringify(mutation.error) ||
        "Error when add user.";
      console.log("errorMessage", errorMessage);
      setStatusMessage({
        type: "Error",
        message: errorMessage,
      });
    }
  }, [mutation.isSuccess, mutation.isError, mutation.error]);

  const handleChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
    // Xóa lỗi khi người dùng chỉnh sửa
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
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

  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10,11}$/;

    // Validate Last name
    if (formData.familyName.length > 50) {
      errors.familyName = "Last name must not exceed 50 characters.";
    }

    // Validate First name
    if (formData.userName.length > 50) {
      errors.userName = "First name must not exceed 50 characters.";
    }

    // Validate Phone
    if (!phoneRegex.test(formData.userPhone)) {
      errors.userPhone = "Phone must be a valid 10-11 digit number.";
    }

    // Validate Email
    if (!emailRegex.test(formData.userEmail)) {
      errors.userEmail =
        "Email must be a valid format (e.g., user@example.com).";
    }

    // Validate Password
    if (formData.userPassword.length > 20) {
      errors.userPassword = "Password must not exceed 20 characters.";
    } else if (formData.userPassword.length < 6) {
      errors.userPassword = "Password must be at least 6 characters.";
    }

    // Validate Confirm password
    if (formData.userPassword !== formData.userConfirmPassword) {
      errors.userConfirmPassword = "Passwords do not match.";
    }

    // Validate Address
    if (formData.userAddress.length > 100) {
      errors.userAddress = "Address must not exceed 100 characters.";
    }

    // Validate Admin role
    if (
      formData.isAdmin &&
      !["true", "false"].includes(formData.isAdmin.toLowerCase())
    ) {
      errors.isAdmin = "Admin role must be 'true' or 'false'.";
    }

    return errors;
  };

  const ClickInfor = () => {
    navigate("/admin/store-info");
  };
  const ClickOrder = () => {
    navigate("/admin/order-list");
  };
  const ClickDiscount = () => {
    navigate("/admin/discount-list");
  };
  const ClickStatus = () => {
    navigate("/admin/status-list");
  };
  const ClickCategory = () => {
    navigate("/admin/category-list");
  };
  const ClickUser = () => {
    navigate("/admin/user-list");
  };
  const ClickReport = () => {
    navigate("/admin/report");
  };

  return (
    <div>
      <div className="container-xl">
        {statusMessage && (
          <Message
            type={statusMessage.type}
            message={statusMessage.message}
            duration={3000}
            onClose={() => setStatusMessage(null)}
          />
        )}
        <div className="add-status__container">
          {/* side menu */}
          <div className="side-menu__status">
            <SideMenuComponent onClick={ClickInfor}>
              Store information
            </SideMenuComponent>
            <SideMenuComponent onClick={ClickOrder}> Order</SideMenuComponent>
            <SideMenuComponent onClick={ClickDiscount}>
              Promotion
            </SideMenuComponent>
            <SideMenuComponent onClick={ClickStatus}>Status</SideMenuComponent>
            <SideMenuComponent onClick={ClickCategory}>
              Category
            </SideMenuComponent>
            <SideMenuComponent onClick={ClickUser}>User</SideMenuComponent>
            <SideMenuComponent onClick={ClickReport}>
              Statistic
            </SideMenuComponent>
          </div>

          <div className="add-status__content">
            <div className="status__info">
              <div className="add-status__title">
                <h2>Add user</h2>
              </div>

              {!showLoading && (
                <div className="content">
                  <div className="content__item">
                    <label className="family__title">Last name</label>
                    <FormComponent
                      placeholder="Nguyễn"
                      name="familyName"
                      value={formData.familyName}
                      onChange={handleChange}
                      error={errors.familyName}
                    ></FormComponent>
                  </div>
                  <div className="content__item">
                    <label className="name__title">First name</label>
                    <FormComponent
                      placeholder="Văn A"
                      name="userName"
                      value={formData.userName}
                      onChange={handleChange}
                      error={errors.userName}
                    ></FormComponent>
                  </div>
                  <div className="content__item">
                    <label className="phone__title">Phone</label>
                    <FormComponent
                      placeholder="0123456789"
                      name="userPhone"
                      value={formData.userPhone}
                      onChange={handleChange}
                      error={errors.userPhone}
                    ></FormComponent>
                  </div>
                  <div className="content__item">
                    <label className="email__title">Email</label>
                    <FormComponent
                      placeholder="abc123@gmail.com"
                      name="userEmail"
                      value={formData.userEmail}
                      onChange={handleChange}
                      error={errors.userEmail}
                    ></FormComponent>
                  </div>
                  <div className="content__item">
                    <label className="password__title">Password</label>
                    <FormComponent
                      placeholder="*******"
                      type="password"
                      name="userPassword"
                      value={formData.userPassword}
                      onChange={handleChange}
                      error={errors.userPassword}
                      data-testid="password-input"
                    ></FormComponent>
                  </div>
                  <div className="content__item">
                    <label className="confirm-password__title">
                      Confirm password
                    </label>
                    <FormComponent
                      placeholder="*******"
                      type="password"
                      name="userConfirmPassword"
                      value={formData.userConfirmPassword}
                      onChange={handleChange}
                      error={errors.userConfirmPassword}
                      data-testid="confirm-password-input"
                    ></FormComponent>
                  </div>
                  <div className="content__item">
                    <label className="address__title">Address</label>
                    <FormComponent
                      placeholder="1/1 khu phố 8"
                      name="userAddress"
                      value={formData.userAddress}
                      onChange={handleChange}
                      error={errors.userAddress}
                    ></FormComponent>
                  </div>
                  <div className="content__item">
                    <label className="description__title">Admin role</label>
                    <FormComponent
                      placeholder="true/false"
                      name="isAdmin"
                      value={formData.isAdmin}
                      onChange={handleChange}
                      error={errors.isAdmin}
                    ></FormComponent>
                  </div>
                </div>
              )}
              {/* button */}
              <div className="btn__add-status">
                <ButtonComponent
                  type="submit"
                  onClick={handleSubmit}
                  // Bỏ disabled để đảm bảo handleSubmit luôn được gọi
                >
                  Add
                </ButtonComponent>
                <ButtonComponent onClick={handleExit}>Exit</ButtonComponent>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddUserPage;
