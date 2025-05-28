import React, { useEffect, useMemo, useState } from "react";
import ProductInfor from "../../../components/ProductInfor/ProductInfor";
import "./OrderInformation.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ButtonComponent from "../../../components/ButtonComponent/ButtonComponent";
import BackIconComponent from "../../../components/BackIconComponent/BackIconComponent";
import FormComponent from "../../../components/FormComponent/FormComponent";
import { useDispatch, useSelector } from "react-redux";
import { useMutationHook } from "../../../hooks/useMutationHook";
import * as OrderService from "../../../services/OrderService";
import { addOrder, setOrderDetails } from "../../../redux/slides/orderSlide";

const OrderInformationPage = () => {
  const location = useLocation();
  const selectedProducts = Array.isArray(location.state?.selectedProductDetails)
    ? location.state.selectedProductDetails
    : [];
  console.log("selectedProducts1", selectedProducts);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const mutation = useMutationHook((data) => OrderService.createOrder(data));
  const shippingPrice = 30000; // Fixed shipping fee

  const user = useSelector((state) => state.user); // Get user info from Redux
  const isLoggedIn = !!user?.userEmail;

  const handleClickBack = () => {
    navigate("/cart");
  };

  const handleClickNext = async () => {
    const orderData = {
      orderItems: selectedProducts.map((product) => ({
        product: product.id,
        quantity: product.quantity,
        total:
          typeof product.price === "number"
            ? product.price * product.quantity
            : parseFloat((product.price ?? "0").toString().replace(/[^0-9.-]+/g, "")) *
            product.quantity,
      })),
      shippingAddress, // Shipping address
      paymentMethod: "Online Payment",
      userId: user?.id || null,
      deliveryDate,
      deliveryTime,
      orderNote,
      shippingPrice: 30000,
      status,
      totalItemPrice,
      totalPrice,
    };

    console.log("orderData", orderData);

    try {
      const response = await mutation.mutateAsync(orderData);

      if (response?.data?._id) {
        const fullOrderData = { ...orderData, orderId: response.data._id };
        dispatch(addOrder(fullOrderData));
        navigate("/payment", { state: { ...fullOrderData } });
      } else {
        console.error("Failed to create order:", response);
      }
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };

  const [shippingAddress, setShippingAddress] = useState({
    familyName: "",
    userName: "",
    userAddress: "",
    userWard: "",
    userDistrict: "",
    userCity: "",
    userPhone: "",
    userEmail: "",
  });

  const [orderNote, setOrderNote] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");
  const [status, setStatus] = useState("PENDING");

  const totalItemPrice = Array.isArray(selectedProducts)
    ? selectedProducts.reduce((acc, product) => {
      const price =
        typeof product.price === "number"
          ? product.price
          : parseFloat((product.price ?? "0").toString().replace(/[^0-9.-]+/g, ""));
      return acc + price * product.quantity;
    }, 0)
    : 0;

  const totalPrice = useMemo(() => totalItemPrice + shippingPrice, [totalItemPrice]);

  useEffect(() => {
    if (isLoggedIn) {
      setShippingAddress((prev) => ({
        ...prev,
        familyName: user.familyName || "",
        userName: user.userName || "",
        userAddress: user.userAddress || "",
        userWard: user.userWard || "",
        userDistrict: user.userDistrict || "",
        userCity: user.userCity || "",
        userPhone: user.userPhone || "",
        userEmail: user.userEmail || "",
      }));
    }
  }, [isLoggedIn, user]);

  const handleInputChange = (field) => (e) => {
    const value = e.target.value;
    if (typeof value === "string" && value.trim().length >= 0) {
      setShippingAddress((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleDeliveryDateChange = (e) => setDeliveryDate(e.target.value);
  const handleDeliveryTimeChange = (e) => setDeliveryTime(e.target.value);
  const handleOrderNoteChange = (e) => setOrderNote(e.target.value);

  return (
    <div className="container-xl cart-container">
      <div className="titleHolder">
        <div>
          <BackIconComponent className="back_btn" onClick={handleClickBack} />
        </div>
        <div>
          <h1 className="title"> Thông tin đơn hàng</h1>
        </div>
      </div>
      <div className="product_area">
        <table>
          <thead>
            <tr className="HeaderHolder">
              <th className="ProductInforHear">Thông tin sản phẩm</th>
              <th className="PriceHeader">Đơn giá</th>
              <th className="QuantityHeader">Số lượng</th>
              <th className="MoneyHeader">Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {selectedProducts.map((product) => (
              <tr key={product.id} className="LineProduct">
                <td className="ProductInfor">
                  <ProductInfor
                    image={product.img}
                    name={product.title}
                    size={product.size || "N/A"}
                  />
                </td>
                <td className="PriceProduct">{product.price}</td>
                <td className="QuantityBtn">x {product.quantity}</td>
                <td className="Money">
                  <p className="MoneyProduct">
                    {(
                      (typeof product.price === "number"
                        ? product.price
                        : parseFloat(product.price.toString().replace(/[^0-9.-]+/g, ""))) *
                      product.quantity
                    ).toLocaleString()}{" "}
                    VND
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="LineProduct">
              <td colSpan="3">Phí vận chuyển:</td>
              <td>{shippingPrice.toLocaleString()} VND</td>
            </tr>
            <tr
              className="total-price d-flex align-items-center justify-content-between"
              style={{ padding: "20px" }}
            >
              <td
                colSpan="3"
                className="text-end"
                style={{ fontWeight: "bold", fontSize: "2rem" }}
              >
                Tổng tiền:
              </td>
              <td
                className="text-end"
                style={{ fontWeight: "bold", fontSize: "2rem" }}
              >
                {totalPrice.toLocaleString()} VND
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div className="question" style={{ margin: "10px 50px" }}>
        <p className="login-question">
          Bạn đã có tài khoản?{" "}
          <Link to="./login" target="_blank" className="login-link">
            Đăng nhập
          </Link>
        </p>
      </div>

      <div>
        {/* =====Shipping Address===== */}
        <div className="shipping-info">
          <div className="input-name">
            <div
              style={{
                display: "flex",
                padding: "10px 50px",
                justifyContent: "space-between",
              }}
            >
              <div>
                <h2>Họ</h2>
                <FormComponent
                  className="input-familyName"
                  name="family"
                  type="text"
                  placeholder="Nhập họ"
                  value={shippingAddress.familyName}
                  onChange={handleInputChange("familyName")}
                ></FormComponent>
              </div>
              <div>
                <h2>Tên</h2>
                <FormComponent
                  className="input-name"
                  type="text"
                  placeholder="Nhập tên"
                  value={shippingAddress.userName}
                  onChange={handleInputChange("userName")}
                ></FormComponent>
              </div>
            </div>
          </div>
          <div className="input-phone-email">
            <div
              style={{
                display: "flex",
                padding: "10px 50px",
                justifyContent: "space-between",
              }}
            >
              <div>
                <h2>Số điện thoại</h2>
                <FormComponent
                  className="input-phone"
                  type="text"
                  placeholder="Nhập số điện thoại"
                  value={shippingAddress.userPhone}
                  onChange={handleInputChange("userPhone")}
                ></FormComponent>
              </div>
              <div>
                <h2>Email</h2>
                <FormComponent
                  className="input-email"
                  type="text"
                  placeholder="Nhập email"
                  value={shippingAddress.userEmail}
                  onChange={handleInputChange("userEmail")}
                ></FormComponent>
              </div>
            </div>
          </div>
          <div className="address" style={{ padding: "10px 50px" }}>
            <h2>Địa chỉ</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
              <div style={{ flex: "1 1 45%" }}>
                <FormComponent
                  type="text"
                  placeholder="Số nhà, đường"
                  style={{ width: "100%" }}
                  value={shippingAddress.userAddress}
                  onChange={handleInputChange("userAddress")}
                ></FormComponent>
              </div>
              <div style={{ flex: "1 1 45%" }}>
                <FormComponent
                  type="text"
                  placeholder="Phường/Xã"
                  style={{ width: "100%" }}
                  value={shippingAddress.userWard}
                  onChange={handleInputChange("userWard")}
                ></FormComponent>
              </div>
              <div style={{ flex: "1 1 45%" }}>
                <FormComponent
                  type="text"
                  placeholder="Quận/Huyện"
                  style={{ width: "100%" }}
                  value={shippingAddress.userDistrict}
                  onChange={handleInputChange("userDistrict")}
                ></FormComponent>
              </div>
              <div style={{ flex: "1 1 45%" }}>
                <FormComponent
                  type="text"
                  placeholder="Tỉnh/Thành phố"
                  style={{ width: "100%" }}
                  value={shippingAddress.userCity}
                  onChange={handleInputChange("userCity")}
                ></FormComponent>
              </div>
            </div>
          </div>
        </div>

        {/* =====Delivery Time===== */}
        <div className="DeliveryTimeHolder">
          <p className="ThoiGian">Thời gian giao hàng dự kiến:</p>
          <div className="d-flex" style={{ gap: "50px", margin: "20px 0" }}>
            <div>
              <h3>Chọn giờ:</h3>
              <input
                type="time"
                className="clock"
                value={deliveryTime}
                onChange={handleDeliveryTimeChange}
              ></input>
            </div>
            <div>
              <h3>Chọn ngày:</h3>
              <input
                type="date"
                id="datePicker"
                className="Datepicker"
                value={deliveryDate}
                onChange={handleDeliveryDateChange}
              />
            </div>
          </div>
        </div>
        {/* =====Order Note===== */}
        <div className="Note" style={{ margin: "50px 50px" }}>
          <div>
            <h2>Ghi chú đơn hàng:</h2>
            <div>
              <textarea
                rows="5"
                cols="50"
                placeholder="Nhập ghi chú đơn hàng....."
                className="inputNote"
                value={orderNote}
                onChange={handleOrderNoteChange}
              ></textarea>
            </div>
          </div>
        </div>

        {/* =====Buttons===== */}
        <div className="Button-area">
          <button className="chinhsachBtn">
            <a href="/chinhsach" target="_blank" className="chinhsach">
              Chính sách đơn hàng
            </a>
          </button>
          <div className="Btn_holder">
            <div>
              <ButtonComponent onClick={handleClickBack}>
                Giỏ hàng
              </ButtonComponent>
            </div>
            <ButtonComponent className="Next_btn" onClick={handleClickNext}>
              Thanh toán
            </ButtonComponent>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderInformationPage;