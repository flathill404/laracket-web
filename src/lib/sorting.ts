import type { SortingState } from "@tanstack/react-table";

/**
 * Convert snake_case to camelCase
 * @example snakeToCamel("due_date") // "dueDate"
 */
export const snakeToCamel = (str: string): string =>
	str.replace(/_([a-z])/g, (_, c) => c.toUpperCase());

/**
 * Convert camelCase to snake_case
 * @example camelToSnake("dueDate") // "due_date"
 */
export const camelToSnake = (str: string): string =>
	str.replace(/[A-Z]/g, (m) => `_${m.toLowerCase()}`);

/**
 * Parse a sort parameter string (e.g., "-due_date") into TanStack Table's SortingState.
 * The sort parameter format is: ["-"]<snake_case_column>
 * - Prefix "-" indicates descending order
 * - No prefix indicates ascending order
 *
 * @example
 * parseSortParam("-due_date") // [{ id: "dueDate", desc: true }]
 * parseSortParam("created_at") // [{ id: "createdAt", desc: false }]
 * parseSortParam(undefined) // []
 */
export const parseSortParam = (sortParam: string | undefined): SortingState => {
	if (!sortParam) return [];

	const desc = sortParam.startsWith("-");
	const snakeId = desc ? sortParam.slice(1) : sortParam;
	const id = snakeToCamel(snakeId);

	return [{ id, desc }];
};

/**
 * Convert TanStack Table's SortingState to a sort parameter string.
 * Returns undefined if no sorting is applied.
 *
 * @example
 * toSortParam([{ id: "dueDate", desc: true }]) // "-due_date"
 * toSortParam([{ id: "createdAt", desc: false }]) // "created_at"
 * toSortParam([]) // undefined
 */
export const toSortParam = (sorting: SortingState): string | undefined => {
	if (sorting.length === 0) return undefined;

	const { id, desc } = sorting[0];
	const snakeId = camelToSnake(id);

	return desc ? `-${snakeId}` : snakeId;
};
