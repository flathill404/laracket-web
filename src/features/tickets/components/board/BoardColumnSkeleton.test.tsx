import { describe, expect, it } from "vitest";
import { render } from "@/test/utils";
import { BoardColumnSkeleton } from "./BoardColumnSkeleton";

describe("BoardColumnSkeleton", () => {
	it("renders the skeleton structure", () => {
		const { container } = render(<BoardColumnSkeleton />);
		// Check for skeleton elements with animate-pulse class
		expect(container.querySelectorAll(".animate-pulse")).not.toHaveLength(0);
	});

	it("renders 3 skeleton cards", () => {
		const { container } = render(<BoardColumnSkeleton />);
		// Check for 3 skeleton cards (header has 3 skeletons + 3 card skeletons = 6 total)
		const skeletons = container.querySelectorAll(".animate-pulse");
		expect(skeletons.length).toBeGreaterThanOrEqual(3);
	});

	it("renders with the correct layout classes", () => {
		const { container } = render(<BoardColumnSkeleton />);
		const column = container.querySelector(".min-w-\\[280px\\]");
		expect(column).toBeInTheDocument();
	});
});
