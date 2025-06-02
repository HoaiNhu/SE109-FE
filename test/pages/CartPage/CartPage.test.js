import React from 'react';
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom"; // Sử dụng BrowserRouter thay vì MemoryRouter
import configureStore from "redux-mock-store";
import CartPage from "../../../src/pages/User/CartPage/CartPage"; // Đảm bảo đúng phần mở rộng
import { removeFromCart, updateQuantity } from "../../../src/redux/slides/cartSlide";

console.log('TamNhu:', CartPage); // Debug import

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
    useSelector: jest.fn(),
}));

// Mock useSelector
const mockUseSelector = jest.fn();
jest.mock("react-redux", () => ({
    ...jest.requireActual("react-redux"),
    useDispatch: () => mockDispatch,
    useSelector: (selector) => mockUseSelector(selector),
}));

// Mock updateQuantity
jest.mock("../../../src/redux/slides/cartSlide", () => ({
    removeFromCart: jest.requireActual("../../../src/redux/slides/cartSlide").removeFromCart,
    updateQuantity: jest.fn(({ id, quantity }) => ({
        type: 'cart/updateQuantity',
        payload: { id, quantity },
    })),
}));
const mockUpdateQuantity = require("../../../src/redux/slides/cartSlide").updateQuantity;

// Mock alert
const mockAlert = jest.fn();
global.alert = mockAlert;

// Mock QuantityBtn
jest.mock("../../../src/components/QuantityBtn/QuantityBtn", () => ({
    __esModule: true,
    default: ({ initialQuantity, productId, maxQuantity }) => {
        const dispatch = mockDispatch;
        const increase = () => {
            if (initialQuantity < maxQuantity) {
                dispatch(mockUpdateQuantity({ id: productId, quantity: initialQuantity + 1 }));
            } else {
                mockAlert("Bạn đã đạt đến số lượng tồn kho tối đa.");
            }
        };
        const decrease = () => {
            if (initialQuantity > 1) {
                dispatch(mockUpdateQuantity({ id: productId, quantity: initialQuantity - 1 }));
            }
        };
        return (
            <div>
                <button data-testid={`decrease-btn-${productId}`} onClick={decrease}>
                    -
                </button>
                <span data-testid={`quantity-${productId}`}>{initialQuantity}</span>
                <button data-testid={`increase-btn-${productId}`} onClick={increase}>
                    +
                </button>
            </div>
        );
    },
}));

// Mock DeleteBtn
jest.mock("../../../src/components/DeleteBtn/DeleteBtn", () => ({
    __esModule: true,
    default: ({ onClick }) => (
        <button data-testid="delete-btn" onClick={onClick}>
            Delete
        </button>
    ),
}));

// Mock CheckboxComponent
jest.mock("../../../src/components/CheckboxComponent/CheckboxComponent", () => ({
    __esModule: true,
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
    __esModule: true,
    default: () => <button data-testid="back-icon">Back</button>,
}));

