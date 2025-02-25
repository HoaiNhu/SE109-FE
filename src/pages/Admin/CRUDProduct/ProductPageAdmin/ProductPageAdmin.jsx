import { useState, useEffect } from "react";
import "./ProductPageAdmin.css";
import CardProductAdmin from "../../../../components/CardProductAdmin/CardProductAdmin";
import AddBtn from "../../../../components/AddBtn(+)/AddBtn";
import SideMenuComponent from "../../../../components/SideMenuComponent/SideMenuComponent";
import * as productService from "../../../../services/productServices";
import axios from 'axios'; // For making API calls
import { Button, Modal } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getProductsByCategory } from "../../../../services/productServices";

const ProductPageAdmin = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0); // Trang hiện tại
  const [totalPages, setTotalPages] = useState(0);   // Tổng số trang
  const [products, setProducts] = useState([]); // State lưu danh sách sản phẩm
  const [categories, setCategories] = useState([]); // State lưu danh sách category
  const [currentCategory, setCurrentCategory] = useState(null); // State lưu category hiện tại
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.user);
  const [error, setError] = useState("");

  // Lấy danh sách category
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

  // Fetch danh sách sản phẩm theo trang
  const fetchProducts = async (page = 0, limit = 15, categoryId = null) => {
    try {
      let url = `http://localhost:3001/api/product/get-all-product?page=${page}&limit=${limit}`;
      if (categoryId) {
        url = `http://localhost:3001/api/product/get-product-by-category/${categoryId}?page=${page}&limit=${limit}`;
      }

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json(); // Chuyển đổi dữ liệu từ JSON
      setCurrentPage(page);  // Cập nhật trang hiện tại
      setTotalPages(Math.ceil(data.total / limit));  // Tính tổng số trang

      if (Array.isArray(data.data)) {
        setProducts(data.data); // Lưu danh sách sản phẩm vào state
      } else {
        console.error("Products data is not in expected format");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Fetch danh sách sản phẩm khi component được mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle chọn category
  const handleCategoryClick = (categoryId) => {
    setCurrentCategory(categoryId); // Lưu category hiện tại
    fetchProducts(0, 15, categoryId); // Fetch sản phẩm theo category
  };

  // Handle khi nhấn vào "Tất cả sản phẩm"
  const handleAllProductsClick = () => {
    setCurrentCategory(null); // Reset category
    fetchProducts(0, 15); // Fetch tất cả sản phẩm
  };

  // Phân trang
  const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const pages = Array.from({ length: totalPages }, (_, index) => index);
    return (
      <div>
        {pages.map((page) => (
          <button
            className="pageNumber"
            key={page}
            onClick={() => onPageChange(page)}
            style={{ fontWeight: currentPage === page ? "bold" : "normal" }}
          >
            {page + 1}
          </button>
        ))}
      </div>
    );
  };

  // Xử lý cập nhật sản phẩm
  const handleUpdate = (productId) => {
    const selectedProduct = products.find((product) => product._id === productId);
    if (selectedProduct) {
      const { productName, productSize, productImage, productCategory, productDescription, productPrice } = selectedProduct;
      navigate("/admin/update-product", {
        state: { productId, productName, productSize, productImage, productDescription, productCategory, productPrice },
      });
    } else {
      alert("Product not found!");
    }
  };

  return (
    <div className="container-xl productadmin-container">
      <div className="productadmin">
        {/* productadmin top */}
        <div className="product__top">
            <h1 className="product__title">SẢN PHẨM</h1>
            {/* Hiển thị tên category nếu có */}
            {currentCategory ? (
              <p className="product__current-category">
                {categories.find((cat) => cat._id === currentCategory)?.categoryName}
              </p>
            ) : (
              <p className="product__current-category">Tất cả sản phẩm</p>
            )}
          </div>
        <div style={{ marginLeft: 1222 }}>
          <AddBtn path={"/admin/add-product"} />
        </div>
        {/* productadmin bot */}
        <div className="productadmin__bot">
          {/* side menu */}
          <div className="side-menu__category">
            {/* Thêm "Tất cả sản phẩm" */}
            <SideMenuComponent onClick={handleAllProductsClick}>
              Tất cả sản phẩm
            </SideMenuComponent>
            {Array.isArray(categories) && categories.length > 0 ? (
              categories.map((category) => (
                <SideMenuComponent
                  key={category._id}
                  value={category._id}
                  onClick={() => handleCategoryClick(category._id)}
                >
                  {category.categoryName}
                </SideMenuComponent>
              ))
            ) : (
              <p>Không có loại sản phẩm</p>
            )}
          </div>

          {/* productadmin list */}
          <div className="container productadmin__list">
            {products.length > 0 ? (
              products.map((product) => {
                const imageUrl = product.productImage.startsWith("http")
                  ? product.productImage
                  : `https://res.cloudinary.com/dlyl41lgq/image/upload/v2/${product.productImage.replace("\\", "/")}`;

                return (
                  <CardProductAdmin
                    key={product._id}
                    className="col productadmin__item"
                    type={"primary"}
                    img={imageUrl}
                    title={product.productName}
                    price={`${product.productPrice.toLocaleString('en-US')} VND`}
                    onUpdate={() => handleUpdate(product._id)}
                    productId={product._id}
                  />
                );
              })
            ) : (
              <p>Không có sản phẩm nào</p>
            )}
          </div>
        </div>

        {/* Pagination */}
        <div className="PageNumberHolder">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => fetchProducts(page, 15, currentCategory)}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductPageAdmin;
