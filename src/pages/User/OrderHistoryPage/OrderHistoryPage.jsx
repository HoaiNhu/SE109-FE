import { React, useEffect, useState } from "react";
import "./OrderHistoryPage.css";
import SideMenuComponent from "../../../components/SideMenuComponent/SideMenuComponent";
import OrderHistoryCardComponent from "../../../components/OrderHistoryCardComponent/OrderHistoryCardComponent";
import { getOrdersByUser } from "../../../services/OrderService";
import img from "../../../assets/img/hero_1.jpg";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as UserService from "../../../services/UserService";
import { resetUser, updateUser } from "../../../redux/slides/userSlide";

const OrderHistoryPage = () => {
  const [showLoading, setShowLoading] = useState(false); // Thêm trạng thái riêng
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const access_token = localStorage.getItem("access_token");
  console.log("token", access_token);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.id) {
      fetchOrderByUser();
    } else {
      console.error("User ID is missing in Redux state");
    }
  }, [user]);

  const fetchOrderByUser = async () => {
    try {
      setLoading(true);
      console.log("Fetching orders...");
      const access_token = localStorage.getItem("access_token");
      const userId = user.id;

      if (!access_token || !userId) {
        throw new Error("Missing authentication details");
      }

      const response = await getOrdersByUser(access_token, userId);
      console.log("Orders fetched:", response.data);
      setOrders(response.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

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
            <div className="order-history__info">
              <h2 className="order-history__title">Order history</h2>
              {Array.isArray(orders) && orders.length > 0 ? (
                orders.map((order, index) => {
                  console.log(`Order ${index + 1}:`, order); // In ra từng đơn hàng trong console
                  return (
                    <OrderHistoryCardComponent key={order._id} order={order} />
                  );
                })
              ) : (
                <div className="no-orders">
                  There are no orders at the moment
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderHistoryPage;
