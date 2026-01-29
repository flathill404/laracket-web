import { describe, expect, it } from "vitest";
import { queryKeys } from "@/lib/queryKeys";
import { ticketQueries } from "./queries";

describe("ticketQueries", () => {
	describe("detail", () => {
		it("generates the correct query options", () => {
			const ticketId = "123";
			const options = ticketQueries.detail(ticketId);
			expect(options.queryKey).toEqual(queryKeys.tickets.detail(ticketId));
			expect(options.enabled).toBe(true);
		});

		it("is disabled when ticketId is empty", () => {
			const options = ticketQueries.detail("");
			expect(options.enabled).toBe(false);
		});
	});

	describe("activities", () => {
		it("generates the correct query options", () => {
			const ticketId = "123";
			const options = ticketQueries.activities(ticketId);
			expect(options.queryKey).toEqual(queryKeys.tickets.activities(ticketId));
			expect(options.enabled).toBe(true);
		});

		it("is disabled when ticketId is empty", () => {
			const options = ticketQueries.activities("");
			expect(options.enabled).toBe(false);
		});
	});

	describe("comments", () => {
		it("generates the correct query options", () => {
			const ticketId = "123";
			const options = ticketQueries.comments(ticketId);
			expect(options.queryKey).toEqual(queryKeys.tickets.comments(ticketId));
			expect(options.enabled).toBe(true);
		});

		it("is disabled when ticketId is empty", () => {
			const options = ticketQueries.comments("");
			expect(options.enabled).toBe(false);
		});
	});
});
