import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";
import CartPage from "../../../src/pages/User/CartPage/CartPage";
import { removeFromCart, updateQuantity } from "../../../src/Redux/slides/cartSlide";

// Mock Redux store
const mockStore = configureStore([]);

// Mock navigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockNavigate,
}));

// Mock dispatch
const mockDispatch = jest.fn();
jest.mock("react-redux", () => ({
    ...jest.requireActual("react-redux"),
    useDispatch: () => mockDispatch,
}));

// Mock QuantityBtn
jest.mock("../../../src/components/QuantityBtn/QuantityBtn", () => ({
    default: ({ initialQuantity, productId, maxQuantity, onChange }) => (
        <div>
            <button
                data-testid={`decrease-btn-${productId}`}
                onClick={() => {
                    if (initialQuantity > 1) {
                        onChange(initialQuantity - 1);
                    } else {
                        window.alert("Số lượng không thể nhỏ hơn 1");
                    }
                }}
            >
                -
            </button>
            <span data-testid={`quantity-${productId}`}>{initialQuantity}</span>
            <button
                data-testid={`increase-btn-${productId}`}
                onClick={() => {
                    if (initialQuantity < maxQuantity) {
                        onChange(initialQuantity + 1);
                    } else {
                        window.alert("Cannot add more, stock limit reached.");
                    }
                }}
            >
                +
            </button>
        </div>
    ),
}));

// Mock DeleteBtn
jest.mock("../../../src/components/DeleteBtn/DeleteBtn", () => ({
    default: ({ onClick }) => (
        <button data-testid="delete-btn" onClick={onClick}>
            Delete
        </button>
    ),
}));

// Mock CheckboxComponent
jest.mock("../../../src/components/CheckboxComponent/CheckboxComponent", () => ({
    default: ({ isChecked, onChange }) => (
        <input
            type="checkbox"
            checked={isChecked}
            onChange={onChange}
            data-testid="checkbox"
        />
    ),
}));

// Mock BackIconComponent
jest.mock("../../../src/components/BackIconComponent/BackIconComponent", () => ({
    default: () => <button data-testid="back-icon">Back</button>,
}));

// Mock ButtonComponent
jest.mock("../../../src/components/ButtonComponent/ButtonComponent", () => ({
    default: ({ children, onClick, disabled, className }) => (
        <button
            data-testid={`button-${children.toLowerCase().replace(/\s/g, "-")}`}
            onClick={onClick}
            disabled={disabled}
            className={className}
        >
            {children}
        </button>
    ),
}));

// Mock ProductInfor
jest.mock("../../../src/components/ProductInfor/ProductInfor", () => ({
    default: ({ image, name, size }) => (
        <div data-testid="product-infor">
            <img src={image} alt={name} />
            <span>{name}</span>
            <span>{size}</span>
        </div>
    ),
}));

