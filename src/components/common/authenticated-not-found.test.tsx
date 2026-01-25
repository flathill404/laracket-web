import {
	createMemoryHistory,
	createRootRoute,
	createRoute,
	createRouter,
	Outlet,
	RouterProvider,
} from "@tanstack/react-router";
import { describe, expect, it } from "vitest";
import { render, screen, waitFor } from "@/test/utils";
import { AuthenticatedNotFound } from "./authenticated-not-found";

// Helper to wrap component with Router for Link support
async function renderWithRouter(component: React.ComponentType) {
	const rootRoute = createRootRoute({
		component: () => <Outlet />,
	});

	const indexRoute = createRoute({
		getParentRoute: () => rootRoute,
		path: "/",
		component: () => {
			const Component = component;
			return <Component />;
		},
	});

	const dashboardRoute = createRoute({
		getParentRoute: () => rootRoute,
		path: "/dashboard",
		component: () => <div>Dashboard</div>,
	});

	const router = createRouter({
		routeTree: rootRoute.addChildren([indexRoute, dashboardRoute]),
		history: createMemoryHistory(),
	});

	await router.load();

	return render(<RouterProvider router={router} />);
}

describe("AuthenticatedNotFound", () => {
	it("renders not found message", async () => {
		await renderWithRouter(AuthenticatedNotFound);

		await waitFor(() => {
			expect(screen.getByText("Page not found")).toBeInTheDocument();
		});
		expect(
			screen.getByText(/Sorry, we couldn't find the page/),
		).toBeInTheDocument();
	});

	it("renders navigation buttons", async () => {
		await renderWithRouter(AuthenticatedNotFound);

		await waitFor(() => {
			expect(
				screen.getByRole("link", { name: /Go to Dashboard/i }),
			).toBeInTheDocument();
		});
		expect(screen.getByRole("link", { name: /Go Back/i })).toBeInTheDocument();
	});
});
