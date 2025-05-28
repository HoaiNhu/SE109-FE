import Card from "react-bootstrap/Card";
import styles from "./Card.module.css";
import TagPriceComponent from "../TagPriceComponent/TagPriceComponent";
import { Button, Col, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/slides/cartSlide";
import { useState } from "react";
import AddToCartButtonComponent from "../AddToCartButtonComponent/AddToCartButtonComponent";
import { createEntityAdapter } from "@reduxjs/toolkit";

const CardProduct = ({ id, type, img, title, price, onClick }) => {
  const dispatch = useDispatch();

  //Hiệu ứng sản phẩm bay dô vỏ hàng
  const handleAddToCart = (e) => {
    const productElement = e.currentTarget.closest(".card");
    const navIcon = document.querySelector(".nav__icon");

    if (productElement && navIcon) {
      // Get positions
      const productRect = productElement.getBoundingClientRect();
      const navIconRect = navIcon.getBoundingClientRect();

      // Create a clone of the product image
      const clone = productElement.cloneNode(true);
      clone.style.position = "fixed";
      clone.style.top = `${productRect.top}px`;
      clone.style.left = `${productRect.left}px`;
      clone.style.width = `${productRect.width}px`;
      clone.style.height = `${productRect.height}px`;
      clone.style.zIndex = 1000;
      clone.style.transition = "all 1.5s cubic-bezier(0.22, 1, 0.36, 1)";

      // Append clone to body
      document.body.appendChild(clone);

      // Trigger animation
      requestAnimationFrame(() => {
        clone.style.transform = `translate(
          ${navIconRect.left - productRect.left}px,
          ${navIconRect.top - productRect.top}px
        ) scale(0.1)`;
        clone.style.opacity = "0.5";
      });

      // Cleanup after animation
      clone.addEventListener("transitionend", () => {
        clone.remove();
      });
    }

    // Dispatch the action to add to cart

    console.log("Received ID in CardProduct:", id); // Kiểm tra ID
    dispatch(addToCart({ id, img, title, price }));
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
            <AddToCartButtonComponent onClick={handleAddToCart} />
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
