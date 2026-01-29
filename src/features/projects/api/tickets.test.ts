import { describe, expect, it } from "vitest";

import { fetchProjectTickets } from "./tickets";

describe("tickets API", () => {
	describe("fetchProjectTickets", () => {
		it("fetches project tickets without filters", async () => {
			const result = await fetchProjectTickets("project-123");

			expect(result.data).toBeInstanceOf(Array);
			expect(result.meta).toBeDefined();
			expect(result.links).toBeDefined();
		});

		it("fetches project tickets with a status filter", async () => {
			const result = await fetchProjectTickets("project-123", {
				filters: { status: ["open", "in_progress"] },
			});

			expect(result.data).toBeInstanceOf(Array);
		});

		it("fetches project tickets with a sort", async () => {
			const result = await fetchProjectTickets("project-123", {
				sort: "-dueDate",
			});

			expect(result.data).toBeInstanceOf(Array);
		});

		it("fetches project tickets with a cursor", async () => {
			const result = await fetchProjectTickets("project-123", {
				pagination: { cursor: "abc123" },
			});

			expect(result.data).toBeInstanceOf(Array);
		});
	});
});
