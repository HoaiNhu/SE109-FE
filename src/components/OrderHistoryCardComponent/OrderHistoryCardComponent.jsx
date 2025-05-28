import React from "react";
import ProductRowComponent from "../ProductRowComponent/ProductRowComponent";
import StatusComponent from "../StatusComponent/StatusComponent";
import ButtonComponent from "../ButtonComponent/ButtonComponent";
import "./OrderHistoryCardComponent.css";
import { useNavigate } from "react-router-dom";

const OrderHistoryCardComponent = ({ order }) => {
  const navigate = useNavigate(); // Hook điều hướng

  const handleViewDetails = (id) => {
    console.log("ORDERID", id)
    
    console.log("ITEM", order)
    navigate(`/order-detail-history/${id}`, { state: { order} }); // Chuyển hướng với dữ liệu
  };

  // const totalAmount = order.products.reduce((acc, product) => {
  //   return acc + parseInt(product.price) * parseInt(product.quantity); // Tổng tiền của tất cả sản phẩm
  // }, 0);
  const totalAmount = order.totalPrice;
  // console.log("ORDERCOMPONENT", order.orderItems)
  console.log("ORDERCOMPONENT1313", totalAmount)
  return (
    <div className="order-card">
      <div className="order-title d-flex align-items-center">
        <StatusComponent
          status={order.status.statusName}
        />
      </div>
      <div className="order-products">
        {Array.isArray(order.orderItems) && order.orderItems.length > 0 ? (
          order.orderItems.map((item, index) => (
            <ProductRowComponent key={index} product={item} />
          ))
        ) : (
          <div>No products found in this order.</div>
        )}

        <div className="order-footer d-flex justify-content-between align-items-center">
          <ButtonComponent className="btn-detail" onClick={() => handleViewDetails(order._id)}   >
            Details
          </ButtonComponent>
          <div className="order-total d-flex text-center gap-5">
            <label>Order Total: </label>{" "}
            <div>{totalAmount.toLocaleString()} VND</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderHistoryCardComponent;
