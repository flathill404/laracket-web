import { describe, expect, it } from "vitest";
import {
	getAllStatuses,
	getStatusBadgeVariant,
	getStatusColor,
	getStatusLabel,
} from "./status";

describe("ticket utils", () => {
	describe("getStatusColor", () => {
		it("returns the correct color for the open status", () => {
			expect(getStatusColor("open")).toBe("text-sky-500 fill-sky-500");
		});

		it("returns the correct color for the in_progress status", () => {
			expect(getStatusColor("in_progress")).toBe(
				"text-yellow-500 fill-yellow-500",
			);
		});

		it("returns the correct color for the in_review status", () => {
			expect(getStatusColor("in_review")).toBe(
				"text-indigo-500 fill-indigo-500",
			);
		});

		it("returns the correct color for the resolved status", () => {
			expect(getStatusColor("resolved")).toBe(
				"text-emerald-500 fill-emerald-500",
			);
		});

		it("returns the correct color for the closed status", () => {
			expect(getStatusColor("closed")).toBe("text-slate-500 fill-slate-500");
		});

		it("returns the default color for an unknown status", () => {
			expect(getStatusColor("unknown")).toBe("text-slate-500 fill-slate-500");
		});
	});

	describe("getStatusBadgeVariant", () => {
		it("returns the badge variant for the open status", () => {
			const variant = getStatusBadgeVariant("open");
			expect(variant).toContain("text-sky-700");
			expect(variant).toContain("bg-sky-50");
		});

		it("returns the badge variant for the in_progress status", () => {
			const variant = getStatusBadgeVariant("in_progress");
			expect(variant).toContain("text-yellow-700");
			expect(variant).toContain("bg-yellow-50");
		});

		it("returns the default variant for an unknown status", () => {
			const variant = getStatusBadgeVariant("unknown");
			expect(variant).toContain("text-slate-700");
			expect(variant).toContain("bg-slate-50");
		});
	});

	describe("getAllStatuses", () => {
		it("returns all 5 statuses", () => {
			const statuses = getAllStatuses();
			expect(statuses).toHaveLength(5);
		});

		it("returns statuses in the correct order", () => {
			const statuses = getAllStatuses();
			expect(statuses).toEqual([
				"open",
				"in_progress",
				"in_review",
				"resolved",
				"closed",
			]);
		});
	});

	describe("getStatusLabel", () => {
		it("returns the label for the open status", () => {
			expect(getStatusLabel("open")).toBe("Open");
		});

		it("returns the label for the in_progress status", () => {
			expect(getStatusLabel("in_progress")).toBe("In Progress");
		});

		it("returns the label for the in_review status", () => {
			expect(getStatusLabel("in_review")).toBe("In Review");
		});

		it("returns the label for the resolved status", () => {
			expect(getStatusLabel("resolved")).toBe("Resolved");
		});

		it("returns the label for the closed status", () => {
			expect(getStatusLabel("closed")).toBe("Closed");
		});

		it("converts an unknown status to title case", () => {
			expect(getStatusLabel("some_unknown_status")).toBe("Some Unknown Status");
		});

		it("handles a single word unknown status", () => {
			expect(getStatusLabel("custom")).toBe("Custom");
		});
	});
});
