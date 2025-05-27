import { useLocation, useNavigate } from "react-router-dom";
import SideMenuComponent from "../../../components/SideMenuComponent/SideMenuComponent";
import ProductRowComponent from "../../../components/ProductRowComponent/ProductRowComponent";
import "./OrderDetailHistoryPage.css";
import * as UserService from "../../../services/UserService";
import { resetUser, updateUser } from "../../../redux/slides/userSlide";
import { React, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const OrderDetailHistoryPage = () => {
  const deliveryCost = 30000;
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order; // Lấy dữ liệu từ state
  const [showLoading, setShowLoading] = useState(false); // Thêm trạng thái riêng
  const dispatch = useDispatch();

  if (!order) {
    return <div>Order information not found!</div>;
  }

  const firstOrderItem = order?.orderItems?.[0]; // optional chaining để tránh lỗi

  // Nếu không có bất kỳ sản phẩm nào trong đơn hàng
  if (!firstOrderItem) {
    return <div>No products found in the order.</div>;
  }

  // Tính tổng giá trị đơn hàng nếu có dữ liệu orderItems
  const totalAmount =
    order.orderItems?.reduce((acc, orderItem) => {
      return acc + parseInt(orderItem.total) || 0;
    }, 0) || 0;

  const handleClickProfile = () => {
    navigate("/user-info");
  };
  const handleClickOrder = () => {
    navigate("/order-history");
  };

  const handleNavigationLogin = () => {
    navigate("/login");
  };
  const handleLogout = async () => {
    setShowLoading(true);
    await UserService.logoutUser();
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("cart");
    // console.log(
    //   "Access token after removal:",
    //   localStorage.getItem("access-token")
    // ); // Kiểm tra xem token đã bị xóa chưa
    dispatch(resetUser());
    setShowLoading(false);
    handleNavigationLogin();
  };

  return (
    <div>
      <div className="container-xl">
        <div className="user-info__container">
          {/* Thông tin người dùng */}
          <div className="user-info__top">
            <div className="user-profile">
              <div className="section-item">
                {/* <img
                  className="user-top__avatar"
                  src={order.products?.[0]?.image || "default-image.jpg"} // kiểm tra ảnh sản phẩm
                  alt="Order Avatar"
                /> */}
                {/* <h2 className="user-top__name">Chi tiết đơn hàng</h2> */}
              </div>
            </div>
          </div>

          {/* Nội dung chính */}
          <div className="user-info__bot">
            <div className="side-menu__info">
              <SideMenuComponent onClick={handleClickProfile}>
                Profile
              </SideMenuComponent>
              {/* <SideMenuComponent>Khuyến mãi</SideMenuComponent> */}
              <SideMenuComponent onClick={handleClickOrder}>
                Order
              </SideMenuComponent>
              <SideMenuComponent onClick={handleLogout}>
                Log out
              </SideMenuComponent>
            </div>
            <div className="order-detail-history">
              <div className="detail__content">
                <h2 className="detail__title">Detail's order</h2>
                <div className="row">
                  <label>
                    <strong>Order's ID: </strong>{" "}
                    <label style={{ color: "#fff" }}>{order.orderCode}</label>
                  </label>
                </div>
                <div className="row">
                  <label>
                    <strong>Order's status: </strong>{" "}
                    <label style={{ color: "#fff" }}>
                      {order.status.statusName}
                    </label>
                  </label>
                </div>

                {/* Danh sách sản phẩm */}
                <h3>Products:</h3>
                <div className="product-list">
                  {Array.isArray(order.orderItems) &&
                  order.orderItems.length > 0 ? (
                    order.orderItems.map((item, index) => (
                      <ProductRowComponent key={index} product={item} />
                    ))
                  ) : (
                    <div>No products found in this order.</div>
                  )}
                </div>

                {/* Tổng tiền đơn hàng */}
                <div className="total-cost">
                  <div className="cost">
                    <label className="product-cost">
                      Total product cost: {totalAmount.toLocaleString()} VND
                    </label>
                    <label className="delivery-cost">
                      Shipping fee: {deliveryCost.toLocaleString()} VND
                    </label>
                  </div>
                  <div className="total-bill">
                    Total bill: {(totalAmount + deliveryCost).toLocaleString()}{" "}
                    VND
                  </div>
                </div>

                {/* Thông tin giao hàng */}
                <div className="info-delivery">
                  <div className="info-customer">
                    <label>Order's information</label>
                    <p>
                      Client name: {order.shippingAddress.familyName}{" "}
                      {order.shippingAddress.userName}
                    </p>
                    <p>Phone: {order.shippingAddress.userPhone}</p>
                    <p>Address: {order.shippingAddress?.userAddress}</p>
                  </div>
                  <div className="info-journey">
                    <label>Delivery progress</label>
                    <p>
                      Complete the order.:{" "}
                      {new Date(order.deliveryDate).toLocaleDateString()}
                    </p>
                    <p>
                      Payment: {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                    <p>
                      Order confirmation:{" "}
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                    <p>
                      Order: {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailHistoryPage;
