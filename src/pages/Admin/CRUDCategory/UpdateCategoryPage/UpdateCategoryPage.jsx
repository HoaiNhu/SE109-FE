import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import FormComponent from "../../../../components/FormComponent/FormComponent";
import SideMenuComponent from "../../../../components/SideMenuComponent/SideMenuComponent";
import ButtonComponent from "../../../../components/ButtonComponent/ButtonComponent";
import "./UpdateCategoryPage.css";
import { useNavigate } from "react-router-dom"; // Import useHistory để điều hướng

const UpdateCategoryPage = () => {
   const navigate = useNavigate();
  const location = useLocation(); // Sử dụng hook để lấy thông tin state
  const { categoryId, categoryName, categoryCode} = location.state || {}; // Lấy thông tin category từ state

  // State cho categoryId và categoryName
  const [category, setCategory] = useState({
    id: categoryId || "",
    code: categoryCode ||"",
    name: categoryName || "",
  });
  const ExitForm =()=>{
    navigate("/admin/category-list")
  }

  useEffect(() => {
    // Nếu không có categoryId trong state, có thể redirect về trang danh sách category hoặc hiển thị thông báo lỗi
    if (!categoryId || !categoryName) {
      // Redirect hoặc hiển thị thông báo
      console.error("Không tìm thấy thông tin category");
    }
  }, [categoryId, categoryName]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCategory({ ...category, [name]: value });
  };

 
  const handleSave = async () => {
    try {
      const response = await fetch(`/api/category/update-category/${category.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          categoryName: category.name,
          categoryCode: category.code,
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert("Cập nhật loại sản phẩm thành công!")
         
      } else {
       
      }
    } catch (error) {
      alert("Error updating category:", error);
      
    }
  };
  const ClickInfor=()=>{navigate("/store-info")}
  const ClickOrder=()=>{navigate("/admin/order-list")}
  const ClickDiscount=()=>{navigate("/admin/discount-list")}
  const ClickStatus=()=>{navigate("/status-list")}
  const ClickCategory=()=>{navigate("/admin/category-list")}
  const ClickUser=()=>{navigate("/user-list")}
  const ClickReprot=()=>{navigate("/reprot")}

  return (
    <div>
      <div className="container-xl">
        <div className="update-category__container">
          {/* Side menu */}
          <div className="side-menu__category">
          <SideMenuComponent onClick={ClickInfor}>Thông tin cửa hàng</SideMenuComponent>
            <SideMenuComponent onClick={ClickOrder}>Đơn hàng</SideMenuComponent>
            <SideMenuComponent onClick={ClickDiscount}>Khuyến mãi</SideMenuComponent>
            <SideMenuComponent onClick={ClickStatus}>Trạng thái</SideMenuComponent>
            <SideMenuComponent onClick={ClickCategory}>Loại sản phẩm</SideMenuComponent>
            <SideMenuComponent onClick={ClickUser}>Danh sách người dùng</SideMenuComponent>
            <SideMenuComponent onClick={ClickReprot}>Thống kê</SideMenuComponent>
          </div>

          <div className="update-category__content">
            <div className="status__info">
              <div className="update_category__title">
                <label>Sửa loại sản phẩm</label>
              </div>

              <div className="content">
                <div className="content__item">
                  <label className="id__title">Mã loại sản phẩm</label>
                  <FormComponent
                    placeholder="C6"
                    name="id"
                    value={category.code}
                    onChange={handleInputChange}
                    disabled
                  />
                </div>
                <div className="content__item" style={{ position: "relative" }}>
                  <label className="name__title">Tên loại sản phẩm</label>
                  <span
                    className="material-icons"
                    style={{
                      fontSize: "26px",
                      marginRight: "45px",
                      position: "absolute",
                      top: "0",
                      right: "0",
                      cursor: "pointer",
                    }}
                  >
                    
                  </span>
                  <FormComponent
                    placeholder="Bánh mùa đông"
                    name="name"
                    value={category.name}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Button */}
              <div className="btn__update-category">
                <ButtonComponent onClick={handleSave}>Lưu</ButtonComponent>
                <ButtonComponent onClick={ExitForm}>Thoát</ButtonComponent>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateCategoryPage;
