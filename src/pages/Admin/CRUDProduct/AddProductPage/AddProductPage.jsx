import React, { useState, useEffect } from "react";
import "./AddProductPage.css";
import FormComponent from "../../../../components/FormComponent/FormComponent";
import ButtonComponent from "../../../../components/ButtonComponent/ButtonComponent";
import { data, error } from "jquery";
import Compressor from 'compressorjs';
import { createProduct } from "../../../../services/productServices";
import { useMutationHook } from "../../../../hooks/useMutationHook";
import * as productService from "../../../../services/productServices";
import Loading from "../../../../components/LoadingComponent/Loading";
import { useNavigate } from "react-router-dom";

const AddProductPage = () => {
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("access_token");
  const [stateproduct, setstateProduct] = useState({
    productName: "",
    productPrice: "",
    productImage: null,
    productCategory: "",
    productSize: "",
    productDescription: "",
  });

  const [categories, setCategories] = useState([]); // State lưu danh sách category
  const [previewImage, setPreviewImage] = useState(null); // State để lưu URL của ảnh preview
  // Fetch danh sách category khi component được mount


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



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setstateProduct({ ...stateproduct, [e.target.name]: e.target.value });
  };

  const handleOnChangeImg = (event) => {
    const file = event.target.files[0];
    setstateProduct({ ...stateproduct, productImage: file })
    const previewUrl = URL.createObjectURL(file); // Tạo URL preview từ file
    setPreviewImage(previewUrl); // Cập nhật state previewImage
    // // if (file) {
    // //   new Compressor(file, {
    // //     quality: 0.6, // Chất lượng ảnh (0.6 là 60%)
    // //     maxWidth: 800, // Chiều rộng tối đa
    // //     maxHeight: 800, // Chiều cao tối đa
    // //     success(result) {
    // //       // Đọc file đã nén dưới dạng base64
    // //       const reader = new FileReader();
    // //       reader.onload = () => {
    // //         setstateProduct({...stateproduct, productImage : reader.result}); // Cập nhật state img bằng base64 URL
    // //       };
    // //       reader.readAsDataURL(result); // Đọc file đã nén như là base64
    // //     },
    // //     error(err) {
    // //       console.error(err);
    // //     }
    //   });
    // }
  };

  const mutation = useMutationHook(
    async (data) => {
      // const { 
      //   productName,
      //   productPrice,
      //   productImage,
      //   productCategory,
      //   productSize,
      //   productDescription
      //  } = data;

      const response = await createProduct(data, accessToken);
      console.log("RESKLT", response);
      try {
        const result = await response;
        //console.log("RESKLT",result);
        if (result.status === "OK") {
          alert("Jewelry item added successfully!");
          navigate('/admin/products')
          // Reset form
          //setProduct({productName: "", productPrice: "", productCategory:null, productImage:null, productSize:"" });
        } else {
          alert(`Failed to add jewelry item: ${result.message}`);
        }
      } catch (error) {
        alert("An error occurred while adding the jewelry item!");
        console.error(error);
      }
      return response;
    }
  );
  const { data, isLoading, isSuccess, isError } = mutation;

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("state", stateproduct)
    const formData = new FormData();
    formData.append("productName", stateproduct.productName);
    formData.append("productPrice", stateproduct.productPrice);
    formData.append("productCategory", stateproduct.productCategory);
    formData.append("productSize", stateproduct.productSize);
    formData.append("productDescription", stateproduct.productDescription);
    formData.append("productImage", stateproduct.productImage);
    // Kiểm tra FormData
    for (let pair of formData.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }

    const response = mutation.mutate(formData)
    // console.log("RESPONSE", response)

    // console.log("Result", JSON.stringify(stateproduct, null, 2));

    //e.preventDefault();



    //     // Lấy access token từ localStorage
    //     const accessToken = localStorage.getItem("access_token");
    //     console.log(localStorage.getItem("access_token"));

    //     if (!accessToken) {
    //       alert("Bạn chưa đăng nhập. Vui lòng đăng nhập để thực hiện thao tác này.");
    //       return;
    //     }
    //   const response = await fetch(
    //     "http://localhost:3001/api/product/create-product",
    //     {
    //       method: "POST",
    //       headers: {
    //         //"Content-Type": "multipart/form-data", // Dành cho việc gửi tệp
    //         Token: `Bearer ${accessToken}`

    //       },
    //       body: formData,
    //     }
    //   );


  };




  return (
    <div>
      <div className="container-xl add-product">
        <h1 className="add-product__title">Add jewelry item</h1>
        <Loading isLoading={isLoading} />
        <div className="add-product__information">
          {/* Info top */}
          <div className="info__top">
            {/* Info left */}
            <div className="info__left">

              <input
                // className="product__image"
                type="file"
                onChange={handleOnChangeImg}
                accept="image/*"
                required
              />
              <div className="product__image">
                {previewImage && (
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="product-preview"
                    style={{
                      width: "36rem",
                      height: "40rem",
                      borderRadius: "15px"
                    }}
                  />
                )}
              </div>
              {/* <div className="icon__add-image">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  viewBox="0 0 40 40"
                  fill="none"
                >
                  <path
                    d="M17.4998 33.3332C17.4998 33.9962 17.7632 34.6321 18.2321 35.1009C18.7009 35.5698 19.3368 35.8332 19.9998 35.8332C20.6629 35.8332 21.2988 35.5698 21.7676 35.1009C22.2364 34.6321 22.4998 33.9962 22.4998 33.3332V22.4998H33.3332C33.9962 22.4998 34.6321 22.2364 35.1009 21.7676C35.5698 21.2988 35.8332 20.6629 35.8332 19.9998C35.8332 19.3368 35.5698 18.7009 35.1009 18.2321C34.6321 17.7632 33.9962 17.4998 33.3332 17.4998H22.4998V6.6665C22.4998 6.00346 22.2364 5.36758 21.7676 4.89874C21.2988 4.4299 20.6629 4.1665 19.9998 4.1665C19.3368 4.1665 18.7009 4.4299 18.2321 4.89874C17.7632 5.36758 17.4998 6.00346 17.4998 6.6665V17.4998H6.6665C6.00346 17.4998 5.36758 17.7632 4.89874 18.2321C4.4299 18.7009 4.1665 19.3368 4.1665 19.9998C4.1665 20.6629 4.4299 21.2988 4.89874 21.7676C5.36758 22.2364 6.00346 22.4998 6.6665 22.4998H17.4998V33.3332Z"
                    fill="#3A060E"
                  />
                </svg>
              </div> */}
            </div>


            {/* Info right */}
            <div className="info__right">
              <div className="product-name">
                <label>Name</label>
                <FormComponent
                  style={{ width: "36rem", height: "6rem" }}
                  className="choose-property"
                  placeholder="Enter name"
                  name="productName"
                  value={stateproduct.productName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="product-price">
                <label>Price</label>
                <FormComponent
                  style={{ width: "36rem", height: "6rem" }}
                  className="choose-property"
                  placeholder="Enter price"
                  name="productPrice"
                  value={stateproduct.productPrice}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="product-category">
                <label>Category</label>
                <select
                  name="productCategory"
                  value={stateproduct.productCategory}
                  onChange={handleInputChange}
                  className="choose-property"
                  style={{ marginBottom: "-15px",marginTop: "5px", width: "36rem", height: "6rem", border: "none", color: "grey", borderRadius: "50px", boxShadow: "0px 2px 4px 0px #203c1640", padding: "15px" }}
                  placeholder="Choose category"
                >
                  <option value="" disabled>Choose category</option>
                  {Array.isArray(categories) && categories.length > 0 ? (
                    categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.categoryName}
                      </option>
                    ))
                  ) : (
                    <option disabled>No product categories available</option>
                  )}
                </select>

              </div>


              <div className="product-size">
                <label>Size</label>
                <FormComponent
                  style={{ width: "36rem", height: "6rem" }}
                  className="choose-property"
                  placeholder="Enter size"
                  name="productSize"
                  value={stateproduct.productSize}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="info__bot">
            <label htmlFor="description">Description</label>
            <textarea
              className="product-description"
              name="productDescription"
              value={stateproduct.productDescription}
              onChange={handleInputChange}
              placeholder="Enter description"
              required
            />
          </div>
        </div>

        <div className="btn-submit">
          <ButtonComponent onClick={handleSubmit}>Save</ButtonComponent>
          <ButtonComponent onClick={() => navigate("/admin/products")}>Exit</ButtonComponent>
        </div>

      </div>

    </div>
  );
};

export default AddProductPage;
