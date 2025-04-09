import React, { useState, useEffect } from "react";
import "./DiscountListPage.css";
import SideMenuComponent from "../../../../components/SideMenuComponent/SideMenuComponent";
import ButtonComponent from "../../../../components/ButtonComponent/ButtonComponent";
import CheckboxComponent from "../../../../components/CheckboxComponent/CheckboxComponent";
import { useNavigate } from "react-router-dom";
import {
  getAllDiscount,
  deleteDiscount,
} from "../../../../services/DiscountService";

const DiscountListPage = () => {
  const accessToken = localStorage.getItem("access_token");
  const [selectedRows, setSelectedRows] = useState([]);
  const [promos, setPromos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch danh sách category
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "http://localhost:3001/api/category/get-all-category",
          {
            method: "GET",
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
          setCategories(data.data); // Lưu danh sách category
        } else {
          console.error("Categories data is not in expected format");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch danh sách khuyến mãi
  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        const discounts = await getAllDiscount();
        if (Array.isArray(discounts.data)) {
          setPromos(discounts.data); // Lưu danh sách khuyến mãi
        } else {
          setError("Dữ liệu trả về không hợp lệ.");
        }
      } catch (err) {
        setError(err.message || "Không thể tải danh sách khuyến mãi.");
      }
    };
    fetchDiscounts();
  }, []);

  const getCategoryNameById = (id) => {
    const category = categories.find((cat) => cat.id === id);
    return category ? category.categoryName : "Không xác định";
  };

  const toggleSelectAll = () => {
    setSelectedRows(
      selectedRows.length === promos.length
        ? [] // Nếu tất cả đã được chọn, bỏ chọn tất cả
        : promos.map((promo) => promo._id) // Chọn tất cả
    );
  };

  const isSelected = (id) => selectedRows.includes(id);
  const toggleSelectRow = (id) => {
    setSelectedRows((prev) => {
      if (prev.includes(id)) {
        // Nếu dòng đã được chọn, bỏ chọn
        return prev.filter((rowId) => rowId !== id);
      } else {
        // Nếu dòng chưa được chọn, thêm vào danh sách
        return [...prev, id];
      }
    });
  };

  console.log("QWERTY", promos);

  const ClickInfor = () => navigate("/admin/store-info");
  const ClickOrder = () => navigate("/admin/order-list");
  const ClickDiscount = () => navigate("/admin/discount-list");
  const ClickStatus = () => navigate("/admin/status-list");
  const ClickCategory = () => navigate("/admin/category-list");
  const ClickUser = () => navigate("/admin/user-list");
  const ClickReport = () => navigate("/admin/report");

  //Xóa
  const handleDelete = async () => {
    if (selectedRows.length === 0) {
      alert("Vui lòng chọn một khuyến mãi để xóa.");
    } else if (selectedRows.length > 1) {
      alert("Vui lòng chỉ chọn một khuyến mãi để xóa.");
    } else {
      try {
        // Gọi API xóa khuyến mãi
        await deleteDiscount(selectedRows[0], accessToken); // Gửi chỉ 1 ID khuyến mãi
        setPromos((prevPromos) =>
          prevPromos.filter((promo) => promo.id !== selectedRows[0])
        );
        setSelectedRows([]); // Dọn dẹp danh sách đã chọn
        alert("Khuyến mãi đã được xóa.");
        navigate("/admin/discount-list");
      } catch (error) {
        alert("Có lỗi xảy ra khi xóa khuyến mãi.");
      }
    }
  };

  return (
    <div>
      <div className="container-xl">
        <div className="discount-list__info">
          {/* Side menu */}
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

          {/* Discount list */}
          <div className="discount-list__content">
            <div className="discount-list__action">
              <h2 className="discount-list__title">Promo list</h2>
              <div className="btn__action">
                <ButtonComponent
                  className="btn btn-delete"
                  onClick={handleDelete}
                >
                  Delete
                </ButtonComponent>

                <ButtonComponent
                  className="btn btn-add"
                  onClick={() => navigate("/admin/add-discount")}
                >
                  Add
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
                        isChecked={selectedRows.length === promos.length}
                        onChange={toggleSelectAll}
                      />
                    </th>
                    <th>No.</th>
                    <th>Promo code</th>
                    <th>Promo name</th>
                    <th>Promo value</th>
                    <th>Category</th>
                    <th>Start date</th>
                    <th>End date</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {promos.length > 0 ? (
                    promos.map((promo, index) => (
                      <tr
                        key={promo.id}
                        className={isSelected(promo.id) ? "highlight" : ""}
                      >
                        <td>
                          <CheckboxComponent
                            isChecked={isSelected(promo._id)}
                            onChange={() => toggleSelectRow(promo._id)}
                          />
                        </td>
                        <td>{index + 1}</td>
                        <td>{promo.discountCode}</td>
                        <td>{promo.discountName}</td>
                        <td>{promo.discountValue} VND</td>
                        <td>{getCategoryNameById(promo.aplicableCategory)}</td>
                        <td>{promo.discountStartDate}</td>
                        <td>{promo.discountEndDate}</td>
                        <td>
                          <button className="delete-btn">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="19"
                              height="24"
                              viewBox="0 0 19 24"
                              fill="none"
                            >
                              <path
                                d="M1.35714 21.3333C1.35714 22.8 2.57857 24 4.07143 24H14.9286C16.4214 24 17.6429 22.8 17.6429 21.3333V8C17.6429 6.53333 16.4214 5.33333 14.9286 5.33333H4.07143C2.57857 5.33333 1.35714 6.53333 1.35714 8V21.3333ZM17.6429 1.33333H14.25L13.2864 0.386667C13.0421 0.146667 12.6893 0 12.3364 0H6.66357C6.31071 0 5.95786 0.146667 5.71357 0.386667L4.75 1.33333H1.35714C0.610714 1.33333 0 1.93333 0 2.66667C0 3.4 0.610714 4 1.35714 4H17.6429C18.3893 4 19 3.4 19 2.66667C19 1.93333 18.3893 1.33333 17.6429 1.33333Z"
                                fill="currentColor"
                              />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9">No promotions available to display.</td>
                    </tr>
                  )}
                </tbody>
              </table>
              {error && <p className="error-message">{error}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscountListPage;
