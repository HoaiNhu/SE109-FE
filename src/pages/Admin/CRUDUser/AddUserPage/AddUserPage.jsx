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
  // const accessToken = localStorage.getItem("access_token");

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

  // const [errorMessage, setErrorMessage] = useState(null);
  const [showLoading, setShowLoading] = useState(false); // Thêm người dùng riêng
  // const [errorMessage, setErrorMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowLoading(true);
    mutation.mutate(formData);
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
        message: "Thêm người dùng thành công!",
      });
    } else if (mutation.isError) {
      const errorMessage =
        mutation.error?.message.message ||
        JSON.stringify(mutation.error) ||
        "Lỗi khi thêm người dùng.";
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
            <SideMenuComponent>Thông tin cửa hàng</SideMenuComponent>
            <SideMenuComponent>Đơn hàng</SideMenuComponent>
            <SideMenuComponent>Khuyến mãi</SideMenuComponent>
            <SideMenuComponent>Trạng thái</SideMenuComponent>
            <SideMenuComponent>Loại sản phẩm </SideMenuComponent>
            <SideMenuComponent>Danh sách người dùng</SideMenuComponent>
            <SideMenuComponent>Thống kê</SideMenuComponent>
          </div>

          <div className="add-status__content">
            <div className="status__info">
              <div className="add-status__title">
                <h2>Thêm người dùng</h2>
              </div>

              {/* <Loading isLoading={showLoading} /> */}
              {!showLoading && (
                <div className="content">
                  <div className="content__item">
                    <label className="family__title">Họ</label>
                    <FormComponent
                      placeholder="Nguyễn"
                      name="familyName"
                      value={formData.familyName}
                      onChange={handleChange}
                    ></FormComponent>
                  </div>
                  <div className="content__item">
                    <label className="name__title">Tên</label>
                    <FormComponent
                      placeholder="Văn A"
                      name="userName"
                      value={formData.userName}
                      onChange={handleChange}
                    ></FormComponent>
                  </div>
                  <div className="content__item">
                    <label className="phone__title">Số điện thoại</label>
                    <FormComponent
                      placeholder="0123456789"
                      name="userPhone"
                      value={formData.userPhone}
                      onChange={handleChange}
                    ></FormComponent>
                  </div>
                  <div className="content__item">
                    <label className="email__title">Email</label>
                    <FormComponent
                      placeholder="abc123@gmail.com"
                      name="userEmail"
                      value={formData.userEmail}
                      onChange={handleChange}
                    ></FormComponent>
                  </div>
                  <div className="content__item">
                    <label className="password__title">Mật khẩu</label>
                    <FormComponent
                      placeholder="*******"
                      type="password"
                      name="userPassword"
                      value={formData.userPassword}
                      onChange={handleChange}
                    ></FormComponent>
                  </div>
                  <div className="content__item">
                    <label className="confirm-password__title">
                      Nhập lại mật khẩu
                    </label>
                    <FormComponent
                      placeholder="*******"
                      type="password"
                      name="userConfirmPassword"
                      value={formData.userConfirmPassword}
                      onChange={handleChange}
                    ></FormComponent>
                  </div>
                  <div className="content__item">
                    <label className="address__title">Địa chỉ</label>
                    <FormComponent
                      placeholder="1/1 khu phố 8"
                      name="userAddress"
                      value={formData.userAddress}
                      onChange={handleChange}
                    ></FormComponent>
                  </div>
                  <div className="content__item">
                    <label className="description__title">Vai trò Admin</label>
                    <FormComponent
                      placeholder="true/false"
                      name="isAdmin"
                      value={formData.isAdmin}
                      onChange={handleChange}
                    ></FormComponent>
                  </div>
                </div>
              )}
              {/* button */}
              <div className="btn__add-status">
                <ButtonComponent
                  type="submit"
                  onClick={handleSubmit}
                  disabled={!isValid()}
                >
                  Thêm
                </ButtonComponent>
                <ButtonComponent onClick={handleExit}>Thoát</ButtonComponent>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddUserPage;
