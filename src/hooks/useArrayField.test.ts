// @vitest-environment jsdom
import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useArrayField } from "@/hooks/useArrayField";

interface TestItem {
	id: string;
	name: string;
}

describe("useArrayField", () => {
	it("manages array field operations", () => {
		const ids = ["1", "2"];
		const setIds = vi.fn();
		const itemsMap: Record<string, TestItem> = {
			"1": { id: "1", name: "Item 1" },
			"2": { id: "2", name: "Item 2" },
			"3": { id: "3", name: "Item 3" },
		};
		const lookup = (id: string) => itemsMap[id];

		const { result } = renderHook(() => useArrayField({ ids, setIds, lookup }));

		// Check initial items
		expect(result.current.items).toHaveLength(2);
		expect(result.current.items[0].id).toBe("1");
		expect(result.current.items[1].id).toBe("2");
		expect(result.current.has("1")).toBe(true);
		expect(result.current.has("3")).toBe(false);

		// Test add
		act(() => {
			result.current.add(itemsMap["3"]);
		});
		expect(setIds).toHaveBeenCalledWith(["1", "2", "3"]);

		// Test remove
		act(() => {
			result.current.remove("1");
		});
		expect(setIds).toHaveBeenCalledWith(["2"]);

		// Test toggle (existing)
		setIds.mockClear();
		act(() => {
			result.current.toggle(itemsMap["1"]);
		});
		expect(setIds).toHaveBeenCalledWith(["2"]); // assuming current ids was ["1", "2"] ? No, mock doesn't update state.
		// Wait, renderHook doesn't automatically update props.
		// But the callback uses `ids` from props.
	});

	it("toggles items correctly", () => {
		// To fully test toggle with state updates, we need a wrapper or manually update props
		// To fully test toggle with state updates, we need a wrapper or manually update props
		const { rerender } = renderHook(
			({ ids }) =>
				useArrayField<TestItem>({
					ids,
					setIds: () => {},
					lookup: (id) => ({ id, name: `Item ${id}` }),
				}),
			{ initialProps: { ids: ["1"] } },
		);

		// Mock setIds to verify
		const setIds = vi.fn();
		rerender({ ids: ["1"] });

		// Re-setup with spy
		const { result: result2 } = renderHook(
			({ ids }) =>
				useArrayField<TestItem>({
					ids,
					setIds,
					lookup: (id) => ({ id, name: `Item ${id}` }),
				}),
			{ initialProps: { ids: ["1"] } },
		);

		act(() => {
			result2.current.toggle({ id: "1", name: "Item 1" });
		});
		expect(setIds).toHaveBeenCalledWith([]);

		act(() => {
			result2.current.toggle({ id: "2", name: "Item 2" });
		});
		expect(setIds).toHaveBeenCalledWith(["1", "2"]);
	});

	it("clears items", () => {
		const setIds = vi.fn();
		const { result } = renderHook(() =>
			useArrayField<TestItem>({
				ids: ["1", "2"],
				setIds,
				lookup: (id) => ({ id, name: `Item ${id}` }),
			}),
		);

		act(() => {
			result.current.clear();
		});
		expect(setIds).toHaveBeenCalledWith([]);
	});
});
