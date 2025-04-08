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
import BackIconComponent from "../../components/BackIconComponent/BackIconComponent";
import ButtonFormComponent from "../../components/ButtonFormComponent/ButtonFormComponent";
import CardNews from "../../components/CardNews/CardNews";
import CartIconComponent from "../../components/CartIconComponent/CartIconComponent";
import CheckboxComponent from "../../components/CheckboxComponent/CheckboxComponent";
import DeleteBtn from "../../components/DeleteBtn/DeleteBtn";

const NotFoundPage = () => {
  return (
    <div className="bg">
      <h1>This page is unavailable</h1>
      <ButtonComponent>Log in</ButtonComponent>
      <SearchBoxComponent></SearchBoxComponent>
      <ButtonNoBGComponent className="custom_btn">Home</ButtonNoBGComponent>
      {/* <FormComponent
        id="emailInput"
        label="Email"
        type="email"
        placeholder="Nhập email"
      /> */}
      {/* <FooterComponent></FooterComponent> */}
      {/* <SideMenuComponent></SideMenuComponent> */}
      {/* <OTPComponent></OTPComponent> */}
      {/* <SizeComponent></SizeComponent> */}
      {/* <AddBtn></AddBtn> */}
      <AddToCartButtonComponent>Add to cart</AddToCartButtonComponent>
      <CartIconComponent></CartIconComponent>
      <CheckboxComponent></CheckboxComponent>
      <DeleteBtn></DeleteBtn>
      {/* <BackIconComponent></BackIconComponent> */}
      {/* <ButtonFormComponent></ButtonFormComponent> */}
      {/* <CardNews></CardNews> */}
    </div>
  );
};

export default NotFoundPage;
