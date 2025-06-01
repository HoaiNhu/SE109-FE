import React, { useEffect, useRef, useState } from "react";
//import $ from "jquery";
import banner1 from "../../../../assets/img/banner_1.png";
import DropdownComponent from "../../../../components/DropdownComponent/DropdownComponent";
import FormComponent from "../../../../components/FormComponent/FormComponent";
import SideMenuComponent from "../../../../components/SideMenuComponent/SideMenuComponent";
import ButtonComponent from "../../../../components/ButtonComponent/ButtonComponent";
import { createDiscount } from "../../../../services/DiscountService";
import "./AddDiscountPage.css";
import { useMutationHook } from "../../../../hooks/useMutationHook";
import { useNavigate } from "react-router-dom";

const AddDiscountPage = () => {
  const accessToken = localStorage.getItem("access_token");
  const [startDateTime, setStartDateTime] = useState("");
  const [endDateTime, setEndDateTime] = useState("");
  const [categories, setCategories] = useState([]); // State lưu danh sách category
  const [previewImage, setPreviewImage] = useState(null); // State để lưu URL của ảnh preview
  const startDateRef = useRef(null);
  const endDateRef = useRef(null);
  const navigate = useNavigate();
  const [statediscount, setstateDiscount] = useState({
    discountCode: "",
    discountName: "",
    discountValue: "",
    applicableCategory: "",
    discountImage: null,
    discountStartDate: "",
    discountEndDate: "",
  });

  // useEffect(() => {
  //   // Initialize Bootstrap Datepicker cho ngày bắt đầu
  //   $(startDateRef.current)
  //     .datepicker({
  //       format: "dd/mm/yyyy", // Định dạng dd/MM/yyyy
  //       autoclose: true, // Tự động đóng khi chọn ngày
  //       todayHighlight: true, // Làm nổi bật ngày hôm nay
  //     })
  //     .on("changeDate", (e) => {
  //       setStartDateTime(e.format()); // Cập nhật giá trị state khi thay đổi
  //     });

  //   // Initialize Bootstrap Datepicker cho ngày kết thúc
  //   $(endDateRef.current)
  //     .datepicker({
  //       format: "dd/mm/yyyy",
  //       autoclose: true,
  //       todayHighlight: true,
  //     })
  //     .on("changeDate", (e) => {
  //       setEndDateTime(e.format());
  //     });
  // }, []);

  const handleOnChangeImg = (event) => {
    const file = event.target.files[0];
    console.log("FILE", file);
    setstateDiscount({ ...statediscount, discountImage: file });
    const previewUrl = URL.createObjectURL(file); // Tạo URL preview từ file
    setPreviewImage(previewUrl); // Cập nhật state previewImage
  };

  // const handleDateChange = (ref, setDate) => {
  //   const value = ref.current?.value || "";
  //   setstateDiscount();
  // };
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
    setstateDiscount({ ...statediscount, [e.target.name]: e.target.value });
  };

  const mutation = useMutationHook(async (data) => {
    const response = await createDiscount(data, accessToken);
    console.log("RESKLT", response);
    try {
      const result = await response;
      console.log("RESKLT", result);
      if (result.status === "OK") {
        alert("Thêm khuyến mãi thành công!");
        navigate("/admin/discount-list");
      } else {
        alert(`Thêm khuyến mãi thất bại: ${result.message}`);
      }
    } catch (error) {
      alert("Đã xảy ra lỗi khi thêm khuyến mãi!");
      console.error(error.message);
    }
    return response;
  });
  const { data, isLoading, isSuccess, isError } = mutation;

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("state", statediscount);
    const formData = new FormData();
    formData.append("discountCode", statediscount.discountCode);
    formData.append("discountName", statediscount.discountName);
    formData.append("discountValue", statediscount.discountValue);
    formData.append("applicableCategory", statediscount.applicableCategory);
    formData.append("discountImage", statediscount.discountImage);
    formData.append("discountStartDate", statediscount.discountStartDate);
    formData.append("discountEndDate", statediscount.discountEndDate);
    // Kiểm tra FormData
    for (let pair of formData.entries()) {
      console.log("FORM", `${pair[0]}: ${pair[1]}`);
    }

    mutation.mutate(formData);
    //  navigate('/admin/discount-list')
  };

  const ClickInfor = () => {
    navigate("/admin/store-info");
  };
  const ClickOrder = () => {
    navigate("/admin/order-list");
  };
  const ClickDiscount = () => {
    navigate("/admin/discount-list");
  };
  const ClickStatus = () => {
    navigate("/admin/status-list");
  };
  const ClickCategory = () => {
    navigate("/admin/category-list");
  };
  const ClickUser = () => {
    navigate("/admin/user-list");
  };
  const ClickReport = () => {
    navigate("/admin/reprot");
  };
  return (
    <div>
      <div className="container-xl">
        <div className="add-discount__container">
          {/* side menu */}
          <div className="side-menu__discount">
            <SideMenuComponent onClick={ClickInfor}>
              Store's Information
            </SideMenuComponent>
            <SideMenuComponent onClick={ClickOrder}>Order</SideMenuComponent>
            <SideMenuComponent onClick={ClickDiscount}>Promo</SideMenuComponent>
            <SideMenuComponent onClick={ClickStatus}>Status</SideMenuComponent>
            <SideMenuComponent onClick={ClickCategory}>
              Category
            </SideMenuComponent>
            <SideMenuComponent onClick={ClickUser}>User</SideMenuComponent>
            <SideMenuComponent onClick={ClickReport}>
              Statistic
            </SideMenuComponent>
          </div>
          {/* info */}
          <div className="add-discount__content">
            <div className="discount__info">
              {/* banner */}
              <div className="banner">
                <label className="banner__title">Promo banner</label>
                <br />
                <input
                  className="banner_image"
                  type="file"
                  onChange={handleOnChangeImg}
                  accept="image/*"
                  required
                  data-testid="banner-input" //thêm data-testid để test
                />
                <div className="banner__image">
                  {previewImage && (
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="banner__image"
                      // style={{
                      //   width: "36rem",
                      //   height: "40rem",
                      //   borderRadius: "15px"
                      // }}
                    />
                  )}
                </div>
              </div>
              {/* content */}
              <div className="content">
                <div className="content__item">
                  <label className="id__title">Promo code</label>
                  <FormComponent
                    placeholder="KM1"
                    name="discountCode"
                    onChange={handleInputChange}
                    value={statediscount.discountCode}
                  ></FormComponent>
                </div>
                <div className="content__item">
                  <label className="name__title">Promo name</label>
                  <FormComponent
                    placeholder="Sumer happiness"
                    name="discountName"
                    value={statediscount.discountName}
                    onChange={handleInputChange}
                  ></FormComponent>
                </div>
                <div className="content__item">
                  <label className="value__title">Promo value (VND)</label>
                  <FormComponent
                    placeholder="100 000"
                    className="choose-property"
                    name="discountValue"
                    value={statediscount.discountValue}
                    onChange={handleInputChange}
                  ></FormComponent>
                </div>
                <div className="content__item">
                  <label className="category__title">Apply category</label>
                  <br />
                  <select
                    name="applicableCategory"
                    value={statediscount.applicableCategory}
                    onChange={handleInputChange}
                    className="choose-property"
                    style={{
                      width: "44rem",
                      height: "6rem",
                      border: "none",
                      color: "grey",
                      borderRadius: "50px",
                      boxShadow: "0px 2px 4px 0px #203c1640",
                      padding: "15px",
                    }}
                    placeholder="Choose category"
                  >
                    <option value="" disabled>
                      Choose product
                    </option>
                    {Array.isArray(categories) && categories.length > 0 ? (
                      categories.map((category) => (
                        <option key={category._id} value={category._id}>
                          {category.categoryName}
                        </option>
                      ))
                    ) : (
                      <option disabled>No category</option>
                    )}
                  </select>
                </div>
                <div className="content__item">
                  <label className="time-start__title">
                    Start date: <strong>{startDateTime}</strong>
                  </label>
                  <input
                    type="date"
                    className="form-control discount__date"
                    placeholder="Choose start date"
                    ref={startDateRef}
                    name="discountStartDate"
                    onChange={handleInputChange}
                    value={statediscount.discountStartDate}
                  />
                </div>
                <div className="content__item">
                  <label className="time-end__title">
                    End date: <strong>{endDateTime}</strong>
                  </label>
                  <input
                    type="date"
                    className="form-control discount__date"
                    placeholder="Choose end date"
                    ref={endDateRef}
                    name="discountEndDate"
                    onChange={handleInputChange}
                    value={statediscount.discountEndDate}
                  />
                </div>
              </div>

              {/* button */}
              <div className="btn__add-discount">
                <ButtonComponent onClick={handleSubmit}>Save</ButtonComponent>
                <ButtonComponent
                  onClick={() => navigate("/admin/discount-list")}
                >
                  Exit
                </ButtonComponent>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddDiscountPage;
