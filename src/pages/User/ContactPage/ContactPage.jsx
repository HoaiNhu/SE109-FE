import React from "react";
import "./ContactPage.css";
import address from "../../../assets/img/address.png";
const ContactPage = () => {
  return (
    <div className="container-xl">
      <h1 className="h1">CONTACT</h1>
      <div style={{ display: "flex" }}>
        <div style={{ width: "auto" }}>
          <div style={{ marginTop: 30 }}>
            <h3>NNN. Co., Ltd.</h3>

            <label>
              Address: Mac Dinh Chi Street, Tan Hoa Quarter, Di An City, Binh
              Duong Province
            </label>
            <br />
            <label>Email: abc123@gmail.com</label>
            <br />
            <label>Website: avocado.com</label>
          </div>
          <div style={{ marginTop: 30 }}>
            <h3>Hotline</h3>
            <label>Phone number: 0912345678</label>
            <br />
            <label>Customer Service Hotline: 0999999999</label>
          </div>
        </div>
        <div>
          <a href="https://maps.app.goo.gl/FMaW1VRMx8zUBUom7">
            <img className="imgContact" src={address}></img>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
