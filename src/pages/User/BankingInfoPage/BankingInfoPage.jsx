import React from "react";
import "./BankingInfoPage.css";
import qr1 from "../../../assets/img/QR1.png";
import qr2 from "../../../assets/img/QR2.png";
import { useNavigate } from "react-router-dom";
import BackIconComponent from "../../../components/BackIconComponent/BackIconComponent";
import ButtonComponent from "../../../components/ButtonComponent/ButtonComponent";

const BankingInfoPage = () => {
  const navigate = useNavigate();
  const handleBack = () => {
    navigate("/payment");
  };

  const handleDone = () => {
    navigate("/");
  };

  return (
    <div>
      <div className="container-xl">
        <div className="title-row">
          <BackIconComponent handleBack={handleBack} />

          <h2 className="title__content">Transfer information</h2>
        </div>

        <div className="container-banking">
          <div className="banking-info">
            {/* item 1 */}
            <section className="item-banking">
              <img className="img-banking" src={qr1} alt="QR banking 1" />
              <div
                className="qr-info d-flex flex-column align-items-center"
                style={{ marginTop: "20px auto" }}
              >
                <label className="owner-name">Le Van A</label>

                <label className="bank-name">BIDV </label>
                <label className="bank-number">Bank account number: 012345</label>
              </div>
            </section>
            {/* item 2 */}
            <section className="item-banking">
              <img className="img-banking" src={qr2} alt="QR banking 2" />
              <div className="qr-info d-flex flex-column align-items-center">
                <label className="owner-name">Le Van A</label>
                <label className="bank-name">MOMO </label>
                <label className="bank-number">Momo account number: 012345</label>
              </div>
            </section>
          </div>
          <ButtonComponent
            onClick={handleDone}
            style={{ width: "50%", margin: "30px auto" }}
          >
            Done
          </ButtonComponent>
        </div>
      </div>
    </div>
  );
};

export default BankingInfoPage;
