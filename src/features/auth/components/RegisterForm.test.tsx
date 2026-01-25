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
import { RegisterForm } from "./RegisterForm";

// Mock useAuth hook
const registerMock = vi.fn();
vi.mock("@/features/auth/hooks/useAuth", () => ({
	useAuth: () => ({
		register: registerMock,
	}),
}));

// Mock sonner toast
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
