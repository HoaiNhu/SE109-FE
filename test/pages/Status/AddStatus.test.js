import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter, useNavigate } from "react-router-dom";
import AddStatusPage from "../../../src/pages/Admin/CRUDStatus/AddStatusPage/AddStatusPage";
import * as StatusService from "../../../src/services/StatusService";

// Mock các dependencies
jest.mock("../../../src/services/StatusService");
const mockMutate = jest.fn();

// Mock mutation hook với state riêng cho mỗi test
let mockMutationState = {
  mutate: mockMutate,
  isSuccess: false,
  isError: false,
  error: null,
};

jest.mock("../../../src/hooks/useMutationHook", () => ({
  useMutationHook: () => mockMutationState,
}));

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  useLocation: () => ({ state: { from: "/status-list" } }),
}));

describe("AddStatusPage Component", () => {
  beforeEach(() => {
    // Reset các mock trước mỗi test
    jest.clearAllMocks();
    mockMutate.mockClear();
    mockNavigate.mockClear();
    // Reset mutation state về mặc định
    mockMutationState = {
      mutate: mockMutate,
      isSuccess: false,
      isError: false,
      error: null,
    };
  });

  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <AddStatusPage />
      </BrowserRouter>
    );
  };

  test("render form thêm status thành công", () => {
    renderComponent();

    // Kiểm tra các trường input có tồn tại
    expect(screen.getByPlaceholderText("S5")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter name")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter description")
    ).toBeInTheDocument();
  });

  test("validate form khi submit với dữ liệu trống", async () => {
    renderComponent();

    // Click nút Save mà không nhập gì
    fireEvent.click(screen.getByText("Save"));

    // Kiểm tra các thông báo lỗi validation - sử dụng getAllByText thay vì getByText
    await waitFor(() => {
      const errorMessages = screen.getAllByText("Status Code is required");
      expect(errorMessages.length).toBeGreaterThan(0);

      const nameErrors = screen.getAllByText("Status Name is required");
      expect(nameErrors.length).toBeGreaterThan(0);

      const descErrors = screen.getAllByText("Status Description is required");
      expect(descErrors.length).toBeGreaterThan(0);
    });
  });

  test("thêm status thành công", async () => {
    // Cập nhật mutation state cho test case này
    mockMutationState = {
      mutate: mockMutate,
      isSuccess: true,
      isError: false,
      error: null,
    };

    renderComponent();

    // Nhập dữ liệu hợp lệ với status code mới
    fireEvent.change(screen.getByPlaceholderText("S5"), {
      target: { name: "statusCode", value: "PAID" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter name"), {
      target: { name: "statusName", value: "Paid" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter description"), {
      target: { name: "statusDescription", value: "Order has been paid" },
    });

    // Click nút Save
    fireEvent.click(screen.getByText("Save"));

    // Kiểm tra mutation được gọi với đúng data
    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({
        statusCode: "PAID",
        statusName: "Paid",
        statusDescription: "Order has been paid",
      });
    });

    // Kiểm tra message thành công
    await waitFor(() => {
      expect(
        screen.getByText("Status added successfully!")
      ).toBeInTheDocument();
    });
  });

  test("xử lý lỗi khi thêm status thất bại", async () => {
    // Cập nhật mutation state cho test case này
    mockMutationState = {
      mutate: mockMutate,
      isSuccess: false,
      isError: true,
      error: { message: { message: "Status code already exists" } },
    };

    renderComponent();

    // Nhập dữ liệu với status code đã tồn tại
    fireEvent.change(screen.getByPlaceholderText("S5"), {
      target: { name: "statusCode", value: "PAID" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter name"), {
      target: { name: "statusName", value: "Paid" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter description"), {
      target: { name: "statusDescription", value: "Order has been paid" },
    });

    // Click nút Save
    fireEvent.click(screen.getByText("Save"));

    // Kiểm tra message lỗi
    await waitFor(() => {
      expect(
        screen.getByText("Status code already exists")
      ).toBeInTheDocument();
    });
  });

  test("nút Exit chuyển hướng về trang danh sách status", async () => {
    renderComponent();

    // Click nút Exit và đợi một chút để đảm bảo event được xử lý
    fireEvent.click(screen.getByText("Exit"));

    // Kiểm tra navigate được gọi với đúng path
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/status-list");
    });
  });
});
