import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import OrderInformationPage from "../../../src/pages/User/OrderInformationPage/OrderInformationPage";
import * as OrderService from "../../../src/services/OrderService";

jest.mock("../../../src/services/OrderService", () => ({
    createOrder: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockNavigate,
    useLocation: () => ({
        state: {
            selectedProductDetails: [
                {
                    id: "1",
                    title: "Product 1",
                    price: 100000,
                    quantity: 2,
                    img: "img1.jpg",
                    size: "M",
                },
            ],
        },
    }),
}));

const mockStore = configureStore([]);
const initialState = {
    user: {
        userEmail: "user@domain.com",
        familyName: "Nguyen",
        userName: "Van",
        userPhone: "0901234567",
        email: "user@domain.com",
        userAddress: "",
        userWard: "",
        userDistrict: "",
        userCity: "",
    },
};

const emptyCartState = {
    ...initialState,
    state: { selectedProductDetails: [] },
};

const renderComponent = (storeState = initialState, locationState = { selectedProductDetails: initialState.state?.selectedProductDetails || [{ id: "1", title: "Product 1", price: 100000, quantity: 2, img: "img1.jpg", size: "M" }] }) => {
    const store = mockStore(storeState);
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
            mutations: { retry: false },
        },
    });

    jest.spyOn(require("react-router-dom"), "useLocation").mockReturnValue({
        state: locationState,
    });

    return render(
        <QueryClientProvider client={queryClient}>
            <Provider store={store}>
                <BrowserRouter>
                    <OrderInformationPage />
                </BrowserRouter>
            </Provider>
        </QueryClientProvider>
    );
};

