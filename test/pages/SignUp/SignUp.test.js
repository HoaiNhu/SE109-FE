import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SignUpPage from "../../../src/pages/SignUpPage/SignUpPage.jsx";
import { AuthProvider } from "../../../src/context/AuthContext";
import * as UserService from "../../../src/services/UserService";

// Mock UserService
jest.mock("../../../src/services/UserService", () => ({
    signupUser: jest.fn(),
}));

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockNavigate,
    Link: ({ to, children, className, ...props }) => (
        <a
            href={to}
            className={className}
            onClick={(e) => {
                e.preventDefault();
                mockNavigate(to);
            }}
            {...props}
        >
            {children}
        </a>
    ),
}));

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
                <AuthProvider>
                    <BrowserRouter>
                        <SignUpPage />
                    </BrowserRouter>
                </AuthProvider>
            </Provider>
        </QueryClientProvider>
    );
};

// Giữ nguyên toàn bộ describe và test từ code của bạn
describe("SignUpPage", () => {
    let store;

    beforeEach(() => {
        store = mockStore({});
        store.dispatch = jest.fn();
        jest.clearAllMocks();
        mockNavigate.mockClear();

        Object.defineProperty(window, "localStorage", {
            value: {
                getItem: jest.fn(),
                setItem: jest.fn(),
                removeItem: jest.fn(),
                clear: jest.fn(),
            },
            writable: true,
        });
    });

    // 2.1 Overall UI Tests
    describe("SU_UIF-1: Overall UI", () => {
        test("should display all UI components correctly", () => {
            renderComponent(store);

            expect(screen.getByRole("heading", { name: /sign up/i })).toBeInTheDocument();
            expect(screen.getByAltText(/signup logo/i)).toBeInTheDocument();

            const inputs = screen.getAllByRole("textbox").concat(screen.getAllByPlaceholderText(/password/i));
            expect(inputs).toHaveLength(6);

            const placeholders = inputs.map((input) => input.placeholder);
            expect(placeholders).toEqual(
                expect.arrayContaining([
                    "Last name",
                    "First name",
                    "Phone number",
                    "Email",
                    "Password",
                    "Confirm password",
                ])
            );

            expect(screen.getByRole("button", { name: /sign up/i })).toBeInTheDocument();
            expect(screen.getByRole("link", { name: /log in/i })).toBeInTheDocument();
        });
    });

    // 2.2 Last Name Textbox Tests
    describe("SU_UIF-2 to SU_UIF-7: Last Name Textbox", () => {
        test("SU_UIF-2: should have empty default state with correct placeholder", () => {
            renderComponent(store);
            const lastNameInput = screen.getByPlaceholderText("Last name");
            expect(lastNameInput).toHaveValue("");
            expect(lastNameInput).toHaveAttribute("name", "familyName");
        });

        test("SU_UIF-3: should accept valid Last Name", async () => {
            UserService.signupUser.mockResolvedValueOnce({ success: true });
            renderComponent(store);

            fireEvent.change(screen.getByPlaceholderText("Last name"), { target: { value: "Nguyễn" } });
            fireEvent.change(screen.getByPlaceholderText("First name"), { target: { value: "Văn" } });
            fireEvent.change(screen.getByPlaceholderText("Phone number"), { target: { value: "0901234567" } });
            fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "user@domain.com" } });
            fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "Pass123!" } });
            fireEvent.change(screen.getByPlaceholderText("Confirm password"), { target: { value: "Pass123!" } });

            fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

            await waitFor(
                () => {
                    expect(screen.getByText(/Registration successful/i)).toBeInTheDocument();
                    // eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
                    expect(mockNavigate).toHaveBeenCalledWith("/login");
                },
                { timeout: 2000 }
            );
        });

        test("SU_UIF-4: should show error for invalid Last Name", () => {
            renderComponent(store);

            fireEvent.change(screen.getByPlaceholderText("Last name"), { target: { value: "Nguyen123" } });
            fireEvent.change(screen.getByPlaceholderText("First name"), { target: { value: "Văn" } });
            fireEvent.change(screen.getByPlaceholderText("Phone number"), { target: { value: "0901234567" } });
            fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "user@domain.com" } });
            fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "Pass123!" } });
            fireEvent.change(screen.getByPlaceholderText("Confirm password"), { target: { value: "Pass123!" } });

            expect(screen.getByText(/Last Name can only contain letters and spaces/i)).toBeInTheDocument();
        });

        test("SU_UIF-5: should show error when Last Name is empty", () => {
            renderComponent(store);

            fireEvent.change(screen.getByPlaceholderText("First name"), { target: { value: "Văn" } });
            fireEvent.change(screen.getByPlaceholderText("Phone number"), { target: { value: "0901234567" } });
            fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "user@domain.com" } });
            fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "Pass123!" } });
            fireEvent.change(screen.getByPlaceholderText("Confirm password"), { target: { value: "Pass123!" } });

            const submitButton = screen.getByRole("button", { name: /sign up/i });
            expect(submitButton).toBeDisabled();
        });

        test("SU_UIF-6: should show error when Last Name contains only spaces", () => {
            renderComponent(store);

            fireEvent.change(screen.getByPlaceholderText("Last name"), { target: { value: "   " } });
            fireEvent.change(screen.getByPlaceholderText("First name"), { target: { value: "Văn" } });
            fireEvent.change(screen.getByPlaceholderText("Phone number"), { target: { value: "0901234567" } });
            fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "user@domain.com" } });
            fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "Pass123!" } });
            fireEvent.change(screen.getByPlaceholderText("Confirm password"), { target: { value: "Pass123!" } });

            const submitButton = screen.getByRole("button", { name: /sign up/i });
            expect(submitButton).toBeDisabled();
        });

        test("SU_UIF-7: should trim leading and trailing spaces for Last Name", async () => {
            UserService.signupUser.mockResolvedValueOnce({ success: true });
            renderComponent(store);

            fireEvent.change(screen.getByPlaceholderText("Last name"), { target: { value: "  Nguyễn  " } });
            fireEvent.change(screen.getByPlaceholderText("First name"), { target: { value: "Văn" } });
            fireEvent.change(screen.getByPlaceholderText("Phone number"), { target: { value: "0901234567" } });
            fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "user@domain.com" } });
            fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "Pass123!" } });
            fireEvent.change(screen.getByPlaceholderText("Confirm password"), { target: { value: "Pass123!" } });

            fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

            await waitFor(
                () => {
                    expect(screen.getByText(/Registration successful/i)).toBeInTheDocument();
                    // eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
                    expect(mockNavigate).toHaveBeenCalledWith("/login");
                },
                { timeout: 2000 }
            );
        });
    });

    // 2.3 First Name Textbox Tests
    describe("SU_UIF-8 to SU_UIF-13: First Name Textbox", () => {
        test("SU_UIF-8: should have empty default state with correct placeholder", () => {
            renderComponent(store);
            const firstNameInput = screen.getByPlaceholderText("First name");
            expect(firstNameInput).toHaveValue("");
            expect(firstNameInput).toHaveAttribute("name", "userName");
        });

        test("SU_UIF-9: should accept valid First Name", async () => {
            UserService.signupUser.mockResolvedValueOnce({ success: true });
            renderComponent(store);

            fireEvent.change(screen.getByPlaceholderText("Last name"), { target: { value: "Nguyễn" } });
            fireEvent.change(screen.getByPlaceholderText("First name"), { target: { value: "Văn" } });
            fireEvent.change(screen.getByPlaceholderText("Phone number"), { target: { value: "0901234567" } });
            fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "user@domain.com" } });
            fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "Pass123!" } });
            fireEvent.change(screen.getByPlaceholderText("Confirm password"), { target: { value: "Pass123!" } });

            fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

            await waitFor(
                () => {
                    expect(screen.getByText(/Registration successful/i)).toBeInTheDocument();
                    // eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
                    expect(mockNavigate).toHaveBeenCalledWith("/login");
                },
                { timeout: 2000 }
            );
        });

        test("SU_UIF-10: should show error for invalid First Name", () => {
            renderComponent(store);

            fireEvent.change(screen.getByPlaceholderText("Last name"), { target: { value: "Nguyễn" } });
            fireEvent.change(screen.getByPlaceholderText("First name"), { target: { value: "Van123" } });
            fireEvent.change(screen.getByPlaceholderText("Phone number"), { target: { value: "0901234567" } });
            fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "user@domain.com" } });
            fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "Pass123!" } });
            fireEvent.change(screen.getByPlaceholderText("Confirm password"), { target: { value: "Pass123!" } });

            expect(screen.getByText(/First Name can only contain letters and spaces/i)).toBeInTheDocument();
        });

        test("SU_UIF-11: should show error when First Name is empty", () => {
            renderComponent(store);

            fireEvent.change(screen.getByPlaceholderText("Last name"), { target: { value: "Nguyễn" } });
            fireEvent.change(screen.getByPlaceholderText("Phone number"), { target: { value: "0901234567" } });
            fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "user@domain.com" } });
            fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "Pass123!" } });
            fireEvent.change(screen.getByPlaceholderText("Confirm password"), { target: { value: "Pass123!" } });

            const submitButton = screen.getByRole("button", { name: /sign up/i });
            expect(submitButton).toBeDisabled();
        });

        test("SU_UIF-12: should show error when First Name contains only spaces", () => {
            renderComponent(store);

            fireEvent.change(screen.getByPlaceholderText("Last name"), { target: { value: "Nguyễn" } });
            fireEvent.change(screen.getByPlaceholderText("First name"), { target: { value: "   " } });
            fireEvent.change(screen.getByPlaceholderText("Phone number"), { target: { value: "0901234567" } });
            fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "user@domain.com" } });
            fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "Pass123!" } });
            fireEvent.change(screen.getByPlaceholderText("Confirm password"), { target: { value: "Pass123!" } });

            const submitButton = screen.getByRole("button", { name: /sign up/i });
            expect(submitButton).toBeDisabled();
        });

        test("SU_UIF-13: should trim leading and trailing spaces for First Name", async () => {
            UserService.signupUser.mockResolvedValueOnce({ success: true });
            renderComponent(store);

            fireEvent.change(screen.getByPlaceholderText("Last name"), { target: { value: "Nguyễn" } });
            fireEvent.change(screen.getByPlaceholderText("First name"), { target: { value: "  Văn  " } });
            fireEvent.change(screen.getByPlaceholderText("Phone number"), { target: { value: "0901234567" } });
            fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "user@domain.com" } });
            fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "Pass123!" } });
            fireEvent.change(screen.getByPlaceholderText("Confirm password"), { target: { value: "Pass123!" } });

            fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

            await waitFor(
                () => {
                    expect(screen.getByText(/Registration successful/i)).toBeInTheDocument();
                    // eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
                    expect(mockNavigate).toHaveBeenCalledWith("/login");
                },
                { timeout: 2000 }
            );
        });
    });

    // 2.4 Phone Textbox Tests
    describe("SU_UIF-14 to SU_UIF-19: Phone Textbox", () => {
        test("SU_UIF-14: should have empty default state with correct placeholder", () => {
            renderComponent(store);
            const phoneInput = screen.getByPlaceholderText("Phone number");
            expect(phoneInput).toHaveValue("");
            expect(phoneInput).toHaveAttribute("name", "userPhone");
        });

        test("SU_UIF-15: should accept valid Phone", async () => {
            UserService.signupUser.mockResolvedValueOnce({ success: true });
            renderComponent(store);

            fireEvent.change(screen.getByPlaceholderText("Last name"), { target: { value: "Nguyễn" } });
            fireEvent.change(screen.getByPlaceholderText("First name"), { target: { value: "Văn" } });
            fireEvent.change(screen.getByPlaceholderText("Phone number"), { target: { value: "0901234567" } });
            fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "user@domain.com" } });
            fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "Pass123!" } });
            fireEvent.change(screen.getByPlaceholderText("Confirm password"), { target: { value: "Pass123!" } });

            fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

            await waitFor(
                () => {
                    expect(screen.getByText(/Registration successful/i)).toBeInTheDocument();
                    // eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
                    expect(mockNavigate).toHaveBeenCalledWith("/login");
                },
                { timeout: 2000 }
            );
        });

        test("SU_UIF-16: should show error for invalid Phone", () => {
            renderComponent(store);

            fireEvent.change(screen.getByPlaceholderText("Last name"), { target: { value: "Nguyễn" } });
            fireEvent.change(screen.getByPlaceholderText("First name"), { target: { value: "Văn" } });
            fireEvent.change(screen.getByPlaceholderText("Phone number"), { target: { value: "090123abc" } });
            fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "user@domain.com" } });
            fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "Pass123!" } });
            fireEvent.change(screen.getByPlaceholderText("Confirm password"), { target: { value: "Pass123!" } });

            expect(screen.getByText(/Phone number must contain only digits/i)).toBeInTheDocument();
        });

        test("SU_UIF-17: should show error when Phone is empty", () => {
            renderComponent(store);

            fireEvent.change(screen.getByPlaceholderText("Last name"), { target: { value: "Nguyễn" } });
            fireEvent.change(screen.getByPlaceholderText("First name"), { target: { value: "Văn" } });
            fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "user@domain.com" } });
            fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "Pass123!" } });
            fireEvent.change(screen.getByPlaceholderText("Confirm password"), { target: { value: "Pass123!" } });

            const submitButton = screen.getByRole("button", { name: /sign up/i });
            expect(submitButton).toBeDisabled();
        });

        test("SU_UIF-18: should show error when Phone contains only spaces", () => {
            renderComponent(store);

            fireEvent.change(screen.getByPlaceholderText("Last name"), { target: { value: "Nguyễn" } });
            fireEvent.change(screen.getByPlaceholderText("First name"), { target: { value: "Văn" } });
            fireEvent.change(screen.getByPlaceholderText("Phone number"), { target: { value: "   " } });
            fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "user@domain.com" } });
            fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "Pass123!" } });
            fireEvent.change(screen.getByPlaceholderText("Confirm password"), { target: { value: "Pass123!" } });

            const submitButton = screen.getByRole("button", { name: /sign up/i });
            expect(submitButton).toBeDisabled();
        });

        test("SU_UIF-19: should trim leading and trailing spaces for Phone", async () => {
            UserService.signupUser.mockResolvedValueOnce({ success: true });
            renderComponent(store);

            fireEvent.change(screen.getByPlaceholderText("Last name"), { target: { value: "Nguyễn" } });
            fireEvent.change(screen.getByPlaceholderText("First name"), { target: { value: "Văn" } });
            fireEvent.change(screen.getByPlaceholderText("Phone number"), { target: { value: "  0901234567  " } });
            fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "user@domain.com" } });
            fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "Pass123!" } });
            fireEvent.change(screen.getByPlaceholderText("Confirm password"), { target: { value: "Pass123!" } });

            fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

            await waitFor(
                () => {
                    expect(screen.getByText(/Registration successful/i)).toBeInTheDocument();
                    // eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
                    expect(mockNavigate).toHaveBeenCalledWith("/login");
                },
                { timeout: 2000 }
            );
        });
    });

    // 2.5 Email Textbox Tests
    describe("SU_UIF-20 to SU_UIF-25: Email Textbox", () => {
        test("SU_UIF-20: should have empty default state with correct placeholder", () => {
            renderComponent(store);
            const emailInput = screen.getByPlaceholderText("Email");
            expect(emailInput).toHaveValue("");
            expect(emailInput).toHaveAttribute("name", "userEmail");
        });

        test("SU_UIF-21: should accept valid Email", async () => {
            UserService.signupUser.mockResolvedValueOnce({ success: true });
            renderComponent(store);

            fireEvent.change(screen.getByPlaceholderText("Last name"), { target: { value: "Nguyễn" } });
            fireEvent.change(screen.getByPlaceholderText("First name"), { target: { value: "Văn" } });
            fireEvent.change(screen.getByPlaceholderText("Phone number"), { target: { value: "0901234567" } });
            fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "user@domain.com" } });
            fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "Pass123!" } });
            fireEvent.change(screen.getByPlaceholderText("Confirm password"), { target: { value: "Pass123!" } });

            fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

            await waitFor(
                () => {
                    expect(screen.getByText(/Registration successful/i)).toBeInTheDocument();
                    // eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
                    expect(mockNavigate).toHaveBeenCalledWith("/login");
                },
                { timeout: 2000 }
            );
        });

        test("SU_UIF-22: should show error for invalid Email", () => {
            renderComponent(store);

            fireEvent.change(screen.getByPlaceholderText("Last name"), { target: { value: "Nguyễn" } });
            fireEvent.change(screen.getByPlaceholderText("First name"), { target: { value: "Văn" } });
            fireEvent.change(screen.getByPlaceholderText("Phone number"), { target: { value: "0901234567" } });
            fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "usér@domain.com" } });
            fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "Pass123!" } });
            fireEvent.change(screen.getByPlaceholderText("Confirm password"), { target: { value: "Pass123!" } });

            expect(screen.getByText(/Invalid email/i)).toBeInTheDocument();
        });

        test("SU_UIF-23: should show error when Email is empty", () => {
            renderComponent(store);

            fireEvent.change(screen.getByPlaceholderText("Last name"), { target: { value: "Nguyễn" } });
            fireEvent.change(screen.getByPlaceholderText("First name"), { target: { value: "Văn" } });
            fireEvent.change(screen.getByPlaceholderText("Phone number"), { target: { value: "0901234567" } });
            fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "Pass123!" } });
            fireEvent.change(screen.getByPlaceholderText("Confirm password"), { target: { value: "Pass123!" } });

            const submitButton = screen.getByRole("button", { name: /sign up/i });
            expect(submitButton).toBeDisabled();
        });

        test("SU_UIF-24: should show error when Email contains only spaces", () => {
            renderComponent(store);

            fireEvent.change(screen.getByPlaceholderText("Last name"), { target: { value: "Nguyễn" } });
            fireEvent.change(screen.getByPlaceholderText("First name"), { target: { value: "Văn" } });
            fireEvent.change(screen.getByPlaceholderText("Phone number"), { target: { value: "0901234567" } });
            fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "   " } });
            fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "Pass123!" } });
            fireEvent.change(screen.getByPlaceholderText("Confirm password"), { target: { value: "Pass123!" } });

            const submitButton = screen.getByRole("button", { name: /sign up/i });
            expect(submitButton).toBeDisabled();
        });

        test("SU_UIF-25: should trim leading and trailing spaces for Email", async () => {
            UserService.signupUser.mockResolvedValueOnce({ success: true });
            renderComponent(store);

            fireEvent.change(screen.getByPlaceholderText("Last name"), { target: { value: "Nguyễn" } });
            fireEvent.change(screen.getByPlaceholderText("First name"), { target: { value: "Văn" } });
            fireEvent.change(screen.getByPlaceholderText("Phone number"), { target: { value: "0901234567" } });
            fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "  user@domain.com  " } });
            fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "Pass123!" } });
            fireEvent.change(screen.getByPlaceholderText("Confirm password"), { target: { value: "Pass123!" } });

            fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

            await waitFor(
                () => {
                    expect(screen.getByText(/Registration successful/i)).toBeInTheDocument();
                    // eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
                    expect(mockNavigate).toHaveBeenCalledWith("/login");
                },
                { timeout: 2000 }
            );
        });
    });

    // 2.6 Password Textbox Tests
    describe("SU_UIF-26 to SU_UIF-30: Password Textbox", () => {
        test("SU_UIF-26: should have empty default state with correct placeholder and type", () => {
            renderComponent(store);
            const passwordInput = screen.getByPlaceholderText("Password");
            expect(passwordInput).toHaveValue("");
            expect(passwordInput).toHaveAttribute("name", "userPassword");
            expect(passwordInput).toHaveAttribute("type", "password");
        });

        test("SU_UIF-27: should accept valid Password", async () => {
            UserService.signupUser.mockResolvedValueOnce({ success: true });
            renderComponent(store);

            fireEvent.change(screen.getByPlaceholderText("Last name"), { target: { value: "Nguyễn" } });
            fireEvent.change(screen.getByPlaceholderText("First name"), { target: { value: "Văn" } });
            fireEvent.change(screen.getByPlaceholderText("Phone number"), { target: { value: "0901234567" } });
            fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "user@domain.com" } });
            fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "Pass123!" } });
            fireEvent.change(screen.getByPlaceholderText("Confirm password"), { target: { value: "Pass123!" } });

            fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

            await waitFor(
                () => {
                    expect(screen.getByText(/Registration successful/i)).toBeInTheDocument();
                    // eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
                    expect(mockNavigate).toHaveBeenCalledWith("/login");
                },
                { timeout: 2000 }
            );
        });

        test("SU_UIF-28: should show error when Password is empty", () => {
            renderComponent(store);

            fireEvent.change(screen.getByPlaceholderText("Last name"), { target: { value: "Nguyễn" } });
            fireEvent.change(screen.getByPlaceholderText("First name"), { target: { value: "Văn" } });
            fireEvent.change(screen.getByPlaceholderText("Phone number"), { target: { value: "0901234567" } });
            fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "user@domain.com" } });
            fireEvent.change(screen.getByPlaceholderText("Confirm password"), { target: { value: "Pass123!" } });

            const submitButton = screen.getByRole("button", { name: /sign up/i });
            expect(submitButton).toBeDisabled();
        });

        test("SU_UIF-29: should show error when Password contains only spaces", () => {
            renderComponent(store);

            fireEvent.change(screen.getByPlaceholderText("Last name"), { target: { value: "Nguyễn" } });
            fireEvent.change(screen.getByPlaceholderText("First name"), { target: { value: "Văn" } });
            fireEvent.change(screen.getByPlaceholderText("Phone number"), { target: { value: "0901234567" } });
            fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "user@domain.com" } });
            fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "   " } });
            fireEvent.change(screen.getByPlaceholderText("Confirm password"), { target: { value: "Pass123!" } });

            const submitButton = screen.getByRole("button", { name: /sign up/i });
            expect(submitButton).toBeDisabled();
        });

        test("SU_UIF-30: should trim leading and trailing spaces for Password", async () => {
            UserService.signupUser.mockResolvedValueOnce({ success: true });
            renderComponent(store);

            fireEvent.change(screen.getByPlaceholderText("Last name"), { target: { value: "Nguyen V" } });
            fireEvent.change(screen.getByPlaceholderText("First name"), { target: { value: "Văn" } });
            fireEvent.change(screen.getByPlaceholderText("Phone number"), { target: { value: "0901234567" } });
            fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "user@domain.com" } });
            fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "  Pass123!  " } });
            fireEvent.change(screen.getByPlaceholderText("Confirm password"), { target: { value: "  Pass123!  " } });

            fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

            await waitFor(
                () => {
                    expect(screen.getByText(/Registration successful/i)).toBeInTheDocument();
                    // eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
                    expect(mockNavigate).toHaveBeenCalledWith("/login");
                },
                { timeout: 2000 }
            );
        });
    });

    // 2.7 Confirm Password Textbox Tests
    describe("SU_UIF-31 to SU_UIF-36: Confirm Password Textbox", () => {
        test("SU_UIF-31: should have empty default state with correct placeholder and type", () => {
            renderComponent(store);
            const confirmPasswordInput = screen.getByPlaceholderText("Confirm password");
            expect(confirmPasswordInput).toHaveValue("");
            expect(confirmPasswordInput).toHaveAttribute("name", "userConfirmPassword");
            expect(confirmPasswordInput).toHaveAttribute("type", "password");
        });

        test("SU_UIF-32: should accept valid Confirm Password", async () => {
            UserService.signupUser.mockResolvedValueOnce({ success: true });
            renderComponent(store);

            fireEvent.change(screen.getByPlaceholderText("Last name"), { target: { value: "Nguyen" } });
            fireEvent.change(screen.getByPlaceholderText("First name"), { target: { value: "Văn" } });
            fireEvent.change(screen.getByPlaceholderText("Phone number"), { target: { value: "0901234567" } });
            fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "user@domain.com" } });
            fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "Pass123!" } });
            fireEvent.change(screen.getByPlaceholderText("Confirm password"), { target: { value: "Pass123!" } });

            fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

            await waitFor(
                () => {
                    expect(screen.getByText(/Registration successful/i)).toBeInTheDocument();
                    // eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
                    expect(mockNavigate).toHaveBeenCalledWith("/login");
                },
                { timeout: 2000 }
            );
        });

        test("SU_UIF-33: should show error when Confirm Password is empty", () => {
            renderComponent(store);

            fireEvent.change(screen.getByPlaceholderText("Last name"), { target: { value: "Nguyen V" } });
            fireEvent.change(screen.getByPlaceholderText("First name"), { target: { value: "Văn" } });
            fireEvent.change(screen.getByPlaceholderText("Phone number"), { target: { value: "0901234567" } });
            fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "user@domain.com" } });
            fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "Pass123!" } });

            const submitButton = screen.getByRole("button", { name: /sign up/i });
            expect(submitButton).toBeDisabled();
        });

        test("SU_UIF-34: should show error when Confirm Password contains only spaces", () => {
            renderComponent(store);

            fireEvent.change(screen.getByPlaceholderText("Last name"), { target: { value: "Nguyen V" } });
            fireEvent.change(screen.getByPlaceholderText("First name"), { target: { value: "Văn" } });
            fireEvent.change(screen.getByPlaceholderText("Phone number"), { target: { value: "0901234567" } });
            fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "user@domain.com" } });
            fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "Pass123!" } });
            fireEvent.change(screen.getByPlaceholderText("Confirm password"), { target: { value: "   " } });

            const submitButton = screen.getByRole("button", { name: /sign up/i });
            expect(submitButton).toBeDisabled();
        });

        test("SU_UIF-35: should trim leading and trailing spaces for Confirm Password", async () => {
            UserService.signupUser.mockResolvedValueOnce({ success: true });
            renderComponent(store);

            fireEvent.change(screen.getByPlaceholderText("Last name"), { target: { value: "Nguyen V" } });
            fireEvent.change(screen.getByPlaceholderText("First name"), { target: { value: "Văn" } });
            fireEvent.change(screen.getByPlaceholderText("Phone number"), { target: { value: "0901234567" } });
            fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "user@domain.com" } });
            fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "  Pass123!  " } });
            fireEvent.change(screen.getByPlaceholderText("Confirm password"), { target: { value: "  Pass123!  " } });

            fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

            await waitFor(
                () => {
                    expect(screen.getByText(/Registration successful/i)).toBeInTheDocument();
                    // eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
                    expect(mockNavigate).toHaveBeenCalledWith("/login");
                },
                { timeout: 2000 }
            );
        });

        test("SU_UIF-36: should show error when Confirm Password does not match Password", () => {
            renderComponent(store);

            fireEvent.change(screen.getByPlaceholderText("Last name"), { target: { value: "Nguyen V" } });
            fireEvent.change(screen.getByPlaceholderText("First name"), { target: { value: "Văn" } });
            fireEvent.change(screen.getByPlaceholderText("Phone number"), { target: { value: "0901234567" } });
            fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "user@domain.com" } });
            fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "Pass123!" } });
            fireEvent.change(screen.getByPlaceholderText("Confirm password"), { target: { value: "Pass456!" } });

            const submitButton = screen.getByRole("button", { name: /sign up/i });
            expect(submitButton).toBeDisabled();
        });
    });

    // 2.8 Navigation and Links Tests
    describe("SU_UIF-37 to SU_UIF-38: Navigation and Links", () => {
        test("SU_UIF-37: should navigate to login page after successful signup", async () => {
            UserService.signupUser.mockResolvedValueOnce({ success: true });
            renderComponent(store);

            fireEvent.change(screen.getByPlaceholderText("Last name"), { target: { value: "Nguyen V" } });
            fireEvent.change(screen.getByPlaceholderText("First name"), { target: { value: "Văn" } });
            fireEvent.change(screen.getByPlaceholderText("Phone number"), { target: { value: "0901234567" } });
            fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "user@domain.com" } });
            fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "Pass123!" } });
            fireEvent.change(screen.getByPlaceholderText("Confirm password"), { target: { value: "Pass123!" } });

            fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

            await waitFor(
                () => {
                    expect(screen.getByText(/Registration successful/i)).toBeInTheDocument();
                    // eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
                    expect(mockNavigate).toHaveBeenCalledWith("/login");
                },
                { timeout: 2000 }
            );
        });

        test("SU_UIF-38: should navigate to login page when clicking Log in link", async () => {
            renderComponent(store);
            const loginLink = screen.getByRole("link", { name: /log in/i });
            fireEvent.click(loginLink);
            await waitFor(() => {
                expect(mockNavigate).toHaveBeenCalledWith("/login");
            }, { timeout: 2000 });
        });
    });

    // Additional Tests
    describe("Form Validation", () => {
        test("should disable submit button when form is invalid", async () => {
            renderComponent(store);
            const submitButton = screen.getByRole("button", { name: /sign up/i });

            expect(submitButton).toBeDisabled();

            fireEvent.change(screen.getByPlaceholderText("Last name"), { target: { value: "Nguyen V" } });
            fireEvent.change(screen.getByPlaceholderText("First name"), { target: { value: "Văn" } });
            expect(submitButton).toBeDisabled();

            fireEvent.change(screen.getByPlaceholderText("Phone number"), { target: { value: "0901234567" } });
            fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "user@domain.com" } });
            fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "Pass123!" } });
            fireEvent.change(screen.getByPlaceholderText("Confirm password"), { target: { value: "Pass123!" } });

            await waitFor(() => {
                expect(submitButton).not.toBeDisabled();
            });
        });

        test("should show loading state during signup", async () => {
            UserService.signupUser.mockImplementationOnce(
                () => new Promise((resolve) => setTimeout(() => resolve({ success: true }), 100))
            );
            renderComponent(store);

            fireEvent.change(screen.getByPlaceholderText("Last name"), { target: { value: "Nguyen V" } });
            fireEvent.change(screen.getByPlaceholderText("First name"), { target: { value: "Văn" } });
            fireEvent.change(screen.getByPlaceholderText("Phone number"), { target: { value: "0901234567" } });
            fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "user@domain.com" } });
            fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "Pass123!" } });
            fireEvent.change(screen.getByPlaceholderText("Confirm password"), { target: { value: "Pass123!" } });

            fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

            expect(screen.getByTestId("loading")).toBeInTheDocument();

            await waitFor(
                () => {
                    expect(screen.queryByTestId("loading")).not.toBeInTheDocument();
                    // eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
                    expect(mockNavigate).toHaveBeenCalledWith("/login");
                },
                { timeout: 2000 }
            );
        });
    });
});