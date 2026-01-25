import {
	createMemoryHistory,
	createRootRoute,
	createRoute,
	createRouter,
	Outlet,
	type RouteComponent,
	RouterProvider,
} from "@tanstack/react-router";
import { render, waitFor } from "@testing-library/react";

interface RouteConfig {
	path: string;
	component: RouteComponent;
}

interface RenderWithRouterOptions {
	routes?: RouteConfig[];
	initialEntry?: string;
}

/**
 * Render a component with TanStack Router context for testing.
 * This helper properly handles router initialization to avoid React act(...) warnings.
 *
 * @param Component - The component to render
 * @param options - Optional configuration for additional routes and initial URL
 * @returns The render result from @testing-library/react
 */
export async function renderWithRouter(
	Component: RouteComponent,
	options: RenderWithRouterOptions = {},
) {
	const rootRoute = createRootRoute({
		component: () => <Outlet />,
	});

	const indexRoute = createRoute({
		getParentRoute: () => rootRoute,
		path: "/",
		component: Component,
	});

	// Add additional routes if provided
	const additionalRoutes =
		options.routes?.map((route) =>
			createRoute({
				getParentRoute: () => rootRoute,
				path: route.path,
				component: route.component,
			}),
		) || [];

	const router = createRouter({
		routeTree: rootRoute.addChildren([indexRoute, ...additionalRoutes]),
		history: createMemoryHistory({
			initialEntries: [options.initialEntry || "/"],
		}),
	});

	// Load router and wait for it to be ready
	await router.load();

	// Render with our test utils (includes QueryClientProvider)
	const result = render(<RouterProvider router={router} />);

	// Wait for the router transitions to complete to avoid act warnings
	await waitFor(() => {
		if (router.state.isTransitioning) {
			throw new Error("Router still transitioning");
		}
	});

	return result;
}
