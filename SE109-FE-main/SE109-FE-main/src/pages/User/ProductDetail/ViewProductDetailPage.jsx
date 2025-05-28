import { React, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./ViewProductDetailPage.css";
import SizeComponent from "../../../components/SizeComponent/SizeComponent";
import ButtonComponent from "../../../components/ButtonComponent/ButtonComponent";
import img1 from "../../../assets/img/hero_2.jpg";
import QuantityBtn from "../../../components/QuantityBtn/QuantityBtn";
import { useDispatch } from "react-redux";
import { addToCart } from "../../../redux/slides/cartSlide";

const ViewProductDetailPage = () => {
  const navigate = useNavigate();
  const { state: productData } = useLocation(); // Nhận dữ liệu từ `state`
  const dispatch = useDispatch();
  const [product, setProduct] = useState(
    productData || {
      productName: "",
      productPrice: "",
      productSize: "",
      productCategory: "",
      productImage: null,
      productDescription: "",
    }
  );


  const [imagePreview, setImagePreview] = useState(
    product.productImage || null
  );

  //Lay danh sach Category 
  const [categories, setCategories] = useState([]); // State lưu danh sách category
  useEffect(() => {
    const fetchCategories = async () => {
      try {

        const response = await fetch("http://localhost:3001/api/category/get-all-category", {
          method: "GET", // Phương thức GET để lấy danh sách category
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }

        const data = await response.json(); // Chuyển đổi dữ liệu từ JSON
        console.log("Categories data:", categories);

        // Kiểm tra và gán mảng categories từ data.data
        if (Array.isArray(data.data)) {
          setCategories(data.data); // Lưu danh sách category vào state

        } else {
          console.error("Categories data is not in expected format");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);


    // Hàm thêm sản phẩm vào giỏ hàng
    const handleAddToCart = () => {
      const { productName, productPrice, productImage, productCategory } = product;
      console.log("PRODUCT", product)
      // Dispatch action để thêm vào giỏ hàng
      dispatch(addToCart({ id: productCategory, img: productImage, title: productName, price: productPrice }));
      console.log("PRODUCT", productPrice)
    };

  return (
    <div>
      <div className="container-xl mb-3">
        <h1 className="view-product-detail-title">Chi tiết sản phẩm</h1>
        {/* info top */}
        <div className="view__product-info d-flex gap-3">
          {/* top left */}
          <div className="info__left">
            <img
              className="product__image"
              src={product.productImage}
              alt="Product"
            />
          </div>
          {/* top right */}
          <div className="info__right">
            <div className="product__name">{product.productName}</div>
            <div className="product__info">
              <label>Giá:</label>
              <div className="product__price">{`${product.productPrice.toLocaleString('en-US')} VND`}</div>
              <label>Loại:</label>
              {Array.isArray(categories) && categories.length > 0 ? (
                <div>
                  {categories
                    .filter(category => category._id === product.productCategory) // Lọc danh mục có id trùng
                    .map((category) => (
                      <div key={category._id}>
                        {category.categoryName}
                      </div>
                    ))}
                </div>
              ) : (
                <option disabled>Không có loại sản phẩm</option>
              )}
              <label>Kích thước:</label>
              <div className="size">
                <SizeComponent >{product.productSize}</SizeComponent>
              </div>
              <div className="button_area">
                <ButtonComponent style={{ width: '200px', marginRight: '20px' }} onClick={handleAddToCart} >Thêm vào giỏ hàng</ButtonComponent>
                <ButtonComponent onClick={() => navigate('/products')}>Thoát</ButtonComponent>
              </div>
            </div>
          </div>
        </div>
        {/* info bot */}
        <div className="info__bot">
          <label className="description">Mô Tả</label>
          <textarea className="product-description">{product.productDescription}</textarea>
        </div>

        {/* <div className="btn__update">
          <ButtonComponent onClick={handleEdit}>Sửa</ButtonComponent>
        </div> */}
      </div>
    </div>
  );
};

export default ViewProductDetailPage;
