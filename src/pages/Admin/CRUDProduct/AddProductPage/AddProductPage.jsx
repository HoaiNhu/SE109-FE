import React, { useState, useEffect } from "react";
import "./AddProductPage.css";
import FormComponent from "../../../../components/FormComponent/FormComponent";
import ButtonComponent from "../../../../components/ButtonComponent/ButtonComponent";
import { createProduct } from "../../../../services/productServices";
import { useMutationHook } from "../../../../hooks/useMutationHook";
import Loading from "../../../../components/LoadingComponent/Loading";
import { useNavigate } from "react-router-dom";

const AddProductPage = () => {
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("access_token");
  const [stateProduct, setStateProduct] = useState({
    productName: "",
    productPrice: "",
    productImage: null,
    productCategory: "",
    productSize: "",
    productDescription: "",
    productMaterial: "",
    productWeight: "",
    productQuantity :"",
  });

  const [categories, setCategories] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);

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
    setStateProduct({ ...stateProduct, [name]: value });
  };

  const handleOnChangeImg = (event) => {
    const file = event.target.files[0];
    if (file) {
      setStateProduct({ ...stateProduct, productImage: file });
      const previewUrl = URL.createObjectURL(file);
      setPreviewImage(previewUrl);
    }
  };

  const mutation = useMutationHook(async (data) => {
    try {
      const response = await createProduct(data, accessToken);
      if (response.status === "OK") {
        alert("Jewelry added successfully!");
        navigate("/admin/products");
        setStateProduct({
          productName: "",
          productPrice: "",
          productImage: null,
          productCategory: "",
          productSize: "",
          productDescription: "",
          productMaterial: "",
          productWeight: "",
          productQuantity:"",
        });
        setPreviewImage(null);
      } else {
        alert(`Failed to add jewelry: ${response.message}`);
      }
      return response;
    } catch (error) {
      alert("An error occurred while adding the jewelry!");
      console.error("Error adding jewelry:", error);
      throw error;
    }
  });

  const { isLoading } = mutation;

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("productName", stateProduct.productName);
    formData.append("productPrice", stateProduct.productPrice);
    formData.append("productCategory", stateProduct.productCategory);
    formData.append("productSize", stateProduct.productSize);
    formData.append("productDescription", stateProduct.productDescription);
    formData.append("productMaterial", stateProduct.productMaterial);
    formData.append("productWeight", stateProduct.productWeight);
     formData.append("productQuantity", stateProduct.productQuantity);
    if (stateProduct.productImage) {
      formData.append("productImage", stateProduct.productImage);
    }

    mutation.mutate(formData);
  };

  const materialOptions = [
    { display: "Gold", value: "vàng" },
    { display: "Silver", value: "bạc" },
    { display: "Stainless Steel", value: "thép không gỉ" },
    { display: "Platinum", value: "platinum" },
  ];

  return (
    <div>
      <div className="container-xl add-product">
        <h1 className="add-product__title">Add Jewelry</h1>
        <Loading isLoading={isLoading} />
        <div className="add-product__information">
          <div className="info__top">
            <div className="info__left">
              <input
                type="file"
                onChange={handleOnChangeImg}
                accept="image/*"
                required
              />
              <div className="product__image">
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="product-preview"
                  />
                ) : (
                  <div className="product__image-placeholder">
                    Select an image
                  </div>
                )}
              </div>
            </div>

            <div className="info__right">
              <div className="form-row product-name">
                <label>Name</label>
                <FormComponent
                  className="form__text"
                  placeholder="Enter name"
                  name="productName"
                  value={stateProduct.productName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-row product-price">
                <label>Price</label>
                <FormComponent
                  className="form__text"
                  placeholder="Enter price"
                  name="productPrice"
                  value={stateProduct.productPrice}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-row product-category">
                <label>Category</label>
                <select
                  name="productCategory"
                  value={stateProduct.productCategory}
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

              <div className="form-row product-size">
                <label>Size</label>
                <FormComponent
                  className="form__text"
                  placeholder="Enter size"
                  name="productSize"
                  value={stateProduct.productSize}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-row product-weight">
                <label>Weight</label>
                <FormComponent
                  className="form__text"
                  placeholder="Enter weight"
                  name="productWeight"
                  value={stateProduct.productWeight}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-row product-material">
                <label>Material</label>
                <select
                  name="productMaterial"
                  value={stateProduct.productMaterial}
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
              <div className="form-row product-quantity">
                <label>Quantity</label>
                <FormComponent
                  className="form__text"
                  placeholder="Enter quantity"
                  name="productQuantity"
                  value={stateProduct.productQuantity}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="info__bot">
            <label htmlFor="productDescription">Description</label>
            <textarea
              className="product-description"
              name="productDescription"
              value={stateProduct.productDescription}
              onChange={handleInputChange}
              placeholder="Enter description"
              required
            />
          </div>
        </div>

        <div className="btn-submit">
          <ButtonComponent onClick={handleSubmit}>Save</ButtonComponent>
          <ButtonComponent onClick={() => navigate("/admin/products")}>
            Cancel
          </ButtonComponent>
        </div>
      </div>
    </div>
  );
};

export default AddProductPage;