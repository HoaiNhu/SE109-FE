import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AddDiscountPage from "../../../src/pages/Admin/CRUDDiscount/AddDiscountPage/AddDiscountPage";
import { createDiscount } from "../../../src/services/DiscountService";
import "@testing-library/jest-dom";

// Mock các dependencies
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
}));

jest.mock("../../../src/services/DiscountService", () => ({
  createDiscount: jest.fn(),
}));

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(() => "mock-token"),
  setItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, "localStorage", { value: mockLocalStorage });

// Mock fetch cho categories
const mockCategories = [
  {
    _id: "683543dc39236fb090290b13",
    categoryCode: "C1",
    categoryName: "Necklace",
    isActive: true,
    createdAt: "2025-05-27T04:47:24.450+00:00",
    updatedAt: "2025-05-27T04:47:24.450+00:00",
    __v: 0,
  },
];

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ data: mockCategories }),
  })
);

// Mock discount data
const mockDiscountData = {
  discountCode: "KM1",
  discountName: "Summer happiness",
  discountValue: "100000",
  applicableCategory: "683543dc39236fb090290b13",
  discountImage: null,
  discountStartDate: "2024-04-01",
  discountEndDate: "2024-04-30",
};

// Tạo QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

// Wrapper component với providers
const AllTheProviders = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{children}</BrowserRouter>
    </QueryClientProvider>
  );
};

const customRender = (ui, options) =>
  render(ui, { wrapper: AllTheProviders, ...options });

describe("AddDiscountPage Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
  });

  const renderComponent = () => {
    return customRender(<AddDiscountPage />);
  };

  test("renders AddDiscountPage component", () => {
    renderComponent();
    expect(screen.getByText("Promo banner")).toBeInTheDocument();
    expect(screen.getByText("Promo code")).toBeInTheDocument();
    expect(screen.getByText("Promo name")).toBeInTheDocument();
  });

  test("loads and displays categories", async () => {
    renderComponent();
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        "http://localhost:3001/api/category/get-all-category",
        expect.any(Object)
      );
    });
    expect(screen.getByText("Choose product")).toBeInTheDocument();
  });

  test("handles form input changes", () => {
    renderComponent();

    const codeInput = screen.getByPlaceholderText("KM1");
    const nameInput = screen.getByPlaceholderText("Sumer happiness");
    const valueInput = screen.getByPlaceholderText("100 000");

    fireEvent.change(codeInput, {
      target: { name: "discountCode", value: mockDiscountData.discountCode },
    });
    fireEvent.change(nameInput, {
      target: { name: "discountName", value: mockDiscountData.discountName },
    });
    fireEvent.change(valueInput, {
      target: { name: "discountValue", value: mockDiscountData.discountValue },
    });

    expect(codeInput.value).toBe(mockDiscountData.discountCode);
    expect(nameInput.value).toBe(mockDiscountData.discountName);
    expect(valueInput.value).toBe(mockDiscountData.discountValue);
  });

  test("handles image upload", () => {
    renderComponent();

    const file = new File(["test"], "test.png", { type: "image/png" });
    const input = screen.getByTestId("banner-input");

    // Mock URL.createObjectURL
    const mockUrl = "blob:http://localhost:3000/mock-url";
    URL.createObjectURL = jest.fn(() => mockUrl);

    fireEvent.change(input, { target: { files: [file] } });

    // Kiểm tra xem preview image có được hiển thị không
    const previewImage = screen.getByAltText("Preview");
    expect(previewImage).toBeInTheDocument();
    expect(previewImage.src).toBe(mockUrl);
  });

  test("handles category selection", async () => {
    renderComponent();

    // Đợi categories được load
    await waitFor(() => {
      expect(screen.getByText("Necklace")).toBeInTheDocument();
    });

    const categorySelect = screen.getByRole("combobox");
    fireEvent.change(categorySelect, {
      target: {
        name: "applicableCategory",
        value: mockDiscountData.applicableCategory,
      },
    });

    expect(categorySelect.value).toBe(mockDiscountData.applicableCategory);
  });

  test("handles date input changes", () => {
    renderComponent();

    const startDateInput = screen.getByPlaceholderText("Choose start date");
    const endDateInput = screen.getByPlaceholderText("Choose end date");

    fireEvent.change(startDateInput, {
      target: {
        name: "discountStartDate",
        value: mockDiscountData.discountStartDate,
      },
    });
    fireEvent.change(endDateInput, {
      target: {
        name: "discountEndDate",
        value: mockDiscountData.discountEndDate,
      },
    });

    expect(startDateInput.value).toBe(mockDiscountData.discountStartDate);
    expect(endDateInput.value).toBe(mockDiscountData.discountEndDate);
  });

  test("handles form submission", async () => {
    createDiscount.mockResolvedValueOnce({ status: "OK" });

    renderComponent();

    // Fill form với mock data
    fireEvent.change(screen.getByPlaceholderText("KM1"), {
      target: { name: "discountCode", value: mockDiscountData.discountCode },
    });
    fireEvent.change(screen.getByPlaceholderText("Sumer happiness"), {
      target: { name: "discountName", value: mockDiscountData.discountName },
    });
    fireEvent.change(screen.getByPlaceholderText("100 000"), {
      target: { name: "discountValue", value: mockDiscountData.discountValue },
    });

    // Submit form
    const submitButton = screen.getByText("Save");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(createDiscount).toHaveBeenCalled();
    });
  });

  test("handles cancel button click", () => {
    const navigate = jest.fn();
    jest
      .spyOn(require("react-router-dom"), "useNavigate")
      .mockImplementation(() => navigate);

    renderComponent();

    const cancelButton = screen.getByText("Exit");
    fireEvent.click(cancelButton);

    expect(navigate).toHaveBeenCalledWith("/admin/discount-list");
  });

  test("displays error message on failed submission", async () => {
    createDiscount.mockRejectedValueOnce(
      new Error("Failed to create discount")
    );
    global.alert = jest.fn();

    renderComponent();

    // Fill form với mock data
    fireEvent.change(screen.getByPlaceholderText("KM1"), {
      target: { name: "discountCode", value: mockDiscountData.discountCode },
    });
    fireEvent.change(screen.getByPlaceholderText("Sumer happiness"), {
      target: { name: "discountName", value: mockDiscountData.discountName },
    });
    fireEvent.change(screen.getByPlaceholderText("100 000"), {
      target: { name: "discountValue", value: mockDiscountData.discountValue },
    });

    // Submit form
    const submitButton = screen.getByText("Save");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith("Failed to create discount");
    });
  });
});
