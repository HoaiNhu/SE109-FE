import React, { useState, useEffect } from "react";
import "./CategoryListPage.css";
import { useNavigate } from "react-router-dom"; // Import useHistory để điều hướng
import SideMenuComponent from "../../../../components/SideMenuComponent/SideMenuComponent";
import ButtonComponent from "../../../../components/ButtonComponent/ButtonComponent";
import CheckboxComponent from "../../../../components/CheckboxComponent/CheckboxComponent";
import DeleteIconComponent from "../../../../components/DeleteIconComponent/DeleteIconComponent";

const CategoryListPage = () => {
  const navigate = useNavigate();

  const [selectedRows, setSelectedRows] = useState([]); // State lưu danh sách các hàng được chọn
  const [categories, setCategories] = useState([]); // State lưu danh sách categories
  const AddCategory = () => {
    navigate("/admin/add-category");
  };

  const handleEdit = () => {
    if (selectedRows.length === 1) {
      // Đảm bảo chỉ có 1 category được chọn
      const categoryId = selectedRows[0];

      // Tìm category dựa trên categoryId
      const selectedCategory = categories.find(
        (category) => category._id === categoryId
      );

      if (selectedCategory) {
        const { categoryCode, categoryName } = selectedCategory; // Lấy mã và tên loại
        navigate("/admin/update-category", {
          state: { categoryId, categoryCode, categoryName }, // Truyền toàn bộ dữ liệu cần thiết
        });
      } else {
        alert("Category not found!");
      }
    } else {
      alert("Please select exactly one category to edit.");
    }
  };
  // Fetch dữ liệu categories từ server
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "http://localhost:3001/api/category/get-all-category"
        );
        const data = await response.json(); // Giả sử API trả về dữ liệu ở dạng JSON

        // Kiểm tra dữ liệu trả về có đúng format hay không
        if (data.status === "OK" && Array.isArray(data.data)) {
          setCategories(data.data); // Lưu dữ liệu vào state nếu dữ liệu hợp lệ
        } else {
          console.error("Unexpected data format", data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories(); // Gọi hàm fetchCategories khi component mount
  }, []);

  // Hàm toggle chọn một dòng
  const toggleSelectRow = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  // Hàm toggle chọn tất cả
  const toggleSelectAll = () => {
    setSelectedRows(
      selectedRows.length === categories.length
        ? [] // Nếu đã chọn tất cả thì bỏ chọn
        : categories.map((category) => category._id) // Chọn tất cả các category
    );
  };

  // Kiểm tra xem một hàng có được chọn không
  const isSelected = (id) => selectedRows.includes(id);

  const handleDelete = async () => {
    // Kiểm tra xem có category nào được chọn không
    if (selectedRows.length === 0) {
      alert("Please select at least one category to delete.");
      return;
    }

    // Hiển thị hộp thoại xác nhận
    const isConfirmed = window.confirm(
      "Are you sure you want to delete the selected categories?"
    );

    if (isConfirmed) {
      try {
        // Gửi yêu cầu xóa từng category được chọn
        for (let categoryId of selectedRows) {
          const response = await fetch(
            `/api/category/delete-category/${categoryId}`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          const data = await response.json();

          if (!response.ok) {
            alert(
              `Error deleting category with ID ${categoryId}: ${data.message}`
            );
            continue; // Nếu có lỗi với category này, chuyển sang category tiếp theo
          }
        }

        alert("Selected categories have been deleted successfully!");

        // Cập nhật lại danh sách categories sau khi xóa
        setCategories(
          categories.filter((category) => !selectedRows.includes(category._id))
        );
        setSelectedRows([]); // Clear selected rows
      } catch (error) {
        console.error("Error deleting categories:", error);
        alert("Something went wrong while deleting the categories.");
      }
    } else {
      console.log("Category deletion cancelled.");
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    // Hiển thị hộp thoại xác nhận
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (isConfirmed) {
      try {
        const response = await fetch(
          `/api/category/delete-category/${categoryId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();

        if (response.ok) {
          alert("Category deleted successfully!");
          // Cập nhật UI hoặc làm mới danh sách category nếu cần
          setCategories(
            categories.filter((category) => category._id !== categoryId)
          ); // Cập nhật lại danh sách
        } else {
          alert(`Error: ${data.message}`);
        }
      } catch (error) {
        console.error("Error deleting category:", error);
        alert("Something went wrong!");
      }
    } else {
      // Nếu người dùng chọn "Cancel", không làm gì cả
      console.log("Category deletion cancelled.");
    }
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
        <div className="category-list__info">
          {/* Side Menu */}
          <div className="side-menu__category1">
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
          {/* Category List */}
          <div className="category-list__content">
            <div className="category-list__action">
              <h2 className="category-list__title">
                Available jewelry category
              </h2>
              <div className="btn__action">
                {/* <ButtonComponent className="btn btn-delete">Chi tiết</ButtonComponent> */}
                <ButtonComponent
                  className="btn btn-delete"
                  onClick={handleDelete}
                >
                  Delete
                </ButtonComponent>
                <ButtonComponent className="btn btn-add" onClick={AddCategory}>
                  Add
                </ButtonComponent>
                <ButtonComponent className="btn btn-edit" onClick={handleEdit}>
                  Update
                </ButtonComponent>
              </div>
            </div>
            {/* Table */}
            <div className="table-container">
              <table className="promo-table">
                <thead>
                  <tr>
                    <th>
                      <CheckboxComponent
                        isChecked={selectedRows.length === categories.length}
                        onChange={toggleSelectAll}
                      />
                    </th>
                    <th>No.</th>
                    <th>Code</th>
                    <th>Name</th>
                    <th>Created date</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category, index) => (
                    <tr
                      key={category._id} // Sử dụng _id làm key cho mỗi hàng
                      className={isSelected(category._id) ? "highlight" : ""}
                    >
                      <td>
                        <CheckboxComponent
                          isChecked={isSelected(category._id)}
                          onChange={() => toggleSelectRow(category._id)} // Chọn hàng dựa trên _id
                        />
                      </td>
                      <td>{index + 1}</td>
                      <td>{category.categoryCode}</td> {/* Hiển thị mã loại */}
                      <td>{category.categoryName}</td> {/* Hiển thị tên loại */}
                      <td>
                        {new Date(category.createdAt).toLocaleDateString(
                          "vi-VN"
                        )}
                      </td>{" "}
                      {/* Hiển thị ngày tạo */}
                      <td>
                        <button
                          className="delete-btn"
                          onClick={() => handleDeleteCategory(category._id)} // Gọi delete cho từng category
                        >
                          <DeleteIconComponent></DeleteIconComponent>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryListPage;
