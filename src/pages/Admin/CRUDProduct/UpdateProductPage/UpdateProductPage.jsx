import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./UpdateProductPage.css";
import FormComponent from "../../../../components/FormComponent/FormComponent";
import DropdownComponent from "../../../../components/DropdownComponent/DropdownComponent";
import ButtonComponent from "../../../../components/ButtonComponent/ButtonComponent";
import SizeComponent from "../../../../components/SizeComponent/SizeComponent";
import { useNavigate } from "react-router-dom";
import * as productService from "../../../../services/productServices";
import { useMutationHook } from "../../../../hooks/useMutationHook";

const UpdateProductPage = () => {
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("access_token");
  const { state: productData } = useLocation();

  const [product, setProduct] = useState({
    productName: "",
    productPrice: "",
    productSize: "",
    productCategory: "",
    productImage: null,
    productDescription: "",
    productMaterial: "",
    productWeight: "",
    productQuantity:"",
    productId: productData?.productId || productData?._id || "",
  });

  const [categories, setCategories] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch product data from backend based on productId
  useEffect(() => {
    const fetchProduct = async () => {
      if (!product.productId) {
        console.error("No productId provided to fetch product data");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await productService.getDetailsproduct(product.productId, accessToken);
        if (data.status === "OK" && data.data) {
          const fetchedProduct = data.data;
          setProduct({
            productName: fetchedProduct.productName || "",
            productPrice: fetchedProduct.productPrice || "",
            productSize: fetchedProduct.productSize || "",
            productCategory: fetchedProduct.productCategory?._id || "",
            productImage: fetchedProduct.productImage || null,
            productDescription: fetchedProduct.productDescription || "",
            productMaterial: fetchedProduct.productMaterial || "",
            productWeight: fetchedProduct.productWeight || "",
            productQuantity:fetchedProduct.productQuantity ||"",
            productId: fetchedProduct._id || product.productId,
          });
          setImagePreview(fetchedProduct.productImage || null);
        } else {
          console.error("Product data is not in the expected format:", data);
        }
      } catch (error) {
        console.error("Error fetching product data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [product.productId, accessToken]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/category/get-all-category", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }

        const data = await response.json();
        if (Array.isArray(data.data)) {
          setCategories(data.data);
        } else {
          console.error("Category data is not in the expected format");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewURL = URL.createObjectURL(file);
      setImagePreview(previewURL);
      setProduct({ ...product, productImage: file });
    }
  };

  const handleEditImage = () => {
    document.getElementById("imageInput").click();
  };

  const mutation = useMutationHook(async (data) => {
    for (let pair of data.formData.entries()) {
      console.log("form", `${pair[0]}: ${pair[1]}`);
    }
    console.log("DATA", data);
    const response = await productService.updateproduct(data.id, accessToken, data.formData);
    console.log("RESULT", response);
    try {
      const result = await response;
      if (result.status === "OK") {
        alert("Jewelry updated successfully!");
        navigate("/admin/products");
      } else {
        alert(`Failed to update jewelry: ${result.message}`);
      }
    } catch (error) {
      alert("An error occurred while updating the jewelry!");
      console.error("Error updating jewelry:", error);
    }
    return response;
  });

  const { data, isLoading, isSuccess, isError } = mutation;

  const handleSubmit = () => {
    console.log("state", product);
    const formData = new FormData();
    formData.append("productName", product.productName);
    formData.append("productPrice", product.productPrice);
    formData.append("productCategory", product.productCategory);
    formData.append("productSize", product.productSize);
    formData.append("productDescription", product.productDescription);
    formData.append("productMaterial", product.productMaterial);
    formData.append("productWeight", product.productWeight);
    formData.append("productQuantity", product.productQuantity);
    if (product.productImage && typeof product.productImage !== "string") {
      formData.append("productImage", product.productImage);
    }

    const data = { id: product.productId, formData: formData };
    mutation.mutate(data);
  };

  const handleDelete = async (productId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (confirmDelete) {
      try {
        const response = await productService.deleteProduct(productId, accessToken);
        console.log("RESPONSE", response);
        if (response.status === "OK") {
          alert("Product deleted successfully!");
          navigate("/admin/products");
        }
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Failed to delete product");
      }
    }
  };

  const materialOptions = [
    { display: "Gold", value: "vàng" },
    { display: "Silver", value: "bạc" },
    { display: "Stainless Steel", value: "thép không gỉ" },
    { display: "Platinum", value: "platinum" },
  ];

  if (loading) {
    return <div>Loading data...</div>;
  }

  return (
    <div>
      <div className="container-xl update-product">
        <h1 className="update-product__title">Update Jewelry</h1>

        <div className="update-product__information">
          <div className="info__top">
            <div className="info__left">
              <div className="product__image-container">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Product preview"
                    className="product__image-preview"
                  />
                ) : (
                  <div className="product__image-placeholder">
                    Select an image
                  </div>
                )}
                <input
                  id="imageInput"
                  className="product__image"
                  type="file"
                  name="productImage"
                  onChange={handleImageChange}
                  accept="image/*"
                  style={{ display: "none" }}
                />
                <div className="icon__update-image" onClick={handleEditImage}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="30"
                    height="30"
                    viewBox="0 0 30 30"
                    fill="none"
                  >
                    <path
                      d="M17.575 11.275L18.725 12.425L7.4 23.75H6.25V22.6L17.575 11.275ZM22.075 3.75C21.7625 3.75 21.4375 3.875 21.2 4.1125L18.9125 6.4L23.6 11.0875L25.8875 8.8C26.0034 8.68436 26.0953 8.547 26.158 8.39578C26.2208 8.24456 26.2531 8.08246 26.2531 7.91875C26.2531 7.75504 26.2208 7.59294 26.158 7.44172C26.0953 7.2905 26.0034 7.15314 25.8875 7.0375L22.9625 4.1125C22.7125 3.8625 22.4 3.75 22.075 3.75ZM17.575 7.7375L3.75 21.5625V26.25H8.4375L22.2625 12.425L17.575 7.7375Z"
                      fill="#3A060E"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="info__right">
              <div className="col product-name">
                <label className="label-name">Name</label>
                <FormComponent
                  name="productName"
                  value={product.productName}
                  onChange={handleInputChange}
                />
              </div>

              <div className="col product-price">
                <label className="label-price">Price</label>
                <FormComponent
                  name="productPrice"
                  value={product.productPrice}
                  onChange={handleInputChange}
                />
              </div>

              <div className="col product-category">
                <label className="label-category">Category</label>
                <select
                  name="productCategory"
                  value={product.productCategory}
                  onChange={handleInputChange}
                  className="form__text"
                >
                  <option value="" disabled>
                    Select category
                  </option>
                  {Array.isArray(categories) && categories.length > 0 ? (
                    categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.categoryName}
                      </option>
                    ))
                  ) : (
                    <option disabled>No categories available</option>
                  )}
                </select>
              </div>

              <div className="col product-size">
                <label className="label-size">Size</label>
                <div className="item__size">
                  <SizeComponent
                    name="productSize"
                    value={product.productSize}
                    isSelected={product.productSize}
                    onChange={handleInputChange}
                  >
                    {product.productSize}
                  </SizeComponent>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="30"
                    height="30"
                    viewBox="0 0 30 30"
                    fill="none"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M26.25 15C26.25 21.2132 21.2132 26.25 15 26.25C8.7868 26.25 3.75 21.2132 3.75 15C3.75 8.7868 8.7868 3.75 15 3.75C21.2132 3.75 26.25 8.7868 26.25 15ZM15 22.25C14.4477 22.25 14 21.8023 14 21.25V16H8.75C8.19772 16 7.75 15.5523 7.75 15C7.75 14.4477 8.19772 14 8.75 14H14V8.75C14 8.19772 14.4477 7.75 15 7.75C15.5523 7.75 16 8.19772 16 8.75V14H21.25C21.8023 14 22.25 14.4477 22.25 15C22.25 15.5523 21.8023 16 21.25 16H16V21.25C16 21.8023 15.5523 22.25 15 22.25Z"
                      fill="#3A060E"
                    />
                  </svg>
                </div>
              </div>

              <div className="col product-material">
                <label className="label-material">Material</label>
                <select
                  name="productMaterial"
                  value={product.productMaterial}
                  onChange={handleInputChange}
                  className="form__text"
                >
                  <option value="" disabled>
                    Select material
                  </option>
                  {materialOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.display}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col product-weight">
                <label className="label-weight">Weight</label>
                <FormComponent
                  name="productWeight"
                  value={product.productWeight}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col product-quantity">
                <label className="label-quantity">Quantity</label>
                <FormComponent
                  name="productQuantity"
                  value={product.productQuantity}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          <div className="info__bot">
            <label className="label-description">Description</label>
            <textarea
              name="productDescription"
              className="product-description"
              value={product.productDescription}
              onChange={(e) =>
                setProduct({ ...product, productDescription: e.target.value })
              }
              placeholder="Enter description"
              required
            />
          </div>
          
        </div>

        <div className="btn-submit">
          <ButtonComponent onClick={handleSubmit}>Save</ButtonComponent>
          <ButtonComponent onClick={() => handleDelete(product.productId)}>
            Delete
          </ButtonComponent>
          <ButtonComponent onClick={() => navigate("/admin/products")}>
            Cancel
          </ButtonComponent>
        </div>
      </div>
    </div>
  );
};

export default UpdateProductPage;