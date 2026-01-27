import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { renderWithRouter } from "@/test/utils";
import { VerifyEmail } from "./VerifyEmail";

// Mock useAuth
const logoutMock = vi.fn();
const userMock = {
	email: "test@example.com",
	displayName: "Test User",
};

vi.mock("@/features/auth/hooks/useAuth", () => ({
	useAuth: () => ({
		user: userMock,
		logout: logoutMock,
	}),
}));

// To properly mock multiple calls to useMutationWithToast, we need better control.
// Let's just verify rendering mostly.

describe("VerifyEmail", () => {
	it("renders email verification message", async () => {
		await renderWithRouter(VerifyEmail);

		await waitFor(() => {
			// Use getAllByText since text appears in both title and description
			expect(screen.getAllByText(/Verify your email/i).length).toBeGreaterThan(
				0,
			);
		});
		expect(screen.getByText(/test@example.com/i)).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: /Resend Verification Email/i }),
		).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: /Log Out/i }),
		).toBeInTheDocument();
	});

	it("allows switching to edit email mode", async () => {
		const user = userEvent.setup();
		await renderWithRouter(VerifyEmail);

		await waitFor(() => {
			expect(screen.getByRole("button", { name: /Edit/i })).toBeInTheDocument();
		});

		const editButton = screen.getByRole("button", { name: /Edit/i });
		await user.click(editButton);

		await waitFor(() => {
			expect(
				screen.getByPlaceholderText(/Enter new email address/i),
			).toBeInTheDocument();
		});
		expect(
			screen.getByRole("button", { name: /Update Email/i }),
		).toBeInTheDocument();
	});
});
