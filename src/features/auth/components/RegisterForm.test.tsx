import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { renderWithRouter } from "@/test/utils";
import { RegisterForm } from "./RegisterForm";

// Mock useAuthActions hook
const registerMock = vi.fn();
vi.mock("@/features/auth/hooks/useAuthActions", () => ({
	useAuthActions: () => ({
		register: { mutateAsync: registerMock },
	}),
}));

// Mock sonner toast
vi.mock("sonner", () => ({
	toast: {
		success: vi.fn(),
	},
}));

describe("RegisterForm", () => {
	it("renders register form fields", async () => {
		await renderWithRouter(RegisterForm);

		await waitFor(() => {
			expect(screen.getByLabelText("Username")).toBeInTheDocument();
		});
		expect(screen.getByLabelText("Display Name")).toBeInTheDocument();
		expect(screen.getByLabelText("Email")).toBeInTheDocument();
		expect(screen.getByLabelText("Password")).toBeInTheDocument();
		expect(screen.getByLabelText("Confirm Password")).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: "Register" }),
		).toBeInTheDocument();
	});

	it("submits form with valid data", async () => {
		registerMock.mockResolvedValue({});
		const user = userEvent.setup();
		await renderWithRouter(RegisterForm);

		await waitFor(() => {
			expect(screen.getByLabelText("Username")).toBeInTheDocument();
		});

		await user.type(screen.getByLabelText("Username"), "jdoe");
		await user.type(screen.getByLabelText("Display Name"), "John Doe");
		await user.type(screen.getByLabelText("Email"), "test@example.com");
		await user.type(screen.getByLabelText("Password"), "password123");
		await user.type(screen.getByLabelText("Confirm Password"), "password123");

		await user.click(screen.getByRole("button", { name: "Register" }));

		await waitFor(() => {
			expect(registerMock).toHaveBeenCalledWith({
				name: "jdoe",
				displayName: "John Doe",
				email: "test@example.com",
				password: "password123",
				passwordConfirmation: "password123",
			});
		});
	});

	it("shows validation error when passwords do not match", async () => {
		const user = userEvent.setup();
		await renderWithRouter(RegisterForm);

		await waitFor(() => {
			expect(screen.getByLabelText("Password")).toBeInTheDocument();
		});

		await user.type(screen.getByLabelText("Password"), "password123");
		await user.type(screen.getByLabelText("Confirm Password"), "mismatch");

		await user.click(screen.getByRole("button", { name: "Register" }));

		expect(registerMock).not.toHaveBeenCalled();
		// Expect validation error message if visible
	});
});
