import { describe, expect, it, vi } from "vitest";
import {
	getAllStatuses,
	getStatusBadgeVariant,
	getStatusColor,
	getStatusLabel,
} from "./utils";

describe("ticket utils", () => {
	describe("getStatusColor", () => {
		it("should return correct color for open status", () => {
			expect(getStatusColor("open")).toBe("text-sky-500 fill-sky-500");
		});

		it("should return correct color for in_progress status", () => {
			expect(getStatusColor("in_progress")).toBe(
				"text-yellow-500 fill-yellow-500",
			);
		});

		it("should return correct color for in_review status", () => {
			expect(getStatusColor("in_review")).toBe(
				"text-indigo-500 fill-indigo-500",
			);
		});

		it("should return correct color for resolved status", () => {
			expect(getStatusColor("resolved")).toBe(
				"text-emerald-500 fill-emerald-500",
			);
		});

		it("should return correct color for closed status", () => {
			expect(getStatusColor("closed")).toBe("text-slate-500 fill-slate-500");
		});

		it("should return default color for unknown status", () => {
			const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
			const result = getStatusColor("unknown");
			expect(result).toBe("text-slate-500 fill-slate-500");
			expect(consoleSpy).toHaveBeenCalledWith("Unknown status: unknown");
			consoleSpy.mockRestore();
		});
	});

	describe("getStatusBadgeVariant", () => {
		it("should return badge variant for open status", () => {
			const variant = getStatusBadgeVariant("open");
			expect(variant).toContain("text-sky-700");
			expect(variant).toContain("bg-sky-50");
		});

		it("should return badge variant for in_progress status", () => {
			const variant = getStatusBadgeVariant("in_progress");
			expect(variant).toContain("text-yellow-700");
			expect(variant).toContain("bg-yellow-50");
		});

		it("should return default variant for unknown status", () => {
			const variant = getStatusBadgeVariant("unknown");
			expect(variant).toContain("text-slate-700");
			expect(variant).toContain("bg-slate-50");
		});
	});

	describe("getAllStatuses", () => {
		it("should return all 5 statuses", () => {
			const statuses = getAllStatuses();
			expect(statuses).toHaveLength(5);
		});

		it("should return statuses in correct order", () => {
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
		it("should return label for open status", () => {
			expect(getStatusLabel("open")).toBe("Open");
		});

		it("should return label for in_progress status", () => {
			expect(getStatusLabel("in_progress")).toBe("In Progress");
		});

		it("should return label for in_review status", () => {
			expect(getStatusLabel("in_review")).toBe("In Review");
		});

		it("should return label for resolved status", () => {
			expect(getStatusLabel("resolved")).toBe("Resolved");
		});

		it("should return label for closed status", () => {
			expect(getStatusLabel("closed")).toBe("Closed");
		});

		it("should convert unknown status to title case", () => {
			expect(getStatusLabel("some_unknown_status")).toBe("Some Unknown Status");
		});

		it("should handle single word unknown status", () => {
			expect(getStatusLabel("custom")).toBe("Custom");
		});
	});
});
