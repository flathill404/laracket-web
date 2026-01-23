import { describe, expect, it } from "vitest";
import {
	camelToSnake,
	parseSortParam,
	snakeToCamel,
	toSortParam,
} from "./sorting";

describe("sorting utilities", () => {
	describe("snakeToCamel", () => {
		it("should convert snake_case to camelCase", () => {
			expect(snakeToCamel("due_date")).toBe("dueDate");
		});

		it("should handle multiple underscores", () => {
			expect(snakeToCamel("created_at_timestamp")).toBe("createdAtTimestamp");
		});

		it("should handle single word", () => {
			expect(snakeToCamel("title")).toBe("title");
		});

		it("should handle empty string", () => {
			expect(snakeToCamel("")).toBe("");
		});

		it("should not change already camelCase", () => {
			expect(snakeToCamel("alreadyCamel")).toBe("alreadyCamel");
		});
	});

	describe("camelToSnake", () => {
		it("should convert camelCase to snake_case", () => {
			expect(camelToSnake("dueDate")).toBe("due_date");
		});

		it("should handle multiple uppercase letters", () => {
			expect(camelToSnake("createdAtTimestamp")).toBe("created_at_timestamp");
		});

		it("should handle single word", () => {
			expect(camelToSnake("title")).toBe("title");
		});

		it("should handle empty string", () => {
			expect(camelToSnake("")).toBe("");
		});

		it("should not change already snake_case", () => {
			expect(camelToSnake("already_snake")).toBe("already_snake");
		});
	});

	describe("parseSortParam", () => {
		it("should parse descending sort parameter", () => {
			expect(parseSortParam("-due_date")).toEqual([
				{ id: "dueDate", desc: true },
			]);
		});

		it("should parse ascending sort parameter", () => {
			expect(parseSortParam("created_at")).toEqual([
				{ id: "createdAt", desc: false },
			]);
		});

		it("should return empty array for undefined", () => {
			expect(parseSortParam(undefined)).toEqual([]);
		});

		it("should return empty array for empty string", () => {
			expect(parseSortParam("")).toEqual([]);
		});

		it("should handle single word column", () => {
			expect(parseSortParam("-title")).toEqual([{ id: "title", desc: true }]);
		});
	});

	describe("toSortParam", () => {
		it("should convert descending sort to parameter", () => {
			expect(toSortParam([{ id: "dueDate", desc: true }])).toBe("-due_date");
		});

		it("should convert ascending sort to parameter", () => {
			expect(toSortParam([{ id: "createdAt", desc: false }])).toBe(
				"created_at",
			);
		});

		it("should return undefined for empty array", () => {
			expect(toSortParam([])).toBeUndefined();
		});

		it("should handle single word column", () => {
			expect(toSortParam([{ id: "title", desc: false }])).toBe("title");
		});

		it("should only use first sorting element", () => {
			expect(
				toSortParam([
					{ id: "dueDate", desc: true },
					{ id: "title", desc: false },
				]),
			).toBe("-due_date");
		});
	});

	describe("round-trip conversion", () => {
		it("should maintain data through parse and toSortParam", () => {
			const original = "-due_date";
			const parsed = parseSortParam(original);
			const result = toSortParam(parsed);
			expect(result).toBe(original);
		});

		it("should maintain data for ascending sort", () => {
			const original = "created_at";
			const parsed = parseSortParam(original);
			const result = toSortParam(parsed);
			expect(result).toBe(original);
		});
	});
});
