import React, { useEffect, useState } from "react";
import "./OrderListPage.css";
import SideMenuComponent from "../../../../components/SideMenuComponent/SideMenuComponent";
import ButtonComponent from "../../../../components/ButtonComponent/ButtonComponent";
import CheckboxComponent from "../../../../components/CheckboxComponent/CheckboxComponent";
import DropdownComponent from "../../../../components/DropdownComponent/DropdownComponent";
import { useNavigate } from "react-router-dom";
import * as OrderService from "../../../../services/OrderService";
import * as StatusService from "../../../../services/StatusService";
import { DropdownButton, Dropdown } from "react-bootstrap";

const OrderListPage = () => {
  const [orders, setOrders] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showLoading, setShowLoading] = useState(false);
  const navigate = useNavigate();

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

  const handleUpdateStatusList = () => {
    const selectedOrders = orders.filter((order) =>
      selectedRows.includes(order._id)
    );

    if (selectedOrders.length === 0) {
      alert("Vui lòng chọn ít nhất một đơn hàng để cập nhật trạng thái.");
      return;
    }

    const currentStatuses = [
      ...new Set(selectedOrders.map((order) => order.status.statusName)),
    ];

    if (currentStatuses.length > 1) {
      alert("Chỉ được chọn các đơn hàng có cùng trạng thái.");
      return;
    }

    const currentStatus = selectedOrders[0].status; // Lấy trạng thái hiện tại
    navigate("/admin/order-status/update", {
      state: { selectedOrders, currentStatus },
    });
  };

  const handleDetail = () => {
    if (selectedRows.length === 1) {
      const selectedOrderId = selectedRows[0]; // Lấy ID của đơn hàng được chọn

      const selectedOrder = orders.find(
        (order) => order._id === selectedOrderId // Tìm đơn hàng trong danh sách
      );

      if (selectedOrder) {
        navigate("/admin/order-detail", { state: selectedOrder }); // Truyền dữ liệu qua state
      } else {
        alert("Không tìm thấy đơn hàng đã chọn.");
      }
    } else {
      alert("Vui lòng chọn 1 đơn hàng để xem chi tiết!");
    }
  };

  const isSelected = (id) => selectedRows.includes(id);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      // console.log("token", token);
      const response = await OrderService.getAllOrders(token);
      // console.log("response", response);
      setOrders(response?.data || []);
      setFilteredOrders(response?.data || []);
    } catch (err) {
      setError(err.message || "Đã xảy ra lỗi khi tải danh sách đơn hàng.");
    } finally {
      setLoading(false);
    }
  };

  // console.log("orders", orders);

  const fetchStatuses = async () => {
    setShowLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      const response = await StatusService.getAllStatus(token);
      const statusOptions = [
        { label: "Tất cả", value: null },
        ...response.data.map((status) => ({
          label: status.statusName,
          value: status.statusCode,
        })),
      ];
      setStatuses(statusOptions);
    } catch (error) {
      console.error("Failed to fetch statuses", error.message);
    } finally {
      setShowLoading(false);
    }
  };

  useEffect(() => {
    fetchStatuses();
    fetchOrders();
  }, []);

  const toggleSelectRow = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    setSelectedRows(
      selectedRows.length === filteredOrders.length
        ? []
        : filteredOrders.map((order) => order._id)
    );
  };

  const handleFilter = (statusCode) => {
    setSelectedStatus(statusCode);
    if (!statusCode) {
      setFilteredOrders(orders); // Hiển thị tất cả đơn hàng
    } else {
      setFilteredOrders(
        orders.filter((order) => order.status?.statusCode === statusCode)
      );
    }
  };

  return (
    <div>
      <div className="container-xl">
        <div className="order-list__info">
          {/* side menu */}
          <div className="side-menu__order">
            <SideMenuComponent className="btn-menu" onClick={ClickInfor}>
              Store information 
            </SideMenuComponent>
            <SideMenuComponent className="btn-menu" onClick={ClickOrder}>
              Order
            </SideMenuComponent>
            <SideMenuComponent className="btn-menu" onClick={ClickDiscount}>
              Promotion
            </SideMenuComponent>
            <SideMenuComponent className="btn-menu" onClick={ClickStatus}>
              Status
            </SideMenuComponent>
            <SideMenuComponent className="btn-menu" onClick={ClickCategory}>
              Category
            </SideMenuComponent>
            <SideMenuComponent className="btn-menu" onClick={ClickUser}>
              User
            </SideMenuComponent>
            <SideMenuComponent className="btn-menu" onClick={ClickReport}>
              Statistic
            </SideMenuComponent>
          </div>
          {/* order list */}
          <div className="order-list__content">
            <div className="order-list__action">
              <h2 className="order-list__title">Danh sách đơn hàng</h2>
              <div className="btn__action">
                <ButtonComponent
                  className="btn btn-detail"
                  onClick={handleDetail}
                >
                  Chi tiết
                </ButtonComponent>
                {/* <ButtonComponent className="btn btn-cancel">
                  Hủy đơn
                </ButtonComponent> */}
                <ButtonComponent
                  className="btn btn-update"
                  onClick={handleUpdateStatusList}
                >
                  Cập nhật
                </ButtonComponent>
              </div>
            </div>
            <div className="filter-order">
              <DropdownButton
                className="filter-order__status"
                title={
                  selectedStatus
                    ? statuses.find((s) => s.value === selectedStatus)?.label ||
                      "Chọn trạng thái"
                    : "Chọn trạng thái"
                }
                onSelect={handleFilter}
              >
                {statuses.map((status, index) => (
                  <Dropdown.Item key={index} eventKey={status.value}>
                    {status.label}
                  </Dropdown.Item>
                ))}
              </DropdownButton>
              {/* <ButtonComponent>Lọc</ButtonComponent> */}
            </div>
            {/* table */}
            <div className="table-container">
              <table className="order-table">
                <thead>
                  <tr>
                    <th>
                      <CheckboxComponent
                        isChecked={
                          selectedRows.length === filteredOrders.length
                        }
                        onChange={toggleSelectAll}
                      />
                    </th>
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
                  {filteredOrders.map((order, index) => (
                    <tr
                      key={order._id}
                      className={isSelected(order._id) ? "highlight" : ""}
                    >
                      <td>
                        <CheckboxComponent
                          isChecked={isSelected(order._id)}
                          onChange={() => toggleSelectRow(order._id)}
                        />
                      </td>
                      <td>{index + 1}</td>
                      <td>{order.orderCode}</td>
                      <td>
                        {order.shippingAddress.familyName +
                          " " +
                          order.shippingAddress.userName}
                      </td>
                      <td>{order.status?.statusName || "Không xác định"}</td>
                      <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td>
                        {order.deliveryDate
                          ? new Date(order.deliveryDate).toLocaleDateString()
                          : "Chưa xác định"}
                      </td>
                      <td>{order.totalPrice?.toLocaleString()} VND</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderListPage;
