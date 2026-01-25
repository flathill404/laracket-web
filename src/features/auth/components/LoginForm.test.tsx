import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { render, renderWithRouter } from "@/test/utils";
import { LoginForm } from "./LoginForm";

// Mock useAuth hook
const loginMock = vi.fn();
vi.mock("@/features/auth/hooks/useAuth", () => ({
	useAuth: () => ({
		login: loginMock,
	}),
}));

describe("LoginForm", () => {
	it("renders bare sanity check", () => {
		render(<div>bare sanity</div>);
		expect(screen.getByText("bare sanity")).toBeInTheDocument();
	});

	it("renders sanity check", async () => {
		await renderWithRouter(() => <div>sanity check</div>);
		await waitFor(() => {
			expect(screen.getByText("sanity check")).toBeInTheDocument();
		});
	});

	// Now that router.load() is in place, these tests should work
	it("renders login form fields", async () => {
		await renderWithRouter(LoginForm);

		await waitFor(() => {
			expect(screen.getByLabelText("Email")).toBeInTheDocument();
		});
		expect(screen.getByLabelText("Password")).toBeInTheDocument();
		expect(screen.getByLabelText("Remember me")).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
	});

	it("submits form with valid data", async () => {
		loginMock.mockResolvedValue({ twoFactor: false });
		const user = userEvent.setup();
		await renderWithRouter(LoginForm);

		await waitFor(() => {
			expect(screen.getByLabelText("Email")).toBeInTheDocument();
		});

		await user.clear(screen.getByLabelText("Email"));
		await user.type(screen.getByLabelText("Email"), "test@example.com");
		await user.clear(screen.getByLabelText("Password"));
		await user.type(screen.getByLabelText("Password"), "password123");

		await user.click(screen.getByRole("button", { name: "Login" }));

		await waitFor(() => {
			expect(loginMock).toHaveBeenCalledWith({
				email: "test@example.com",
				password: "password123",
				remember: false,
			});
		});
	});

	it("validation errors are shown for invalid input", async () => {
		const user = userEvent.setup();
		await renderWithRouter(LoginForm);

		await waitFor(() => {
			expect(screen.getByLabelText("Email")).toBeInTheDocument();
		});

		// Clear valid defaults if any
		await user.clear(screen.getByLabelText("Email"));
		await user.clear(screen.getByLabelText("Password"));

		await user.type(screen.getByLabelText("Email"), "invalid-email");
		await user.click(screen.getByRole("button", { name: "Login" }));

		expect(loginMock).not.toHaveBeenCalled();
	});
});