describe("CartPage", () => {
    let store;

    // Sample product data
    const mockProducts = [
        {
            id: 1,
            img: "img1.jpg",
            title: "Product A",
            size: "M",
            price: "100,000 VND",
            quantity: 2,
            productQuantity: 5,
        },
        {
            id: 2,
            img: "img2.jpg",
            title: "Product B",
            size: "L",
            price: "50,000 VND",
            quantity: 1,
            productQuantity: 3,
        },
    ];

    beforeEach(() => {
        store = mockStore({
            cart: { products: mockProducts },
        });
        mockNavigate.mockClear();
        mockDispatch.mockClear();
        jest.spyOn(window, "alert").mockImplementation(() => { });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test("C_UIF-1: Overall layout displays correctly with products", () => {
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <CartPage />
                </MemoryRouter>
            </Provider>
        );

        // Check title
        expect(screen.getByText("CART")).toBeInTheDocument();

        // Check table headers
        expect(screen.getByText("Information")).toBeInTheDocument();
        expect(screen.getByText("Price")).toBeInTheDocument();
        expect(screen.getByText("Quantity")).toBeInTheDocument();
        expect(screen.getByText("Cost")).toBeInTheDocument();

        // Check product rows
        expect(screen.getByText("Product A")).toBeInTheDocument();
        expect(screen.getByText("M")).toBeInTheDocument();
        expect(screen.getByText("100,000 VND")).toBeInTheDocument();
        expect(screen.getByText("200,000 VND")).toBeInTheDocument();

        // Check total
        expect(screen.getByText("Order Total:")).toBeInTheDocument();
        expect(screen.getByText("250,000 VND")).toBeInTheDocument();

        // Check buttons
        expect(screen.getByTestId("button-buy-more")).toBeInTheDocument();
        expect(screen.getByTestId("button-pay")).toBeDisabled();
        expect(screen.getByTestId("back-icon")).toBeInTheDocument();
    });

    test("C_UIF-2: Product table displays correct product information", () => {
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <CartPage />
                </MemoryRouter>
            </Provider>
        );

        // Check first product
        expect(screen.getByText("Product A")).toBeInTheDocument();
        expect(screen.getByText("M")).toBeInTheDocument();
        expect(screen.getByText("100,000 VND")).toBeInTheDocument();
        expect(screen.getByText("200,000 VND")).toBeInTheDocument();
        expect(screen.getAllByTestId("checkbox")[1]).not.toBeChecked();
        expect(screen.getAllByTestId("delete-btn")[0]).toBeInTheDocument();

        // Check second product
        expect(screen.getByText("Product B")).toBeInTheDocument();
        expect(screen.getByText("L")).toBeInTheDocument();
        expect(screen.getByText("50,000 VND")).toBeInTheDocument();
        expect(screen.getByText("50,000 VND")).toBeInTheDocument();
        expect(screen.getAllByTestId("checkbox")[2]).not.toBeChecked();
        expect(screen.getAllByTestId("delete-btn")[1]).toBeInTheDocument();
    });

    test("C_UIF-3: Cart displays empty state correctly", () => {
        store = mockStore({ cart: { products: [] } });
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <CartPage />
                </MemoryRouter>
            </Provider>
        );

        // Check empty table
        expect(screen.queryByTestId("product-infor")).not.toBeInTheDocument();

        // Check total
        expect(screen.getByText("Order Total:")).toBeInTheDocument();
        expect(screen.getByText("0 VND")).toBeInTheDocument();

        // Check Pay button
        expect(screen.getByTestId("button-pay")).toBeDisabled();
    });

    test("C_UIF-4: Total amount calculates correctly", () => {
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <CartPage />
                </MemoryRouter>
            </Provider>
        );

        // Total: (100,000 * 2) + (50,000 * 1) = 250,000 VND
        expect(screen.getByText("250,000 VND")).toBeInTheDocument();
    });

    test("C_UIF-5: Checkboxes are unchecked by default", () => {
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <CartPage />
                </MemoryRouter>
            </Provider>
        );

        // Check select all checkbox
        expect(screen.getAllByTestId("checkbox")[0]).not.toBeChecked();

        // Check product checkboxes
        expect(screen.getAllByTestId("checkbox")[1]).not.toBeChecked();
        expect(screen.getAllByTestId("checkbox")[2]).not.toBeChecked();
    });

    test("C_UIF-6: Selecting individual product checkbox", () => {
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <CartPage />
                </MemoryRouter>
            </Provider>
        );

        // Select first product
        fireEvent.click(screen.getAllByTestId("checkbox")[1]);

        // Check states
        expect(screen.getAllByTestId("checkbox")[1]).toBeChecked();
        expect(screen.getAllByTestId("checkbox")[2]).not.toBeChecked();
        expect(screen.getByTestId("button-pay")).not.toBeDisabled();
    });

    test("C_UIF-7: Deselecting a product checkbox", () => {
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <CartPage />
                </MemoryRouter>
            </Provider>
        );

        // Select then deselect first product
        fireEvent.click(screen.getAllByTestId("checkbox")[1]);
        fireEvent.click(screen.getAllByTestId("checkbox")[1]);

        // Check states
        expect(screen.getAllByTestId("checkbox")[1]).not.toBeChecked();
        expect(screen.getByTestId("button-pay")).toBeDisabled();
    });

    test("C_UIF-8: Select All checkbox selects all products", () => {
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <CartPage />
                </MemoryRouter>
            </Provider>
        );

        // Select all
        fireEvent.click(screen.getAllByTestId("checkbox")[0]);

        // Check states
        expect(screen.getAllByTestId("checkbox")[0]).toBeChecked();
        expect(screen.getAllByTestId("checkbox")[1]).toBeChecked();
        expect(screen.getAllByTestId("checkbox")[2]).toBeChecked();
        expect(screen.getByTestId("button-pay")).not.toBeDisabled();
    });

    test("C_UIF-9: Deselect All checkbox clears all selections", () => {
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <CartPage />
                </MemoryRouter>
            </Provider>
        );

        // Select all then deselect
        fireEvent.click(screen.getAllByTestId("checkbox")[0]);
        fireEvent.click(screen.getAllByTestId("checkbox")[0]);

        // Check states
        expect(screen.getAllByTestId("checkbox")[0]).not.toBeChecked();
        expect(screen.getAllByTestId("checkbox")[1]).not.toBeChecked();
        expect(screen.getAllByTestId("checkbox")[2]).not.toBeChecked();
        expect(screen.getByTestId("button-pay")).toBeDisabled();
    });

    test("C_UIF-10: Increase product quantity within stock limit", () => {
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <CartPage />
                </MemoryRouter>
            </Provider>
        );

        // Increase quantity of first product (id: 1, from 2 to 3)
        fireEvent.click(screen.getByTestId("increase-btn-1"));

        // Check updates
        expect(screen.getByTestId("quantity-1")).toHaveTextContent("3");
        expect(screen.getByText("300,000 VND")).toBeInTheDocument(); // Subtotal
        expect(screen.getByText("350,000 VND")).toBeInTheDocument(); // Total
        expect(mockDispatch).toHaveBeenCalledWith(updateQuantity({ id: 1, quantity: 3 }));
    });

    test("C_UIF-11: Increase quantity beyond stock limit", () => {
        store = mockStore({
            cart: {
                products: [
                    {
                        id: 1,
                        img: "img1.jpg",
                        title: "Product A",
                        size: "M",
                        price: "100,000 VND",
                        quantity: 5,
                        productQuantity: 5,
                    },
                ],
            },
        });
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <CartPage />
                </MemoryRouter>
            </Provider>
        );

        // Try to increase quantity
        fireEvent.click(screen.getByTestId("increase-btn-1"));

        // Check no change
        expect(screen.getByTestId("quantity-1")).toHaveTextContent("5");
        expect(window.alert).toHaveBeenCalledWith("Cannot add more, stock limit reached.");
        expect(mockDispatch).not.toHaveBeenCalled();
    });

    test("C_UIF-12: Decrease product quantity to minimum", () => {
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <CartPage />
                </MemoryRouter>
            </Provider>
        );

        // Decrease quantity of first product (id: 1, from 2 to 1)
        fireEvent.click(screen.getByTestId("decrease-btn-1"));

        // Check updates
        expect(screen.getByTestId("quantity-1")).toHaveTextContent("1");
        expect(screen.getByText("100,000 VND")).toBeInTheDocument(); // Subtotal
        expect(screen.getByText("150,000 VND")).toBeInTheDocument(); // Total
        expect(mockDispatch).toHaveBeenCalledWith(updateQuantity({ id: 1, quantity: 1 }));
    });

    test("C_UIF-13: Decrease quantity below minimum", () => {
        store = mockStore({
            cart: {
                products: [
                    {
                        id: 1,
                        img: "img1.jpg",
                        title: "Product A",
                        size: "M",
                        price: "100,000 VND",
                        quantity: 1,
                        productQuantity: 5,
                    },
                ],
            },
        });
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <CartPage />
                </MemoryRouter>
            </Provider>
        );

        // Try to decrease quantity
        fireEvent.click(screen.getByTestId("decrease-btn-1"));

        // Check no change
        expect(screen.getByTestId("quantity-1")).toHaveTextContent("1");
        expect(window.alert).toHaveBeenCalledWith("Số lượng không thể nhỏ hơn 1");
        expect(mockDispatch).not.toHaveBeenCalled();
    });

    test("C_UIF-14: Delete a product from cart", () => {
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <CartPage />
                </MemoryRouter>
            </Provider>
        );

        // Delete first product
        fireEvent.click(screen.getAllByTestId("delete-btn")[0]);

        // Check dispatch
        expect(mockDispatch).toHaveBeenCalledWith(removeFromCart({ id: 1 }));
    });

    test("C_UIF-15: Back button navigates to products page", () => {
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <CartPage />
                </MemoryRouter>
            </Provider>
        );

        fireEvent.click(screen.getByTestId("back-icon"));
        expect(mockNavigate).toHaveBeenCalledWith("/products");
    });

    test("C_UIF-16: Buy more button navigates to products page", () => {
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <CartPage />
                </MemoryRouter>
            </Provider>
        );

        fireEvent.click(screen.getByTestId("button-buy-more"));
        expect(mockNavigate).toHaveBeenCalledWith("/products");
    });

    test("C_UIF-17: Pay button navigates to order-information with selected products", () => {
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <CartPage />
                </MemoryRouter>
            </Provider>
        );

        // Select first product
        fireEvent.click(screen.getAllByTestId("checkbox")[1]);

        // Click Pay
        fireEvent.click(screen.getByTestId("button-pay"));

        // Check navigation
        expect(mockNavigate).toHaveBeenCalledWith("/order-information", {
            state: {
                selectedProductDetails: [mockProducts[0]],
            },
        });
    });

    test("C_UIF-18: Pay button disabled when no products selected", () => {
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <CartPage />
                </MemoryRouter>
            </Provider>
        );

        // Check Pay button disabled
        expect(screen.getByTestId("button-pay")).toBeDisabled();

        // Try clicking Pay
        fireEvent.click(screen.getByTestId("button-pay"));
        expect(mockNavigate).not.toHaveBeenCalled();
    });

    test("C_UIF-19: Redux state updates when deleting a product", () => {
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <CartPage />
                </MemoryRouter>
            </Provider>
        );

        // Delete first product
        fireEvent.click(screen.getAllByTestId("delete-btn")[0]);

        // Check Redux action
        expect(mockDispatch).toHaveBeenCalledWith(removeFromCart({ id: 1 }));
    });

    test("C_UIF-20: Redux state updates when changing quantity", () => {
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <CartPage />
                </MemoryRouter>
            </Provider>
        );

        // Increase quantity of first product
        fireEvent.click(screen.getByTestId("increase-btn-1"));

        // Check Redux action
        expect(mockDispatch).toHaveBeenCalledWith(updateQuantity({ id: 1, quantity: 3 }));
    });
});