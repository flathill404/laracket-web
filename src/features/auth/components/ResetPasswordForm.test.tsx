import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentType } from "react";
import { describe, expect, it, vi } from "vitest";
import { renderWithRouter as baseRenderWithRouter } from "@/test/utils";
import { ResetPasswordForm } from "./ResetPasswordForm";

const resetPasswordMock = vi.fn();
vi.mock("@/features/auth/hooks/useAuth", () => ({
	useAuth: () => ({
		resetPassword: resetPasswordMock,
	}),
}));

vi.mock("sonner", () => ({
	toast: {
		success: vi.fn(),
	},
}));

// Wrapper to support component props
async function renderWithRouter<T extends object>(
	Component: ComponentType<T>,
	props = {} as T,
) {
	return baseRenderWithRouter(() => <Component {...props} />);
}

describe("ResetPasswordForm", () => {
	const defaultProps = {
		email: "test@example.com",
		token: "token123",
	};

	it("renders password inputs", async () => {
		await renderWithRouter(ResetPasswordForm, defaultProps);

		await waitFor(() => {
			expect(screen.getByLabelText("Password")).toBeInTheDocument();
		});
		expect(screen.getByLabelText("Confirm Password")).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: "Reset Password" }),
		).toBeInTheDocument();
	});

	it("submits valid password reset", async () => {
		resetPasswordMock.mockResolvedValue({});
		const user = userEvent.setup();
		await renderWithRouter(ResetPasswordForm, defaultProps);

		await waitFor(() => {
			expect(screen.getByLabelText("Password")).toBeInTheDocument();
		});

		await user.type(screen.getByLabelText("Password"), "newpassword123");
		await user.type(
			screen.getByLabelText("Confirm Password"),
			"newpassword123",
		);

		await user.click(screen.getByRole("button", { name: "Reset Password" }));

		await waitFor(() => {
			expect(resetPasswordMock).toHaveBeenCalledWith({
				email: defaultProps.email,
				token: defaultProps.token,
				password: "newpassword123",
				passwordConfirmation: "newpassword123",
			});
		});
	});
});
