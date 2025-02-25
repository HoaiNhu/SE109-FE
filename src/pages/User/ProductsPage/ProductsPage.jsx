import { React, useEffect, useState } from "react";
import "./ProductsPage.css";
import SideMenuComponent from "../../../components/SideMenuComponent/SideMenuComponent";
import CardProduct from "../../../components/CardProduct/CardProduct";
import ButtonComponent from "../../../components/ButtonComponent/ButtonComponent";
import { useNavigate, useLocation } from "react-router-dom";

const ProductsPage = () => {
  const [products, setProducts] = useState([]); // State lưu danh sách sản phẩm
  const [categories, setCategories] = useState([]); // State lưu danh sách category
  const [currentCategory, setCurrentCategory] = useState(null); // State lưu category hiện tại
  const [currentPage, setCurrentPage] = useState(0); // Trang hiện tại
  const [totalPages, setTotalPages] = useState(0); // Tổng số trang
  const [error, setError] = useState(""); // State lưu lỗi
  const navigate = useNavigate();
  const location = useLocation();


  // Lấy categoryId từ state truyền qua navigation
  const previousCategoryId = location.state?.categoryIds || null;
  console.log("GHJ",previousCategoryId)
  //=========Danh mục sản phẩm=======
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "http://localhost:3001/api/category/get-all-category",
          {
            method: "GET", // Phương thức GET để lấy danh sách category
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }

        const data = await response.json();
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

  // Fetch danh sách sản phẩm khi component được mount
  const fetchProducts = async (page = 0, limit = 9, categoryId = null) => {
    try {
      const queryParams = new URLSearchParams({
        page,
        limit,
      }).toString();

      let url = `http://localhost:3001/api/product/get-all-product?${queryParams}`;
      if (categoryId) {
        url = `http://localhost:3001/api/product/get-product-by-category/${categoryId}?${queryParams}`;
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

      const data = await response.json();
      setCurrentPage(page); // Cập nhật trang hiện tại
      setTotalPages(Math.ceil(data.total / limit)); // Tính tổng số trang

      if (Array.isArray(data.data)) {
        setProducts(data.data);
      } else {
        console.error("Products data is not in expected format");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Khi component được mount
  useEffect(() => {
    if (previousCategoryId) {
      setCurrentCategory(previousCategoryId); // Lưu categoryId để lọc sản phẩm
    setCurrentPage(0); // Reset trang về 0 khi chuyển qua category mới
    fetchProducts(0, 9, previousCategoryId); // Fetch sản phẩm theo category
    } else {
      fetchProducts(0, 9); // Nếu không có categoryId thì fetch tất cả sản phẩm
    }
  }, [previousCategoryId]);

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

  // Hàm xử lý reloadProduct khi người dùng chuyển trang
  useEffect(() => {
    fetchProducts(currentPage, 9, currentCategory);
  }, [currentPage, currentCategory]);

  // Khi nhấn vào category
  const handleCategoryClick = (categoryId, categoryName) => {
    setCurrentCategory(categoryId); // Lưu categoryId để lọc sản phẩm
    setCurrentPage(0); // Reset trang về 0 khi chuyển qua category mới
    fetchProducts(0, 9, categoryId); // Fetch sản phẩm theo category
  };

  // Khi nhấn vào Tất cả sản phẩm
  const handleAllProductsClick = () => {
    setCurrentCategory(null); // Reset category, hiển thị tất cả sản phẩm
    setCurrentPage(0); // Reset trang về 0
    fetchProducts(0, 9); // Fetch tất cả sản phẩm
  };

  // Khi nhấn vào sản phẩm
  const handleDetail = (productId) => {
    const selectedProduct = products.find((product) => product._id === productId);

    if (selectedProduct) {
      const { productName, productSize, productImage, productCategory, productDescription, productPrice } = selectedProduct;
      navigate("/view-product-detail", {
        state: { productId, productName, productSize, productImage, productDescription, productCategory, productPrice },
      });
    } else {
      alert("Product not found!");
    }
  };

  return (
    <div>
      <div className="container-xl product-container">
        <div className="product">
          {/* product top */}
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

          {/* product bot */}
          <div className="product__bot">
            {/* side menu */}
            <div className="side-menu__category">
              {/* Thêm "Tất cả sản phẩm" */}
              <SideMenuComponent 
                key="all-products" 
                value={null}
                onClick={handleAllProductsClick}
              >
                Tất cả sản phẩm
              </SideMenuComponent>

              {Array.isArray(categories) && categories.length > 0 ? (
                categories.map((category) => (
                  <SideMenuComponent 
                    key={category._id} 
                    value={category._id}
                    onClick={() => handleCategoryClick(category._id, category.categoryName)}
                  >
                    {category.categoryName}
                  </SideMenuComponent>
                ))
              ) : (
                <p>Không có loại sản phẩm</p>
              )}
            </div>

            {/* product list */}
            <div className="container product__list">
              {products.length > 0 ? (
                products.map((product) => {
                  const imageUrl = product.productImage.startsWith("http")
                    ? product.productImage
                    : `https://res.cloudinary.com/dlyl41lgq/image/upload/v2/${product.productImage.replace("\\", "/")}`;

                  return (
                    <CardProduct
                      key={product._id}
                      className="col productadmin__item"
                      type={"primary"}
                      img={imageUrl}
                      title={product.productName}
                      price={`${product.productPrice}`}
                      id={product._id}
                      onClick={() => handleDetail(product._id)}
                    />
                  );
                })
              ) : (
                <p>Không có sản phẩm nào</p>
              )}
            </div>
          </div>
        </div>
        {/* Pagination */}
        <div className="PageNumberHolder">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
