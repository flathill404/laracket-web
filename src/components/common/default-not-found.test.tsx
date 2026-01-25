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
import { DefaultNotFound } from "./default-not-found";

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

	const router = createRouter({
		routeTree: rootRoute.addChildren([indexRoute]),
		history: createMemoryHistory(),
	});

	await router.load();

	return render(<RouterProvider router={router} />);
}

describe("DefaultNotFound", () => {
	it("renders 404 message", async () => {
		await renderWithRouter(DefaultNotFound);

		await waitFor(() => {
			expect(screen.getByText("404")).toBeInTheDocument();
		});
		expect(screen.getByText("Page Not Found")).toBeInTheDocument();
	});

	it("renders Go Home link", async () => {
		await renderWithRouter(DefaultNotFound);

		await waitFor(() => {
			expect(
				screen.getByRole("link", { name: /Go Home/i }),
			).toBeInTheDocument();
		});
	});
});
