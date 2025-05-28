import React, { useState, useEffect } from "react";
import "./QuantityBtn.css";
import { useDispatch } from "react-redux";
import { updateQuantity } from "../../redux/slides/cartSlide";

const QuantityBtn = ({ initialQuantity, productId, maxQuantity }) => {
  const [quantity, setQuantity] = useState(initialQuantity || 1);
  const dispatch = useDispatch();

  useEffect(() => {
    // Nếu initialQuantity thay đổi từ bên ngoài, cập nhật lại
    setQuantity(initialQuantity);
  }, [initialQuantity]);

  const increaseQuantity = () => {
    if (maxQuantity !== undefined && quantity >= maxQuantity) {
      alert("Bạn đã đạt đến số lượng tồn kho tối đa.");
      return;
    }
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    dispatch(updateQuantity({ id: productId, quantity: newQuantity }));
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      dispatch(updateQuantity({ id: productId, quantity: newQuantity }));
    }
  };

  return (
    <div className="cart-item__quantity">
      <button className="Minus" onClick={decreaseQuantity}>
        -
      </button>
      <span>{quantity}</span>
      <button className="Add" onClick={increaseQuantity}>
        +
      </button>
    </div>
  );
};

export default QuantityBtn;
