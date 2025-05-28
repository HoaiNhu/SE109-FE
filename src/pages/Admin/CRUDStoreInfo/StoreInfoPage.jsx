import React from "react";
import "./StoreInfoPage.css";
import DropdownComponent from "../../../components/DropdownComponent/DropdownComponent";
import FormComponent from "../../../components/FormComponent/FormComponent";
import SideMenuComponent from "../../../components/SideMenuComponent/SideMenuComponent";
import ButtonComponent from "../../../components/ButtonComponent/ButtonComponent";
import logo from "../../../assets/img/AVOCADO.png";
import { useNavigate } from "react-router-dom";
const StoreInfoPage = () => {
  const navigate = useNavigate();
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
        <div className="store-info__container">
          {/* side menu */}
          <div className="side-menu__info">
            <SideMenuComponent onClick={ClickInfor}>
              Store's Information
            </SideMenuComponent>
            <SideMenuComponent onClick={ClickOrder}>Order</SideMenuComponent>
            <SideMenuComponent onClick={ClickDiscount}>Promo</SideMenuComponent>
            <SideMenuComponent onClick={ClickStatus}>Status</SideMenuComponent>
            <SideMenuComponent onClick={ClickCategory}>
              Category
            </SideMenuComponent>
            <SideMenuComponent onClick={ClickUser}>User</SideMenuComponent>
            <SideMenuComponent onClick={ClickReport}>
              Statistic
            </SideMenuComponent>
          </div>
          {/* content */}
          <div className="store-info">
            <div className="store-info__content">
              {/* top */}
              <div className="row mb-5">
                <div className="col">
                  <label className="title-name">Logo</label>
                  <img className="logo__image-store" src={logo} alt="avocado" />
                </div>
                <div className="col name-phone">
                  <div className="store-name">
                    <label className="title-name">Store's name</label>
                    <FormComponent
                      style={{ width: "100%" }}
                      value="AVOCADO"
                    ></FormComponent>
                  </div>
                  <div className="store-phone">
                    <label className="title-name">Phone</label>
                    <FormComponent
                      style={{ width: "100%" }}
                      value="0334455246"
                    ></FormComponent>
                  </div>
                </div>
              </div>
              {/* bot */}
              <div className="row store-info__email">
                <label className="title-name">Email</label>
                <FormComponent
                  className="store__mail"
                  type="email"
                  style={{ width: "100%" }}
                  value="avocado@gmail.com"
                ></FormComponent>
              </div>
              <div className="row store-info__email mb-5">
                <label className="title-name">Address</label>
                <FormComponent
                  className="store-address mb-3"
                  style={{ width: "100%" }}
                  value="Đường Mạc Đỉnh Chi, khu phố Tân Hòa, Dĩ An, Bình Dương"
                ></FormComponent>
                {/* <div className="dropdown__address">
                  <DropdownComponent></DropdownComponent>
                  <DropdownComponent></DropdownComponent>
                  <DropdownComponent></DropdownComponent>
                </div> */}
              </div>

              {/* button */}
              <div className="btn__store-info">
                <ButtonComponent>Save</ButtonComponent>
                <ButtonComponent>Exit</ButtonComponent>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreInfoPage;
