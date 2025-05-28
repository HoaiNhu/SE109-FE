// import React from "react";
// import { render, screen, fireEvent, waitFor } from "@testing-library/react";
// import { BrowserRouter } from "react-router-dom";
// import { Provider } from "react-redux";
// import configureStore from "redux-mock-store";
// import LogInPage from "../../../src/pages/LogInPage/LogInPage.jsx";
// import * as UserService from "../../../src/services/UserService";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { jwtDecode } from "jwt-decode";

// // Mock necessary dependencies
// jest.mock("../../../src/services/UserService");
// jest.mock("jwt-decode", () => jest.fn());

// // Mock react-router-dom navigate
// const mockNavigate = jest.fn();
// jest.mock("react-router-dom", () => ({
//   ...jest.requireActual("react-router-dom"),
//   useNavigate: () => mockNavigate,
// }));

// const mockStore = configureStore([]);

// const renderComponent = (store) => {
//   const queryClient = new QueryClient({
//     defaultOptions: {
//       queries: { retry: false },
//       mutations: { retry: false },
//     },
//   });
//   return render(
//     <QueryClientProvider client={queryClient}>
//       <Provider store={store}>
//         <BrowserRouter>
//           <LogInPage />
//         </BrowserRouter>
//       </Provider>
//     </QueryClientProvider>
//   );
// };

// describe("LogInPage", () => {
//   let store;

//   beforeEach(() => {
//     store = mockStore({});
//     store.dispatch = jest.fn();
//     jest.clearAllMocks();
//     mockNavigate.mockClear();

//     // Mock localStorage
//     Object.defineProperty(window, "localStorage", {
//       value: {
//         getItem: jest.fn(),
//         setItem: jest.fn(),
//         removeItem: jest.fn(),
//         clear: jest.fn(),
//       },
//       writable: true,
//     });
//   });

//   // 1.2 Email Textbox Tests
//   describe("Email Textbox", () => {
//     test("should have empty default state", () => {
//       renderComponent(store);
//       const emailInput = screen.getByPlaceholderText("Enter email");
//       expect(emailInput).toHaveValue("");
//     });

//     test("should allow valid email characters", () => {
//       renderComponent(store);
//       const emailInput = screen.getByPlaceholderText("Enter email");
//       fireEvent.change(emailInput, { target: { value: "test@example.com" } });
//       expect(emailInput).toHaveValue("test@example.com");
//     });

//     test("should respect maxlength validation", () => {
//       renderComponent(store);
//       const emailInput = screen.getByPlaceholderText("Enter email");
//       const longEmail = "a".repeat(35) + "@example.com"; // This will be > 40 chars
//       fireEvent.change(emailInput, { target: { value: longEmail } });

//       // The component only prevents updates if trimmed length > 40
//       // So we need to test the actual behavior
//       if (longEmail.trim().length > 40) {
//         expect(emailInput).toHaveValue(""); // Value won't update if too long
//       } else {
//         expect(emailInput).toHaveValue(longEmail);
//       }
//     });

//     test("should not update value if trimmed length exceeds 40", () => {
//       renderComponent(store);
//       const emailInput = screen.getByPlaceholderText("Enter email");

//       // First set a valid value
//       fireEvent.change(emailInput, { target: { value: "test@example.com" } });
//       expect(emailInput).toHaveValue("test@example.com");

//       // Try to set a value that's too long
//       const tooLongEmail = "a".repeat(50) + "@example.com";
//       fireEvent.change(emailInput, { target: { value: tooLongEmail } });

//       // Should keep the previous valid value
//       expect(emailInput).toHaveValue("test@example.com");
//     });

//     test("should accept valid email format", () => {
//       renderComponent(store);
//       const emailInput = screen.getByPlaceholderText("Enter email");
//       fireEvent.change(emailInput, {
//         target: { value: "valid.email@domain.com" },
//       });
//       expect(emailInput).toHaveValue("valid.email@domain.com");
//     });
//   });

//   // 1.3 Password Textbox Tests
//   describe("Password Textbox", () => {
//     test("should have empty default state", () => {
//       renderComponent(store);
//       const passwordInput = screen.getByPlaceholderText("Enter password");
//       expect(passwordInput).toHaveValue("");
//     });

//     test("should allow valid password characters", () => {
//       renderComponent(store);
//       const passwordInput = screen.getByPlaceholderText("Enter password");
//       fireEvent.change(passwordInput, { target: { value: "Password123!@#" } });
//       expect(passwordInput).toHaveValue("Password123!@#");
//     });

//     test("should respect maxlength validation", () => {
//       renderComponent(store);
//       const passwordInput = screen.getByPlaceholderText("Enter password");

//       // First set a valid value
//       fireEvent.change(passwordInput, { target: { value: "validPassword" } });
//       expect(passwordInput).toHaveValue("validPassword");

//       // Try to set a value that's too long
//       const longPassword = "a".repeat(50);
//       fireEvent.change(passwordInput, { target: { value: longPassword } });

//       // Should keep the previous valid value
//       expect(passwordInput).toHaveValue("validPassword");
//     });

//     test("should mask password characters", () => {
//       renderComponent(store);
//       const passwordInput = screen.getByPlaceholderText("Enter password");
//       expect(passwordInput).toHaveAttribute("type", "password");
//     });

//     test("should not update if only spaces exceed length limit", () => {
//       renderComponent(store);
//       const passwordInput = screen.getByPlaceholderText("Enter password");

