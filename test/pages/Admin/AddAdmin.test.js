import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import AddUserPage from "../../../src/pages/Admin/CRUDUser/AddUserPage/AddUserPage";
import * as UserService from "../../../src/services/UserService";

// Mock các dependencies
jest.mock("../../../src/services/UserService");
const mockMutate = jest.fn();

jest.mock("../../../src/hooks/useMutationHook", () => ({
  useMutationHook: () => ({
    mutate: mockMutate,
    isSuccess: false,
    isError: false,
    error: null,
  }),
}));

describe("AddUserPage Component", () => {
  const mockNavigate = jest.fn();
  const mockLocation = { state: { from: "/user-list" } };

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
        <AddUserPage />
      </BrowserRouter>
    );
  };

  test("render form thêm admin thành công", () => {
    renderComponent();

    // Kiểm tra các trường input có tồn tại
    expect(screen.getByPlaceholderText("Nguyễn")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Văn A")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("0123456789")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("abc123@gmail.com")).toBeInTheDocument();
    expect(screen.getByTestId("password-input")).toBeInTheDocument();
    expect(screen.getByTestId("confirm-password-input")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("1/1 khu phố 8")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("true/false")).toBeInTheDocument();
  });

  test("validate form khi submit với dữ liệu không hợp lệ", async () => {
    renderComponent();

    // Click nút Add mà không nhập gì
    fireEvent.click(screen.getByText("Add"));

    // Kiểm tra các thông báo lỗi validation
    await waitFor(() => {
      expect(
        screen.getByText("Password must be at least 6 characters.")
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          "Email must be a valid format (e.g., user@example.com)."
        )
      ).toBeInTheDocument();
      expect(
        screen.getByText("Phone must be a valid 10-11 digit number.")
      ).toBeInTheDocument();
    });
  });

  test("validate email không hợp lệ", async () => {
    renderComponent();

    // Nhập email không hợp lệ
    const emailInput = screen.getByPlaceholderText("abc123@gmail.com");
    fireEvent.change(emailInput, {
      target: { name: "userEmail", value: "invalid-email" },
    });

    // Click nút Add
    fireEvent.click(screen.getByText("Add"));

    // Kiểm tra thông báo lỗi
    await waitFor(() => {
      expect(
        screen.getByText(
          "Email must be a valid format (e.g., user@example.com)."
        )
      ).toBeInTheDocument();
    });
  });

  test("validate số điện thoại không hợp lệ", async () => {
    renderComponent();

    // Nhập số điện thoại không hợp lệ
    const phoneInput = screen.getByPlaceholderText("0123456789");
    fireEvent.change(phoneInput, {
      target: { name: "userPhone", value: "123" },
    });

    // Click nút Add
    fireEvent.click(screen.getByText("Add"));

    // Kiểm tra thông báo lỗi
    await waitFor(() => {
      expect(
        screen.getByText("Phone must be a valid 10-11 digit number.")
      ).toBeInTheDocument();
    });
  });

  test("validate mật khẩu không khớp", async () => {
    renderComponent();

    // Nhập mật khẩu và xác nhận mật khẩu khác nhau
    const passwordInput = screen.getByTestId("password-input");
    const confirmPasswordInput = screen.getByTestId("confirm-password-input");

    fireEvent.change(passwordInput, {
      target: { name: "userPassword", value: "password123" },
    });
    fireEvent.change(confirmPasswordInput, {
      target: { name: "userConfirmPassword", value: "password456" },
    });

    // Click nút Add
    fireEvent.click(screen.getByText("Add"));

    // Kiểm tra thông báo lỗi
    await waitFor(() => {
      expect(screen.getByText("Passwords do not match.")).toBeInTheDocument();
    });
  });

  test("thêm admin thành công", async () => {
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
    fireEvent.change(screen.getByPlaceholderText("Nguyễn"), {
      target: { name: "familyName", value: "Nguyễn" },
    });
    fireEvent.change(screen.getByPlaceholderText("Văn A"), {
      target: { name: "userName", value: "Như" },
    });
    fireEvent.change(screen.getByPlaceholderText("0123456789"), {
      target: { name: "userPhone", value: "0777031667" },
    });
    fireEvent.change(screen.getByPlaceholderText("abc123@gmail.com"), {
      target: { name: "userEmail", value: "tamnhu11204@gmail.com" },
    });
    const passwordInput = screen.getByTestId("password-input");
    const confirmPasswordInput = screen.getByTestId("confirm-password-input");
    fireEvent.change(passwordInput, {
      target: { name: "userPassword", value: "123456" },
    });
    fireEvent.change(confirmPasswordInput, {
      target: { name: "userConfirmPassword", value: "123456" },
    });
    fireEvent.change(screen.getByPlaceholderText("1/1 khu phố 8"), {
      target: { name: "userAddress", value: "123 Test Street" },
    });
    fireEvent.change(screen.getByPlaceholderText("true/false"), {
      target: { name: "isAdmin", value: "true" },
    });

    // Click nút Add
    fireEvent.click(screen.getByText("Add"));

    // Kiểm tra mutation được gọi với đúng data
    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({
        familyName: "Nguyễn",
        userName: "Như",
        userPhone: "0777031667",
        userEmail: "tamnhu11204@gmail.com",
        userPassword: "123456",
        userConfirmPassword: "123456",
        userAddress: "123 Test Street",
        userImage: "",
        isAdmin: "true",
      });
    });

    // Kiểm tra message thành công
    await waitFor(() => {
      expect(screen.getByText("Add user successful!")).toBeInTheDocument();
    });
  });
});
