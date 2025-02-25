import React, { useEffect, useState } from "react";
import "./UpdateStatus.css"; // Import file CSS
import SideMenuComponent from "../../../../components/SideMenuComponent/SideMenuComponent";
import ButtonComponent from "../../../../components/ButtonComponent/ButtonComponent";
import TruckIconComponent from "../../../../components/TruckIconComponent/TruckIconComponent";
import { useLocation, useNavigate } from "react-router-dom";
import * as StatusService from "../../../../services/StatusService";
import * as OrderService from "../../../../services/OrderService";

const UpdateStatus = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const handelClickExit = () => {
    navigate("/admin/order-list");
  };
  const ClickInfor = () => {
    navigate("/admin/store-info");
  };
  const ClickOrder = () => {
    navigate("/admin/order-list");
  };
  const ClickDiscount = () => {
    navigate("/admin/discount-list");
  };
  const ClickStatus = () => {
    navigate("/admin/status-list");
  };
  const ClickCategory = () => {
    navigate("/admin/category-list");
  };
  const ClickUser = () => {
    navigate("/admin/user-list");
  };
  const ClickReport = () => {
    navigate("/admin/report");
  };

  const { selectedOrders, currentStatus } = location.state || {};
  console.log("selectedOrders", selectedOrders);
  const [orders, setOrders] = useState(selectedOrders || []);
  // console.log("orders", orders);
  const [statuses, setStatuses] = useState([]); // Tất cả status
  const [currentIndex, setCurrentIndex] = useState(-1);

  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await StatusService.getAllStatus(token);
        setStatuses(response.data || []);
      } catch (error) {
        console.error("Error fetching statuses:", error);
      }
    };

    fetchStatuses();
  }, []);

  useEffect(() => {
    if (statuses.length > 0 && currentStatus) {
      const index = statuses.findIndex(
        (status) => status.statusName === currentStatus.statusName
      );
      setCurrentIndex(index);
    }
  }, [statuses, currentStatus]);

  //update status
  const updateStatus = async () => {
    if (currentIndex === -1 || currentIndex === statuses.length - 1) {
      alert("Đây là trạng thái cuối cùng.");
      return;
    }

    const currentStatus = statuses[currentIndex];
    if (currentStatus.statusCode === "COMPLETED") {
      alert("Trạng thái hiện tại là 'Đã giao'. Không thể cập nhật thêm.");
      return;
    }

    const nextStatus = statuses[currentIndex + 1];
    try {
      const token = localStorage.getItem("access_token");
      const updatedOrders = await Promise.all(
        orders.map((order) =>
          OrderService.updateOrderStatus(order._id, nextStatus._id, token)
        )
      );

      console.log("updatedOrders", updatedOrders);

      const updatedOrdersWithDetails = updatedOrders.map((updatedOrder) => {
        const updatedOrderData = updatedOrder.data; // Lấy `data` từ response
        const detailedStatus = statuses.find(
          (status) => status._id === updatedOrderData.status // Tìm trạng thái chi tiết
        );
        return {
          ...updatedOrderData, // Dữ liệu đơn hàng
          status: detailedStatus, // Gắn thêm trạng thái chi tiết
        };
      });

      alert("Cập nhật trạng thái thành công!");
      setOrders(updatedOrdersWithDetails);
      setCurrentIndex((prev) => prev + 1); // Cập nhật chỉ số trạng thái
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Đã xảy ra lỗi khi cập nhật trạng thái.");
    }
  };

  //cancel order
  const cancelOrders = async () => {
    if (currentIndex === -1 || currentIndex === statuses.length - 1) {
      alert("Đây là trạng thái cuối cùng.");
      return;
    }

    const currentStatus = statuses[currentIndex];
    if (currentStatus.statusCode === "COMPLETED") {
      alert("Trạng thái hiện tại là 'Đã giao'. Không thể cập nhật thêm.");
      return;
    }

    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        alert("Access token is missing");
        return;
      }

      // Tìm trạng thái hủy (CANCEL)
      const cancelStatus = statuses.find(
        (status) => status.statusCode === "CANCEL"
      );
      if (!cancelStatus) {
        alert("Không tìm thấy trạng thái hủy.");
        return;
      }

      // Cập nhật trạng thái hủy cho các đơn hàng đã chọn
      const updatedOrders = await Promise.all(
        orders.map((order) =>
          OrderService.updateOrderStatus(order._id, cancelStatus._id, token)
        )
      );

      const updatedOrdersWithDetails = updatedOrders.map((updatedOrder) => {
        const updatedOrderData = updatedOrder.data;
        const detailedStatus = statuses.find(
          (status) => status._id === updatedOrderData.status
        );
        return {
          ...updatedOrderData,
          status: detailedStatus,
        };
      });

      alert("Hủy đơn thành công!");
      setOrders(updatedOrdersWithDetails);
      setCurrentIndex(statuses.length - 1);
    } catch (error) {
      console.error("Error canceling orders:", error);
      alert("Đã xảy ra lỗi khi hủy đơn.");
    }
  };

  const isLastStatus = currentStatus === statuses[statuses.length - 1];
  // const currentIndex = statuses.indexOf(currentStatus);

  if (!statuses || !selectedOrders) {
    return <p>Không có dữ liệu để hiển thị. Vui lòng kiểm tra lại.</p>;
  }

  return (
    <div className="container-xl">
      <div className="holderContent-updateStatus">
        {/* side menu */}
        <div className="side-menu__discount">
          <SideMenuComponent onClick={ClickInfor}>
            Thông tin cửa hàng
          </SideMenuComponent>
          <SideMenuComponent onClick={ClickOrder}>Đơn hàng</SideMenuComponent>
          <SideMenuComponent onClick={ClickDiscount}>
            Khuyến mãi
          </SideMenuComponent>
          <SideMenuComponent onClick={ClickStatus}>
            Trạng thái
          </SideMenuComponent>
          <SideMenuComponent onClick={ClickCategory}>
            Loại sản phẩm
          </SideMenuComponent>
          <SideMenuComponent onClick={ClickUser}>
            Danh sách người dùng
          </SideMenuComponent>
          <SideMenuComponent onClick={ClickReport}>Thống kê</SideMenuComponent>
        </div>
        <div className="right-area-UpdateStatus">
          <h2
            style={{
              margin: "20px",
            }}
          >
            Cập nhật trạng thái đơn hàng
          </h2>
          <label
            style={{
              margin: "20px",
            }}
          >
            Trạng thái hiện tại
          </label>
          <div className="status-bar">
            <div className="progress-line-wrapper">
              <div
                className="progress-line"
                style={{
                  width: `${(currentIndex / (statuses.length - 1)) * 100}%`, // Adjust width based on current progress
                  backgroundColor: "#B1E321", // Green color for completed part
                }}
              />
              <div className="status-circle-wrapper">
                {statuses.map((status, index) => (
                  <div
                    key={index}
                    className={`status-circle ${
                      index === currentIndex ? "active" : ""
                    } ${index < currentIndex ? "completed" : ""}`}
                  >
                    <div className="car-icon">
                      {index === currentIndex && (
                        <span>
                          <TruckIconComponent />
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="status-labels">
              {statuses.map((status, index) => (
                <div key={index} className="status-label">
                  {status.statusName}
                </div>
              ))}
            </div>
          </div>

          {/* table */}
          <div className="table-container">
            <table className="order-table">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Mã đơn</th>
                  <th>Khách hàng</th>
                  <th>Trạng thái</th>
                  <th>Ngày đặt</th>
                  <th>Ngày giao</th>
                  <th>Tổng tiền</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => (
                  <tr key={order._id}>
                    <td>{index + 1}</td>
                    <td>{order.orderCode}</td>
                    <td>
                      {order.shippingAddress.familyName +
                        " " +
                        order.shippingAddress.userName}
                    </td>
                    <td>{order.status?.statusName}</td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>
                      {order.deliveryDate
                        ? new Date(order.deliveryDate).toLocaleDateString()
                        : "Chưa giao"}
                    </td>
                    <td>{order.totalPrice.toLocaleString()} VND</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="BtnHolder-UpdateStatus gap-3">
            <div className="UpdateStatus-btn">
              <ButtonComponent
                onClick={updateStatus}
                disabled={isLastStatus}
                className="UpdateStatus-btnCustom"
              >
                Cập nhật trạng thái
              </ButtonComponent>
            </div>
            <ButtonComponent
              className="btn btn-cancel"
              onClick={cancelOrders}
              style={{ marginLeft: "20px" }}
            >
              Hủy đơn
            </ButtonComponent>
            <div className="ExitHolder-btn">
              <ButtonComponent onClick={handelClickExit}>Thoát</ButtonComponent>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateStatus;
