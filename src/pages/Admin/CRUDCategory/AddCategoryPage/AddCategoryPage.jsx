import React, { useState } from "react";
import FormComponent from "../../../../components/FormComponent/FormComponent";
import SideMenuComponent from "../../../../components/SideMenuComponent/SideMenuComponent";
import ButtonComponent from "../../../../components/ButtonComponent/ButtonComponent";
import "./AddCategoryPage.css";
import { useNavigate } from "react-router-dom";

const AddCategoryPage = () => {
  
  const [category, setCategory] = useState({
    categoryCode: "",
    categoryName: "",
  });
const ExitForm =()=>{
  navigate("/admin/category-list")
}
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCategory({ ...category, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
   
    try {
      // Lấy access token từ localStorage
      const accessToken = localStorage.getItem("access_token");
      console.log(localStorage.getItem("access_token"));

      if (!accessToken) {
        alert("Bạn chưa đăng nhập. Vui lòng đăng nhập để thực hiện thao tác này.");
        return;
      }

      // Gửi yêu cầu API tạo category
      const response = await fetch("http://localhost:3001/api/category/create-category", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Token: `Bearer ${accessToken}`, // Thêm access token
        },
        body: JSON.stringify(category),
      });

      const result = await response.json();
      if (response.ok) {
        alert("Thêm loại bánh thành công!");
        // Reset form
        setCategory({ categoryCode: "", categoryName: "" });
      } else {
        alert(`Thêm loại bánh thất bại: ${result.message}`);
      }
    } catch (error) {
      alert("Đã xảy ra lỗi khi thêm loại bánh!");
      console.error(error);
    }
    navigate("/admin/category-list")
  };
  const navigate= useNavigate();
  const ClickInfor=()=>{navigate("/store-info")}
  const ClickOrder=()=>{navigate("/admin/order-list")}
  const ClickDiscount=()=>{navigate("/admin/discount-list")}
  const ClickStatus=()=>{navigate("/status-list")}
  const ClickCategory=()=>{navigate("/category-list")}
  const ClickUser=()=>{navigate("/user-list")}
  const ClickReprot=()=>{navigate("/reprot")}



  return (
    <div>
      <div className="container-xl">
        <div className="add-category__container">
          {/* side menu */}
          <div className="side-menu__category">
            <SideMenuComponent onClick={ClickInfor}>Thông tin cửa hàng</SideMenuComponent>
            <SideMenuComponent onClick={ClickOrder}>Đơn hàng</SideMenuComponent>
            <SideMenuComponent onClick={ClickDiscount}>Khuyến mãi</SideMenuComponent>
            <SideMenuComponent onClick={ClickStatus}>Trạng thái</SideMenuComponent>
            <SideMenuComponent onClick={ClickCategory}>Loại sản phẩm</SideMenuComponent>
            <SideMenuComponent onClick={ClickUser}>Danh sách người dùng</SideMenuComponent>
            <SideMenuComponent onClick={ClickReprot}>Thống kê</SideMenuComponent>
          </div>

          <div className="add-category__content">
            <div className="category__info">
              <div className="add_category__title">
                <label>Thêm loại bánh</label>
              </div>
              <div className="content">
                <div className="content__item">
                  <label className="id__title">Mã loại bánh</label>
                  <FormComponent
                    placeholder="C6"
                    name="categoryCode"
                    value={category.categoryCode}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="content__item">
                  <label className="name__title">
                    Tên loại bánh <i className="fas fa-pencil-alt" style={{ marginLeft: "5px" }}></i>
                  </label>
                  <FormComponent
                    placeholder="Bánh mùa đông"
                    name="categoryName"
                    value={category.categoryName}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* button */}
              <div className="btn__add-category">
                <ButtonComponent onClick={handleSubmit}>Thêm</ButtonComponent>
                <ButtonComponent onClick={ExitForm}>Thoát</ButtonComponent>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCategoryPage;
