import React, { useState } from "react";
import "./CartPage.css";
import ButtonComponent from "../../../components/ButtonComponent/ButtonComponent";
import { useNavigate } from "react-router-dom";
import ProductInfor from "../../../components/ProductInfor/ProductInfor";
import imageProduct from "../../../assets/img/hero_3.jpg";
import QuantityBtn from "../../../components/QuantityBtn/QuantityBtn";
import DeleteBtn from "../../../components/DeleteBtn/DeleteBtn";
import CheckboxComponent from "../../../components/CheckboxComponent/CheckboxComponent";
import BackIconComponent from "../../../components/BackIconComponent/BackIconComponent";
import { useDispatch, useSelector } from "react-redux";
import {
  removeFromCart,
  updateQuantity,
} from "../../../redux/slides/cartSlide";
const CartPage = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleNavigate = (path) => {
    navigate(path);
  };

  const products = useSelector((state) => state.cart.products);
  // console.log("products", products);
  console.log("products in cart", products);

  const calculatePrice = (price) => {
    if (typeof price !== 'string') {
      price = String(price); // Nếu price không phải là chuỗi, chuyển nó thành chuỗi
    }
    return parseFloat(price.replace(/[^0-9.-]+/g, ""));
  };

  const totalAmount = products.reduce((acc, product) => {
    return acc + calculatePrice(product.price) * product.quantity;
  }, 0);

  //   const totalAmount = products.reduce((acc, product) => acc + product.price, 0);
  // const calculateTotal = () => {
  //   return products.reduce((total, product) => {
  //     const quantity = product.quantity || 1; // Default to 1 if quantity is missing
  //     // console.log("quantity", quantity);
  //     const price = parseFloat(
  //       product.price.toString().replace(/[^\d.-]/g, "")
  //     ); // Remove 'VND' or other non-numeric chars
  //     return total + price * quantity;
  //   }, 0);
  // };

  // const totalAmount = calculateTotal();

  //Chọn sản phẩm muốn mua

  const isSelected = (productId) => selectedProducts.includes(productId);
  const [selectedProducts, setSelectedProducts] = useState([]); //lưu sản phẩm được chọn
  // Hàm toggle chọn/deselect sản phẩm
  const toggleSelectRow = (productId) => {
    const product = products.find((p) => p.id === productId);

    if (!product) return;

    if (product.productQuantity === 0) {
      alert(`Sản phẩm "${product.title}" đã hết hàng.`);
      return;
    }

    if (product.quantity > product.productQuantity) {
      alert(
        `Sản phẩm "${product.title}" có số lượng vượt quá tồn kho. Hiện còn lại ${product.productQuantity} sản phẩm.`
      );
      return;
    }

    setSelectedProducts((prev) => {
      const updated = prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId];
      console.log("Updated selected products:", updated);
      return updated;
    });
  };


  // Hàm xử lý khi nhấn "Mua ngay"
  const handleBuyNow = () => {
    const selectedProductDetails = products.filter((product) =>
      selectedProducts.includes(product.id)
    );

    const overstockedItems = selectedProductDetails.filter(
      (product) => product.quantity > product.productQuantity
    );

    if (overstockedItems.length > 0) {
      alert("Một số sản phẩm có số lượng vượt quá tồn kho. Vui lòng điều chỉnh lại.");
      return;
    }

    navigate("/order-information", { state: { selectedProductDetails } });
  };

  // Hàm toggle chọn/deselect tất cả
  const toggleSelectAll = () => {
    setSelectedProducts(
      selectedProducts.length === products.length
        ? [] // Bỏ chọn tất cả
        : products.map((product) => product.id) // Chọn tất cả
    );
  };

  // Hàm xử lý xóa sản phẩm
  const handleRemoveProduct = (id) => {
    dispatch(removeFromCart({ id }));
  };

  return (
    <div className="container-xl cart-container">
      <div className="titleHolderCart">
        <button
          className="back_btn"
          onClick={() => handleNavigate("/products")}
        >
          <BackIconComponent />
        </button>
        <h1 className="titleCart">CART</h1>
      </div>

      <div className="product_area">
        <table>
          <thead>
            <tr className="HeaderHolder">
              <th>
                <CheckboxComponent
                  isChecked={selectedProducts.length === products.length}
                  onChange={toggleSelectAll}
                />
              </th>
              <th className="ProductInforHear">Information</th>
              <th className="PriceHeader">Price</th>
              <th className="QuantityHeader">Quantity</th>
              <th className="MoneyHeader">Cost</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="LineProduct">
                <td>
                  <CheckboxComponent
                    isChecked={isSelected(product.id)} // Kiểm tra nếu sản phẩm được chọn
                    onChange={() => {
                      console.log("Checkbox clicked for:", product.id);
                      toggleSelectRow(product.id);
                    }} // Toggle chọn sản phẩm
                  />
                </td>
                <td className="ProductInfor">
                  <ProductInfor
                    image={product.img}
                    name={product.title}
                    size={product.size}
                  />
                </td>
                <td className="PriceProduct">
                  <p className="Price">{product.price}</p>
                </td>
                <td className="QuantityBtn">
                  <QuantityBtn
                    initialQuantity={product.quantity}
                    productId={product.id}
                    maxQuantity={product.productQuantity}
                  />


                </td>
                <td className="Money">
                  <p className="MoneyProduct">
                    {(
                      calculatePrice(product.price) * product.quantity
                    ).toLocaleString()}{" "}
                    VND
                  </p>
                </td>
                <td className="DeleteBtn">
                  <DeleteBtn onClick={() => handleRemoveProduct(product.id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="Btnarea">
          <div className="total-holder">
            <p className="tong">Order Total:</p>
            <p className="total">{totalAmount.toLocaleString()} VND</p>
          </div>
          <div className="Btnholder">
            <button
              className="Buy_more"
              onClick={() => handleNavigate("/products")}
            >
              Buy more
            </button>
            <ButtonComponent
              className="Buy_btn"
              onClick={handleBuyNow}
              disabled={selectedProducts.length === 0}
            >
              Pay
            </ButtonComponent>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
