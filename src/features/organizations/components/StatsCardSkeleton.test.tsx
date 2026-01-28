import { describe, expect, it } from "vitest";
import { render } from "@/test/utils";
import { StatsCardSkeleton } from "./StatsCardSkeleton";

describe("StatsCardSkeleton", () => {
	it("renders skeleton structure", () => {
		const { container } = render(<StatsCardSkeleton />);
		// Check for skeleton class (likely animate-pulse from shadcn ui skeleton fallback)
		// Or structure check
		expect(container.querySelectorAll(".animate-pulse")).not.toHaveLength(0);
	});
});
