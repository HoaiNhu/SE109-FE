
import { useLocation, useNavigate} from "react-router-dom";
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
  const navigate= useNavigate();
  const order = location.state?.order; // Lấy dữ liệu từ state
  const [showLoading, setShowLoading] = useState(false); // Thêm trạng thái riêng
  const dispatch = useDispatch();

  if (!order) {
    return <div>Không tìm thấy thông tin đơn hàng!</div>;
  }

  const firstOrderItem = order?.orderItems?.[0]; // optional chaining để tránh lỗi

  // Nếu không có bất kỳ sản phẩm nào trong đơn hàng
  if (!firstOrderItem) {
    return <div>Không có sản phẩm nào trong đơn hàng.</div>;
  }

  // Tính tổng giá trị đơn hàng nếu có dữ liệu orderItems
  const totalAmount = order.orderItems?.reduce((acc, orderItem) => {
    return acc + parseInt(orderItem.total) || 0;
  }, 0) || 0;

  const handleClickProfile=(()=>{
    navigate('/user-info')
  })
  const handleClickOrder=(()=>{
    navigate('/order-history')
  })
 
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
              <SideMenuComponent onClick={handleClickProfile}>Thông tin cá nhân</SideMenuComponent>
              {/* <SideMenuComponent>Khuyến mãi</SideMenuComponent> */}
              <SideMenuComponent onClick={handleClickOrder}>Đơn hàng</SideMenuComponent>
              <SideMenuComponent onClick={handleLogout}>
                Đăng xuất
              </SideMenuComponent>
            </div>
            <div className="order-detail-history">
              <div className="detail__content">
                <h2 className="detail__title">Chi tiết đơn hàng</h2>
                <div className="row">
                  <label>
                    <strong>ID đơn hàng:</strong> {order.orderCode}
                  </label>
                </div>
                <div className="row">
                  <label>
                    <strong>Trạng thái:</strong> {order.status.statusName}
                  </label>
                </div>

                {/* Danh sách sản phẩm */}
                <h3>Sản phẩm:</h3>
                <div className="product-list">
                  {Array.isArray(order.orderItems) && order.orderItems.length > 0 ? (
                    order.orderItems.map((item, index) => (
                      <ProductRowComponent key={index} product={item} />
                    ))
                  ) : (
                    <div>Không có sản phẩm nào trong đơn hàng này.</div>
                  )}
                </div>

                {/* Tổng tiền đơn hàng */}
                <div className="total-cost">
                  <div className="cost">
                    <label className="product-cost">
                      Tổng tiền sản phẩm: {totalAmount.toLocaleString()} VND
                    </label>
                    <label className="delivery-cost">
                      Phí vận chuyển: {deliveryCost.toLocaleString()} VND
                    </label>
                  </div>
                  <div className="total-bill">
                    Tổng hóa đơn: {(totalAmount + deliveryCost).toLocaleString()} VND
                  </div>
                </div>

                {/* Thông tin giao hàng */}
                <div className="info-delivery">
                  <div className="info-customer">
                    <label>Thông tin giao hàng</label>
                    <p>Tên: {order.shippingAddress.familyName} {order.shippingAddress.userName}</p>
                    <p>Số điện thoại: {order.shippingAddress.userPhone}</p>
                    <p>Địa chỉ: {order.shippingAddress?.userAddress}</p>
                  </div>
                  <div className="info-journey">
                    <label>Hành trình giao hàng</label>
                    <p>Hoàn thành đơn hàng: {new Date(order.deliveryDate).toLocaleDateString()}</p>
                    <p>Thanh toán: {new Date(order.createdAt).toLocaleDateString()}</p>
                    <p>Xác nhận đơn hàng: {new Date(order.createdAt).toLocaleDateString()}</p>
                    <p>Đặt hàng: {new Date(order.createdAt).toLocaleDateString()}</p>
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
