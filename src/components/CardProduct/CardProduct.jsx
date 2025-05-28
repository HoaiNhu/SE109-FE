import Card from "react-bootstrap/Card";
import styles from "./Card.module.css";
import TagPriceComponent from "../TagPriceComponent/TagPriceComponent";
import { Button, Col, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/slides/cartSlide";
import { useState } from "react";
import AddToCartButtonComponent from "../AddToCartButtonComponent/AddToCartButtonComponent";
import { createEntityAdapter } from "@reduxjs/toolkit";

const CardProduct = ({ id, type, img, title, price, onClick , quantity}) => {
  const dispatch = useDispatch();

  //Hiệu ứng sản phẩm bay dô vỏ hàng
  const handleAddToCart = (e) => {
  if (quantity === 0) {
    alert("Sản phẩm đã hết hàng!");
    return;
  }

  // Hiệu ứng bay vào giỏ hàng
  const productElement = e.currentTarget.closest(".card");
  const navIcon = document.querySelector(".nav__icon");

  if (productElement && navIcon) {
    const productRect = productElement.getBoundingClientRect();
    const navIconRect = navIcon.getBoundingClientRect();

    const clone = productElement.cloneNode(true);
    clone.style.position = "fixed";
    clone.style.top = `${productRect.top}px`;
    clone.style.left = `${productRect.left}px`;
    clone.style.width = `${productRect.width}px`;
    clone.style.height = `${productRect.height}px`;
    clone.style.zIndex = 1000;
    clone.style.transition = "all 1.5s cubic-bezier(0.22, 1, 0.36, 1)";
    document.body.appendChild(clone);

    requestAnimationFrame(() => {
      clone.style.transform = `translate(
        ${navIconRect.left - productRect.left}px,
        ${navIconRect.top - productRect.top}px
      ) scale(0.1)`;
      clone.style.opacity = "0.5";
    });

    clone.addEventListener("transitionend", () => {
      clone.remove();
    });
  }

  // Thêm vào giỏ hàng
  dispatch(addToCart({ id, img, title, price,productQuantity : quantity }));
};


  return (
    <Card
      style={{
        width: "29rem",
        overflow: "hidden",
        borderRadius: 15,
        // margin: "auto",
      }}
      className={type === "primary" ? styles.primary : styles.secondary}
    >
      <Card.Img
        onClick={() => onClick(id)}
        src={img}
        alt={title}
        style={{
          // borderTopLeftRadius: "15px",
          // borderTopRightRadius: "15px",
          objectFit: "cover",
          height: "200px",
          width: "100%",
        }}
      />
      <Card.Body>
        <Card.Title
          style={{
            fontSize: "1.6rem",
            fontWeight: 500,
            lineHeight: 1.5,
            textTransform: "capitalize",
            textAlign: "center",
          }}
        >
          {title}
        </Card.Title>
        {type === "secondary" && (
          <Card.Subtitle
            style={{
              fontSize: "2rem",
              fontWeight: 700,
              lineHeight: 1.5,
              textTransform: "capitalize",
              textAlign: "center",
            }}
          >
            {`${price.toLocaleString("en-US")} VND`}
          </Card.Subtitle>
        )}
      </Card.Body>
      {type === "primary" && (
        <div
          className="priceCart"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "15px",
            gap: "20px",
          }}
        >
          <div>
            <TagPriceComponent>
              {`${price.toLocaleString("en-US")} VND`}
            </TagPriceComponent>
          </div>

          <div style={{ alignItems: "center" }}>
           {quantity === 0 ? (
  <p style={{ color: "red", fontWeight: "bold" }}>Hết hàng</p>
) : (
  <AddToCartButtonComponent onClick={handleAddToCart} />
)}

          </div>
        </div>
      )}

      {/* Hiệu ứng sản phẩm bay */}
      {/* {isFlying && (
        <div
          className="flying-product"
          style={{
            ...flyStyle,
          }}
        >
          <img src={img} alt={title} />
        </div>
      )} */}
    </Card>
  );
};

export default CardProduct;
