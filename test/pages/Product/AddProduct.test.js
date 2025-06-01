import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AddProductPage from "../../../src/pages/Admin/CRUDProduct/AddProductPage/AddProductPage";
import { createProduct } from "../../../src/services/productServices";
import "@testing-library/jest-dom";

// Mock các dependencies
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
}));

jest.mock("../../../src/services/productServices", () => ({
  createProduct: jest.fn(),
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
    _id: "683543f639236fb090290b1d",
    categoryName: "Nhẫn cưới",
    createdAt: "2024-03-28T05:26:01.578+00:00",
    updatedAt: "2024-03-28T05:26:01.578+00:00",
  },
];

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ data: mockCategories }),
  })
);

// Mock product data
const mockProductData = {
  _id: "68369e69939e032f252b051a",
  productName: "Cặp nhẫn cưới Kim cương Vàng trắng 14K PNJ 13131-05656",
  productPrice: 19957000,
  productImage:
    "https://res.cloudinary.com/dlyl41lgq/image/upload/v1748409961/products/test.jpg",
  productCategory: "683543f639236fb090290b1d",
  productSize: "20",
  productQuantity: 5,
  productDescription:
    "Cặp nhẫn cưới Kim cương Vàng 14K PNJ là lựa chọn hoàn hảo cho những cặp đôi",
  productMaterial: "platinum",
  productWeight: 8.8226,
  createdAt: "2024-03-28T05:26:01.578+00:00",
  updatedAt: "2024-03-28T05:26:01.578+00:00",
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

describe("AddProductPage Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
  });

  const renderComponent = () => {
    return customRender(<AddProductPage />);
  };

  test("renders AddProductPage component", () => {
    renderComponent();
    expect(screen.getByText("Add Jewelry")).toBeInTheDocument();
  });

  test("loads and displays categories", async () => {
    renderComponent();
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        "http://localhost:3001/api/category/get-all-category",
        expect.any(Object)
      );
    });
    expect(screen.getByText("Select category")).toBeInTheDocument();
  });

  test("handles form input changes", () => {
    renderComponent();

    const nameInput = screen.getByPlaceholderText("Enter name");
    const priceInput = screen.getByPlaceholderText("Enter price");

    fireEvent.change(nameInput, {
      target: { name: "productName", value: mockProductData.productName },
    });
    fireEvent.change(priceInput, {
      target: { name: "productPrice", value: mockProductData.productPrice },
    });

    expect(nameInput.value).toBe(mockProductData.productName);
    expect(priceInput.value).toBe(mockProductData.productPrice.toString());
  });

  test("handles image upload", () => {
    renderComponent();

    const file = new File(["test"], "test.png", { type: "image/png" });
    const input = screen.getByTestId("file-input");

    // Mock URL.createObjectURL
    const mockUrl =
      "https://res.cloudinary.com/dlyl41lgq/image/upload/v1748409961/products/file_vonlcs.png";
    URL.createObjectURL = jest.fn(() => mockUrl);

    fireEvent.change(input, { target: { files: [file] } });

    // Kiểm tra xem preview image có được hiển thị không
    const previewImage = screen.getByAltText("Preview");
    expect(previewImage).toBeInTheDocument();
    expect(previewImage.src).toBe(mockUrl);
  });

  test("handles form submission", async () => {
    createProduct.mockResolvedValueOnce({ status: "OK" });

    renderComponent();

    // Fill form với mock data
    fireEvent.change(screen.getByPlaceholderText("Enter name"), {
      target: { name: "productName", value: mockProductData.productName },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter price"), {
      target: { name: "productPrice", value: mockProductData.productPrice },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter size"), {
      target: { name: "productSize", value: mockProductData.productSize },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter weight"), {
      target: { name: "productWeight", value: mockProductData.productWeight },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter quantity"), {
      target: {
        name: "productQuantity",
        value: mockProductData.productQuantity,
      },
    });

    // Submit form
    const submitButton = screen.getByText("Save");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(createProduct).toHaveBeenCalled();
    });
  });

  test("handles material selection", () => {
    renderComponent();

    const materialSelect = screen.getByTestId("material-select");
    fireEvent.change(materialSelect, {
      target: { value: mockProductData.productMaterial },
    });

    expect(materialSelect.value).toBe(mockProductData.productMaterial);
  });

  test("handles cancel button click", () => {
    const navigate = jest.fn();
    jest
      .spyOn(require("react-router-dom"), "useNavigate")
      .mockImplementation(() => navigate);

    renderComponent();

    const cancelButton = screen.getByText("Cancel");
    fireEvent.click(cancelButton);

    expect(navigate).toHaveBeenCalledWith("/admin/products");
  });

  test("displays error message on failed submission", async () => {
    createProduct.mockRejectedValueOnce(new Error("Failed to create product"));
    global.alert = jest.fn();

    renderComponent();

    const submitButton = screen.getByText("Save");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith(
        "An error occurred while adding the jewelry!"
      );
    });
  });
});
