import { describe, expect, it } from "vitest";

import { renderWithRouter, screen, waitFor } from "@/test/utils";
import { DefaultNotFound } from "./default-not-found";

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
