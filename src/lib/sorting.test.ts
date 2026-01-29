import { describe, expect, it } from "vitest";
import {
	camelToSnake,
	parseSortParam,
	snakeToCamel,
	toSortParam,
} from "./sorting";

describe("sorting utilities", () => {
	describe("snakeToCamel", () => {
		it("converts snake_case to camelCase", () => {
			expect(snakeToCamel("due_date")).toBe("dueDate");
		});

		it("handles multiple underscores", () => {
			expect(snakeToCamel("created_at_timestamp")).toBe("createdAtTimestamp");
		});

		it("handles a single word", () => {
			expect(snakeToCamel("title")).toBe("title");
		});

		it("handles an empty string", () => {
			expect(snakeToCamel("")).toBe("");
		});

		it("does not change an already camelCase string", () => {
			expect(snakeToCamel("alreadyCamel")).toBe("alreadyCamel");
		});
	});

	describe("camelToSnake", () => {
		it("converts camelCase to snake_case", () => {
			expect(camelToSnake("dueDate")).toBe("due_date");
		});

		it("handles multiple uppercase letters", () => {
			expect(camelToSnake("createdAtTimestamp")).toBe("created_at_timestamp");
		});

		it("handles a single word", () => {
			expect(camelToSnake("title")).toBe("title");
		});

		it("handles an empty string", () => {
			expect(camelToSnake("")).toBe("");
		});

		it("does not change an already snake_case string", () => {
			expect(camelToSnake("already_snake")).toBe("already_snake");
		});
	});

	describe("parseSortParam", () => {
		it("parses the descending sort parameter", () => {
			expect(parseSortParam("-due_date")).toEqual([
				{ id: "dueDate", desc: true },
			]);
		});

		it("parses the ascending sort parameter", () => {
			expect(parseSortParam("created_at")).toEqual([
				{ id: "createdAt", desc: false },
			]);
		});

		it("returns an empty array for undefined", () => {
			expect(parseSortParam(undefined)).toEqual([]);
		});

		it("returns an empty array for an empty string", () => {
			expect(parseSortParam("")).toEqual([]);
		});

		it("handles a single word column", () => {
			expect(parseSortParam("-title")).toEqual([{ id: "title", desc: true }]);
		});
	});

	describe("toSortParam", () => {
		it("converts descending sort to a parameter", () => {
			expect(toSortParam([{ id: "dueDate", desc: true }])).toBe("-due_date");
		});

		it("converts ascending sort to a parameter", () => {
			expect(toSortParam([{ id: "createdAt", desc: false }])).toBe(
				"created_at",
			);
		});

		it("returns undefined for an empty array", () => {
			expect(toSortParam([])).toBeUndefined();
		});

		it("handles a single word column", () => {
			expect(toSortParam([{ id: "title", desc: false }])).toBe("title");
		});

		it("only uses the first sorting element", () => {
			expect(
				toSortParam([
					{ id: "dueDate", desc: true },
					{ id: "title", desc: false },
				]),
			).toBe("-due_date");
		});
	});

	describe("round-trip conversion", () => {
		it("maintains data through parse and toSortParam", () => {
			const original = "-due_date";
			const parsed = parseSortParam(original);
			const result = toSortParam(parsed);
			expect(result).toBe(original);
		});

		it("maintains data for ascending sort", () => {
			const original = "created_at";
			const parsed = parseSortParam(original);
			const result = toSortParam(parsed);
			expect(result).toBe(original);
		});
	});
});
