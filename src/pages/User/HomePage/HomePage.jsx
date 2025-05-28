import React, { useEffect, useState } from "react";
import SliderComponent from "../../../components/SliderComponent/SliderComponent";
import slider1 from "../../../assets/img/slider1.webp";
import slider2 from "../../../assets/img/slider2.webp";
import slider3 from "../../../assets/img/slider3.webp";
import CardProduct from "../../../components/CardProduct/CardProduct";
import image1 from "../../../assets/img/cake1.webp";
import ButtonNoBGComponent from "../../../components/ButtonNoBGComponent/ButtonNoBGComponent";
import story from "../../../assets/img/story.jpg";
import LinesEllipsis from "react-lines-ellipsis";
import CardNews from "../../../components/CardNews/CardNews";
import news from "../../../assets/img/news.jpg";
import ButtonComponent from "../../../components/ButtonComponent/ButtonComponent";
import { useNavigate } from "react-router-dom";
import {
  getAllDiscount,
  deleteDiscount,
} from "../../../services/DiscountService";
import { getAllNews } from "../../../services/NewsService";
import img12 from "../../../assets/img/hero_2.jpg";
const text =
  "From the very first glance, jewelry is more than just an accessory — it's a way to tell your personal story. Our jewelry website was born from a simple desire: to bring pure, elegant beauty with a personal touch to every woman.We believe that each piece of jewelry holds meaning. It's a gift to mark a milestone, a ring to celebrate love, or simply a bracelet that gives you a boost of confidence every time you wear it. What started from a small workshop, guided by hands full of passion, has grown into a digital space — so no matter where you are, you can find a piece of yourself in our designs.";

