import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";
import { describe, expect, it, vi } from "vitest";
import * as api from "@/features/auth/api";
import { PasswordForm } from "./PasswordForm";

// Mock API
vi.mock("@/features/auth/api", () => ({
	updatePassword: vi.fn(),
}));

// Mock toast
vi.mock("sonner", () => ({
	toast: {
		success: vi.fn(),
		error: vi.fn(),
	},
}));

const createWrapper = () => {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: { retry: false },
			mutations: { retry: false },
		},
	});
	return ({ children }: { children: React.ReactNode }) => (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
};

describe("PasswordForm", () => {
	it("renders the form fields", () => {
		render(<PasswordForm />, { wrapper: createWrapper() });
		expect(screen.getByLabelText("Current Password")).toBeInTheDocument();
		expect(screen.getByLabelText("New Password")).toBeInTheDocument();
		expect(screen.getByLabelText("Confirm Password")).toBeInTheDocument();
	});

	it("shows a validation error for a short password", async () => {
		const user = userEvent.setup();
		render(<PasswordForm />, { wrapper: createWrapper() });

		const passwordInput = screen.getByLabelText("New Password");
		await user.type(passwordInput, "short");

		const submitButton = screen.getByRole("button", { name: "Save" });
		await user.click(submitButton);

		expect(
			await screen.findByText("Password must be at least 8 characters long"),
		).toBeInTheDocument();
	});

	it("shows a validation error for a password mismatch", async () => {
		const user = userEvent.setup();
		render(<PasswordForm />, { wrapper: createWrapper() });

		await user.type(screen.getByLabelText("New Password"), "password123");
		await user.type(screen.getByLabelText("Confirm Password"), "different123");

		const submitButton = screen.getByRole("button", { name: "Save" });
		await user.click(submitButton);

		expect(
			await screen.findByText("Passwords do not match"),
		).toBeInTheDocument();
	});

	it("submits the form successfully", async () => {
		const user = userEvent.setup();
		vi.mocked(api.updatePassword).mockResolvedValue(
			{} as unknown as Awaited<ReturnType<typeof api.updatePassword>>,
		);
		render(<PasswordForm />, { wrapper: createWrapper() });

		await user.type(screen.getByLabelText("Current Password"), "current-pass");
		await user.type(screen.getByLabelText("New Password"), "new-password123");
		await user.type(
			screen.getByLabelText("Confirm Password"),
			"new-password123",
		);

		const submitButton = screen.getByRole("button", { name: "Save" });
		await user.click(submitButton);

		await waitFor(() => {
			expect(api.updatePassword).toHaveBeenCalledWith(
				expect.objectContaining({
					currentPassword: "current-pass",
					password: "new-password123",
					passwordConfirmation: "new-password123",
				}),
				expect.anything(),
			);
		});
		expect(toast.success).toHaveBeenCalledWith("Password updated");
	});

	it("handles a server error", async () => {
		const user = userEvent.setup();
		vi.mocked(api.updatePassword).mockRejectedValue(new Error("Server error"));

		render(<PasswordForm />, { wrapper: createWrapper() });

		await user.type(screen.getByLabelText("Current Password"), "current-pass");
		await user.type(screen.getByLabelText("New Password"), "new-password123");
		await user.type(
			screen.getByLabelText("Confirm Password"),
			"new-password123",
		);

		const submitButton = screen.getByRole("button", { name: "Save" });
		// We expect this to trigger a toast.error even if the promise rejects
		try {
			await user.click(submitButton);
		} catch (_) {
			// ignore expected error
		}

		await waitFor(() => {
			expect(toast.error).toHaveBeenCalledWith("Failed to update password");
		});
	});
});
