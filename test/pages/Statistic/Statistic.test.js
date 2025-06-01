import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import ReportPage from "../../../src/pages/Admin/CRUDReport/ReportPage";
import * as OrderService from "../../../src/services/OrderService";
import * as ProductService from "../../../src/services/productServices";

// Mock các dependencies
jest.mock("../../../src/services/OrderService");
jest.mock("../../../src/services/productServices");

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

// Tăng timeout cho toàn bộ test suite
jest.setTimeout(10000);

describe("ReportPage Component", () => {
  const mockOrders = [
    {
      _id: "1",
      orderCode: "ORD001",
      totalPrice: 1000000,
      createdAt: "2024-03-20T10:00:00.000Z",
      deliveryDate: "2024-03-21T10:00:00.000Z",
      orderItems: [
        {
          product: { _id: "P1" },
          quantity: 2,
          total: 500000,
        },
        {
          product: { _id: "P2" },
          quantity: 1,
          total: 500000,
        },
      ],
    },
  ];

  const mockProducts = [
    {
      _id: "P1",
      productName: "Product 1",
      productPrice: 250000,
    },
    {
      _id: "P2",
      productName: "Product 2",
      productPrice: 500000,
    },
  ];

  beforeEach(() => {
    // Reset các mock trước mỗi test
    jest.clearAllMocks();
    mockNavigate.mockClear();

    // Mock localStorage
    Storage.prototype.getItem = jest.fn(() => "mock-token");

    // Mock API calls
    OrderService.getAllOrders.mockResolvedValue({ data: mockOrders });
    ProductService.getAllproduct.mockResolvedValue({ data: mockProducts });
  });

  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <ReportPage />
      </BrowserRouter>
    );
  };

  test("render trang thống kê thành công", async () => {
    renderComponent();

    // Kiểm tra các dropdown có tồn tại
    expect(screen.getByText("Choose date")).toBeInTheDocument();
    expect(screen.getByText("Choose month")).toBeInTheDocument();
    expect(screen.getByText("Choose year")).toBeInTheDocument();
    expect(screen.getByText("Product Table")).toBeInTheDocument();

    // Kiểm tra nút View Statistics
    expect(screen.getByText("View Statistics")).toBeInTheDocument();

    // Kiểm tra các tiêu đề bảng
    await waitFor(() => {
      expect(screen.getByText("Statistics by Product")).toBeInTheDocument();
      expect(screen.getByText("Statistics by Order")).toBeInTheDocument();
    });
  });

  test("fetch dữ liệu orders và products thành công", async () => {
    renderComponent();

    // Kiểm tra API calls
    await waitFor(() => {
      expect(OrderService.getAllOrders).toHaveBeenCalledWith("mock-token");
      expect(ProductService.getAllproduct).toHaveBeenCalled();
    });

    // Kiểm tra dữ liệu được hiển thị
    await waitFor(() => {
      expect(screen.getByText("ORD001")).toBeInTheDocument();
      expect(screen.getByText("Product 1")).toBeInTheDocument();
      expect(screen.getByText("Product 2")).toBeInTheDocument();
    });
  });

  test("tính toán thống kê sản phẩm chính xác", async () => {
    renderComponent();

    // Đợi API calls hoàn thành
    await waitFor(() => {
      expect(OrderService.getAllOrders).toHaveBeenCalled();
      expect(ProductService.getAllproduct).toHaveBeenCalled();
    });

    // Đợi dữ liệu được tính toán và hiển thị với timeout dài hơn
    await waitFor(
      () => {
        // Kiểm tra tổng doanh thu
        const revenueElement = screen.getByText("1,000,000");
        expect(revenueElement).toBeInTheDocument();

        // Kiểm tra tổng số lượng sản phẩm
        const quantityElement = screen.getByText("3");
        expect(quantityElement).toBeInTheDocument();

        // Kiểm tra dữ liệu sản phẩm
        expect(screen.getByText("Product 1")).toBeInTheDocument();
        expect(screen.getByText("Product 2")).toBeInTheDocument();
      },
      { timeout: 8000 }
    ); // Tăng timeout lên 8 giây
  });

  test("lọc dữ liệu theo ngày/tháng/năm", async () => {
    renderComponent();

    // Đợi dữ liệu được load
    await waitFor(() => {
      expect(screen.getByText("ORD001")).toBeInTheDocument();
    });

    // Chọn ngày 20
    fireEvent.click(screen.getByText("Choose date"));
    fireEvent.click(screen.getByText("Date 20"));

    // Chọn tháng 3
    fireEvent.click(screen.getByText("Choose month"));
    fireEvent.click(screen.getByText("Month 3"));

    // Chọn năm 2024
    fireEvent.click(screen.getByText("Choose year"));
    fireEvent.click(screen.getByText("Year 2024"));

    // Click nút View Statistics
    fireEvent.click(screen.getByText("View Statistics"));

    // Kiểm tra dữ liệu được lọc
    await waitFor(() => {
      expect(screen.getByText("ORD001")).toBeInTheDocument();
    });
  });

  test("chuyển đổi giữa bảng sản phẩm và đơn hàng", async () => {
    renderComponent();

    // Đợi dữ liệu được load
    await waitFor(
      () => {
        expect(screen.getByText("Statistics by Product")).toBeInTheDocument();
      },
      { timeout: 5000 }
    );

    // Chuyển sang bảng đơn hàng
    const tableDropdown = screen.getByText("Product Table");
    fireEvent.click(tableDropdown);

    // Đợi dropdown menu xuất hiện
    await waitFor(() => {
      const orderTableOption = screen.getByText("Order Table");
      fireEvent.click(orderTableOption);
    });

    // Click nút View Statistics
    const viewButton = screen.getByText("View Statistics");
    fireEvent.click(viewButton);

    // Kiểm tra bảng đơn hàng được hiển thị với timeout dài hơn
    await waitFor(
      () => {
        expect(screen.getByText("Statistics by Order")).toBeInTheDocument();
        expect(screen.getByText("ORD001")).toBeInTheDocument();
      },
      { timeout: 5000 }
    );
  });

  test("xử lý checkbox chọn hàng", async () => {
    renderComponent();

    // Đợi dữ liệu được load
    await waitFor(() => {
      expect(screen.getByText("ORD001")).toBeInTheDocument();
    });

    // Tìm và click vào checkbox đầu tiên trong bảng sản phẩm
    const checkbox =
      screen.getByTestId("select-all-checkbox") ||
      document.querySelector(".promo-table thead th svg");
    expect(checkbox).toBeTruthy();
    fireEvent.click(checkbox);

    // Kiểm tra các hàng được highlight
    await waitFor(() => {
      const rows = document.querySelectorAll(".promo-table tbody tr");
      rows.forEach((row) => {
        expect(row).toHaveClass("highlight");
      });
    });

    // Click lại để bỏ chọn tất cả
    fireEvent.click(checkbox);

    // Kiểm tra các hàng không còn highlight
    await waitFor(() => {
      const rows = document.querySelectorAll(".promo-table tbody tr");
      rows.forEach((row) => {
        expect(row).not.toHaveClass("highlight");
      });
    });
  });

  test("chuyển hướng khi click menu", async () => {
    renderComponent();

    // Click các menu item
    fireEvent.click(screen.getByText("Store information"));
    expect(mockNavigate).toHaveBeenCalledWith("/admin/store-info");

    fireEvent.click(screen.getByText("Order"));
    expect(mockNavigate).toHaveBeenCalledWith("/admin/order-list");

    fireEvent.click(screen.getByText("Promotion"));
    expect(mockNavigate).toHaveBeenCalledWith("/admin/discount-list");

    fireEvent.click(screen.getByText("Status"));
    expect(mockNavigate).toHaveBeenCalledWith("/admin/status-list");

    fireEvent.click(screen.getByText("Category"));
    expect(mockNavigate).toHaveBeenCalledWith("/admin/category-list");

    fireEvent.click(screen.getByText("User"));
    expect(mockNavigate).toHaveBeenCalledWith("/admin/user-list");

    fireEvent.click(screen.getByText("Statistic"));
    expect(mockNavigate).toHaveBeenCalledWith("/admin/report");
  });
});
