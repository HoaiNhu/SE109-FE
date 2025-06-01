import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import AddStatusPage from "../../../src/pages/Admin/CRUDStatus/AddStatusPage/AddStatusPage";
import * as StatusService from "../../../src/services/StatusService";

// Mock các dependencies
jest.mock("../../../src/services/StatusService");
const mockMutate = jest.fn();

jest.mock("../../../src/hooks/useMutationHook", () => ({
  useMutationHook: () => ({
    mutate: mockMutate,
    isSuccess: false,
    isError: false,
    error: null,
  }),
}));

describe("AddStatusPage Component", () => {
  const mockNavigate = jest.fn();
  const mockLocation = { state: { from: "/status-list" } };

  beforeEach(() => {
    // Reset các mock trước mỗi test
    jest.clearAllMocks();
    mockMutate.mockClear();
    // Mock useNavigate và useLocation
    jest.mock("react-router-dom", () => ({
      ...jest.requireActual("react-router-dom"),
      useNavigate: () => mockNavigate,
      useLocation: () => mockLocation,
    }));
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

    // Kiểm tra các thông báo lỗi validation
    await waitFor(() => {
      expect(screen.getByText("Status Code is required")).toBeInTheDocument();
      expect(screen.getByText("Status Name is required")).toBeInTheDocument();
      expect(
        screen.getByText("Status Description is required")
      ).toBeInTheDocument();
    });
  });

  test("thêm status thành công", async () => {
    // Mock mutation hook với giá trị isSuccess = true
    jest
      .spyOn(require("../../../src/hooks/useMutationHook"), "useMutationHook")
      .mockImplementation(() => ({
        mutate: mockMutate,
        isSuccess: true,
        isError: false,
        error: null,
      }));

    renderComponent();

    // Nhập dữ liệu hợp lệ
    fireEvent.change(screen.getByPlaceholderText("S5"), {
      target: { name: "statusCode", value: "PENDING" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter name"), {
      target: { name: "statusName", value: "Pending" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter description"), {
      target: { name: "statusDescription", value: "null" },
    });

    // Click nút Save
    fireEvent.click(screen.getByText("Save"));

    // Kiểm tra mutation được gọi với đúng data
    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({
        statusCode: "PENDING",
        statusName: "Pending",
        statusDescription: "null",
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
    // Mock mutation hook với giá trị isError = true
    jest
      .spyOn(require("../../../src/hooks/useMutationHook"), "useMutationHook")
      .mockImplementation(() => ({
        mutate: mockMutate,
        isSuccess: false,
        isError: true,
        error: { message: { message: "Status code already exists" } },
      }));

    renderComponent();

    // Nhập dữ liệu
    fireEvent.change(screen.getByPlaceholderText("S5"), {
      target: { name: "statusCode", value: "PENDING" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter name"), {
      target: { name: "statusName", value: "Pending" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter description"), {
      target: { name: "statusDescription", value: "null" },
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

  test("nút Exit chuyển hướng về trang danh sách status", () => {
    renderComponent();

    // Click nút Exit
    fireEvent.click(screen.getByText("Exit"));

    // Kiểm tra navigate được gọi với đúng path
    expect(mockNavigate).toHaveBeenCalledWith("/status-list");
  });
});
