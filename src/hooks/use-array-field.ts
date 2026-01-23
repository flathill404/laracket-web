import { useCallback, useMemo } from "react";

interface HasId {
	id: string;
}

interface ArrayFieldOperations<T extends HasId> {
	items: T[];
	add: (item: T) => void;
	remove: (itemId: string) => void;
	toggle: (item: T) => void;
	has: (itemId: string) => boolean;
	clear: () => void;
}

interface UseArrayFieldOptions<T extends HasId> {
	ids: string[];
	setIds: (ids: string[]) => void;
	lookup: (id: string) => T | undefined;
}

export function useArrayField<T extends HasId>({
	ids,
	setIds,
	lookup,
}: UseArrayFieldOptions<T>): ArrayFieldOperations<T> {
	const items = useMemo(
		() => ids.map(lookup).filter((item): item is T => item !== undefined),
		[ids, lookup],
	);

	const add = useCallback(
		(item: T) => {
			if (!ids.includes(item.id)) {
				setIds([...ids, item.id]);
			}
		},
		[ids, setIds],
	);

	const remove = useCallback(
		(itemId: string) => {
			setIds(ids.filter((id) => id !== itemId));
		},
		[ids, setIds],
	);

	const toggle = useCallback(
		(item: T) => {
			if (ids.includes(item.id)) {
				remove(item.id);
			} else {
				add(item);
			}
		},
		[ids, add, remove],
	);

	const has = useCallback((itemId: string) => ids.includes(itemId), [ids]);

	const clear = useCallback(() => {
		setIds([]);
	}, [setIds]);

	return {
		items,
		add,
		remove,
		toggle,
		has,
		clear,
	};
}
