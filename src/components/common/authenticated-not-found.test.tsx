import { screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { renderWithRouter } from "@/test/utils";
import { AuthenticatedNotFound } from "./authenticated-not-found";

describe("AuthenticatedNotFound", () => {
	it("renders not found message", async () => {
		await renderWithRouter(AuthenticatedNotFound, {
			routes: [{ path: "/dashboard", component: () => <div>Dashboard</div> }],
		});

		await waitFor(() => {
			expect(screen.getByText("Page not found")).toBeInTheDocument();
		});
		expect(
			screen.getByText(/Sorry, we couldn't find the page/),
		).toBeInTheDocument();
	});

	it("renders navigation buttons", async () => {
		await renderWithRouter(AuthenticatedNotFound, {
			routes: [{ path: "/dashboard", component: () => <div>Dashboard</div> }],
		});

		await waitFor(() => {
			expect(
				screen.getByRole("link", { name: /Go to Dashboard/i }),
			).toBeInTheDocument();
		});
		expect(screen.getByRole("link", { name: /Go Back/i })).toBeInTheDocument();
	});
});