//       // Set a password with spaces that when trimmed is within limit
//       const passwordWithSpaces = "  " + "a".repeat(38) + "  "; // 42 chars, but 38 when trimmed
//       fireEvent.change(passwordInput, {
//         target: { value: passwordWithSpaces },
//       });
//       expect(passwordInput).toHaveValue(passwordWithSpaces);
//     });
//   });

//   // 1.4 Account Validation Tests
//   describe("Account Validation", () => {
//     test("should show error message for login failure", async () => {
//       UserService.loginUser.mockRejectedValueOnce({
//         message: { message: "Invalid email format" },
//       });

//       renderComponent(store);
//       const emailInput = screen.getByPlaceholderText("Enter email");
//       const passwordInput = screen.getByPlaceholderText("Enter password");
//       const submitButton = screen.getByRole("button", { name: /log in/i });

//       fireEvent.change(emailInput, { target: { value: "invalid-email" } });
//       fireEvent.change(passwordInput, { target: { value: "password123" } });
//       fireEvent.click(submitButton);

//       await waitFor(() => {
//         // Look for error message in the Message component
//         expect(screen.getByText(/Invalid email format/i)).toBeInTheDocument();
//       });
//     });

//     test("should show error for empty password", async () => {
//       UserService.loginUser.mockRejectedValueOnce({
//         message: { message: "Password is required" },
//       });

//       renderComponent(store);
//       const emailInput = screen.getByPlaceholderText("Enter email");
//       const passwordInput = screen.getByPlaceholderText("Enter password");
//       const submitButton = screen.getByRole("button", { name: /log in/i });

//       fireEvent.change(emailInput, { target: { value: "test@example.com" } });
//       fireEvent.change(passwordInput, { target: { value: "" } });

//       // Button should be disabled when form is invalid
//       expect(submitButton).toBeDisabled();
//     });

//     test("should handle successful login", async () => {
//       const mockToken = "mock-jwt-token";
//       const mockDecodedToken = { id: "user123" };

//       UserService.loginUser.mockResolvedValueOnce({
//         access_token: mockToken,
//       });

//       UserService.getDetailsUser.mockResolvedValueOnce({
//         data: { id: "user123", email: "test@example.com" },
//       });

//       jwtDecode.mockReturnValueOnce(mockDecodedToken);

//       renderComponent(store);
//       const emailInput = screen.getByPlaceholderText("Enter email");
//       const passwordInput = screen.getByPlaceholderText("Enter password");
//       const submitButton = screen.getByRole("button", { name: /log in/i });

//       fireEvent.change(emailInput, { target: { value: "test@example.com" } });
//       fireEvent.change(passwordInput, { target: { value: "password123" } });
//       fireEvent.click(submitButton);

//       await waitFor(() => {
//         expect(screen.getByText(/Login successful/i)).toBeInTheDocument();
//       });

//       // Check if localStorage was called
//       expect(window.localStorage.setItem).toHaveBeenCalledWith(
//         "access_token",
//         mockToken
//       );

//       // Check if navigation happens after delay
//       await waitFor(
//         () => {
//           expect(mockNavigate).toHaveBeenCalledWith("/");
//         },
//         { timeout: 2000 }
//       );
//     });

//     test("should show error for non-existent account", async () => {
//       UserService.loginUser.mockRejectedValueOnce({
//         message: { message: "Account does not exist" },
//       });

//       renderComponent(store);
//       const emailInput = screen.getByPlaceholderText("Enter email");
//       const passwordInput = screen.getByPlaceholderText("Enter password");
//       const submitButton = screen.getByRole("button", { name: /log in/i });

//       fireEvent.change(emailInput, {
//         target: { value: "nonexistent@example.com" },
//       });
//       fireEvent.change(passwordInput, { target: { value: "password123" } });
//       fireEvent.click(submitButton);

//       await waitFor(() => {
//         expect(screen.getByText(/Account does not exist/i)).toBeInTheDocument();
//       });
//     });

//     test("should disable submit button when form is invalid", () => {
//       renderComponent(store);
//       const submitButton = screen.getByRole("button", { name: /log in/i });

//       // Button should be disabled initially
//       expect(submitButton).toBeDisabled();

//       // Fill only email
//       const emailInput = screen.getByPlaceholderText("Enter email");
//       fireEvent.change(emailInput, { target: { value: "test@example.com" } });
//       expect(submitButton).toBeDisabled();

//       // Fill both email and password
//       const passwordInput = screen.getByPlaceholderText("Enter password");
//       fireEvent.change(passwordInput, { target: { value: "password123" } });
//       expect(submitButton).not.toBeDisabled();
//     });

//     test("should show loading state during login", async () => {
//       // Mock a delayed response
//       UserService.loginUser.mockImplementationOnce(
//         () =>
//           new Promise((resolve) =>
//             setTimeout(() => resolve({ access_token: "token" }), 100)
//           )
//       );

//       renderComponent(store);
//       const emailInput = screen.getByPlaceholderText("Enter email");
//       const passwordInput = screen.getByPlaceholderText("Enter password");
//       const submitButton = screen.getByRole("button", { name: /log in/i });

//       fireEvent.change(emailInput, { target: { value: "test@example.com" } });
//       fireEvent.change(passwordInput, { target: { value: "password123" } });
//       fireEvent.click(submitButton);

//       // Check if loading component is shown
//       expect(screen.getByTestId("loading")).toBeInTheDocument();

//       // Wait for loading to disappear
//       await waitFor(() => {
//         expect(screen.queryByTestId("loading")).not.toBeInTheDocument();
//       });
//     });
//   });
// });
