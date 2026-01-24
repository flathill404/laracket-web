import { describe, expect, it } from "vitest";
import {
	ALL_STATUSES,
	STATUS_BADGE_VARIANTS,
	STATUS_COLORS,
	STATUS_LABELS,
	TICKET_STATUS_VALUES,
	TICKET_STATUSES,
	type TicketStatus,
} from "./constants";

describe("ticket constants", () => {
	describe("TICKET_STATUS_VALUES", () => {
		it("should contain all 5 status values", () => {
			expect(TICKET_STATUS_VALUES).toHaveLength(5);
		});

		it("should have correct values in order", () => {
			expect(TICKET_STATUS_VALUES).toEqual([
				"open",
				"in_progress",
				"in_review",
				"resolved",
				"closed",
			]);
		});

		it("should be readonly (as const)", () => {
			// TypeScript ensures this, but we can verify the values match
			expect(TICKET_STATUS_VALUES[0]).toBe("open");
			expect(TICKET_STATUS_VALUES[4]).toBe("closed");
		});
	});

	describe("TICKET_STATUSES", () => {
		it("should have all 5 statuses", () => {
			expect(Object.keys(TICKET_STATUSES)).toHaveLength(5);
		});

		it("should have correct status values", () => {
			expect(TICKET_STATUSES.open).toBe("open");
			expect(TICKET_STATUSES.in_progress).toBe("in_progress");
			expect(TICKET_STATUSES.in_review).toBe("in_review");
			expect(TICKET_STATUSES.resolved).toBe("resolved");
			expect(TICKET_STATUSES.closed).toBe("closed");
		});
	});

	describe("STATUS_COLORS", () => {
		it("should have a color for each status", () => {
			const statuses = Object.values(TICKET_STATUSES) as TicketStatus[];
			for (const status of statuses) {
				expect(STATUS_COLORS[status]).toBeDefined();
				expect(typeof STATUS_COLORS[status]).toBe("string");
			}
		});

		it("should contain text and fill classes", () => {
			for (const color of Object.values(STATUS_COLORS)) {
				expect(color).toMatch(/text-/);
				expect(color).toMatch(/fill-/);
			}
		});
	});

	describe("STATUS_BADGE_VARIANTS", () => {
		it("should have a variant for each status", () => {
			const statuses = Object.values(TICKET_STATUSES) as TicketStatus[];
			for (const status of statuses) {
				expect(STATUS_BADGE_VARIANTS[status]).toBeDefined();
				expect(typeof STATUS_BADGE_VARIANTS[status]).toBe("string");
			}
		});

		it("should contain required CSS classes", () => {
			for (const variant of Object.values(STATUS_BADGE_VARIANTS)) {
				expect(variant).toMatch(/text-/);
				expect(variant).toMatch(/bg-/);
				expect(variant).toMatch(/border-/);
				expect(variant).toMatch(/hover:/);
				expect(variant).toMatch(/dark:/);
			}
		});
	});

	describe("STATUS_LABELS", () => {
		it("should have a label for each status", () => {
			const statuses = Object.values(TICKET_STATUSES) as TicketStatus[];
			for (const status of statuses) {
				expect(STATUS_LABELS[status]).toBeDefined();
				expect(typeof STATUS_LABELS[status]).toBe("string");
			}
		});

		it("should have human-readable labels", () => {
			expect(STATUS_LABELS.open).toBe("Open");
			expect(STATUS_LABELS.in_progress).toBe("In Progress");
			expect(STATUS_LABELS.in_review).toBe("In Review");
			expect(STATUS_LABELS.resolved).toBe("Resolved");
			expect(STATUS_LABELS.closed).toBe("Closed");
		});
	});

	describe("ALL_STATUSES", () => {
		it("should contain all 5 statuses", () => {
			expect(ALL_STATUSES).toHaveLength(5);
		});

		it("should match TICKET_STATUSES values", () => {
			const statusValues = Object.values(TICKET_STATUSES);
			expect(ALL_STATUSES).toEqual(expect.arrayContaining(statusValues));
			expect(statusValues).toEqual(expect.arrayContaining(ALL_STATUSES));
		});

		it("should be in the expected order", () => {
			expect(ALL_STATUSES).toEqual([
				"open",
				"in_progress",
				"in_review",
				"resolved",
				"closed",
			]);
		});
	});

	describe("consistency checks", () => {
		it("all maps should have the same keys", () => {
			const statusKeys = Object.keys(TICKET_STATUSES);
			const colorKeys = Object.keys(STATUS_COLORS);
			const badgeKeys = Object.keys(STATUS_BADGE_VARIANTS);
			const labelKeys = Object.keys(STATUS_LABELS);

			expect(colorKeys.sort()).toEqual(statusKeys.sort());
			expect(badgeKeys.sort()).toEqual(statusKeys.sort());
			expect(labelKeys.sort()).toEqual(statusKeys.sort());
		});
	});
});
