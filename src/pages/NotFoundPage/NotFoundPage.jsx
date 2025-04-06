import React from "react";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import ButtonNoBGComponent from "../../components/ButtonNoBGComponent/ButtonNoBGComponent";
import FooterComponent from "../../components/FooterComponent/FooterComponent";
import FormComponent from "../../components/FormComponent/FormComponent";
import SearchBoxComponent from "../../components/SearchBoxComponent/SearchBoxComponent";
import SideMenuComponent from "../../components/SideMenuComponent/SideMenuComponent";
import "./NotFoundPage.css";
import OTPComponent from "../../components/OTPComponent/OTPComponent";
import SizeComponent from "../../components/SizeComponent/SizeComponent";
import AddBtn from "../../components/AddBtn(+)/AddBtn";
import AddToCartButtonComponent from "../../components/AddToCartButtonComponent/AddToCartButtonComponent";

const NotFoundPage = () => {
  return (
    <div className="bg">
      <h1>This page is unavailable</h1>
      <ButtonComponent>Đăng nhập</ButtonComponent>
      <SearchBoxComponent></SearchBoxComponent>
      <ButtonNoBGComponent className="custom_btn">home</ButtonNoBGComponent>
      <FormComponent
        id="emailInput"
        label="Email"
        type="email"
        placeholder="Nhập email"
      />
      <FooterComponent></FooterComponent>
      <SideMenuComponent></SideMenuComponent>
      <OTPComponent></OTPComponent>
      <SizeComponent></SizeComponent>
      <AddBtn></AddBtn>
      <AddToCartButtonComponent></AddToCartButtonComponent>
    </div>
  );
};

export default NotFoundPage;
