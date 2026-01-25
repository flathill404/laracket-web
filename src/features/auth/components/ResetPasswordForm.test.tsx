import { render, screen, waitFor } from "@/test/utils";
import {
	createMemoryHistory,
	createRootRoute,
	createRoute,
	createRouter,
	Outlet,
	RouterProvider,
} from "@tanstack/react-router";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
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

function renderWithRouter(Component: React.ComponentType<any>, props = {}) {
	const rootRoute = createRootRoute({
		component: () => <Outlet />,
	});

	const indexRoute = createRoute({
		getParentRoute: () => rootRoute,
		path: "/",
		// component is passed as element from test
		component: () => <Component {...props} />,
	});

	const router = createRouter({
		routeTree: rootRoute.addChildren([indexRoute]),
		history: createMemoryHistory({
			initialEntries: ["/"],
		}),
	});

	return render(<RouterProvider router={router} />);
}

describe("ResetPasswordForm", () => {
	const defaultProps = {
		email: "test@example.com",
		token: "token123",
	};

	it.skip("renders password inputs", () => {
		renderWithRouter(ResetPasswordForm, defaultProps);

		expect(screen.getByLabelText("Password")).toBeInTheDocument();
		expect(screen.getByLabelText("Confirm Password")).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: "Reset Password" }),
		).toBeInTheDocument();
	});

	it.skip("submits valid password reset", async () => {
		resetPasswordMock.mockResolvedValue({});
		const user = userEvent.setup();
		renderWithRouter(ResetPasswordForm, defaultProps);

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
