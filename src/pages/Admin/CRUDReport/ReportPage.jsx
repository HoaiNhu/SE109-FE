import React, { useEffect, useState } from "react";
import "./ReportPage.css";
import SideMenuComponent from "../../../components/SideMenuComponent/SideMenuComponent";
import ButtonComponent from "../../../components/ButtonComponent/ButtonComponent";
import CheckboxComponent from "../../../components/CheckboxComponent/CheckboxComponent";
import DropdownComponent from "../../../components/DropdownComponent/DropdownComponent";
import { useNavigate } from "react-router-dom";
import * as OrderService from "../../../services/OrderService";
import * as ProductService from "../../../services/productServices";
import { Dropdown, DropdownButton } from "react-bootstrap";

const ReportDropdown = ({
  title,
  options,
  selectedValue,
  onSelect,
  className,
}) => {
  const selectedLabel =
    selectedValue &&
    options.find((o) => o.value.toString() === selectedValue.toString())?.label;

  return (
    <DropdownButton
      title={selectedLabel || title}
      className={`custom-dropdown ${className}`}
      onSelect={(value) => onSelect(value)}
    >
      {options.map((option, index) => (
        <Dropdown.Item key={index} eventKey={option.value}>
          {option.label}
        </Dropdown.Item>
      ))}
    </DropdownButton>
  );
};