// Mock ButtonComponent
jest.mock("../../../src/components/ButtonComponent/ButtonComponent", () => ({
    __esModule: true,
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
    __esModule: true,
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
        mockUpdateQuantity.mockClear();
        mockAlert.mockClear();
        mockUseSelector.mockReset();
        mockUseSelector.mockImplementation((selector) =>
            selector({ cart: { products: mockProducts } })
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test("C_UIF-1: Overall layout displays correctly with products", () => {
        render(
            <Provider store={store}>
                <BrowserRouter>
                    <CartPage />
                </BrowserRouter>
            </Provider>
        );

        expect(screen.getByText("CART")).toBeInTheDocument();
        expect(screen.getByText("Information")).toBeInTheDocument();
        expect(screen.getByText("Price")).toBeInTheDocument();
        expect(screen.getByText("Quantity")).toBeInTheDocument();
        expect(screen.getByText("Cost")).toBeInTheDocument();
        expect(screen.getByText("Product A")).toBeInTheDocument();
        expect(screen.getByText("M")).toBeInTheDocument();
        expect(screen.getByText("100,000 VND")).toBeInTheDocument();
        expect(screen.getByText("200,000 VND")).toBeInTheDocument();
        expect(screen.getByText("Order Total:")).toBeInTheDocument();
        expect(screen.getByText("250,000 VND")).toBeInTheDocument();
        expect(screen.getByText(/Buy more/i)).toBeInTheDocument(); // Sửa: Dùng getByText thay vì getByTestId
        expect(screen.getByTestId("button-pay")).toBeDisabled();
        expect(screen.getByTestId("back-icon")).toBeInTheDocument();
    });

    test("C_UIF-2: Product table displays correct product information", () => {
        render(
            <Provider store={store}>
                <BrowserRouter>
                    <CartPage />
                </BrowserRouter>
            </Provider>
        );

        expect(screen.getByText("Product A")).toBeInTheDocument();
        expect(screen.getByText("M")).toBeInTheDocument();
        expect(screen.getByText("100,000 VND")).toBeInTheDocument();
        expect(screen.getByText("200,000 VND")).toBeInTheDocument();
        expect(screen.getAllByTestId("checkbox")[1]).not.toBeChecked();
        expect(screen.getAllByTestId("delete-btn")[0]).toBeInTheDocument();
        expect(screen.getByText("Product B")).toBeInTheDocument();
        expect(screen.getByText("L")).toBeInTheDocument();
        // Sửa: Dùng getAllByText và kiểm tra phần tử đầu tiên (giá đơn vị)
        expect(screen.getAllByText("50,000 VND")[0]).toBeInTheDocument();
        expect(screen.getAllByText("50,000 VND")[1]).toBeInTheDocument(); // Tổng giá
        expect(screen.getAllByTestId("checkbox")[2]).not.toBeChecked();
        expect(screen.getAllByTestId("delete-btn")[1]).toBeInTheDocument();
    });

    test("C_UIF-3: Cart displays empty state correctly", () => {
        store = mockStore({ cart: { products: [] } });
        mockUseSelector.mockImplementation((selector) =>
            selector({ cart: { products: [] } })
        );
        render(
            <Provider store={store}>
                <BrowserRouter>
                    <CartPage />
                </BrowserRouter>
            </Provider>
        );

        expect(screen.queryByTestId("product-infor")).not.toBeInTheDocument();
        expect(screen.getByText("Order Total:")).toBeInTheDocument();
        expect(screen.getByText("0 VND")).toBeInTheDocument();
        expect(screen.getByTestId("button-pay")).toBeDisabled();
    });

    test("C_UIF-4: Total amount calculates correctly", () => {
        render(
            <Provider store={store}>
                <BrowserRouter>
                    <CartPage />
                </BrowserRouter>
            </Provider>
        );

        expect(screen.getByText("250,000 VND")).toBeInTheDocument();
    });

    test("C_UIF-5: Checkboxes are unchecked by default", () => {
        render(
            <Provider store={store}>
                <BrowserRouter>
                    <CartPage />
                </BrowserRouter>
            </Provider>
        );

        expect(screen.getAllByTestId("checkbox")[0]).not.toBeChecked();
        expect(screen.getAllByTestId("checkbox")[1]).not.toBeChecked();
        expect(screen.getAllByTestId("checkbox")[2]).not.toBeChecked();
    });

    test("C_UIF-6: Selecting individual product checkbox", () => {
        render(
            <Provider store={store}>
                <BrowserRouter>
                    <CartPage />
                </BrowserRouter>
            </Provider>
        );

        fireEvent.click(screen.getAllByTestId("checkbox")[1]);
        expect(screen.getAllByTestId("checkbox")[1]).toBeChecked();
        expect(screen.getAllByTestId("checkbox")[2]).not.toBeChecked();
        expect(screen.getByTestId("button-pay")).not.toBeDisabled();
    });

    test("C_UIF-7: Deselecting a product checkbox", () => {
        render(
            <Provider store={store}>
                <BrowserRouter>
                    <CartPage />
                </BrowserRouter>
            </Provider>
        );

        fireEvent.click(screen.getAllByTestId("checkbox")[1]);
        fireEvent.click(screen.getAllByTestId("checkbox")[1]);
        expect(screen.getAllByTestId("checkbox")[1]).not.toBeChecked();
        expect(screen.getByTestId("button-pay")).toBeDisabled();
    });

    test("C_UIF-8: Select All checkbox selects all products", () => {
        render(
            <Provider store={store}>
                <BrowserRouter>
                    <CartPage />
                </BrowserRouter>
            </Provider>
        );

        fireEvent.click(screen.getAllByTestId("checkbox")[0]);
        expect(screen.getAllByTestId("checkbox")[0]).toBeChecked();
        expect(screen.getAllByTestId("checkbox")[1]).toBeChecked();
        expect(screen.getAllByTestId("checkbox")[2]).toBeChecked();
        expect(screen.getByTestId("button-pay")).not.toBeDisabled();
    });

    test("C_UIF-9: Deselect All checkbox clears all selections", () => {
        render(
            <Provider store={store}>
                <BrowserRouter>
                    <CartPage />
                </BrowserRouter>
            </Provider>
        );

        fireEvent.click(screen.getAllByTestId("checkbox")[0]);
        fireEvent.click(screen.getAllByTestId("checkbox")[0]);
        expect(screen.getAllByTestId("checkbox")[0]).not.toBeChecked();
        expect(screen.getAllByTestId("checkbox")[1]).not.toBeChecked();
        expect(screen.getAllByTestId("checkbox")[2]).not.toBeChecked();
        expect(screen.getByTestId("button-pay")).toBeDisabled();
    });

    test("C_UIF-10: Increase product quantity within stock limit", () => {
        render(
            <Provider store={store}>
                <BrowserRouter>
                    <CartPage />
                </BrowserRouter>
            </Provider>
        );

        fireEvent.click(screen.getByTestId("increase-btn-1"));
        expect(mockDispatch).toHaveBeenCalledWith(
            expect.objectContaining({
                type: 'cart/updateQuantity',
                payload: { id: 1, quantity: 3 },
            })
        );
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
        mockUseSelector.mockImplementation((selector) =>
            selector({ cart: { products: store.getState().cart.products } })
        );
        render(
            <Provider store={store}>
                <BrowserRouter>
                    <CartPage />
                </BrowserRouter>
            </Provider>
        );

        fireEvent.click(screen.getByTestId("increase-btn-1"));
        expect(mockAlert).toHaveBeenCalledWith("Bạn đã đạt đến số lượng tồn kho tối đa.");
        expect(mockDispatch).not.toHaveBeenCalled();
    });

    test("C_UIF-12: Decrease product quantity to minimum", () => {
        render(
            <Provider store={store}>
                <BrowserRouter>
                    <CartPage />
                </BrowserRouter>
            </Provider>
        );

        fireEvent.click(screen.getByTestId("decrease-btn-1"));
        expect(mockDispatch).toHaveBeenCalledWith(
            expect.objectContaining({
                type: 'cart/updateQuantity',
                payload: { id: 1, quantity: 1 },
            })
        );
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
        mockUseSelector.mockImplementation((selector) =>
            selector({ cart: { products: store.getState().cart.products } })
        );
        render(
            <Provider store={store}>
                <BrowserRouter>
                    <CartPage />
                </BrowserRouter>
            </Provider>
        );

        fireEvent.click(screen.getByTestId("decrease-btn-1"));
        expect(mockDispatch).not.toHaveBeenCalled();
    });

    test("C_UIF-14: Delete a product from cart", () => {
        render(
            <Provider store={store}>
                <BrowserRouter>
                    <CartPage />
                </BrowserRouter>
            </Provider>
        );

        fireEvent.click(screen.getAllByTestId("delete-btn")[0]);
        expect(mockDispatch).toHaveBeenCalledWith(removeFromCart({ id: 1 }));
    });

    test("C_UIF-15: Back button navigates to products page", () => {
        render(
            <Provider store={store}>
                <BrowserRouter>
                    <CartPage />
                </BrowserRouter>
            </Provider>
        );

        fireEvent.click(screen.getByTestId("back-icon"));
        expect(mockNavigate).toHaveBeenCalledWith("/products");
    });

    test("C_UIF-16: Buy more button navigates to products page", () => {
        render(
            <Provider store={store}>
                <BrowserRouter>
                    <CartPage />
                </BrowserRouter>
            </Provider>
        );

        fireEvent.click(screen.getByText(/Buy more/i)); // Sửa: Dùng getByText thay vì getByTestId
        expect(mockNavigate).toHaveBeenCalledWith("/products");
    });

    test("C_UIF-17: Pay button navigates to order-information with selected products", () => {
        render(
            <Provider store={store}>
                <BrowserRouter>
                    <CartPage />
                </BrowserRouter>
            </Provider>
        );

        fireEvent.click(screen.getAllByTestId("checkbox")[1]);
        fireEvent.click(screen.getByTestId("button-pay"));
        expect(mockNavigate).toHaveBeenCalledWith("/order-information", {
            state: {
                selectedProductDetails: [mockProducts[0]],
            },
        });
    });

    test("C_UIF-18: Pay button disabled when no products selected", () => {
        render(
            <Provider store={store}>
                <BrowserRouter>
                    <CartPage />
                </BrowserRouter>
            </Provider>
        );

        expect(screen.getByTestId("button-pay")).toBeDisabled();
        fireEvent.click(screen.getByTestId("button-pay"));
        expect(mockNavigate).not.toHaveBeenCalled();
    });

    test("C_UIF-19: Redux state updates when deleting a product", () => {
        render(
            <Provider store={store}>
                <BrowserRouter>
                    <CartPage />
                </BrowserRouter>
            </Provider>
        );

        fireEvent.click(screen.getAllByTestId("delete-btn")[0]);
        expect(mockDispatch).toHaveBeenCalledWith(removeFromCart({ id: 1 }));
    });

    test("C_UIF-20: Redux state updates when changing quantity", () => {
        render(
            <Provider store={store}>
                <BrowserRouter>
                    <CartPage />
                </BrowserRouter>
            </Provider>
        );

        fireEvent.click(screen.getByTestId("increase-btn-1"));
        expect(mockDispatch).toHaveBeenCalledWith(
            expect.objectContaining({
                type: 'cart/updateQuantity',
                payload: { id: 1, quantity: 3 },
            })
        );
    });
});