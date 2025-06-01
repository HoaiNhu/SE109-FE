import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AddCategoryPage from "../../../src/pages/Admin/CRUDCategory/AddCategoryPage/AddCategoryPage";

// Mock fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

// Mock window.alert
const mockAlert = jest.fn();
window.alert = mockAlert;

const mockStore = configureStore([]);

const renderComponent = (store) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <BrowserRouter>
          <AddCategoryPage />
        </BrowserRouter>
      </Provider>
    </QueryClientProvider>
  );
};

describe("AddCategoryPage", () => {
  let store;

  beforeEach(() => {
    store = mockStore({});
    store.dispatch = jest.fn();
    jest.clearAllMocks();
    mockNavigate.mockClear();
    mockFetch.mockClear();
    mockAlert.mockClear();

    // Mock localStorage
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: jest.fn(() => "mock-access-token"),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
      },
      writable: true,
    });
  });

  // Test UI Components
  describe("UI Components", () => {
    test("AC_UIF-1: Should display all UI components correctly", () => {
      renderComponent(store);

      // Check title
      expect(screen.getByText(/ADD CATEGORY/i)).toBeInTheDocument();

      // Check form inputs
      expect(screen.getByPlaceholderText("C6")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Bánh mùa đông")).toBeInTheDocument();

      // Check buttons
      expect(screen.getByRole("button", { name: /Add/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Exit/i })).toBeInTheDocument();

      // Check side menu items
      expect(screen.getByText(/Store's Information/i)).toBeInTheDocument();
      expect(screen.getByText(/Order/i)).toBeInTheDocument();
      expect(screen.getByText(/Promo/i)).toBeInTheDocument();
      expect(screen.getByText(/Status/i)).toBeInTheDocument();
      expect(screen.getByText(/Category/i)).toBeInTheDocument();
      expect(screen.getByText(/User/i)).toBeInTheDocument();
      expect(screen.getByText(/Statistic/i)).toBeInTheDocument();
    });
  });

  // Test Category Code Input
  describe("Category Code Input", () => {
    test("AC_UIF-2: Should have empty default state", () => {
      renderComponent(store);
      const codeInput = screen.getByPlaceholderText("C6");
      expect(codeInput).toHaveValue("");
    });

    test("AC_UIF-3: Should accept valid category code", () => {
      renderComponent(store);
      const codeInput = screen.getByPlaceholderText("C6");
      fireEvent.change(codeInput, { target: { value: "C4" } });
      expect(codeInput).toHaveValue("C4");
    });

    test("AC_UIF-4: Should show error for empty category code", async () => {
      renderComponent(store);
      const codeInput = screen.getByPlaceholderText("C6");
      const nameInput = screen.getByPlaceholderText("Bánh mùa đông");
      const addButton = screen.getByRole("button", { name: /Add/i });

      fireEvent.change(codeInput, { target: { value: "" } });
      fireEvent.change(nameInput, { target: { value: "New Category" } });
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(mockAlert).toHaveBeenCalledWith("Category code is required");
      });
    });

    test("AC_UIF-5: Should trim spaces in category code", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({ categoryCode: "C4", categoryName: "New Category" }),
      });

      renderComponent(store);
      const codeInput = screen.getByPlaceholderText("C6");
      const nameInput = screen.getByPlaceholderText("Bánh mùa đông");
      const addButton = screen.getByRole("button", { name: /Add/i });

      fireEvent.change(codeInput, { target: { value: "  C4  " } });
      fireEvent.change(nameInput, { target: { value: "New Category" } });
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          "http://localhost:3001/api/category/create-category",
          expect.objectContaining({
            method: "POST",
            body: JSON.stringify({
              categoryCode: "C4",
              categoryName: "New Category",
            }),
          })
        );
      });
    });
  });

  // Test Category Name Input
  describe("Category Name Input", () => {
    test("AC_UIF-6: Should have empty default state", () => {
      renderComponent(store);
      const nameInput = screen.getByPlaceholderText("Bánh mùa đông");
      expect(nameInput).toHaveValue("");
    });

    test("AC_UIF-7: Should accept valid category name", () => {
      renderComponent(store);
      const nameInput = screen.getByPlaceholderText("Bánh mùa đông");
      fireEvent.change(nameInput, { target: { value: "New Category" } });
      expect(nameInput).toHaveValue("New Category");
    });

    test("AC_UIF-8: Should show error for empty category name", async () => {
      renderComponent(store);
      const codeInput = screen.getByPlaceholderText("C6");
      const nameInput = screen.getByPlaceholderText("Bánh mùa đông");
      const addButton = screen.getByRole("button", { name: /Add/i });

      fireEvent.change(codeInput, { target: { value: "C4" } });
      fireEvent.change(nameInput, { target: { value: "" } });
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(mockAlert).toHaveBeenCalledWith("Category name is required");
      });
    });

    test("AC_UIF-9: Should trim spaces in category name", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({ categoryCode: "C4", categoryName: "New Category" }),
      });

      renderComponent(store);
      const codeInput = screen.getByPlaceholderText("C6");
      const nameInput = screen.getByPlaceholderText("Bánh mùa đông");
      const addButton = screen.getByRole("button", { name: /Add/i });

      fireEvent.change(codeInput, { target: { value: "C4" } });
      fireEvent.change(nameInput, { target: { value: "  New Category  " } });
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          "http://localhost:3001/api/category/create-category",
          expect.objectContaining({
            method: "POST",
            body: JSON.stringify({
              categoryCode: "C4",
              categoryName: "New Category",
            }),
          })
        );
      });
    });
  });

  // Test Form Submission
  describe("Form Submission", () => {
    test("AC_UIF-10: Should successfully create new category", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({ categoryCode: "C4", categoryName: "New Category" }),
      });

      renderComponent(store);
      const codeInput = screen.getByPlaceholderText("C6");
      const nameInput = screen.getByPlaceholderText("Bánh mùa đông");
      const addButton = screen.getByRole("button", { name: /Add/i });

      fireEvent.change(codeInput, { target: { value: "C4" } });
      fireEvent.change(nameInput, { target: { value: "New Category" } });
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          "http://localhost:3001/api/category/create-category",
          expect.objectContaining({
            method: "POST",
            body: JSON.stringify({
              categoryCode: "C4",
              categoryName: "New Category",
            }),
          })
        );
        expect(mockAlert).toHaveBeenCalledWith("Thêm loại bánh thành công!");
        expect(mockNavigate).toHaveBeenCalledWith("/admin/category-list");
      });
    });

    test("AC_UIF-11: Should show error message on failed submission", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: () =>
          Promise.resolve({ message: "Category code already exists" }),
      });

      renderComponent(store);
      const codeInput = screen.getByPlaceholderText("C6");
      const nameInput = screen.getByPlaceholderText("Bánh mùa đông");
      const addButton = screen.getByRole("button", { name: /Add/i });

      fireEvent.change(codeInput, { target: { value: "C1" } });
      fireEvent.change(nameInput, { target: { value: "New Category" } });
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(mockAlert).toHaveBeenCalledWith(
          "Thêm loại bánh thất bại: Category code already exists"
        );
      });
    });

    test("AC_UIF-12: Should handle network error", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      renderComponent(store);
      const codeInput = screen.getByPlaceholderText("C6");
      const nameInput = screen.getByPlaceholderText("Bánh mùa đông");
      const addButton = screen.getByRole("button", { name: /Add/i });

      fireEvent.change(codeInput, { target: { value: "C4" } });
      fireEvent.change(nameInput, { target: { value: "New Category" } });
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(mockAlert).toHaveBeenCalledWith(
          "Đã xảy ra lỗi khi thêm loại bánh!"
        );
      });
    });
  });

  // Test Navigation
  describe("Navigation", () => {
    test("AC_UIF-13: Should navigate to category list on Exit button click", () => {
      renderComponent(store);
      const exitButton = screen.getByRole("button", { name: /Exit/i });
      fireEvent.click(exitButton);
      expect(mockNavigate).toHaveBeenCalledWith("/admin/category-list");
    });

    test("AC_UIF-14: Should navigate to category list after successful creation", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({ categoryCode: "C4", categoryName: "New Category" }),
      });

      renderComponent(store);
      const codeInput = screen.getByPlaceholderText("C6");
      const nameInput = screen.getByPlaceholderText("Bánh mùa đông");
      const addButton = screen.getByRole("button", { name: /Add/i });

      fireEvent.change(codeInput, { target: { value: "C4" } });
      fireEvent.change(nameInput, { target: { value: "New Category" } });
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith("/admin/category-list");
      });
    });
  });

  // Test Authentication
  describe("Authentication", () => {
    test("AC_UIF-15: Should show error when not logged in", async () => {
      window.localStorage.getItem.mockReturnValueOnce(null);

      renderComponent(store);
      const codeInput = screen.getByPlaceholderText("C6");
      const nameInput = screen.getByPlaceholderText("Bánh mùa đông");
      const addButton = screen.getByRole("button", { name: /Add/i });

      fireEvent.change(codeInput, { target: { value: "C4" } });
      fireEvent.change(nameInput, { target: { value: "New Category" } });
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(mockAlert).toHaveBeenCalledWith(
          "Bạn chưa đăng nhập. Vui lòng đăng nhập để thực hiện thao tác này."
        );
      });
    });
  });
});
