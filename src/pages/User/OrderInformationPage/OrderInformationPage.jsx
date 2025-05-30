import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useMutationHook } from "../../../hooks/useMutationHook";
import * as OrderService from "../../../services/OrderService";
import { addOrder } from "../../../redux/slides/orderSlide";
import ProductInfor from "../../../components/ProductInfor/ProductInfor";
import ButtonComponent from "../../../components/ButtonComponent/ButtonComponent";
import BackIconComponent from "../../../components/BackIconComponent/BackIconComponent";
import FormComponent from "../../../components/FormComponent/FormComponent";
import "./OrderInformation.css";

const OrderInformationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const selectedProducts = Array.isArray(location.state?.selectedProductDetails)
    ? location.state.selectedProductDetails
    : [];

  const user = useSelector((state) => state.user);
  const isLoggedIn = !!user?.userEmail;
  const shippingPrice = 30000;

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
  const [errors, setErrors] = useState({});
  const [statusMessage, setStatusMessage] = useState("");

  const mutation = useMutationHook((data) => OrderService.createOrder(data));

  useEffect(() => {
    if (isLoggedIn) {
      setShippingAddress({
        familyName: user.familyName || "",
        userName: user.userName || "",
        userAddress: user.userAddress || "",
        userWard: user.userWard || "",
        userDistrict: user.userDistrict || "",
        userCity: user.userCity || "",
        userPhone: user.userPhone || "",
        userEmail: user.userEmail || "",
      });
    }
  }, [isLoggedIn, user]);

  const totalItemPrice = useMemo(() => {
    if (!Array.isArray(selectedProducts)) return 0;
    return selectedProducts.reduce((acc, product) => {
      const price =
        typeof product.price === "number"
          ? product.price
          : parseFloat((product.price ?? "0").toString().replace(/[^0-9.-]+/g, ""));
      return acc + price * product.quantity;
    }, 0);
  }, [selectedProducts]);

  const totalPrice = useMemo(() => totalItemPrice + shippingPrice, [totalItemPrice]);

  const validateForm = () => {
    const newErrors = {};
    const phoneRegex = /^\d{10}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!shippingAddress.familyName.trim()) {
      newErrors.familyName = "Last Name is required";
    }

    if (!shippingAddress.userName.trim()) {
      newErrors.userName = "First Name is required";
    }

    if (!shippingAddress.userPhone.trim()) {
      newErrors.userPhone = "Phone Number is required";
    } else if (!/^\d+$/.test(shippingAddress.userPhone.trim())) {
      newErrors.userPhone = "Phone Number must contain only digits";
    } else if (!phoneRegex.test(shippingAddress.userPhone.trim())) {
      newErrors.userPhone = "Phone Number must be exactly 10 digits";
    }

    if (!shippingAddress.userEmail.trim()) {
      newErrors.userEmail = "Email cannot be empty";
    } else if (!emailRegex.test(shippingAddress.userEmail.trim())) {
      newErrors.userEmail = "Invalid email format";
    }

    if (selectedProducts.length === 0) {
      newErrors.products = "No products in cart";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field) => (e) => {
    const value = e.target.value;
    if (field === "userPhone") {
      if (/^\d*$/.test(value) || value === "") {
        setShippingAddress((prev) => ({ ...prev, [field]: value }));
      }
    } else {
      setShippingAddress((prev) => ({ ...prev, [field]: value }));
    }
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleDeliveryDateChange = (e) => setDeliveryDate(e.target.value);
  const handleDeliveryTimeChange = (e) => setDeliveryTime(e.target.value);
  const handleOrderNoteChange = (e) => setOrderNote(e.target.value);

  const handleClickBack = () => {
    navigate("/cart");
  };

  const handleClickNext = async () => {
    if (!validateForm()) {
      return;
    }

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
      shippingAddress: {
        familyName: shippingAddress.familyName.trim(),
        userName: shippingAddress.userName.trim(),
        userAddress: shippingAddress.userAddress.trim(),
        userWard: shippingAddress.userWard.trim(),
        userDistrict: shippingAddress.userDistrict.trim(),
        userCity: shippingAddress.userCity.trim(),
        userPhone: shippingAddress.userPhone.trim(),
        userEmail: shippingAddress.userEmail.trim(),
      },
      paymentMethod: "Online Payment",
      userId: user?.id || null,
      deliveryDate: deliveryDate || null,
      deliveryTime: deliveryTime || null,
      orderNote: orderNote.trim() || null,
      shippingPrice,
      status,
      totalItemPrice,
      totalPrice,
    };

    try {
      const response = await mutation.mutateAsync(orderData);
      if (response?.data?._id) {
        const fullOrderData = { ...orderData, orderId: response.data._id };
        dispatch(addOrder(fullOrderData));
        navigate("/payment", { state: { ...fullOrderData } });
      } else {
        setStatusMessage("Failed to create order. Please try again.");
      }
    } catch (error) {
      setStatusMessage("Failed to create order. Please try again.");
    }
  };

  return (
    <div className="container-xl cart-container">
      <div className="titleHolder">
        <BackIconComponent className="back_btn" onClick={handleClickBack} />
        <h1 className="title">Order Information</h1>
      </div>

      {selectedProducts.length === 0 ? (
        <p>No products in cart</p>
      ) : (
        <div className="product_area">
          <table>
            <thead>
              <tr className="HeaderHolder">
                <th className="ProductInforHear">Product</th>
                <th className="PriceHeader">Price</th>
                <th className="QuantityHeader">Quantity</th>
                <th className="MoneyHeader">Subtotal</th>
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
                  <td className="PriceProduct">
                    {typeof product.price === "number"
                      ? product.price.toLocaleString()
                      : parseFloat(product.price.toString().replace(/[^0-9.-]+/g, "")).toLocaleString()}{" "}
                    VND
                  </td>
                  <td className="QuantityBtn">x {product.quantity}</td>
                  <td className="Money">
                    {(
                      (typeof product.price === "number"
                        ? product.price
                        : parseFloat(product.price.toString().replace(/[^0-9.-]+/g, ""))) *
                      product.quantity
                    ).toLocaleString()}{" "}
                    VND
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="LineProduct">
                <td colSpan="3">Shipping Fee:</td>
                <td>{shippingPrice.toLocaleString()} VND</td>
              </tr>
              <tr className="total-price">
                <td colSpan="3" className="text-end" style={{ fontWeight: "bold", fontSize: "2rem" }}>
                  Total:
                </td>
                <td className="text-end" style={{ fontWeight: "bold", fontSize: "2rem" }}>
                  {totalPrice.toLocaleString()} VND
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      <div className="question" style={{ margin: "10px 50px" }}>
        <p className="login-question">
          Already have an account?{" "}
          <Link to="/login" className="login-link">
            Log in
          </Link>
        </p>
      </div>

      <div className="shipping-info">
        {statusMessage && <p className="error-message">{statusMessage}</p>}
        <div className="input-name" style={{ display: "flex", padding: "10px 50px", gap: "20px" }}>
          <div style={{ flex: 1 }}>
            <h2>Last Name</h2>
            <FormComponent
              className="input-familyName"
              name="familyName"
              type="text"
              placeholder="Enter Last Name"
              value={shippingAddress.familyName}
              onChange={handleInputChange("familyName")}
            />
            {errors.familyName && <span className="error">{errors.familyName}</span>}
          </div>
          <div style={{ flex: 1 }}>
            <h2>First Name</h2>
            <FormComponent
              className="input-name"
              name="userName"
              type="text"
              placeholder="Enter First Name"
              value={shippingAddress.userName}
              onChange={handleInputChange("userName")}
            />
            {errors.userName && <span className="error">{errors.userName}</span>}
          </div>
        </div>

        <div className="input-phone-email" style={{ display: "flex", padding: "10px 50px", gap: "20px" }}>
          <div style={{ flex: 1 }}>
            <h2>Phone Number</h2>
            <FormComponent
              className="input-phone"
              name="userPhone"
              type="tel"
              placeholder="Enter Phone Number"
              value={shippingAddress.userPhone}
              onChange={handleInputChange("userPhone")}
            />
            {errors.userPhone && <span className="error">{errors.userPhone}</span>}
          </div>
          <div style={{ flex: 1 }}>
            <h2>Email</h2>
            <FormComponent
              className="input-email"
              name="userEmail"
              type="email"
              placeholder="Enter Email"
              value={shippingAddress.userEmail}
              onChange={handleInputChange("userEmail")}
            />
            {errors.userEmail && <span className="error">{errors.userEmail}</span>}
          </div>
        </div>

        <div className="address" style={{ padding: "10px 50px" }}>
          <h2>Address</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
            <div style={{ flex: "1 1 45%" }}>
              <FormComponent
                name="userAddress"
                type="text"
                placeholder="Street, House Number"
                value={shippingAddress.userAddress}
                onChange={handleInputChange("userAddress")}
              />
            </div>
            <div style={{ flex: "1 1 45%" }}>
              <FormComponent
                name="userWard"
                type="text"
                placeholder="Ward"
                value={shippingAddress.userWard}
                onChange={handleInputChange("userWard")}
              />
            </div>
            <div style={{ flex: "1 1 45%" }}>
              <FormComponent
                name="userDistrict"
                type="text"
                placeholder="District"
                value={shippingAddress.userDistrict}
                onChange={handleInputChange("userDistrict")}
              />
            </div>
            <div style={{ flex: "1 1 45%" }}>
              <FormComponent
                name="userCity"
                type="text"
                placeholder="City/Province"
                value={shippingAddress.userCity}
                onChange={handleInputChange("userCity")}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="DeliveryTimeHolder" style={{ padding: "10px 50px" }}>
        <p className="ThoiGian">Expected Delivery Time:</p>
        <div className="d-flex" style={{ gap: "50px", margin: "20px 0px" }}>
          <div>
            <h3>Select Time:</h3>
            <input
              className="clock"
              type="time"
              value={deliveryTime}
              onChange={handleDeliveryTimeChange}
              data-testid="time-input"
            />
          </div>
          <div>
            <h3>Select Date:</h3>
            <input
              className="Datepicker"
              id="datePicker"
              type="date"
              value={deliveryDate}
              onChange={handleDeliveryDateChange}
              data-testid="date-input"
            />
          </div>
        </div>
      </div>

      <div className="Note" style={{ padding: "10px 50px" }}>
        <h2>Order Note:</h2>
        <textarea
          rows="5"
          cols="50"
          placeholder="Enter order note..."
          className="inputNote"
          value={orderNote}
          onChange={handleOrderNoteChange}
        />
      </div>

      <div className="Button-area" style={{ padding: "10px 50px" }}>
        <button className="chinhsachBtn">
          <a href="/chinhsach" target="_blank" className="chinhsach">
            Order Policy
          </a>
        </button>
        <div className="Btn_holder">
          <ButtonComponent onClick={handleClickBack}>Back to Cart</ButtonComponent>
          <ButtonComponent className="Next_btn" onClick={handleClickNext}>
            Checkout
          </ButtonComponent>
        </div>
      </div>
    </div>
  );
};

export default OrderInformationPage;