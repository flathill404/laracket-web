import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { renderWithRouter } from "@/test/renderWithRouter";
import { screen, waitFor } from "@/test/utils";
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

// Mock useMutationWithToast
// Mocks for useMutationWithToast (removed if not used)

vi.mock("@/hooks/use-mutation-with-toast", () => ({
	// biome-ignore lint/suspicious/noExplicitAny: mock needs flexible options
	useMutationWithToast: (_options: any) => {
		// Note: In real app, we check mutationFn identity or name, but here we just return generic mocks
		// Ideally we should distinguish between resend and update.
		// We can infer from arguments or return different mocks if needed.
		// For now, let's just return success mocks.

		// We can use a factory if needed, but the component calls useMutationWithToast multiple times.
		// Vitest mock factory runs once.
		// We can mock the hook implementation to return different values based on call order or ...
		// But testing library `render` runs the component.

		// Let's rely on standard mocking.
		return {
			mutate: vi.fn(),
			isPending: false,
		};
	},
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
