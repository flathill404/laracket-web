import { useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";

/**
 * A hook to automatically manage accordion open state based on the current URL path.
 *
 * @param mapping - A key-value pair where the key is the path prefix to match (starts with)
 *                  and the value is the accordion item value to expand.
 * @param defaultValue - The initial open sections (default: []).
 * @returns a state tuple [openSections, setOpenSections] compatible with Accordion's controlled state.
 *
 * @example
 * const [openSections, setOpenSections] = useRouteAwareAccordion({
 *   "/projects": "projects",
 *   "/teams": "teams",
 * });
 */
export function useRouteAwareAccordion(
	mapping: Record<string, string>,
	defaultValue: string[] = [],
) {
	const location = useLocation();
	const [value, setValue] = useState<string[]>(defaultValue);

	// biome-ignore lint/correctness/useExhaustiveDependencies: mapping is assumed to be static or stable
	useEffect(() => {
		const path = location.pathname;

		setValue((prev) => {
			const next = new Set(prev);
			let changed = false;

			Object.entries(mapping).forEach(([keyword, sectionValue]) => {
				// Check if path starts with the keyword
				if (path.startsWith(keyword) && !next.has(sectionValue)) {
					next.add(sectionValue);
					changed = true;
				}
			});

			return changed ? Array.from(next) : prev;
		});
	}, [location.pathname]);

	return [value, setValue] as const;
}