describe("OrderInformationPage", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockNavigate.mockClear();
    });

    // OI_UIF-1: Overall UI should display correctly
    test("OI_UIF-1: Overall UI should display correctly", () => {
        renderComponent();
        expect(screen.getByText(/Order Information/i)).toBeInTheDocument();
        expect(screen.getByRole("columnheader", { name: /Product/i })).toBeInTheDocument();
        expect(screen.getByRole("columnheader", { name: /Price/i })).toBeInTheDocument();
        expect(screen.getByRole("columnheader", { name: /Quantity/i })).toBeInTheDocument();
        expect(screen.getByRole("columnheader", { name: /Subtotal/i })).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Enter Last Name/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Enter First Name/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Enter Phone Number/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Enter Email/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Street, House Number/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Ward/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/District/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/City\/Province/i)).toBeInTheDocument();
        expect(screen.getByText(/Expected Delivery Time/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Enter order note/i)).toBeInTheDocument();
        expect(screen.getByText(/Back to Cart/i)).toBeInTheDocument();
        expect(screen.getByText(/Checkout/i)).toBeInTheDocument();
    });

    // OI_UIF-2: Last Name default state
    test("OI_UIF-2: Last Name default state", () => {
        renderComponent();
        const lastNameInput = screen.getByPlaceholderText(/Enter Last Name/i);
        expect(lastNameInput).toHaveValue("Nguyen");
    });

    // OI_UIF-3: Last Name empty
    test("OI_UIF-3: Last Name empty", async () => {
        renderComponent({ user: {} });
        fireEvent.change(screen.getByPlaceholderText(/Enter Last Name/i), { target: { value: "" } });
        fireEvent.change(screen.getByPlaceholderText(/Enter First Name/i), { target: { value: "Van" } });
        fireEvent.change(screen.getByPlaceholderText(/Enter Phone Number/i), { target: { value: "0901234567" } });
        fireEvent.change(screen.getByPlaceholderText(/Enter Email/i), { target: { value: "user@domain.com" } });
        fireEvent.click(screen.getByText(/Checkout/i));
        await waitFor(() => {
            expect(screen.getByText(/Last Name is required/i)).toBeInTheDocument();
        });
    });

    // OI_UIF-4: Last Name trim space
    test("OI_UIF-4: Last Name trim space", async () => {
        OrderService.createOrder.mockResolvedValueOnce({ data: { _id: "123" } });
        renderComponent();
        fireEvent.change(screen.getByPlaceholderText(/Enter Last Name/i), { target: { value: "  Nguyen  " } });
        fireEvent.change(screen.getByPlaceholderText(/Enter First Name/i), { target: { value: "Van" } });
        fireEvent.change(screen.getByPlaceholderText(/Enter Phone Number/i), { target: { value: "0901234567" } });
        fireEvent.change(screen.getByPlaceholderText(/Enter Email/i), { target: { value: "user@domain.com" } });
        fireEvent.click(screen.getByText(/Checkout/i));
        await waitFor(() => {
            expect(OrderService.createOrder).toHaveBeenCalledWith(
                expect.objectContaining({
                    shippingAddress: expect.objectContaining({
                        familyName: "Nguyen",
                    }),
                })
            );
            expect(mockNavigate).toHaveBeenCalledWith("/payment", expect.anything());
        });
    });

    // OI_UIF-5: First Name default state
    test("OI_UIF-5: First Name default state", () => {
        renderComponent();
        const firstNameInput = screen.getByPlaceholderText(/Enter First Name/i);
        expect(firstNameInput).toHaveValue("Van");
    });

    // OI_UIF-6: First Name empty
    test("OI_UIF-6: First Name empty", async () => {
        renderComponent({ user: {} });
        fireEvent.change(screen.getByPlaceholderText(/Enter Last Name/i), { target: { value: "Nguyen" } });
        fireEvent.change(screen.getByPlaceholderText(/Enter First Name/i), { target: { value: "" } });
        fireEvent.change(screen.getByPlaceholderText(/Enter Phone Number/i), { target: { value: "0901234567" } });
        fireEvent.change(screen.getByPlaceholderText(/Enter Email/i), { target: { value: "user@domain.com" } });
        fireEvent.click(screen.getByText(/Checkout/i));
        await waitFor(() => {
            expect(screen.getByText(/First Name is required/i)).toBeInTheDocument();
        });
    });

    // OI_UIF-7: First Name trim space
    test("OI_UIF-7: First Name trim space", async () => {
        OrderService.createOrder.mockResolvedValueOnce({ data: { _id: "123" } });
        renderComponent();
        fireEvent.change(screen.getByPlaceholderText(/Enter Last Name/i), { target: { value: "Nguyen" } });
        fireEvent.change(screen.getByPlaceholderText(/Enter First Name/i), { target: { value: "  Van  " } });
        fireEvent.change(screen.getByPlaceholderText(/Enter Phone Number/i), { target: { value: "0901234567" } });
        fireEvent.change(screen.getByPlaceholderText(/Enter Email/i), { target: { value: "user@domain.com" } });
        fireEvent.click(screen.getByText(/Checkout/i));
        await waitFor(() => {
            expect(OrderService.createOrder).toHaveBeenCalledWith(
                expect.objectContaining({
                    shippingAddress: expect.objectContaining({
                        userName: "Van",
                    }),
                })
            );
            expect(mockNavigate).toHaveBeenCalledWith("/payment", expect.anything());
        });
    });

    // OI_UIF-8: Phone Number default state
    test("OI_UIF-8: Phone Number default state", () => {
        renderComponent();
        const phoneInput = screen.getByPlaceholderText(/Enter Phone Number/i);
        expect(phoneInput).toHaveValue("0901234567");
    });

    // OI_UIF-9: Phone Number empty
    test("OI_UIF-9: Phone Number empty", async () => {
        renderComponent({ user: {} });
        fireEvent.change(screen.getByPlaceholderText(/Enter Last Name/i), { target: { value: "Nguyen" } });
        fireEvent.change(screen.getByPlaceholderText(/Enter First Name/i), { target: { value: "Van" } });
        fireEvent.change(screen.getByPlaceholderText(/Enter Phone Number/i), { target: { value: "" } });
        fireEvent.change(screen.getByPlaceholderText(/Enter Email/i), { target: { value: "user@domain.com" } });
        fireEvent.click(screen.getByText(/Checkout/i));
        await waitFor(() => {
            expect(screen.getByText(/Phone Number is required/i)).toBeInTheDocument();
        });
    });

    // OI_UIF-10: Phone Number valid
    test("OI_UIF-10: Phone Number valid", async () => {
        OrderService.createOrder.mockResolvedValueOnce({ data: { _id: "123" } });
        renderComponent();
        fireEvent.change(screen.getByPlaceholderText(/Enter Last Name/i), { target: { value: "Nguyen" } });
        fireEvent.change(screen.getByPlaceholderText(/Enter First Name/i), { target: { value: "Van" } });
        fireEvent.change(screen.getByPlaceholderText(/Enter Phone Number/i), { target: { value: "0901234567" } });
        fireEvent.change(screen.getByPlaceholderText(/Enter Email/i), { target: { value: "user@domain.com" } });
        fireEvent.click(screen.getByText(/Checkout/i));
        await waitFor(() => {
            expect(OrderService.createOrder).toHaveBeenCalled();
            expect(mockNavigate).toHaveBeenCalledWith("/payment", expect.anything());
        });
    });

    // OI_UIF-11: Phone Number only accepts numbers
    test("OI_UIF-11: Phone Number only accepts numbers", () => {
        renderComponent();
        const phoneInput = screen.getByPlaceholderText(/Enter Phone Number/i);
        // Explicitly clear input first
        fireEvent.change(phoneInput, { target: { value: "" } });
        expect(phoneInput).toHaveValue("");
        // Try non-numeric input
        fireEvent.change(phoneInput, { target: { value: "abc" } });
        expect(phoneInput).toHaveValue(""); // Non-numeric input ignored
        // Try numeric input
        fireEvent.change(phoneInput, { target: { value: "0901234567" } });
        expect(phoneInput).toHaveValue("0901234567"); // Numeric input accepted
    });

    // OI_UIF-12: Phone Number trim space
    test("OI_UIF-12: Phone Number trim space", async () => {
        OrderService.createOrder.mockResolvedValueOnce({ data: { _id: "123" } });
        renderComponent();
        fireEvent.change(screen.getByPlaceholderText(/Enter Last Name/i), { target: { value: "Nguyen" } });
        fireEvent.change(screen.getByPlaceholderText(/Enter First Name/i), { target: { value: "Van" } });
        fireEvent.change(screen.getByPlaceholderText(/Enter Phone Number/i), { target: { value: "  0901234567  " } });
        fireEvent.change(screen.getByPlaceholderText(/Enter Email/i), { target: { value: "user@domain.com" } });
        fireEvent.click(screen.getByText(/Checkout/i));
        await waitFor(() => {
            expect(OrderService.createOrder).toHaveBeenCalledWith(
                expect.objectContaining({
                    shippingAddress: expect.objectContaining({
                        userPhone: "0901234567",
                    }),
                })
            );
            expect(mockNavigate).toHaveBeenCalledWith("/payment", expect.anything());
        });
    });

    // OI_UIF-13: Email default state
    test("OI_UIF-13: Email default state", () => {
        renderComponent();
        const emailInput = screen.getByPlaceholderText(/Enter Email/i);
        expect(emailInput).toHaveValue("user@domain.com");
    });

    // OI_UIF-14: Email empty
    test("OI_UIF-14: Email empty", async () => {
        renderComponent({ user: {} });
        fireEvent.change(screen.getByPlaceholderText(/Enter Last Name/i), { target: { value: "Nguyen" } });
        fireEvent.change(screen.getByPlaceholderText(/Enter First Name/i), { target: { value: "Van" } });
        fireEvent.change(screen.getByPlaceholderText(/Enter Phone Number/i), { target: { value: "0901234567" } });
        fireEvent.change(screen.getByPlaceholderText(/Enter Email/i), { target: { value: "" } });
        fireEvent.click(screen.getByText(/Checkout/i));
        await waitFor(() => {
            expect(screen.getByText(/Email cannot be empty/i)).toBeInTheDocument();
        });
    });

    // OI_UIF-15: Email valid special characters
    test("OI_UIF-15: Email valid special characters", async () => {
        OrderService.createOrder.mockResolvedValueOnce({ data: { _id: "123" } });
        renderComponent();
        fireEvent.change(screen.getByPlaceholderText(/Enter Last Name/i), { target: { value: "Nguyen" } });
        fireEvent.change(screen.getByPlaceholderText(/Enter First Name/i), { target: { value: "Van" } });
        fireEvent.change(screen.getByPlaceholderText(/Enter Phone Number/i), { target: { value: "0901234567" } });
        fireEvent.change(screen.getByPlaceholderText(/Enter Email/i), { target: { value: "user.name+test@domain.com" } });
        fireEvent.click(screen.getByText(/Checkout/i));
        await waitFor(() => {
            expect(OrderService.createOrder).toHaveBeenCalled();
            expect(mockNavigate).toHaveBeenCalledWith("/payment", expect.anything());
        });
    });

    // OI_UIF-16: Email invalid special characters
    test("OI_UIF-16: Email invalid special characters", async () => {
        renderComponent();
        const emailInput = screen.getByPlaceholderText(/Enter Email/i);
        fireEvent.change(screen.getByPlaceholderText(/Enter Last Name/i), { target: { value: "Nguyen" } });
        fireEvent.change(screen.getByPlaceholderText(/Enter First Name/i), { target: { value: "Van" } });
        fireEvent.change(screen.getByPlaceholderText(/Enter Phone Number/i), { target: { value: "0901234567" } });
        fireEvent.change(emailInput, { target: { value: "user#name@domain.com" } });
        fireEvent.click(screen.getByText(/Checkout/i));
        await waitFor(() => {
            expect(screen.getByText(/Invalid email format/i)).toBeInTheDocument();
            expect(emailInput).toHaveValue("user#name@domain.com");
        });
    });

    // OI_UIF-17: Email contains numbers
    test("OI_UIF-17: Email contains numbers", async () => {
        OrderService.createOrder.mockResolvedValueOnce({ data: { _id: "123" } });
        renderComponent();
        fireEvent.change(screen.getByPlaceholderText(/Enter Last Name/i), { target: { value: "Nguyen" } });
        fireEvent.change(screen.getByPlaceholderText(/Enter First Name/i), { target: { value: "Van" } });
        fireEvent.change(screen.getByPlaceholderText(/Enter Phone Number/i), { target: { value: "0901234567" } });
        fireEvent.change(screen.getByPlaceholderText(/Enter Email/i), { target: { value: "user123@domain.com" } });
        fireEvent.click(screen.getByText(/Checkout/i));
        await waitFor(() => {
            expect(OrderService.createOrder).toHaveBeenCalled();
            expect(mockNavigate).toHaveBeenCalledWith("/payment", expect.anything());
        });
    });

    // OI_UIF-18: Email trim space
    test("OI_UIF-18: Email trim space", async () => {
        OrderService.createOrder.mockResolvedValueOnce({ data: { _id: "123" } });
        renderComponent();
        fireEvent.change(screen.getByPlaceholderText(/Enter Last Name/i), { target: { value: "Nguyen" } });
        fireEvent.change(screen.getByPlaceholderText(/Enter First Name/i), { target: { value: "Van" } });
        fireEvent.change(screen.getByPlaceholderText(/Enter Phone Number/i), { target: { value: "0901234567" } });
        fireEvent.change(screen.getByPlaceholderText(/Enter Email/i), { target: { value: "  user@domain.com  " } });
        fireEvent.click(screen.getByText(/Checkout/i));
        await waitFor(() => {
            expect(OrderService.createOrder).toHaveBeenCalledWith(
                expect.objectContaining({
                    shippingAddress: expect.objectContaining({
                        userEmail: "user@domain.com",
                    }),
                })
            );
            expect(mockNavigate).toHaveBeenCalledWith("/payment", expect.anything());
        });
    });

    // OI_UIF-19: Street, House Number default state
    test("OI_UIF-19: Street, House Number default state", () => {
        renderComponent();
        const addressInput = screen.getByPlaceholderText(/Street, House Number/i);
        expect(addressInput).toHaveValue("");
    });

    // OI_UIF-20: Street, House Number empty
    test("OI_UIF-20: Street, House Number empty", async () => {
        OrderService.createOrder.mockResolvedValueOnce({ data: { _id: "123" } });
        renderComponent();
        fireEvent.change(screen.getByPlaceholderText(/Enter Last Name/i), { target: { value: "Nguyen" } });
        fireEvent.change(screen.getByPlaceholderText(/Enter First Name/i), { target: { value: "Van" } });
        fireEvent.change(screen.getByPlaceholderText(/Enter Phone Number/i), { target: { value: "0901234567" } });
        fireEvent.change(screen.getByPlaceholderText(/Enter Email/i), { target: { value: "user@domain.com" } });
        fireEvent.change(screen.getByPlaceholderText(/Street, House Number/i), { target: { value: "" } });
        fireEvent.click(screen.getByText(/Checkout/i));
        await waitFor(() => {
            expect(OrderService.createOrder).toHaveBeenCalled();
            expect(mockNavigate).toHaveBeenCalledWith("/payment", expect.anything());
        });
    });

    // OI_UIF-21: Street, House Number trim space
    test("OI_UIF-21: Street, House Number trim space", async () => {
        OrderService.createOrder.mockResolvedValueOnce({ data: { _id: "123" } });
        renderComponent();
        fireEvent.change(screen.getByPlaceholderText(/Enter Last Name/i), { target: { value: "Nguyen" } });
        fireEvent.change(screen.getByPlaceholderText(/Enter First Name/i), { target: { value: "Van" } });
        fireEvent.change(screen.getByPlaceholderText(/Enter Phone Number/i), { target: { value: "0901234567" } });
        fireEvent.change(screen.getByPlaceholderText(/Enter Email/i), { target: { value: "user@domain.com" } });
        fireEvent.change(screen.getByPlaceholderText(/Street, House Number/i), { target: { value: "  123 Main St  " } });
        fireEvent.click(screen.getByText(/Checkout/i));
        await waitFor(() => {
            expect(OrderService.createOrder).toHaveBeenCalledWith(
                expect.objectContaining({
                    shippingAddress: expect.objectContaining({
                        userAddress: "123 Main St",
                    }),
                })
            );
            expect(mockNavigate).toHaveBeenCalledWith("/payment", expect.anything());
        });
    });

    // OI_UIF-22: Ward default state
    test("OI_UIF-22: Ward default state", () => {
        renderComponent();
        const wardInput = screen.getByPlaceholderText(/Ward/i);
        expect(wardInput).toHaveValue("");
    });

    // OI_UIF-23: Ward empty
    test("OI_UIF-23: Ward empty", async () => {
        OrderService.createOrder.mockResolvedValueOnce({ data: { _id: "123" } });
        renderComponent();
        fireEvent.change(screen.getByPlaceholderText(/Enter Last Name/i), { target: { value: "Nguyen" } });
        fireEvent.change(screen.getByPlaceholderText(/Enter First Name/i), { target: { value: "Van" } });
        fireEvent.change(screen.getByPlaceholderText(/Enter Phone Number/i), { target: { value: "0901234567" } });
        fireEvent.change(screen.getByPlaceholderText(/Enter Email/i), { target: { value: "user@domain.com" } });
        fireEvent.change(screen.getByPlaceholderText(/Ward/i), { target: { value: "" } });
        fireEvent.click(screen.getByText(/Checkout/i));
        await waitFor(() => {
            expect(OrderService.createOrder).toHaveBeenCalled();
            expect(mockNavigate).toHaveBeenCalledWith("/payment", expect.anything());
        });
    });

    // OI_UIF-24: Ward trim space
    test("OI_UIF-24: Ward trim space", async () => {
        OrderService.createOrder.mockResolvedValueOnce({ data: { _id: "123" } });
        renderComponent();
        fireEvent.change(screen.getByPlaceholderText(/Enter Last Name/i), { target: { value: "Nguyen" } });
        fireEvent.change(screen.getByPlaceholderText(/Enter First Name/i), { target: { value: "Van" } });
        fireEvent.change(screen.getByPlaceholderText(/Enter Phone Number/i), { target: { value: "0901234567" } });
        fireEvent.change(screen.getByPlaceholderText(/Enter Email/i), { target: { value: "user@domain.com" } });
        fireEvent.change(screen.getByPlaceholderText(/Ward/i), { target: { value: "  Ward 1  " } });
        fireEvent.click(screen.getByText(/Checkout/i));
        await waitFor(() => {
            expect(OrderService.createOrder).toHaveBeenCalledWith(
                expect.objectContaining({
                    shippingAddress: expect.objectContaining({
                        userWard: "Ward 1",
                    }),
                })
            );
            expect(mockNavigate).toHaveBeenCalledWith("/payment", expect.anything());
        });
    });

    // OI_UIF-25: District default state
    test("OI_UIF-25: District default state", () => {
        renderComponent();
        const districtInput = screen.getByPlaceholderText(/District/i);
        expect(districtInput).toHaveValue("");
    });

    // OI_UIF-26: District empty
    test("OI_UIF-26: District empty", async () => {
        OrderService.createOrder.mockResolvedValueOnce({ data: { _id: "123" } });
        renderComponent();
        fireEvent.change(screen.getByPlaceholderText(/Enter Last Name/i), { target: { value: "Nguyen" } });
        fireEvent.change(screen.getByPlaceholderText(/Enter First Name/i), { target: { value: "Van" } });
        fireEvent.change(screen.getByPlaceholderText(/Enter Phone Number/i), { target: { value: "0901234567" } });
        fireEvent.change(screen.getByPlaceholderText(/Enter Email/i), { target: { value: "user@domain.com" } });
        fireEvent.change(screen.getByPlaceholderText(/District/i), { target: { value: "" } });
        fireEvent.click(screen.getByText(/Checkout/i));
        await waitFor(() => {
            expect(OrderService.createOrder).toHaveBeenCalled();
            expect(mockNavigate).toHaveBeenCalledWith("/payment", expect.anything());
        });
    });

    // OI_UIF-27: District trim space
    test("OI_UIF-27: District trim space", async () => {
        OrderService.createOrder.mockResolvedValueOnce({ data: { _id: "123" } });
        renderComponent();
        fireEvent.change(screen.getByPlaceholderText(/Enter Last Name/i), { target: { value: "Nguyen" } });
        fireEvent.change(screen.getByPlaceholderText(/Enter First Name/i), { target: { value: "Van" } });
        fireEvent.change(screen.getByPlaceholderText(/Enter Phone Number/i), { target: { value: "0901234567" } });
        fireEvent.change(screen.getByPlaceholderText(/Enter Email/i), { target: { value: "user@domain.com" } });
        fireEvent.change(screen.getByPlaceholderText(/District/i), { target: { value: "  District 1  " } });
        fireEvent.click(screen.getByText(/Checkout/i));
        await waitFor(() => {
            expect(OrderService.createOrder).toHaveBeenCalledWith(
                expect.objectContaining({
                    shippingAddress: expect.objectContaining({
                        userDistrict: "District 1",
                    }),
                })
            );
            expect(mockNavigate).toHaveBeenCalledWith("/payment", expect.anything());
        });
    });

    // OI_UIF-28: City/Province default state
    test("OI_UIF-28: City/Province default state", () => {
        renderComponent();
        const cityInput = screen.getByPlaceholderText(/City\/Province/i);
        expect(cityInput).toHaveValue("");
    });

    // OI_UIF-29: City/Province empty
    test("OI_UIF-29: City/Province empty", async () => {
        OrderService.createOrder.mockResolvedValueOnce({ data: { _id: "123" } });
        renderComponent();
        fireEvent.change(screen.getByPlaceholderText(/Enter Last Name/i), { target: { value: "Nguyen" } });
        fireEvent.change(screen.getByPlaceholderText(/Enter First Name/i), { target: { value: "Van" } });
        fireEvent.change(screen.getByPlaceholderText(/Enter Phone Number/i), { target: { value: "0901234567" } });
        fireEvent.change(screen.getByPlaceholderText(/Enter Email/i), { target: { value: "user@domain.com" } });
        fireEvent.change(screen.getByPlaceholderText(/City\/Province/i), { target: { value: "" } });
        fireEvent.click(screen.getByText(/Checkout/i));
        await waitFor(() => {
            expect(OrderService.createOrder).toHaveBeenCalled();
            expect(mockNavigate).toHaveBeenCalledWith("/payment", expect.anything());
        });
    });

    // OI_UIF-30: City/Province trim space
    test("OI_UIF-30: City/Province trim space", async () => {
        OrderService.createOrder.mockResolvedValueOnce({ data: { _id: "123" } });
        renderComponent();
        fireEvent.change(screen.getByPlaceholderText(/Enter Last Name/i), { target: { value: "Nguyen" } });
        fireEvent.change(screen.getByPlaceholderText(/Enter First Name/i), { target: { value: "Van" } });
        fireEvent.change(screen.getByPlaceholderText(/Enter Phone Number/i), { target: { value: "0901234567" } });
        fireEvent.change(screen.getByPlaceholderText(/Enter Email/i), { target: { value: "user@domain.com" } });
        fireEvent.change(screen.getByPlaceholderText(/City\/Province/i), { target: { value: "  Hanoi  " } });
        fireEvent.click(screen.getByText(/Checkout/i));
        await waitFor(() => {
            expect(OrderService.createOrder).toHaveBeenCalledWith(
                expect.objectContaining({
                    shippingAddress: expect.objectContaining({
                        userCity: "Hanoi",
                    }),
                })
            );
            expect(mockNavigate).toHaveBeenCalledWith("/payment", expect.anything());
        });
    });

    // OI_UIF-31: Select Time default state
    test("OI_UIF-31: Select Time default state", () => {
        renderComponent();
        const timeInput = screen.getByTestId("time-input");
        expect(timeInput).toHaveValue("");
    });

    // OI_UIF-32: Select Time empty
    test("OI_UIF-32: Select Time empty", async () => {
        OrderService.createOrder.mockResolvedValueOnce({ data: { _id: "123" } });
        renderComponent();
        fireEvent.change(screen.getByPlaceholderText(/Enter Last Name/i), { target: { value: "Nguyen" } });
        fireEvent.change(screen.getByPlaceholderText(/Enter First Name/i), { target: { value: "Van" } });
        fireEvent.change(screen.getByPlaceholderText(/Enter Phone Number/i), { target: { value: "0901234567" } });
        fireEvent.change(screen.getByPlaceholderText(/Enter Email/i), { target: { value: "user@domain.com" } });
        const timeInput = screen.getByTestId("time-input");
        fireEvent.change(timeInput, { target: { value: "" } });
        fireEvent.click(screen.getByText(/Checkout/i));
        await waitFor(() => {
            expect(OrderService.createOrder).toHaveBeenCalled();
            expect(mockNavigate).toHaveBeenCalledWith("/payment", expect.anything());
        });
    });

    // OI_UIF-33: Select Date default state
    test("OI_UIF-33: Select Date default state", () => {
        renderComponent();
        const dateInput = screen.getByTestId("date-input");
        expect(dateInput).toHaveValue("");
    });

    // OI_UIF-34: Select Date empty
    test("OI_UIF-34: Select Date empty", async () => {
        OrderService.createOrder.mockResolvedValueOnce({ data: { _id: "123" } });
        renderComponent();
        fireEvent.change(screen.getByPlaceholderText(/Enter Last Name/i), { target: { value: "Nguyen" } });
        fireEvent.change(screen.getByPlaceholderText(/Enter First Name/i), { target: { value: "Van" } });
        fireEvent.change(screen.getByPlaceholderText(/Enter Phone Number/i), { target: { value: "0901234567" } });
        fireEvent.change(screen.getByPlaceholderText(/Enter Email/i), { target: { value: "user@domain.com" } });
        const dateInput = screen.getByTestId("date-input");
        fireEvent.change(dateInput, { target: { value: "" } });
        fireEvent.click(screen.getByText(/Checkout/i));
        await waitFor(() => {
            expect(OrderService.createOrder).toHaveBeenCalled();
            expect(mockNavigate).toHaveBeenCalledWith("/payment", expect.anything());
        });
    });

    // OI_UIF-35: Order Note default state
    test("OI_UIF-35: Order Note default state", () => {
        renderComponent();
        const noteInput = screen.getByPlaceholderText(/Enter order note/i);
        expect(noteInput).toHaveValue("");
    });

    // OI_UIF-36: Order Note empty
    test("OI_UIF-36: Order Note empty", async () => {
        OrderService.createOrder.mockResolvedValueOnce({ data: { _id: "123" } });
        renderComponent();
        fireEvent.change(screen.getByPlaceholderText(/Enter Last Name/i), { target: { value: "Nguyen" } });
        fireEvent.change(screen.getByPlaceholderText(/Enter First Name/i), { target: { value: "Van" } });
        fireEvent.change(screen.getByPlaceholderText(/Enter Phone Number/i), { target: { value: "0901234567" } });
        fireEvent.change(screen.getByPlaceholderText(/Enter Email/i), { target: { value: "user@domain.com" } });
        fireEvent.change(screen.getByPlaceholderText(/Enter order note/i), { target: { value: "" } });
        fireEvent.click(screen.getByText(/Checkout/i));
        await waitFor(() => {
            expect(OrderService.createOrder).toHaveBeenCalled();
            expect(mockNavigate).toHaveBeenCalledWith("/payment", expect.anything());
        });
    });

    // OI_UIF-37: Order Note trim space
    test("OI_UIF-37: Order Note trim space", async () => {
        OrderService.createOrder.mockResolvedValueOnce({ data: { _id: "123" } });
        renderComponent();
        fireEvent.change(screen.getByPlaceholderText(/Enter Last Name/i), { target: { value: "Nguyen" } });
        fireEvent.change(screen.getByPlaceholderText(/Enter First Name/i), { target: { value: "Van" } });
        fireEvent.change(screen.getByPlaceholderText(/Enter Phone Number/i), { target: { value: "0901234567" } });
        fireEvent.change(screen.getByPlaceholderText(/Enter Email/i), { target: { value: "user@domain.com" } });
        fireEvent.change(screen.getByPlaceholderText(/Enter order note/i), { target: { value: "  Note here  " } });
        fireEvent.click(screen.getByText(/Checkout/i));
        await waitFor(() => {
            expect(OrderService.createOrder).toHaveBeenCalledWith(
                expect.objectContaining({
                    orderNote: "Note here",
                })
            );
            expect(mockNavigate).toHaveBeenCalledWith("/payment", expect.anything());
        });
    });

    // OI_UIF-38: Product table display
    test("OI_UIF-38: Product table display", () => {
        renderComponent();
        expect(screen.getByText(/Product 1/i)).toBeInTheDocument();
        expect(screen.getByText(/100,000 VND/i)).toBeInTheDocument();
        expect(screen.getByText(/x 2/i)).toBeInTheDocument();
        expect(screen.getByText(/200,000 VND/i)).toBeInTheDocument();
    });

    // OI_UIF-39: No products in cart
    test("OI_UIF-39: No products in cart", () => {
        renderComponent(emptyCartState, { selectedProductDetails: [] });
        expect(screen.getByText(/No products in cart/i)).toBeInTheDocument();
    });

    // OI_UIF-40: Total price calculation
    test("OI_UIF-40: Total price calculation", () => {
        renderComponent();
        expect(screen.getByText(/230,000 VND/i)).toBeInTheDocument(); // 200,000 (items) + 30,000 (shipping)
    });

    // OI_UIF-41: Back to Cart button
    test("OI_UIF-41: Back to Cart button", () => {
        renderComponent();
        fireEvent.click(screen.getByText(/Back to Cart/i));
        expect(mockNavigate).toHaveBeenCalledWith("/cart");
    });

    // OI_UIF-42: Checkout with valid data
    test("OI_UIF-42: Checkout with valid data", async () => {
        OrderService.createOrder.mockResolvedValueOnce({ data: { _id: "123" } });
        renderComponent();
        fireEvent.change(screen.getByPlaceholderText(/Enter Last Name/i), { target: { value: "Nguyen" } });
        fireEvent.change(screen.getByPlaceholderText(/Enter First Name/i), { target: { value: "Van" } });
        fireEvent.change(screen.getByPlaceholderText(/Enter Phone Number/i), { target: { value: "0901234567" } });
        fireEvent.change(screen.getByPlaceholderText(/Enter Email/i), { target: { value: "user@domain.com" } });
        fireEvent.click(screen.getByText(/Checkout/i));
        await waitFor(() => {
            expect(OrderService.createOrder).toHaveBeenCalled();
            expect(mockNavigate).toHaveBeenCalledWith("/payment", expect.anything());
        });
    });

    // OI_UIF-43: Checkout with missing required fields
    test("OI_UIF-43: Checkout with missing required fields", async () => {
        renderComponent();
        fireEvent.change(screen.getByPlaceholderText(/Enter Last Name/i), { target: { value: "" } });
        fireEvent.change(screen.getByPlaceholderText(/Enter First Name/i), { target: { value: "Van" } });
        fireEvent.change(screen.getByPlaceholderText(/Enter Phone Number/i), { target: { value: "0901234567" } });
        fireEvent.change(screen.getByPlaceholderText(/Enter Email/i), { target: { value: "user@domain.com" } });
        fireEvent.click(screen.getByText(/Checkout/i));
        await waitFor(() => {
            expect(screen.getByText(/Last Name is required/i)).toBeInTheDocument();
            expect(OrderService.createOrder).not.toHaveBeenCalled();
        });
    });

    // OI_UIF-44: Checkout with backend error
    test("OI_UIF-44: Checkout with backend error", async () => {
        OrderService.createOrder.mockRejectedValueOnce(new Error("Backend error"));
        renderComponent();
        fireEvent.change(screen.getByPlaceholderText(/Enter Last Name/i), { target: { value: "Nguyen" } });
        fireEvent.change(screen.getByPlaceholderText(/Enter First Name/i), { target: { value: "Van" } });
        fireEvent.change(screen.getByPlaceholderText(/Enter Phone Number/i), { target: { value: "0901234567" } });
        fireEvent.change(screen.getByPlaceholderText(/Enter Email/i), { target: { value: "user@domain.com" } });
        fireEvent.click(screen.getByText(/Checkout/i));
        await waitFor(() => {
            // Điều chỉnh dựa trên thông báo lỗi thực tế
            expect(screen.getByText(/Failed to create order. Please try again./i)).toBeInTheDocument();
            expect(mockNavigate).not.toHaveBeenCalled();
        });
    });
});