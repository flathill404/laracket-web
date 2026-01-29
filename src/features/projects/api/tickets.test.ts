import { describe, expect, it } from "vitest";

import { fetchProjectTickets } from "./tickets";

describe("tickets API", () => {
	describe("fetchProjectTickets", () => {
		it("should fetch project tickets without filters", async () => {
			const result = await fetchProjectTickets("project-123");

			expect(result.data).toBeInstanceOf(Array);
			expect(result.meta).toBeDefined();
			expect(result.links).toBeDefined();
		});

		it("should fetch project tickets with status filter", async () => {
			const result = await fetchProjectTickets("project-123", {
				filters: { status: ["open", "in_progress"] },
			});

			expect(result.data).toBeInstanceOf(Array);
		});

		it("should fetch project tickets with sort", async () => {
			const result = await fetchProjectTickets("project-123", {
				sort: "-dueDate",
			});

			expect(result.data).toBeInstanceOf(Array);
		});

		it("should fetch project tickets with cursor", async () => {
			const result = await fetchProjectTickets("project-123", {
				pagination: { cursor: "abc123" },
			});

			expect(result.data).toBeInstanceOf(Array);
		});
	});
});
