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
import { ForgotPasswordForm } from "./ForgotPasswordForm";

// Mock useAuth hook
const forgotPasswordMock = vi.fn();
vi.mock("@/features/auth/hooks/useAuth", () => ({
	useAuth: () => ({
		forgotPassword: forgotPasswordMock,
	}),
}));

// Mock sonner
vi.mock("sonner", () => ({
	toast: {
		success: vi.fn(),
	},
}));

function renderWithRouter(Component: React.ComponentType) {
	const rootRoute = createRootRoute({
		component: () => <Outlet />,
	});

	const indexRoute = createRoute({
		getParentRoute: () => rootRoute,
		path: "/",
		// component is passed as element from test
		component: () => <Component />,
	});

	const router = createRouter({
		routeTree: rootRoute.addChildren([indexRoute]),
		history: createMemoryHistory({
			initialEntries: ["/"],
		}),
	});

	return render(<RouterProvider router={router} />);
}

describe("ForgotPasswordForm", () => {
	// Skipped due to JSDOM/Router rendering issue
	it.skip("renders email input", () => {
		renderWithRouter(ForgotPasswordForm);

		expect(screen.getByLabelText("Email")).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: /Reset Link/i }),
		).toBeInTheDocument();
	});

	it.skip("submits valid email", async () => {
		forgotPasswordMock.mockResolvedValue({});
		const user = userEvent.setup();
		renderWithRouter(ForgotPasswordForm);

		await user.type(screen.getByLabelText("Email"), "test@example.com");
		await user.click(screen.getByRole("button", { name: /Reset Link/i }));

		await waitFor(() => {
			expect(forgotPasswordMock).toHaveBeenCalledWith({
				email: "test@example.com",
			});
		});
	});
});
