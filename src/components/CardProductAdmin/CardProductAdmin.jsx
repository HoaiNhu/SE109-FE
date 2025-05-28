import React, { useState } from "react";
import { Card, Button, Col, Row, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import styles from "./CardProductAdmin.css";
import TagPriceComponent from "../TagPriceComponent/TagPriceComponent";
import EditIconComponent from "../EditIconComponent/EditIconComponent";

const CardProductAdmin = ({ id, type, img, title, price, onUpdate }) => {
  const navigate = useNavigate();

  const handleUpdateClick = () => {
    navigate("/update-product"); // Navigate to the update product page
    if (onUpdate) {
      onUpdate(); // Call the onUpdate function passed from the parent
    }
  };

  return (
    <Card
      style={{
        width: "29rem", // Set card width
        overflow: "hidden",
        borderRadius: 15,
        margin: "auto",
        cursor: "pointer",
      }}
      className={type === "primary" ? styles.primary : styles.secondary}
    >
      <Card.Img
        src={img}
        alt={title}
        style={{
          borderTopLeftRadius: "15px",
          borderTopRightRadius: "15px",
          objectFit: "cover",
          height: "200px",
          width: "100%",
        }}
      />
      <Card.Body style={{ background: "#000" }}>
        <Card.Title
          style={{
            fontSize: "2rem",
            lineHeight: 1.5,
            textTransform: "capitalize",
            textAlign: "center",
            color: "#fff",
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
            {price}
          </Card.Subtitle>
        )}
        {type === "primary" && (
          <div
          // style={{
          //   display: "flex",
          //   justifyContent: "space-between",
          //   alignItems: "center",
          // }}
          >
            <Button
              style={{
                background: "transparent",
                border: "none",
              }}
              onClick={handleUpdateClick}
            >
              <EditIconComponent />
            </Button>
            <TagPriceComponent>{price}</TagPriceComponent>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default CardProductAdmin;