const HomePage = () => {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [promos, setPromos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [arrImgs, setArrImg] = useState([]); // State lưu trữ mảng hình ảnh
  const [products, setProducts] = useState([]); // State lưu danh sách sản phẩm
  const [currentCategory, setCurrentCategory] = useState(null); // State lưu category hiện tại
  const [currentPage, setCurrentPage] = useState(0); // Trang hiện tại
  const [totalPages, setTotalPages] = useState(0); // Tổng số trang
  const navigate = useNavigate();
  const handleClick = (path) => {
    navigate(path);
  };
  const [newsList, setNewsList] = useState([]);

  // Fetch danh sách khuyến mãi
  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        const discounts = await getAllDiscount();
        console.log("TYU", discounts);
        if (Array.isArray(discounts.data)) {
          setPromos(discounts.data); // Lưu danh sách khuyến mãi
          console.log("HBJK");
          const images = Array.isArray(discounts.data)
            ? discounts.data
              .map((discount) => discount?.discountImage)
              .filter(Boolean)
            : [];

          console.log("IMG", images);
          setArrImg(images);
          console.log("IMFGH", arrImgs);
        } else {
          setError("Dữ liệu trả về không hợp lệ.");
        }
      } catch (err) {
        setError(err.message || "Không thể tải danh sách khuyến mãi.");
      }
    };
    fetchDiscounts();
  }, []);

  // Hàm xử lý khi click vào một ảnh slider
  const handleSliderImageClick = (clickedImage) => {
    // Tìm khuyến mãi có ảnh đó
    const promo = promos.find((promo) => promo.discountImage === clickedImage);
    console.log("PROMOS", promo);
    if (promo) {
      const categoryIds = promo.applicableCategory || [];
      console.log(categoryIds);
      // Điều hướng đến trang sản phẩm với queryParams chứa categoryIds
      navigate("/products", { state: { categoryIds } });
    }
  };

  //Lấy danh sách tin tức:
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await getAllNews();

        if (Array.isArray(response.data)) {
          setNewsList(response.data.slice(0, 4)); // Chỉ lấy 3 tin tức đầu
        } else {
          setError("Dữ liệu trả về không hợp lệ.");
        }
      } catch (err) {
        setError(err.message || "Không thể tải danh sách tin tức.");
      }
    };
    fetchNews();
  }, []);

  //Xem chi tiet
  const handleDetailNews = (newsId) => {
    console.log("ID NEWS", newsId);
    const selectedNews = newsList.find((item) => item._id === newsId);
    console.log("VB", selectedNews);

    if (selectedNews) {
      const { newsImage, newsTitle, newsContent } = selectedNews;
      navigate("/news-detail", {
        state: { newsImage, newsTitle, newsContent },
      });
    } else {
      alert("News not found!");
    }
  };

  // Lay danh sach category
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
          console.log("GGHH", categories);
          // Lấy category đầu tiên và fetch sản phẩm tương ứng
          if (data.data.length > 0) {
            const firstCategoryId = data.data[0]._id;
            setCurrentCategory(firstCategoryId); // Lưu category đầu tiên
            fetchProducts(0, 9, firstCategoryId); // Fetch sản phẩm của category đầu tiên
          }
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

      let url = `${process.env.REACT_APP_API_URL_BACKEND}/product/get-all-product?${queryParams}`;
      if (categoryId) {
        url = `${process.env.REACT_APP_API_URL_BACKEND}/product/get-product-by-category/${categoryId}?${queryParams}`;
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
      console.log("FDS", data);
      console.log("GVHNJ", data.data);
      // setCurrentPage(page); // Cập nhật trang hiện tại
      // setTotalPages(Math.ceil(data.data.lenght / limit)); // Tính tổng số trang

      if (Array.isArray(data.data)) {
        setProducts(data.data.slice(0, 4));
      } else {
        console.error("Products data is not in expected format");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Khi nhấn vào sản phẩm
  const handleDetailProduct = (productId) => {
    const selectedProduct = products.find(
      (product) => product._id === productId
    );

    if (selectedProduct) {
      const {
        productName,
        productSize,
        productImage,
        productCategory,
        productDescription,
        productPrice,
      } = selectedProduct;
      navigate("/view-product-detail", {
        state: {
          productId,
          productName,
          productSize,
          productImage,
          productDescription,
          productCategory,
          productPrice,
        },
      });
    } else {
      alert("Product not found!");
    }
  };

  //Click categoryName:
  const handleCategoryClick = (categoryId) => {
    console.log("Category clicked:", categoryId);
    setCurrentCategory(categoryId); // Lưu categoryId để lọc sản phẩm
    setCurrentPage(0); // Reset trang về 0 khi chuyển qua category mới
    fetchProducts(0, 9, categoryId); // Fetch sản phẩm theo category
  };

  return (
    <div>
      {/* Banner quànrg cáo */}
      <div>
        <SliderComponent
          arrImg={arrImgs}
          onImageClick={handleSliderImageClick}
        />
      </div>
      <div
        style={{
          marginTop: 100,
          paddingTop: 50,
          paddingBottom: 60,
          backgroundColor: "#000",
          width: "100%",
        }}
      >
        <h1
          style={{
            color: "#f2bed1",
            textAlign: "center",
            marginBottom: "50px",
            fontSize: "4rem",
            fontWeight: 700,
          }}
        >
          IMPRESSIVE PRODUCTS
        </h1>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            paddingBottom: 50,
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="79"
            height="90"
            viewBox="0 0 111 127"
            fill="none"
          >
            <g clip-path="url(#clip0_261_214)">
              <path
                d="M39.4694 1.33946C41.402 -0.47128 44.4 -0.446476 46.3326 1.36427C53.171 7.78868 59.5882 14.7092 65.5842 22.2002C68.3096 18.6283 71.4067 14.734 74.7516 11.559C76.7089 9.72345 79.7317 9.72345 81.6891 11.5838C90.2618 19.7693 97.5214 30.5842 102.625 40.8533C107.655 50.9736 111 61.3172 111 68.6098C111 100.261 86.2728 127 55.5 127C24.3804 127 0 100.236 0 68.585C0 59.06 4.41027 47.4266 11.2487 35.9172C18.1614 24.2342 27.9234 12.0551 39.4694 1.33946ZM55.9212 103.188C62.1897 103.188 67.7397 101.451 72.9676 97.9785C83.3987 90.686 86.1984 76.1008 79.9299 64.641C78.815 62.4086 75.9656 62.2598 74.3551 64.1449L68.1114 71.4127C66.4761 73.2979 63.5277 73.2483 61.9915 71.2887C57.9033 66.0797 50.5942 56.7779 46.4317 51.4945C44.8708 49.5102 41.8975 49.4854 40.3118 51.4697C31.9373 62.0117 27.7252 68.6594 27.7252 76.1256C27.75 93.1168 40.2871 103.188 55.9212 103.188Z"
                fill="#fff"
              />
            </g>
            <defs>
              <clipPath id="clip0_261_214">
                <rect width="111" height="127" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </div>

        {/* 1 slide  */}
        {/* <Row
          style={{
            maxWidth: 1000,
            margin: 'auto'
          }}>
          <Col >
            <CardProduct type={"secondary"} img={image1} title={"Chocolate Sweet Cream"} price={"250.000 VND"} />
          </Col>
          <Col >
            <CardProduct type={"secondary"} img={image1} title={"Chocolate Sweet Cream"} price={"250.000 VND"} />
          </Col>
          <Col >
            <CardProduct type={"secondary"} img={image1} title={"Chocolate Sweet Cream"} price={"250.000 VND"} />
          </Col>
          <Col>
            <CardProduct type={"secondary"} img={image1} title={"Chocolate Sweet Cream"} price={"250.000 VND"} />
          </Col>
        </Row> */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            marginLeft: "137px",
            marginRight: "137px",
            gap: "18px",
          }}
        >
          {products.map((product) => (
            <CardProduct
              key={product._id}
              id={product._id} // Thêm prop id vào đây
              type="secondary"
              img={product.productImage}
              title={product.productName}
              price={product.productPrice}
              onClick={() => handleDetailProduct(product._id)}
            />
          ))}
        </div>

        <ButtonComponent
          onClick={() => handleClick("/products")}
          style={{
            margin: "auto",
          }}
        >
          See more{" "}
        </ButtonComponent>
      </div>

      {/* Sản phẩm */}
      <div style={{ width: "100%", marginTop: 50 }}>
        <h1
          style={{
            color: "#f2bed1",
            textAlign: "center",
            marginTop: "80px",
            fontSize: "4rem",
            paddingBottom: 10,
            fontWeight: 700,
          }}
        >
          PRODUCTS
        </h1>
        <h3
          style={{
            color: "#fff",
            textAlign: "center",
            fontSize: "16px ",
            paddingBottom: 25,
          }}
        >
          Welcome to Avocado's jewelry collection!
        </h3>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            paddingBottom: 25,
          }}
        >
          {categories.map((category) => (
            <ButtonNoBGComponent
              key={category._id}
              onClick={() => handleCategoryClick(category._id)}
            >
              {category.categoryName}
            </ButtonNoBGComponent>
          ))}
        </div>
        {/* 1 tab */}
        {/* <Row
          style={{
            maxWidth: 1000,
            margin: 'auto'
            
          }}>
          <Col style={{ marginTop: "10px" }}>
            <CardProduct type={"primary"} img={image1} title={"Chocolate Sweet Cream"} price={"250.000 VND"} />
          </Col>
          <Col style={{ marginTop: "10px" }}>
            <CardProduct type={"primary"} img={image1} title={"Chocolate Sweet Cream"} price={"250.000 VND"} />
          </Col>
          <Col style={{ marginTop: "10px" }}>
            <CardProduct type={"primary"} img={image1} title={"Chocolate Sweet Cream"} price={"250.000 VND"} />
          </Col>
          <Col style={{ marginTop: "10px" }}>
            <CardProduct type={"primary"} img={image1} title={"Chocolate Sweet Cream"} price={"250.000 VND"} />
          </Col>
        </Row> */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            marginLeft: "137px",
            marginRight: "137px",
            gap: "18px",
            paddingBottom: 50,
          }}
        >
          {products.map((product) => (
            <CardProduct
              key={product._id}
              id={product._id} // Thêm prop id vào đây
              type={"primary"}
              img={product.productImage}
              title={product.productName}
              price={product.productPrice}
              onClick={() => handleDetailProduct(product._id)}
            />
          ))}
        </div>
        <div
          style={{
            marginBottom: 50,
          }}
        >
          <ButtonComponent
            onClick={() => handleClick("/products")}
            style={{
              margin: "auto",
            }}
          >
            See more{" "}
          </ButtonComponent>
        </div>
      </div>

      {/* Cau chuyen avocado */}
      <div>
        <h1
          style={{
            color: "#f2bed1",
            textAlign: "center",
            marginTop: "50px",
            fontSize: "4rem",
            paddingBottom: 10,
            fontWeight: 700,
          }}
        >
          {" "}
          NNN.'S STORIES
        </h1>
        <h3
          style={{
            color: "#fff",
            textAlign: "center",
            fontSize: "16px ",
            paddingBottom: 25,
          }}
        >
          NNN. is proud to be a premium Vietnamese jewelry boutique,
          combining luxury, elegance, and refined sophistication
        </h3>
        <div
          style={{
            display: "flex",
            marginRight: "137px",
          }}
        >
          <div
            style={{
              position: "absolute",
              backgroundColor: "#000",
              width: 577,
              height: 406,
              marginLeft: 105,
              marginTop: 17,
              borderRadius: 15,
            }}
          />
          <img
            src={img12}
            style={{
              position: "relative",
              width: "550px",
              height: "400px",
              marginLeft: 137,
              borderRadius: 15,
              flexShrink: 0,
            }}
          ></img>

          <div
            style={{
              maxWidth: "56rem",
              maxHeight: "30rem",
              borderRadius: 15,
              background: "#000",
              marginLeft: "10rem",
              flexShrink: 0,

              marginTop: "45px",
            }}
          >
            <h3
              style={{
                color: "#f2bed1",
                textAlign: "center",
                marginTop: "80px",
                fontSize: "1.8rem",
                fontWeight: 700,
                marginTop: 45,
                paddingBottom: 25,
              }}
            >
              {" "}
              THE BRAND STORY{" "}
            </h3>
            <LinesEllipsis
              text={text}
              maxLine="4" // Số dòng tối đa
              ellipsis="..."
              trimRight
              basedOn="words"
              style={{
                fontSize: 16,
                marginLeft: 45,
                marginRight: 45,
                marginTop: 20,
                marginBottom: 25,
                color: "#fff",
              }}
            />
            <div>
              <a
                style={{
                  color: "#f2bed1",
                  textAlign: "center",
                  marginTop: "80px",
                  fontSize: "16px",
                  fontStyle: "italic",
                  textDecoration: "underline",
                  marginLeft: 45,
                  cursor: "pointer",
                }}
                onClick={() => handleClick("/introduce")}
              >
                See more{" "}
              </a>
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 50 }}>
        <h1
          style={{
            color: "#f2bed1",
            textAlign: "center",
            marginTop: "80px",
            fontSize: "4rem",
            paddingBottom: 10,
            fontWeight: 700,
          }}
        >
          NEWS{" "}
        </h1>
        <h3
          style={{
            color: "#fff",
            textAlign: "center",
            fontSize: "16px ",
            paddingBottom: 25,
          }}
        >
          Latest updates on NNN.'s activities
        </h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            marginLeft: "137px",
            marginRight: "137px",
            gap: "25px",
            paddingBottom: 25,
          }}
        >
          {newsList.map((newsItem, index) => (
            <CardNews
              key={index}
              id={newsItem._id}
              img={newsItem.newsImage || news}
              title={newsItem.newsTitle}
              detail={newsItem.newsContent}
              onClick={handleDetailNews}
            />
          ))}
        </div>
        <div
          style={{
            marginBottom: 50,
          }}
        >
          <ButtonComponent
            onClick={() => handleClick("/news")}
            style={{
              margin: "30px auto",
            }}
          >
            See more{" "}
          </ButtonComponent>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