const ReportPage = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [statistics, setStatistics] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);

  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedTable, setSelectedTable] = useState("product");

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await OrderService.getAllOrders(token);
      console.log("responseOrder", response);
      setOrders(response.data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await ProductService.getAllproduct();
      setProducts(response.data || []);
      console.log("responseProduct", response);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const calculateStatistics = () => {
    const productStats = {};

    let revenue = 0;
    let quantity = 0;

    orders.forEach((order) => {
      revenue += order.totalPrice;

      order.orderItems.forEach((item) => {
        const productId = item.product._id;
        console.log("productId", productId);

        const product = products.find((p) => p._id === productId);
        // console.log("product", product);

        if (!product) return;

        const itemRevenue = item.total;
        const itemQuantity = item.quantity;

        // revenue += itemRevenue;
        quantity += itemQuantity;

        if (!productStats[productId]) {
          productStats[productId] = {
            code: product._id,
            name: product.productName,
            price: product.productPrice,
            quantity: 0,
            total: 0,
          };

          // console.log("productStats", productStats)
        }

        productStats[productId].quantity += itemQuantity;
        productStats[productId].total += itemRevenue;
      });
    });

    const statsArray = Object.values(productStats).map((stat) => ({
      ...stat,
      percentage: ((stat.total / revenue) * 100).toFixed(2) + "%",
    }));

    setStatistics(statsArray);
    setTotalRevenue(revenue);
    setTotalQuantity(quantity);
  };

  const calculateOrderStatistics = () => {
    return orders.map((order, index) => ({
      stt: index + 1,
      orderCode: order.orderCode,
      totalProducts: order.orderItems.reduce(
        (sum, item) => sum + item.quantity,
        0
      ),
      orderDate: new Date(order.createdAt).toLocaleDateString(),
      completionDate: order.deliveryDate
        ? new Date(order.deliveryDate).toLocaleDateString()
        : "Incomplete",
      totalPrice: order.totalPrice,
    }));
  };

  useEffect(() => {
    fetchOrders();
    fetchProducts();
  }, []);

  useEffect(() => {
    if (orders.length > 0 && products.length > 0) {
      calculateStatistics();
    }
  }, [orders, products]);

  const toggleSelectRow = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    setSelectedRows(
      selectedRows.length === statistics.length
        ? []
        : statistics.map((promo) => promo.id)
    );
  };

  const isSelected = (id) => selectedRows.includes(id);

  const days = Array.from({ length: 31 }, (_, i) => ({
    label: `Date ${i + 1}`,
    value: i + 1,
  }));

  const months = Array.from({ length: 12 }, (_, i) => ({
    label: `Month ${i + 1}`,
    value: i + 1,
  }));

  const years = Array.from({ length: 7 }, (_, i) => ({
    label: `Year ${2020 + i}`,
    value: 2020 + i,
  }));

  const tables = [
    { label: "Product Table", value: "product" },
    { label: "Order Table", value: "order" },
  ];

  const handleView = () => {
    let filteredOrders = [...orders];

    if (selectedDay) {
      filteredOrders = filteredOrders.filter(
        (order) =>
          new Date(order.createdAt).getDate() === parseInt(selectedDay, 10) ||
          (order.deliveryDate &&
            new Date(order.deliveryDate).getDate() ===
              parseInt(selectedDay, 10))
      );
    }
    if (selectedMonth) {
      filteredOrders = filteredOrders.filter(
        (order) =>
          new Date(order.createdAt).getMonth() + 1 ===
            parseInt(selectedMonth, 10) ||
          (order.deliveryDate &&
            new Date(order.deliveryDate).getMonth() + 1 ===
              parseInt(selectedMonth, 10))
      );
    }
    if (selectedYear) {
      filteredOrders = filteredOrders.filter(
        (order) =>
          new Date(order.createdAt).getFullYear() ===
            parseInt(selectedYear, 10) ||
          (order.deliveryDate &&
            new Date(order.deliveryDate).getFullYear() ===
              parseInt(selectedYear, 10))
      );
    }

    if (selectedTable === "product") {
      calculateStatistics(filteredOrders); // Lọc sản phẩm từ đơn hàng
    } else {
      setOrders(filteredOrders); // Lọc và hiển thị đơn hàng
    }

    console.log("Filtered Orders:", filteredOrders);
  };

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

  return (
    <div>
      <div className="container-xl">
        <div className="report-list__info">
          {/* side menu */}
          <div className="side-menu__report">
            <SideMenuComponent onClick={ClickInfor}>
              Store information
            </SideMenuComponent>
            <SideMenuComponent onClick={ClickOrder}>Đơn hàng</SideMenuComponent>
            <SideMenuComponent onClick={ClickDiscount}>
              Promotion
            </SideMenuComponent>
            <SideMenuComponent onClick={ClickStatus}>
              Status
            </SideMenuComponent>
            <SideMenuComponent onClick={ClickCategory}>
              Product category
            </SideMenuComponent>
            <SideMenuComponent onClick={ClickUser}>
              User list
            </SideMenuComponent>
            <SideMenuComponent onClick={ClickReport}>
              Statistic
            </SideMenuComponent>
          </div>

          <div className="report-list__content">
            <div className="report-list__action">
              <div className="report-dropdown-container">
                <ReportDropdown
                  title="Choose date"
                  options={days}
                  selectedValue={selectedDay}
                  onSelect={(value) => setSelectedDay(value)}
                  className="report-dropdown"
                />
                <ReportDropdown
                  title="Choose month"
                  options={months}
                  selectedValue={selectedMonth}
                  onSelect={(value) => setSelectedMonth(value)}
                  className="report-dropdown"
                />
                <ReportDropdown
                  title="Choose year"
                  options={years}
                  selectedValue={selectedYear}
                  onSelect={(value) => setSelectedYear(value)}
                  className="report-dropdown"
                />
                <ReportDropdown
                  title="Choose table"
                  options={tables}
                  selectedValue={selectedTable}
                  onSelect={(value) => setSelectedTable(value)}
                  className="report-dropdown"
                />
                <div className="btn__action">
                  <ButtonComponent className="btn-view" onClick={handleView}>
                  View Statistics 
                  </ButtonComponent>
                </div>
              </div>
            </div>

            <div class="report-total-container">
              <div class="report-container">
                <div class="report-title">
                  <table>
                    <tr>
                      <th>TOTAL REVENUE</th>
                    </tr>
                  </table>
                </div>

                <div class="report-data">
                  <table>
                    <tr>
                      <td>{totalRevenue.toLocaleString()}</td>
                    </tr>
                  </table>
                </div>
              </div>

              <div class="report-container">
                <div class="report-title">
                  <table>
                    <tr>
                      <th>TOTAL PRODUCTS SOLD</th>
                    </tr>
                  </table>
                </div>

                <div class="report-data">
                  <table>
                    <tr>
                      <td>{totalQuantity}</td>
                    </tr>
                  </table>
                </div>
              </div>
            </div>

            {/* table thống kê theo sản phẩm */}
            <div className="table-container">
              <h3 style={{ padding: "10px 20px" }}>Statistics by Product</h3>
              <table className="promo-table">
                <thead>
                  <tr>
                    <th>
                      <CheckboxComponent
                        isChecked={selectedRows.length === statistics.length}
                        onChange={toggleSelectAll}
                      />
                    </th>
                    <th>No.</th>
                    <th>Code</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total revenue</th>
                    <th>Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {statistics.map((stat, index) => (
                    <tr
                      key={stat.id}
                      className={
                        isSelected(stat.id || stat._id) ? "highlight" : ""
                      }
                    >
                      <td>
                        <CheckboxComponent
                          isChecked={isSelected(statistics.id)}
                          onChange={() => toggleSelectRow(statistics.id)}
                        />
                      </td>
                      <td>{index + 1}</td>
                      <td>{stat.code}</td>
                      <td>{stat.name}</td>
                      <td>{stat.price}</td>
                      <td>{stat.quantity}</td>
                      <td>{stat.total}</td>
                      <td>{stat.percentage}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Bảng thống kê theo đơn hàng */}
            <div className="table-container">
              <h3 style={{ padding: "10px 20px" }}>Statistics by Order</h3>
              <table className="promo-table">
                <thead>
                  <tr>
                    <th>
                      <CheckboxComponent
                        isChecked={selectedRows.length === orders.length}
                        onChange={toggleSelectAll}
                      />
                    </th>
                    <th>No.</th>
                    <th>Order ID</th>
                    <th>Total products</th>
                    <th>Order time</th>
                    <th>Completion time</th>
                    <th>Total amount</th>
                  </tr>
                </thead>
                <tbody>
                  {calculateOrderStatistics().map((order) => (
                    <tr key={order.orderCode}>
                      <td>
                        <CheckboxComponent
                          isChecked={isSelected(order.orderCode)}
                          onChange={() => toggleSelectRow(order.orderCode)}
                        />
                      </td>
                      <td>{order.stt}</td>
                      <td>{order.orderCode}</td>
                      <td>{order.totalProducts}</td>
                      <td>{order.orderDate}</td>
                      <td>{order.completionDate}</td>
                      <td>{order.totalPrice.toLocaleString()} VND</td>
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

export default ReportPage;
