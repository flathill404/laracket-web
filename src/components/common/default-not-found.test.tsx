import { render, screen } from "@/test/utils";
import {
	createMemoryHistory,
	createRootRoute,
	createRoute,
	createRouter,
	Outlet,
	RouterProvider,
} from "@tanstack/react-router";
import { describe, expect, it } from "vitest";
import { DefaultNotFound } from "./default-not-found";

function renderWithRouter(component: React.ComponentType) {
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

	const router = createRouter({
		routeTree: rootRoute.addChildren([indexRoute]),
		history: createMemoryHistory(),
	});

	return render(<RouterProvider router={router} />);
}

describe("DefaultNotFound", () => {
	it("renders 404 message", () => {
		renderWithRouter(DefaultNotFound); // Changed to pass the component type directly

		expect(screen.getByText("404")).toBeInTheDocument();
		expect(screen.getByText("Page Not Found")).toBeInTheDocument();
	});

	it("renders Go Home link", () => {
		renderWithRouter(DefaultNotFound);

		expect(screen.getByRole("link", { name: /Go Home/i })).toBeInTheDocument();
	});
});
