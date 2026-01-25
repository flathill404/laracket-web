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
import { render, screen, waitFor } from "@/test/utils";
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

async function renderWithRouter(Component: React.ComponentType) {
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

	await router.load();

	return render(<RouterProvider router={router} />);
}

describe("ForgotPasswordForm", () => {
	it("renders email input", async () => {
		await renderWithRouter(ForgotPasswordForm);

		await waitFor(() => {
			expect(screen.getByLabelText("Email")).toBeInTheDocument();
		});
		expect(
			screen.getByRole("button", { name: /Reset Link/i }),
		).toBeInTheDocument();
	});

	it("submits valid email", async () => {
		forgotPasswordMock.mockResolvedValue({});
		const user = userEvent.setup();
		await renderWithRouter(ForgotPasswordForm);

		await waitFor(() => {
			expect(screen.getByLabelText("Email")).toBeInTheDocument();
		});

		await user.type(screen.getByLabelText("Email"), "test@example.com");
		await user.click(screen.getByRole("button", { name: /Reset Link/i }));

		await waitFor(() => {
			expect(forgotPasswordMock).toHaveBeenCalledWith({
				email: "test@example.com",
			});
		});
	});
});
